import ProjectsSection from "../Components/Portfolio_Components/ProjectsSection";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";
import CTABand from "../Components/common/CTABand";

function Portfolio() {
  return (
    <>
      <PageMeta
        title="Portfolio — Our Work | CookIT"
        description="Explore live websites CookIT has built for businesses across real estate, media, and hospitality."
      />
      <PageHero
        eyebrow="Portfolio"
        title="Work we're proud of"
        subtitle="A look at the live websites and products we've crafted for real businesses."
      />
      <ProjectsSection />
      <CTABand title="Want to be our next success story?" />
    </>
  );
}

export default Portfolio;
