import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
// Keep critical above-the-fold components static
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SectionBlend } from "@/components/section-blend"
import { Footer } from "@/components/footer"

// Lazy load below-the-fold heavy sections
const ConceptSection = dynamic(() => import("@/components/concept-section").then(mod => mod.ConceptSection), {
  loading: () => <div className="h-screen bg-black" />
})
const MechanicsSection = dynamic(() => import("@/components/mechanics-section").then(mod => mod.MechanicsSection))
const TechShowcase = dynamic(() => import("@/components/tech-showcase").then(mod => mod.TechShowcase))
const ArtShowcase = dynamic(() => import("@/components/art-showcase").then(mod => mod.ArtShowcase))
const RoadmapSection = dynamic(() => import("@/components/roadmap-section").then(mod => mod.RoadmapSection))

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
