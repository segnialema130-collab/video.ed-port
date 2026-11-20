export function MotionBlurBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]"
    >
      {/* Primary sweeping motion-blur layer across entire site */}
      <img
        src="/assets/aistudio/image_d710e069.png"
        alt=""
        referrerPolicy="no-referrer"
        className="animate-motion-blur-a absolute inset-0 h-full w-full object-cover opacity-90 blur-[14px] will-change-transform"
      />

      {/* Secondary counter-drifting optical motion-blur trail */}
      <img
        src="/assets/aistudio/image_d710e069.png"
        alt=""
        referrerPolicy="no-referrer"
        className="animate-motion-blur-b absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen blur-[32px] will-change-transform"
      />

      {/* Measured contrast scrim preserving text legibility while keeping light-leak glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/45 via-[#050505]/35 to-[#050505]/65" />
    </div>
  );
}
