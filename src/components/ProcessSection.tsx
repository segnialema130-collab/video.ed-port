import {motion} from 'motion/react';
import {WORK_PROCESS} from '../data/portfolioData';

export function ProcessSection() {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-violet-400">My Work Process</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Raw Footage to Final Master
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            A structured six-stage workflow designed for predictable timelines, clear creative alignment, and broadcast-ready results.
          </p>
        </div>

        {/* Modern Timeline Grid */}
        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WORK_PROCESS.map((item, idx) => (
            <motion.article
              key={item.step}
              initial={{opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{duration: 0.38, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1]}}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B11] p-6 transition-colors duration-200 hover:border-sky-400/40"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-lg font-semibold text-violet-400 tabular-nums">
                    {item.step}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">{item.turnaround}</span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
