'use client'

import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import CategorySection from '@/components/landing/CategorySection'
import GISMapSection from '@/components/landing/GISMapSection'
import AnalyticsSection from '@/components/landing/AnalyticsSection'
import WorkflowSection from '@/components/landing/WorkflowSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import TrustSection from '@/components/landing/TrustSection'
import MobilePreviewSection from '@/components/landing/MobilePreviewSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <> 
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <GISMapSection />
        <AnalyticsSection />
        <WorkflowSection />
        <FeaturesSection />
        <TrustSection />
        <MobilePreviewSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}