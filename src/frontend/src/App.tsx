import { useEffect } from "react";
import AllPlansCarousel from "./components/AllPlansCarousel";
import ComparePlans from "./components/ComparePlans";
import ContactSection from "./components/ContactSection";
import EnterpriseSection from "./components/EnterpriseSection";
import ExitIntentPopup from "./components/ExitIntentPopup";
import FAQSection from "./components/FAQSection";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ParticleBackground from "./components/ParticleBackground";
import PricingSection from "./components/PricingSection";
import ROICalculator from "./components/ROICalculator";
import ServicesSection from "./components/ServicesSection";
import SpecialOffersSection from "./components/SpecialOffersSection";
import StickyFloatingCTA from "./components/StickyFloatingCTA";
import ThreeBackground from "./components/ThreeBackground";
import TrustBand from "./components/TrustBand";
import { useActor } from "./hooks/useActor";

export default function App() {
  const { actor } = useActor();

  // Increment visit count on mount
  useEffect(() => {
    if (actor) {
      actor.incrementVisitCount().catch(() => {
        // Silently fail — analytics shouldn't break the page
      });
    }
  }, [actor]);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "#050A0A", color: "white" }}
    >
      {/* 3D wireframe background */}
      <ThreeBackground />

      {/* Animated particle canvas background */}
      <ParticleBackground />

      {/* Main content */}
      <main>
        <HeroSection />
        <TrustBand />
        <PricingSection />
        <AllPlansCarousel />
        <SpecialOffersSection />
        <ServicesSection />
        <EnterpriseSection />
        <ROICalculator />
        <ComparePlans />
        <FAQSection />
        <ContactSection />
        <FinalCTA />
      </main>

      <Footer />

      {/* Fixed UI elements */}
      <StickyFloatingCTA />
      <ExitIntentPopup />
    </div>
  );
}
