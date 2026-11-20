import {useEffect, useState} from 'react';
import {Menu, X} from 'lucide-react';
import {BRAND_CONFIG} from '../data/portfolioData';

const NAV_LINKS = [
  {id: 'home', label: 'Home', href: '#home'},
  {id: 'about', label: 'About', href: '#about'},
  {id: 'services', label: 'Services', href: '#services'},
  {id: 'portfolio', label: 'Portfolio', href: '#portfolio'},
  {id: 'contact', label: 'Contact', href: '#contact'},
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

      // If scrolled near the very bottom, ensure Contact is highlighted
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const probeY = scrollY + 180;
      let current = 'home';

      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (probeY >= top) {
          current = link.id;
        }
      }

      setActiveSection(current);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, {passive: true});
    window.addEventListener('resize', updateScrollState, {passive: true});
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-30 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#050505]/85 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#home"
          onClick={() => handleLinkClick('home')}
          className="font-display text-lg font-bold tracking-[0.14em] text-white transition-all duration-200 ease-out hover:scale-105 hover:text-sky-300 active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-sm"
        >
          {BRAND_CONFIG.brandName}
        </a>

        {/* Zone 2: 5 concise single-line nav links with active background & color + transform/transition */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  isActive
                    ? 'scale-[1.03] bg-gradient-to-r from-violet-600/35 to-sky-500/25 border border-violet-400/50 text-sky-300 shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                    : 'border border-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={() => handleLinkClick('contact')}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:from-violet-500 hover:to-blue-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Hire Me
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70 text-zinc-200 transition-all duration-200 ease-out hover:scale-105 active:scale-95 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#08080D]/95 backdrop-blur-xl px-6 py-5 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-base font-medium transition-all duration-200 ease-out hover:translate-x-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/35 to-sky-500/25 border border-violet-400/50 text-sky-300'
                      : 'border border-transparent text-zinc-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
