import { withProviders } from "@/lib/withProviders";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StickyArticlesTicker from "@/components/StickyArticlesTicker";
import AboutPreview from "@/components/AboutPreview";
import VideoPlaylist from "@/components/VideoPlaylist";
import LatestNews from "@/components/LatestNews";
import StatsSection from "@/components/StatsSection";
import Publications from "@/components/Publications";

import ProjectsGrid from "@/components/ProjectsGrid";
import ProjectThemes from "@/components/ProjectThemes";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <Hero />
        <StickyArticlesTicker />
        <AboutPreview />
        <ProjectThemes />
        <ProjectsGrid />
        <VideoPlaylist />
        <StatsSection />
        <Publications />
        <LatestNews />
        <Testimonials />
        <Partners />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default withProviders(Index);
