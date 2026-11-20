import {useState} from 'react';
import {AboutSection} from './components/AboutSection';
import {ContactSection} from './components/ContactSection';
import {CustomCursor} from './components/CustomCursor';
import {Footer} from './components/Footer';
import {HeroSection} from './components/HeroSection';
import {InboxModal} from './components/InboxModal';
import {LoadingIntro} from './components/LoadingIntro';
import {MotionBlurBackground} from './components/MotionBlurBackground';
import {Navbar} from './components/Navbar';
import {PortfolioSection} from './components/PortfolioSection';
import {ProcessSection} from './components/ProcessSection';
import {ServicesSection} from './components/ServicesSection';
import {SkillsSection} from './components/SkillsSection';
import {TestimonialsSection} from './components/TestimonialsSection';
import {VideoPreviewModal} from './components/VideoPreviewModal';
import type {PortfolioProject} from './data/portfolioData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100">
      <MotionBlurBackground />
      <LoadingIntro />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection onSelectProject={setSelectedProject} />
        <SkillsSection />
        <ProcessSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <div className="relative z-10">
        <Footer onOpenInbox={() => setInboxOpen(true)} />
      </div>

      <VideoPreviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <InboxModal
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
      />
    </div>
  );
}
