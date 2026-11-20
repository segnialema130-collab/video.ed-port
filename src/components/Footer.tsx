import {Inbox, Instagram, Mail, MessageCircle, Send, Youtube} from 'lucide-react';
import {BRAND_CONFIG} from '../data/portfolioData';

interface FooterProps {
  onOpenInbox: () => void;
}

export function Footer({onOpenInbox}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050505]/45 backdrop-blur-sm py-12">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <a
              href="#home"
              className="font-display text-lg font-bold tracking-[0.14em] text-white"
            >
              {BRAND_CONFIG.brandName}
            </a>
            <p className="mt-1.5 text-sm text-zinc-400">{BRAND_CONFIG.tagline}</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <a href="#home" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#portfolio" className="hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#process" className="hover:text-white transition-colors">
              Process
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={BRAND_CONFIG.contact.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a
              href={BRAND_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={BRAND_CONFIG.contact.telegramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <Send className="h-4 w-4" />
            </a>
            <a
              href={BRAND_CONFIG.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${BRAND_CONFIG.contact.email}`}
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col justify-between gap-3 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} {BRAND_CONFIG.editorName} ({BRAND_CONFIG.brandName}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>{BRAND_CONFIG.location}</span>
            <button
              type="button"
              onClick={onOpenInbox}
              className="inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-sky-300 cursor-pointer"
            >
              <Inbox className="h-3.5 w-3.5" />
              Client Inbox
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
