import { Helmet } from "react-helmet-async";
import PageMeta from "../Components/PageMeta";
import HeroSection from "../Components/landing/HeroSection";
import TrustSection from "../Components/landing/TrustSection";
import ServicesSection from "../Components/landing/ServicesSection";
import HowWeWorkSection from "../Components/landing/HowWeWorkSection";
import FeaturedProjectsSection from "../Components/landing/FeaturedProjectsSection";
import IndustriesSection from "../Components/landing/IndustriesSection";
import WhyCookITSection from "../Components/landing/WhyCookITSection";
import BeyondWebsitesSection from "../Components/landing/BeyondWebsitesSection";
import TestimonialsSection from "../Components/landing/TestimonialsSection";
import FaqSection from "../Components/landing/FaqSection";
import FinalCTASection from "../Components/landing/FinalCTASection";

// New premium landing — 10 sections. Navbar + Footer are provided by <Layout>.
function Home() {
  return (
    <>
      <PageMeta />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CookIT",
          description: "Technology solutions company helping businesses digitize, automate, and scale — websites, custom software, mobile apps, and AI automation.",
          foundingDate: "2025",
          url: "https://cookit.example",
          sameAs: ["https://linkedin.com/", "https://instagram.com/"],
        })}</script>
      </Helmet>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <HowWeWorkSection />
      <FeaturedProjectsSection />
      <IndustriesSection />
      <WhyCookITSection />
      <BeyondWebsitesSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCTASection />
    </>
  );
}

export default Home;
