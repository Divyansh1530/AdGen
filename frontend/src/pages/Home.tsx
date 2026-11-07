import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { FlowSection } from "../components/FlowSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { PricingSection } from "../components/PricingCards";
import { FaqSection } from "../components/FaqSection";
import { CtaSection } from "../components/CtaSection";

export function Home() {
  return (
    <div className="grain min-h-screen bg-ink">
      <Navbar />
      <main>
        <Hero />
        <FlowSection />
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
