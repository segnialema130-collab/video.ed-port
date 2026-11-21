import {motion} from 'motion/react';
import {BRAND_CONFIG} from '../data/portfolioData';

const ABOUT_PILLARS = [
  {
    title: 'Creative Journey',
    body: 'Starting from late-night timeline experiments cutting music visuals and creator stories, my focus grew into full-scale post-production—blending pacing, sound design, and color into cohesive visual narratives.',
  },
  {
    title: 'Editing Craft',
    body: 'Every frame earns its place. From tight A-roll story pruning and J/L-cut dialogue flow to optical-flow speed ramps and custom After Effects compositing, I shape raw footage with surgical precision.',
  },
  {
    title: 'Creative Vision',
    body: 'Editing is invisible architecture. Whether a 12-second 3D logo sting or a 20-minute YouTube documentary, the goal is identical: hold human attention effortlessly and make every beat memorable.',
  },
  {
    title: 'Professional Approach',
    body: 'Clear communication, organized project files, frame-accurate revision rounds, and reliable turnaround times—built so creators, agencies, and brands never have to chase deadlines.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Intro Column */}
          <motion.div
            initial={{opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-5"
          >
            <p className="text-sm font-medium text-sky-300">About Me</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Crafting Emotion, Rhythm, and Clarity in Every Cut
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-200/90">
              I&apos;m <strong className="font-semibold text-white">{BRAND_CONFIG.editorName}</strong>, founder of{' '}
              <strong className="font-semibold text-white">{BRAND_CONFIG.brandName}</strong>. I partner with YouTube
              creators, ambitious startups, and commercial directors to turn unpolished camera cards into films that
              command attention from the opening second.
            </p>

            <div className="mt-8 border-t border-sky-200/15 pt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-200">
              <div>
                <span className="block text-xs text-slate-400">Primary Focus</span>
                <span className="font-medium text-white">Cinematic &amp; Retention Editing</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Availability</span>
                <span className="font-medium text-white">Freelance &amp; Retainers</span>
              </div>
            </div>
          </motion.div>

          {/* Right 2x2 Editorial Pillars Grid (separated by whitespace & hairline borders) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {ABOUT_PILLARS.map((pillar, idx) => (
              <motion.article
                key={pillar.title}
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-60px'}}
                transition={{duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1]}}
                className="rounded-2xl border border-sky-200/15 bg-[#182244]/80 backdrop-blur-md p-6 transition-colors duration-200 hover:border-sky-400/50 hover:bg-[#1E2B55]/85"
              >
                <span className="font-mono text-xs text-amber-300 tabular-nums">0{idx + 1}.</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200/90">{pillar.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
