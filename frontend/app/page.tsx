import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import StartupCarousel from '@/components/landing/StartupCarousel';
import OpportunitiesSection from '@/components/landing/OpportunitiesSection';
import StatsSection from '@/components/landing/StatsSection';
import KnowledgeHub from '@/components/landing/KnowledgeHub';
import MentorshipSection from '@/components/landing/MentorshipSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StartupCarousel />
        <OpportunitiesSection />
        <StatsSection />
        <KnowledgeHub />
        <MentorshipSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
