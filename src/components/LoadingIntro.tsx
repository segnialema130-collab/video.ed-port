import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {BRAND_CONFIG} from '../data/portfolioData';

export function LoadingIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="segni-intro"
          initial={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 0.45, ease: [0.16, 1, 0.3, 1]}}}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172F] via-[#172347] to-[#131C3A] px-6 cursor-pointer select-none"
          aria-label="Loading portfolio"
        >
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
              className="font-display text-2xl sm:text-4xl font-bold tracking-[0.18em] text-white"
            >
              {BRAND_CONFIG.brandName}
            </motion.div>

            <div className="h-[2px] w-44 overflow-hidden bg-slate-700/70 rounded-full">
              <motion.div
                initial={{scaleX: 0}}
                animate={{scaleX: 1}}
                transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
                style={{transformOrigin: 'left'}}
                className="h-full w-full bg-gradient-to-r from-amber-300 via-sky-400 to-indigo-400"
              />
            </div>

            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.15, duration: 0.3}}
              className="text-xs font-mono tracking-widest text-zinc-400 tabular-nums"
            >
              {BRAND_CONFIG.tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
