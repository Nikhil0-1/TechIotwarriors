'use client';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CoursesSection } from '@/components/home/CoursesSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FounderSection } from '@/components/home/FounderSection';
import { CTASection } from '@/components/home/CTASection';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function HomePage() {
  useScrollReveal();
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesSection />
      <ProjectsSection />
      <ReviewsSection />
      <FounderSection />
      <CTASection />
    </>
  );
}
