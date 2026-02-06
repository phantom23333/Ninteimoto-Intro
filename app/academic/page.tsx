import { AcademicShowcase } from "@/components/academic/academic-showcase"

export const metadata = {
  title: "Academic Showcase | Ninteimoto Research",
  description: "Multimodal TTS and Lip-Sync Analysis Prototype",
}

export default function AcademicPage() {
  return (
    <main className="min-h-screen bg-white">
      <AcademicShowcase />
    </main>
  )
}
