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
    <section id="testimonials" className="border-t border-sky-200/12 bg-[#141E3E]/55 backdrop-blur-xs py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-sky-300">Client Feedback</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by Creators &amp; Brands
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-sky-200/20 bg-[#1B264B]/80 text-slate-200 transition-colors hover:border-sky-400/55 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-sky-200/20 bg-[#1B264B]/80 text-slate-200 transition-colors hover:border-sky-400/55 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Slider Card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-sky-200/15 bg-[#1B264B]/85 backdrop-blur-md p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -8}}
              transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
            >
              <Quote className="h-8 w-8 text-amber-300/75" aria-hidden="true" />

              <blockquote className="mt-6 max-w-4xl font-sans text-xl italic leading-relaxed text-slate-100 sm:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-sky-200/12 pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-base font-semibold text-white">{current.name}</p>
                  <p className="text-sm text-slate-300">
                    {current.role} <span aria-hidden="true">·</span> {current.company}
                  </p>
                </div>

                <div className="text-sm text-slate-200">
                  <span className="font-semibold text-sky-300">{current.outcome}</span>
                  <span className="mx-2 text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-slate-300">{current.projectType}</span>
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
                    isSelected ? 'w-8 bg-gradient-to-r from-sky-400 to-amber-300' : 'w-2 bg-slate-600 hover:bg-slate-400'
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
