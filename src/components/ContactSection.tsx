import {useState, type FormEvent} from 'react';
import {Check, Copy, Instagram, Loader2, Mail, MessageCircle, Send, Youtube} from 'lucide-react';
import {BRAND_CONFIG} from '../data/portfolioData';

const PROJECT_TYPES = [
  'YouTube Video Editing',
  'Cinematic Video Editing',
  'Motion Graphics / 3D Logo',
  'Promotional Commercial',
  'Social Media Reels / Shorts',
  'Monthly Retainer',
];

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setError('Please enter your name, email address, and comment or idea.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSending(true);

    try {
      const apiRes = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          projectType,
          message: cleanMessage,
        }),
      });

      const apiData = (await apiRes.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!apiRes.ok || !apiData.ok) {
        setError(apiData.error || 'Could not send message right now. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error while sending your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const whatsappDirectHref = `${BRAND_CONFIG.contact.whatsappUrl}?text=${encodeURIComponent(
    `Hi Segni, I'm ${name.trim() || 'a client'} (${email.trim()}).\nProject: ${projectType}\n\n${message.trim()}`,
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: CTA & Direct Contact Channels */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-sky-300">Start a Project</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s Create Something Amazing Together.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-200/90">
              Enter your name, email, and idea in the form to send it straight to Segni&apos;s Client Inbox—or reach out
              instantly via WhatsApp or Telegram.
            </p>

            {/* Contact Channel Rows */}
            <div className="mt-8 space-y-3">
              {/* WhatsApp */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md px-4 py-3.5">
                <a
                  href={BRAND_CONFIG.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center gap-3 text-sm text-slate-200 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-sky-300" />
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-400">WhatsApp</span>
                    <span className="block truncate font-medium font-mono tabular-nums">
                      {BRAND_CONFIG.contact.whatsappNumber}
                    </span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('whatsapp', BRAND_CONFIG.contact.whatsappNumber)}
                  aria-label="Copy WhatsApp number"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-200/15 bg-[#111936] text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'whatsapp' ? (
                    <Check className="h-4 w-4 text-sky-300" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Telegram */}
              <a
                href={BRAND_CONFIG.contact.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md px-4 py-3.5 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Send className="h-4 w-4 shrink-0 text-sky-300" />
                  <span>
                    <span className="block text-xs text-slate-400">Telegram</span>
                    <span className="block font-medium">{BRAND_CONFIG.contact.telegramHandle}</span>
                  </span>
                </span>
                <span className="text-xs text-slate-300">Message</span>
              </a>

              {/* Email */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md px-4 py-3.5">
                <a
                  href={`mailto:${BRAND_CONFIG.contact.email}`}
                  className="flex min-w-0 items-center gap-3 text-sm text-slate-200 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-amber-300" />
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-400">Email</span>
                    <span className="block truncate font-medium">{BRAND_CONFIG.contact.email}</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('email', BRAND_CONFIG.contact.email)}
                  aria-label="Copy email address"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-200/15 bg-[#111936] text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'email' ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Social Pair: Instagram & YouTube */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={BRAND_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md px-4 py-3 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
                >
                  <Instagram className="h-4 w-4 shrink-0 text-amber-300" />
                  <span className="truncate font-medium">Instagram</span>
                </a>
                <a
                  href={BRAND_CONFIG.contact.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md px-4 py-3 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
                >
                  <Youtube className="h-4 w-4 shrink-0 text-amber-300" />
                  <span className="truncate font-medium">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Client Inbox Submission Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-sky-200/15 bg-[#182244]/85 backdrop-blur-md p-6 sm:p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/15 text-sky-300">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">
                    Message Received!
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-200">
                    Thank you, {name}. Your comment and email (<span className="font-medium text-sky-300">{email}</span>)
                    have been saved directly into Segni&apos;s Client Inbox.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={whatsappDirectHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-500/15 px-5 py-2.5 text-sm font-semibold text-sky-200 hover:bg-sky-500/25"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Also Ping on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="inline-flex min-h-[44px] items-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-sky-400 hover:to-indigo-500 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-slate-200">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={sending}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="mt-2 w-full rounded-lg border border-sky-200/20 bg-[#111936] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-slate-200">
                        Your Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={sending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@studio.com"
                        className="mt-2 w-full rounded-lg border border-sky-200/20 bg-[#111936] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-medium text-slate-200">
                      Project Category
                    </label>
                    <select
                      id="contact-service"
                      disabled={sending}
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-sky-200/20 bg-[#111936] px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-60"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#111936] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-slate-200">
                      Your Idea / Comment
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      disabled={sending}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your idea, comment, footage details, or project deadline..."
                      className="mt-2 w-full resize-none rounded-lg border border-sky-200/20 bg-[#111936] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-60"
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-rose-400/35 bg-rose-500/15 p-3 text-xs font-medium text-rose-200"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:from-sky-400 hover:to-indigo-500 hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message Directly
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
