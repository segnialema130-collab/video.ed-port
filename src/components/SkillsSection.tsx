import {motion} from 'motion/react';
import {SOFTWARE_SKILLS} from '../data/portfolioData';

function SoftwareBadgeIcon({code, accentColor, bgTint}: {code: string; accentColor: string; bgTint: string}) {
  if (code === 'CC') {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15"
        style={{backgroundColor: bgTint}}
      >
        {/* Minimalist CapCut geometric chevron emblem */}
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M4 8.5L12 12L4 15.5V8.5ZM20 8.5L12 12L20 15.5V8.5Z"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M5 6H19M5 18H19" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl border font-display text-lg font-bold tracking-tight"
      style={{
        backgroundColor: bgTint,
        borderColor: `${accentColor}45`,
        color: accentColor,
      }}
    >
      {code}
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="border-t border-white/10 bg-[#08080D]/40 backdrop-blur-xs py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-sky-400">Software &amp; Toolkit</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Industry-Standard Editing Stack
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Mastery across timeline editing, keyframe compositing, vector graphics, and rapid social cutdowns.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {SOFTWARE_SKILLS.map((skill, idx) => (
            <motion.article
              key={skill.id}
              initial={{opacity: 0, y: 14}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-40px'}}
              transition={{duration: 0.35, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1]}}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E0E15] p-6 transition-colors duration-200 hover:border-white/25"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <SoftwareBadgeIcon
                    code={skill.code}
                    accentColor={skill.accentColor}
                    bgTint={skill.bgTint}
                  />
                  <span className="font-mono text-sm font-semibold text-zinc-200 tabular-nums">
                    {skill.proficiency}%
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-white">{skill.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{skill.specialty}</p>
              </div>

              {/* Compositor-only progress indicator */}
              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  initial={{scaleX: 0}}
                  whileInView={{scaleX: skill.proficiency / 100}}
                  viewport={{once: true}}
                  transition={{duration: 0.75, delay: 0.1 + idx * 0.05, ease: [0.16, 1, 0.3, 1]}}
                  style={{
                    transformOrigin: 'left',
                    background: `linear-gradient(90deg, ${skill.accentColor}, #38BDF8)`,
                  }}
                  className="h-full w-full rounded-full"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
