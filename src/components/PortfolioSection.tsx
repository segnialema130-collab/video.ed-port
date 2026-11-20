import {useRef, useState, type MouseEvent} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Film, Play, Plus} from 'lucide-react';
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  type PortfolioCategory,
  type PortfolioProject,
} from '../data/portfolioData';

interface PortfolioSectionProps {
  onSelectProject: (project: PortfolioProject) => void;
}

interface TiltCardProps {
  project: PortfolioProject;
  isFeaturedSlot: boolean;
  onSelect: (project: PortfolioProject) => void;
}

function ProjectCard({project, isFeaturedSlot, onSelect}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [tilt, setTilt] = useState({rotateX: 0, rotateY: 0});
  const [mediaError, setMediaError] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 6).toFixed(2)),
      rotateY: Number((x * 6).toFixed(2)),
    });
  };

  const handleMouseEnter = () => {
    if (videoPreviewRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoPreviewRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setTilt({rotateX: 0, rotateY: 0});
    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause();
    }
  };

  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.98}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.98}}
      transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
      className={isFeaturedSlot ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : 'col-span-1'}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B11] will-change-transform hover:border-violet-400/50"
      >
        <button
          type="button"
          data-cursor="watch"
          onClick={() => onSelect(project)}
          aria-label={`Play ${project.title}`}
          className="relative flex h-full w-full flex-col text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {/* Media Frame */}
          <div
            className={`relative w-full overflow-hidden bg-zinc-900 ${
              isFeaturedSlot ? 'aspect-[16/10] lg:h-full lg:min-h-[420px]' : 'aspect-[16/10]'
            }`}
          >
            {project.videoUrl && !mediaError ? (
              <video
                ref={videoPreviewRef}
                src={`${project.videoUrl}#t=0.8`}
                poster={project.thumbnail}
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setMediaError(true)}
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : !mediaError ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                referrerPolicy="no-referrer"
                onError={() => setMediaError(true)}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#151226] to-zinc-950 p-6 text-center">
                <Film className="h-8 w-8 text-violet-400" />
                <span className="mt-2 text-sm font-medium text-zinc-300">{project.title}</span>
              </div>
            )}

            {/* Measured contrast scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-200 group-hover:from-black/95"
            />

            {/* Top-right play button affordance */}
            <div className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/55 backdrop-blur-md text-white transition-all duration-200 group-hover:scale-105 group-hover:border-violet-400 group-hover:bg-violet-600">
              <Play className="h-4 w-4 fill-current translate-x-[1px]" />
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              {/* Unboxed Metadata (Zero Pills) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-300">
                <span className={project.accentHue === 'blue' ? 'text-sky-400' : 'text-violet-400'}>
                  {project.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{project.duration}</span>
                <span aria-hidden="true">·</span>
                <span>{project.aspectLabel}</span>
              </div>

              <h3
                className={`mt-2 font-display font-bold text-white tracking-tight ${
                  isFeaturedSlot ? 'text-xl sm:text-2xl lg:text-[1.75rem]' : 'text-lg sm:text-xl'
                }`}
              >
                {project.title}
              </h3>

              {isFeaturedSlot && (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-300 line-clamp-2">
                  {project.description}
                </p>
              )}

              <p className="mt-3 text-xs text-zinc-400">
                {project.client} <span aria-hidden="true">·</span> {project.year}
              </p>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export function PortfolioSection({onSelectProject}: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All Projects');
  const [customProjects, setCustomProjects] = useState<PortfolioProject[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allProjects = [...customProjects, ...PORTFOLIO_PROJECTS];

  const filteredProjects =
    activeCategory === 'All Projects'
      ? allProjects
      : allProjects.filter((item) => item.category === activeCategory);

  const handleUploadLocalVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const targetCategory =
      activeCategory === 'All Projects' ? 'Portfolio Videos' : activeCategory;

    const newProject: PortfolioProject = {
      id: `local-${Date.now()}`,
      title: cleanTitle || 'Custom Studio Preview',
      category: targetCategory,
      duration: 'Local Cut',
      year: '2026',
      client: 'Local Upload Preview',
      aspectLabel: 'Custom Master',
      description: 'Uploaded directly in-browser for instant playback and portfolio layout preview.',
      tools: ['Adobe Premiere Pro', 'SEGNI EDITOR'],
      thumbnail: '/src/assets/images/thumb_cinematic_edit_1795201039958.jpg',
      videoUrl: objectUrl,
      accentHue: 'purple',
    };

    setCustomProjects((prev) => [newProject, ...prev]);
    onSelectProject(newProject);
    e.target.value = '';
  };

  return (
    <section id="portfolio" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header Row */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-violet-400">Selected Portfolio</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Edits &amp; Motion Reels
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleUploadLocalVideo}
              className="hidden"
              aria-label="Preview your own local video file"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-zinc-900/70 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors duration-150 hover:border-sky-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Plus className="h-3.5 w-3.5 text-sky-400" />
              Test Local Video
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Functional Segmented Buttons) */}
        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-5"
        >
          {PORTFOLIO_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-zinc-900/70 text-zinc-300 border border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Dynamic Bento Grid */}
        <motion.div layout className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isFeaturedSlot={activeCategory === 'All Projects' && index === 0}
                onSelect={onSelectProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
