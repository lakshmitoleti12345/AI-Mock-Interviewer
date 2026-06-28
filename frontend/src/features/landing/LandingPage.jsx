import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { useBackendHealth } from "../../shared/hooks/useBackendHealth";

export default function LandingPage() {
  const { health, error, loading } = useBackendHealth();

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer health={health} error={error} loading={loading} />
    </div>
  );
}
