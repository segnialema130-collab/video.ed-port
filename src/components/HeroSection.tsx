import {useState} from 'react';
import {motion} from 'motion/react';
import {ArrowRight, Instagram, Mail, MessageCircle, Send, Youtube} from 'lucide-react';
import {BRAND_CONFIG, HERO_METRICS} from '../data/portfolioData';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-20">
      {/* Ambient cinematic light atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 left-1/4 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 right-1/5 h-[360px] w-[360px] rounded-full bg-sky-500/12 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        {/* Split-Screen Home / Hero */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-12">
          {/* Left Column: Typographic Hierarchy & CTAs */}
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            className="flex flex-col justify-center md:col-span-7"
          >
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-[3.75rem]">
              <span className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                {BRAND_CONFIG.editorName},
              </span>{' '}
              <span className="block mt-2 bg-gradient-to-r from-sky-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                Video Editor &amp; Motion Designer
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
              I&apos;m Segni Alemayehu, a creative video editor passionate about transforming raw footage into powerful
              visual experiences.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#portfolio"
                className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:from-sky-400 hover:to-indigo-500 hover:shadow-[0_0_28px_rgba(56,189,248,0.4)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                Explore My Work
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-sky-200/20 bg-[#1B264B]/75 backdrop-blur-md px-6 py-3 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:border-sky-400/60 hover:bg-[#23315E]/85 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Hire Me
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-3 pt-2">
              <span className="text-xs font-medium text-slate-300">Connect:</span>
              <div className="flex items-center gap-2">
                <a
                  href={BRAND_CONFIG.contact.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200/15 bg-[#192447]/70 text-slate-200 transition-all duration-150 hover:border-sky-400/60 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href={BRAND_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200/15 bg-[#192447]/70 text-slate-200 transition-all duration-150 hover:border-sky-400/60 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={BRAND_CONFIG.contact.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200/15 bg-[#192447]/70 text-slate-200 transition-all duration-150 hover:border-sky-400/60 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Send className="h-4 w-4" />
                </a>
                <a
                  href={BRAND_CONFIG.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200/15 bg-[#192447]/70 text-slate-200 transition-all duration-150 hover:border-sky-400/60 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${BRAND_CONFIG.contact.email}`}
                  aria-label="Email Segni"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200/15 bg-[#192447]/70 text-slate-200 transition-all duration-150 hover:border-sky-400/60 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Compact Circular User Portrait with Transform & Transition */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
            className="relative flex justify-center md:col-span-5 md:justify-end"
          >
            <div className="group relative h-72 w-72 sm:h-80 sm:w-80 md:h-[340px] md:w-[340px] lg:h-[380px] lg:w-[380px] overflow-hidden rounded-full border-2 border-sky-300/45 bg-[#162040] shadow-[0_0_48px_rgba(56,189,248,0.22)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 hover:border-amber-300/75 hover:shadow-[0_0_56px_rgba(251,191,36,0.26)] will-change-transform">
              {!imgError ? (
                <img
                  src={BRAND_CONFIG.heroPortrait}
                  alt="Segni Alemayehu — Creative Video Editor"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#162040] via-[#1E2B54] to-[#111831] p-6 text-center">
                  <span className="font-display text-xl font-bold tracking-wider text-white">
                    {BRAND_CONFIG.brandName}
                  </span>
                  <span className="mt-1.5 text-xs text-slate-300">Segni Alemayehu</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Metrics Row Below Hero Split */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-sky-200/15 pt-8 md:grid-cols-4">
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                {metric.value}
              </span>
              <span className="mt-1 text-sm text-slate-300">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Marquee Divider Ribbon */}
      <div className="mt-16 border-y border-sky-200/15 bg-[#152042]/65 backdrop-blur-sm py-3.5 overflow-hidden select-none">
        <div className="animate-marquee text-xs font-medium tracking-[0.22em] text-slate-300 uppercase">
          <span className="mx-6">Selected Works</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Cinematic Storytelling</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="mx-6">Motion Graphics</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Color Grading</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="mx-6">3D Brand Reveals</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Sound Design</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="mx-6">Selected Works</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Cinematic Storytelling</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="mx-6">Motion Graphics</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Color Grading</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="mx-6">3D Brand Reveals</span>
          <span aria-hidden="true" className="text-violet-400">·</span>
          <span className="mx-6">Sound Design</span>
          <span aria-hidden="true" className="text-sky-400">·</span>
        </div>
      </div>
    </section>
  );
}
