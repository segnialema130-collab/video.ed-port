import {useEffect, useState} from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({x: -100, y: -100});
  const [cursorMode, setCursorMode] = useState<'default' | 'pointer' | 'watch'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || prefersReduced) {
      return;
    }

    setEnabled(true);

    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="watch"]')) {
        setCursorMode('watch');
      } else if (target?.closest('a, button, input, textarea, select, [role="button"]')) {
        setCursorMode('pointer');
      } else {
        setCursorMode('default');
      }
    };

    const handleLeave = () => setVisible(false);

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      setPosition({x: currentX, y: currentY});
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, {passive: true});
    document.addEventListener('mouseleave', handleLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled || !visible) return null;

  const isWatch = cursorMode === 'watch';
  const isPointer = cursorMode === 'pointer';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border transition-all duration-150 ease-out ${
          isWatch
            ? 'h-16 w-16 border-violet-400/70 bg-violet-600/20 backdrop-blur-md text-[11px] font-medium tracking-wide text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]'
            : isPointer
              ? 'h-9 w-9 border-sky-400/70 bg-sky-400/10'
              : 'h-6 w-6 border-white/30 bg-transparent'
        }`}
      >
        {isWatch ? 'Play' : null}
      </div>
    </div>
  );
}
