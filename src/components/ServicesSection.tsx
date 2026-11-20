import {motion} from 'motion/react';
import {
  Box,
  Clapperboard,
  Film,
  Megaphone,
  Palette,
  PlaySquare,
  Smartphone,
  Sparkles,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import {SERVICES_LIST, type ServiceItem} from '../data/portfolioData';

const ICON_MAP: Record<ServiceItem['iconName'], LucideIcon> = {
  Film,
  Youtube,
  Clapperboard,
  Sparkles,
  Box,
  Smartphone,
  Megaphone,
  Palette,
  PlaySquare,
};

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-white/10 bg-[#08080D]/40 backdrop-blur-xs py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-sky-400">My Services</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              End-to-End Post-Production Capabilities
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Tailored editing, motion design, and finishing workflows engineered for creators, brands, and modern
            production teams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_LIST.map((service, idx) => {
            const Icon = ICON_MAP[service.iconName];
            return (
              <motion.article
                key={service.id}
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-50px'}}
                transition={{duration: 0.38, delay: (idx % 3) * 0.06, ease: [0.16, 1, 0.3, 1]}}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E0E15] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/45 hover:bg-[#12121B]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/90 text-violet-400 transition-colors duration-200 group-hover:border-sky-400/40 group-hover:text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500 tabular-nums">{service.number}</span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">{service.description}</p>
                </div>

                <p className="mt-6 border-t border-white/10 pt-4 text-xs font-medium text-zinc-400">
                  {service.deliverables}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
