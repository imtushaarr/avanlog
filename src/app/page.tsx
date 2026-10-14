import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TechnologyMarquee from "@/components/TechnologyMarquee";
import ServicesSection from "@/components/ServicesSection";
import WhyDevOps from "@/components/WhyDevOps";
import PipelineDashboard from "@/components/PipelineDashboard";
import EngagementModels from "@/components/EngagementModels";
import ConversionSection from "@/components/ConversionSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        <Hero />
        <TechnologyMarquee />
        <ServicesSection />
        <WhyDevOps />
        <PipelineDashboard />
        <EngagementModels />
        <ConversionSection />
      </main>
      <Footer />
    </>
  );
}
