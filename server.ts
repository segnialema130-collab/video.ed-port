import crypto from 'crypto';
import 'dotenv/config';
import express, {type NextFunction, type Request, type Response} from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_EMAIL = 'segnialema130@gmail.com';
const PORT = Number(process.env.PORT) || 3000;

const DATA_DIR = path.resolve(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
  read: boolean;
  forwardedVia: string[];
}

interface AdminCredential {
  salt: string;
  hash: string;
}

interface SessionEntry {
  expiresAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const sessions = new Map<string, SessionEntry>();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 10;

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
}

function readInquiries(): InquiryRecord[] {
  ensureDataDir();
  if (!fs.existsSync(INQUIRIES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeInquiries(items: InquiryRecord[]): void {
  ensureDataDir();
  const tmpFile = `${INQUIRIES_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(items, null, 2), 'utf8');
  fs.renameSync(tmpFile, INQUIRIES_FILE);
}

function readAdminCredential(): AdminCredential | null {
  ensureDataDir();
  if (!fs.existsSync(ADMIN_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminCredential>;
    if (typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      return {salt: parsed.salt, hash: parsed.hash};
    }
    return null;
  } catch {
    return null;
  }
}

function hashPasscode(passcode: string, saltHex: string): string {
  return crypto.scryptSync(passcode, Buffer.from(saltHex, 'hex'), 64).toString('hex');
}

function constantTimeMatch(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function createSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {expiresAt: Date.now() + SESSION_TTL_MS});
  return token;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const match = /^Bearer\s+([a-f0-9]{64})$/i.exec(header.trim());
  if (!match) {
    res.status(401).json({ok: false, error: 'Authentication required.'});
    return;
  }
  const token = match[1];
  const session = sessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    sessions.delete(token);
    res.status(401).json({ok: false, error: 'Session expired. Please sign in again.'});
    return;
  }
  next();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, {count: 1, resetAt: now + RATE_WINDOW_MS});
    return false;
  }
  if (entry.count >= RATE_MAX_REQUESTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

function stripHeaderBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function tryOptionalForwarding(inquiry: InquiryRecord): Promise<string[]> {
  const forwarded: string[] = [];
  const subject = `[SEGNI EDITOR] ${inquiry.projectType} from ${inquiry.name}`;
  const textBody = [
    `New portfolio inquiry for SEGNI EDITOR`,
    ``,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Category: ${inquiry.projectType}`,
    ``,
    `Message:`,
    inquiry.message,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #18181b; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">New Portfolio Inquiry — SEGNI EDITOR</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
      <p><strong>Category:</strong> ${escapeHtml(inquiry.projectType)}</p>
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(inquiry.message)}</p>
    </div>
  `;

  // Optional Gmail / SMTP forwarding if configured in environment secrets
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpUser = process.env.SMTP_USER || TARGET_EMAIL;
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (Number(process.env.SMTP_PORT) || 465) === 465,
        auth: {user: smtpUser, pass: smtpPass},
      });
      await transporter.sendMail({
        from: `"SEGNI EDITOR Portfolio" <${smtpUser}>`,
        to: TARGET_EMAIL,
        replyTo: inquiry.email,
        subject,
        text: textBody,
        html: htmlBody,
      });
      forwarded.push('smtp');
    } catch (err) {
      console.error('Optional SMTP forward skipped:', err);
    }
  }

  // Optional Resend forwarding if RESEND_API_KEY is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'SEGNI EDITOR <onboarding@resend.dev>',
          to: [TARGET_EMAIL],
          reply_to: inquiry.email,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });
      if (resendRes.ok) {
        forwarded.push('resend');
      }
    } catch (err) {
      console.error('Optional Resend forward skipped:', err);
    }
  }

  // Optional Telegram Bot notification if configured
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    try {
      const tgText = `New SEGNI EDITOR Inquiry\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nCategory: ${inquiry.projectType}\n\n${inquiry.message}`;
      const tgRes = await fetch(`https://api.telegram.org/bot${encodeURIComponent(tgToken)}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: tgChatId, text: tgText}),
      });
      if (tgRes.ok) {
        forwarded.push('telegram');
      }
    } catch (err) {
      console.error('Optional Telegram forward skipped:', err);
    }
  }

  return forwarded;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({limit: '16kb'}));

  // Public contact submission endpoint: reliably stores inquiry in server inbox + forwards if configured
  app.post('/api/contact', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        error: 'Too many submissions. Please wait a few minutes before trying again.',
      });
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    const rawName = typeof body?.name === 'string' ? stripHeaderBreaks(body.name) : '';
    const rawEmail = typeof body?.email === 'string' ? stripHeaderBreaks(body.email) : '';
    const rawProjectType =
      typeof body?.projectType === 'string' ? stripHeaderBreaks(body.projectType) : 'Video Project';
    const rawMessage = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!rawName || rawName.length > 120) {
      res.status(400).json({ok: false, error: 'Please enter a valid name (1–120 characters).'});
      return;
    }

    if (!rawEmail || rawEmail.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      res.status(400).json({ok: false, error: 'Please enter a valid email address.'});
      return;
    }

    if (!rawMessage || rawMessage.length > 4000) {
      res.status(400).json({ok: false, error: 'Please write a message (1–4000 characters).'});
      return;
    }

    const inquiry: InquiryRecord = {
      id: crypto.randomUUID(),
      name: rawName,
      email: rawEmail,
      projectType: rawProjectType.slice(0, 100) || 'Video Project',
      message: rawMessage,
      createdAt: new Date().toISOString(),
      read: false,
      forwardedVia: ['inbox'],
    };

    const extraChannels = await tryOptionalForwarding(inquiry);
    inquiry.forwardedVia = ['inbox', ...extraChannels];

    const existing = readInquiries();
    existing.unshift(inquiry);
    writeInquiries(existing.slice(0, 500));

    res.status(201).json({
      ok: true,
      id: inquiry.id,
      createdAt: inquiry.createdAt,
      forwardedVia: inquiry.forwardedVia,
    });
  });

  // Admin Inbox auth status
  app.get('/api/inquiries/auth-status', (_req, res) => {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const stored = readAdminCredential();
    res.json({
      configured: Boolean(envPasscode || stored),
    });
  });

  // One-time admin passcode setup when ADMIN_PASSCODE env is unset and no hash exists yet
  app.post('/api/inquiries/claim', (req, res) => {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const existing = readAdminCredential();
    if (envPasscode || existing) {
      res.status(409).json({ok: false, error: 'Admin passcode is already configured.'});
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    const passcode = typeof body?.passcode === 'string' ? body.passcode.trim() : '';
    if (passcode.length < 6 || passcode.length > 128) {
      res.status(400).json({ok: false, error: 'Choose a passcode between 6 and 128 characters.'});
      return;
    }

    ensureDataDir();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasscode(passcode, salt);
    const tmpFile = `${ADMIN_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify({salt, hash}, null, 2), 'utf8');
    fs.renameSync(tmpFile, ADMIN_FILE);

    const token = createSessionToken();
    res.status(201).json({ok: true, token});
  });

  // Admin login
  app.post('/api/inquiries/login', (req, res) => {
    const body = req.body as Record<string, unknown> | undefined;
    const passcode = typeof body?.passcode === 'string' ? body.passcode.trim() : '';
    if (!passcode) {
      res.status(400).json({ok: false, error: 'Passcode is required.'});
      return;
    }

    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    if (envPasscode) {
      if (!constantTimeMatch(passcode, envPasscode)) {
        res.status(401).json({ok: false, error: 'Incorrect passcode.'});
        return;
      }
      res.json({ok: true, token: createSessionToken()});
      return;
    }

    const stored = readAdminCredential();
    if (!stored) {
      res.status(400).json({ok: false, error: 'No admin passcode configured yet.'});
      return;
    }

    const candidateHash = hashPasscode(passcode, stored.salt);
    if (!constantTimeMatch(candidateHash, stored.hash)) {
      res.status(401).json({ok: false, error: 'Incorrect passcode.'});
      return;
    }

    res.json({ok: true, token: createSessionToken()});
  });

  // Protected Inbox Routes
  app.get('/api/inquiries', requireAdmin, (_req, res) => {
    res.json({ok: true, inquiries: readInquiries()});
  });

  app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
    const {id} = req.params;
    const body = req.body as Record<string, unknown> | undefined;
    const read = typeof body?.read === 'boolean' ? body.read : true;
    const items = readInquiries();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ok: false, error: 'Inquiry not found.'});
      return;
    }
    items[index] = {...items[index], read};
    writeInquiries(items);
    res.json({ok: true, inquiry: items[index]});
  });

  app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
    const {id} = req.params;
    const items = readInquiries();
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) {
      res.status(404).json({ok: false, error: 'Inquiry not found.'});
      return;
    }
    writeInquiries(next);
    res.json({ok: true});
  });

  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
