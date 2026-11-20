import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Maximize2, Pause, Play, SlidersHorizontal, Volume2, VolumeX, X} from 'lucide-react';
import type {PortfolioProject} from '../data/portfolioData';

interface VideoPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function formatSeconds(total: number): string {
  const mins = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function VideoPreviewModal({project, onClose}: VideoPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [gradeSplit, setGradeSplit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [videoDurationSec, setVideoDurationSec] = useState<number | null>(null);
  const totalDemoSec = 24;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Reset playback state when switching projects
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    setCurrentTimeSec(0);
    setVideoDurationSec(null);
    setGradeSplit(false);
  }, [project?.id]);

  // ESC key handler
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  // Sync HTML5 video play/pause & mute
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, isMuted, project?.videoUrl]);

  // Procedural cinema preview timer when no external videoUrl is supplied
  useEffect(() => {
    if (!project || project.videoUrl || !isPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + 0.1;
        const wrapped = next >= totalDemoSec ? 0 : next;
        setProgress((wrapped / totalDemoSec) * 100);
        return wrapped;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [project, isPlaying]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
    } else {
      setCurrentTimeSec((val / 100) * totalDemoSec);
    }
  };

  const handleFullscreen = () => {
    if (!playerWrapperRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      playerWrapperRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  const embedUrl = project?.videoUrl ? getEmbedUrl(project.videoUrl) : null;
  const isNativeVideo = Boolean(project?.videoUrl && !embedUrl);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="video-modal-backdrop"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <motion.div
            initial={{opacity: 0, scale: 0.97, y: 12}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97, y: 12}}
            transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B11] shadow-2xl"
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="text-sky-400 font-medium">{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.client}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{project.duration}</span>
                </div>
                <h3 id="video-modal-title" className="mt-1 truncate font-display text-lg font-bold text-white sm:text-xl">
                  {project.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close video preview"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 text-zinc-200 transition-colors hover:border-white/35 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player Stage */}
            <div ref={playerWrapperRef} className="relative aspect-video w-full bg-black overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={project.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : isNativeVideo ? (
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  poster={project.thumbnail}
                  playsInline
                  autoPlay
                  loop
                  onClick={() => setIsPlaying((p) => !p)}
                  onLoadedMetadata={() => {
                    if (videoRef.current?.duration) {
                      setVideoDurationSec(videoRef.current.duration);
                    }
                  }}
                  onTimeUpdate={() => {
                    if (!videoRef.current || !videoRef.current.duration) return;
                    setCurrentTimeSec(videoRef.current.currentTime);
                    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                  }}
                  className="h-full w-full object-contain bg-black cursor-pointer"
                />
              ) : (
                /* Interactive Studio Preview Sequence (when no external MP4/YouTube URL is linked yet) */
                <div className="relative h-full w-full overflow-hidden select-none">
                  {/* Graded Frame */}
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    style={{
                      transform: isPlaying
                        ? `scale(${1.02 + (progress / 100) * 0.08}) translate3d(${(progress - 50) * -0.06}%, 0, 0)`
                        : 'scale(1.04)',
                      transition: 'transform 120ms linear',
                    }}
                    className="h-full w-full object-cover"
                  />

                  {/* Before/After Raw Log Comparison Split */}
                  {gradeSplit && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-sky-400/80"
                    >
                      <img
                        src={project.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{
                          transform: isPlaying
                            ? `scale(${1.02 + (progress / 100) * 0.08}) translate3d(${(progress - 50) * -0.06}%, 0, 0)`
                            : 'scale(1.04)',
                          filter: 'saturate(0.35) contrast(0.75) brightness(1.08)',
                        }}
                        className="h-full w-[200%] max-w-none object-cover"
                      />
                      <span className="absolute top-4 left-4 rounded bg-black/70 px-2.5 py-1 font-mono text-[11px] text-zinc-200">
                        Raw Camera Log
                      </span>
                    </div>
                  )}

                  {gradeSplit && (
                    <span className="absolute top-4 right-4 rounded bg-black/70 px-2.5 py-1 font-mono text-[11px] text-sky-300">
                      Final Color Grade
                    </span>
                  )}

                  {/* Cinematic Letterbox Overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-black/90"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/75 to-transparent"
                  />

                  {/* Center Play/Pause Click Target */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer focus-visible:outline-none"
                  >
                    {!isPlaying && (
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/70 backdrop-blur-md text-white">
                        <Play className="h-6 w-6 fill-current translate-x-[2px]" />
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Custom Transport Bar for Native Video or Studio Preview */}
              {!embedUrl && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-3 pt-2 bg-gradient-to-t from-black/95 to-transparent">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.5}
                    value={progress}
                    onChange={handleScrub}
                    aria-label="Seek video timeline"
                    className="h-1.5 w-full cursor-pointer accent-violet-500"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/10 cursor-pointer"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMuted((m) => !m)}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-200 hover:bg-white/10 cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>

                      <span className="font-mono text-xs text-zinc-300 tabular-nums">
                        {formatSeconds(currentTimeSec)} /{' '}
                        {isNativeVideo && videoDurationSec
                          ? formatSeconds(videoDurationSec)
                          : project.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isNativeVideo && (
                        <button
                          type="button"
                          onClick={() => setGradeSplit((prev) => !prev)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                            gradeSplit
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                              : 'bg-white/10 text-zinc-200 hover:bg-white/15'
                          }`}
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          Compare Color Grade
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleFullscreen}
                        aria-label="Toggle fullscreen"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-200 hover:bg-white/10 cursor-pointer"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project Credits & Details Footer */}
            <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-12 sm:px-6">
              <p className="text-sm leading-relaxed text-zinc-300 sm:col-span-8">{project.description}</p>
              <div className="sm:col-span-4 sm:border-l sm:border-white/10 sm:pl-6">
                <p className="text-xs font-medium text-zinc-400">Pipeline &amp; Tools</p>
                <p className="mt-1.5 text-sm text-zinc-200">{project.tools.join(' · ')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
