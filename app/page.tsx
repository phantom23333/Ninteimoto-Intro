import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ConceptSection } from "@/components/concept-section"
import { MechanicsSection } from "@/components/mechanics-section"
import { TechShowcase } from "@/components/tech-showcase"
import { ArtShowcase } from "@/components/art-showcase"
import { RoadmapSection } from "@/components/roadmap-section"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SectionBlend } from "@/components/section-blend"

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <SectionBlend />
        <ConceptSection />
        <MechanicsSection />
        <TechShowcase />
        <ArtShowcase />
        <RoadmapSection />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
