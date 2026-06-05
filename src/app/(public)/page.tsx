'use client'
 
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import QuickServicesSection from '@/components/landing/QuickServicesSection'
import AnalyticsSection from '@/components/landing/AnalyticsSection'
import GISMapSection from '@/components/landing/GISMapSection'
import CategorySection from '@/components/landing/CategorySection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import WorkflowSection from '@/components/landing/WorkflowSection'
import TrustSection from '@/components/landing/TrustSection'
import TestimoniSection from '@/components/landing/TestimoniSection'
import MobilePreviewSection from '@/components/landing/MobilePreviewSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
 
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <QuickServicesSection />
        <AnalyticsSection />
        <GISMapSection />
        <CategorySection />
        <FeaturesSection />
        <WorkflowSection />
        <TrustSection />
        <TestimoniSection />
        <MobilePreviewSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}