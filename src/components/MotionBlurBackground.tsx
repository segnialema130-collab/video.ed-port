export function MotionBlurBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#0F172F] via-[#172347] to-[#131C3A]"
    >
      {/* Subtle architectural sapphire & sky radial depth */}
      <div
        className="absolute -top-32 left-1/4 h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-[140px]"
      />
      <div
        className="absolute bottom-0 right-1/5 h-[480px] w-[480px] rounded-full bg-sky-400/14 blur-[150px]"
      />

      {/* Primary sweeping motion-blur light-leak layer (screen blend keeps sapphire base instead of black) */}
      <img
        src="/assets/aistudio/image_d710e069.png"
        alt=""
        referrerPolicy="no-referrer"
        className="animate-motion-blur-a absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-screen blur-[18px] will-change-transform"
      />

      {/* Secondary counter-drifting optical motion-blur trail */}
      <img
        src="/assets/aistudio/image_d710e069.png"
        alt=""
        referrerPolicy="no-referrer"
        className="animate-motion-blur-b absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen blur-[36px] will-change-transform"
      />

      {/* Soft sapphire-slate atmospheric veil preserving high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101833]/35 via-[#131D3D]/25 to-[#0E152C]/55" />
    </div>
  );
}
