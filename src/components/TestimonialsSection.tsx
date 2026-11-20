import {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronLeft, ChevronRight, Quote} from 'lucide-react';
import {TESTIMONIALS} from '../data/portfolioData';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="border-t border-white/10 bg-[#08080D]/40 backdrop-blur-xs py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-sky-400">Client Feedback</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by Creators &amp; Brands
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900/70 text-zinc-200 transition-colors hover:border-violet-400/50 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900/70 text-zinc-200 transition-colors hover:border-violet-400/50 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Slider Card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E15] p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -8}}
              transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
            >
              <Quote className="h-8 w-8 text-violet-400/70" aria-hidden="true" />

              <blockquote className="mt-6 max-w-4xl font-sans text-xl italic leading-relaxed text-zinc-100 sm:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-base font-semibold text-white">{current.name}</p>
                  <p className="text-sm text-zinc-400">
                    {current.role} <span aria-hidden="true">·</span> {current.company}
                  </p>
                </div>

                <div className="text-sm text-zinc-300">
                  <span className="font-semibold text-sky-400">{current.outcome}</span>
                  <span className="mx-2 text-zinc-500" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-zinc-400">{current.projectType}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Navigation Dots */}
          <div className="mt-8 flex items-center gap-2">
            {TESTIMONIALS.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View testimonial ${idx + 1} from ${item.name}`}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    isSelected ? 'w-8 bg-gradient-to-r from-violet-500 to-sky-400' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
