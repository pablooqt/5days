import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/features/landing/HeroSection';
import { ValuePropsSection } from '@/features/landing/ValuePropsSection';
import { FeaturesSection } from '@/features/landing/FeaturesSection';
import { DeviceShowcaseSection } from '@/features/landing/DeviceShowcaseSection';
import { CTASection } from '@/features/landing/CTASection';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top sticky navigation */}
      <Navbar />

      {/* Main Landing Page Content */}
       <main className="flex-1">
        <HeroSection />
        <ValuePropsSection />
        <FeaturesSection />
        <DeviceShowcaseSection />
        <CTASection />
      </main>

      {/* Modern Footer */}
      <Footer />
    </div>
  );
}
