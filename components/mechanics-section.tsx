"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Plus, Play, Volume2, VolumeX, Maximize2 } from "lucide-react"
import Image from "next/image"
import { ASSETS } from "@/lib/assets"
import { cn } from "@/lib/utils"

export function MechanicsSection() {
  return (
    <section id="mechanics" className="py-24 md:py-32 bg-[#080808] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
        >
             <span className="font-mono text-xs tracking-[0.3em] text-white/50 uppercase mb-4 block">02 — MECHANICS</span>
             <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">AI-Native Core</h2>
        </motion.div>

        {/* Intro Video Player */}
        <IntroVideoPlayer />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MechanicCard
            title="Psychology Driven"
            category="Cognitive Behavior"
            subtitle="超越脚本的真实反馈"
            detailText="摒弃传统的脚本树（Script Tree）。我们引入 CBT（认知行为理论）构建 NPC 的心理模型。你的每一句话都会实时修正 NPC 的焦虑值、依赖度与认知偏差，从而改变剧情走向。"
            index={0}
            image={ASSETS.images.backgrounds.abstractDark}
          />
          <MechanicCard
            title="Dynamic Performance"
            category="Generative Interaction"
            subtitle="拒绝僵硬的站桩对话"
            detailText="整合 LLM 与 Motion Generation 模型。NPC 的回答、表情微动、肢体语言均由 AI 实时演算。没有预渲染的动画，只有当下这一刻的真实反应。"
            index={1}
            image={ASSETS.images.backgrounds.soundWave}
          />
          <MechanicCard
            title="Idealized Fidelity"
            category="The Aesthetic"
            subtitle="去除“数字油腻感”"
            detailText="基于 UE5 Substrate 材质系统，我们分离了‘肉体’与‘妆面’。配合高调摄影（High-Key）光照策略，呈现出如同偶像写真般通透、纯净的次时代视觉体验。"
            index={2}
            image={ASSETS.images.backgrounds.abstractMemory}
          />
        </div>
      </div>
    </section>
  )
}

function IntroVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-16 relative group rounded-lg overflow-hidden border border-white/10 bg-black aspect-video md:aspect-[21/9]"
    >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-6 pointer-events-none">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
                <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Core Loop Alpha</span>
            </div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest hidden md:block">
                System Record: REC-0492
            </div>
        </div>

        {/* Video */}
        <div className="absolute inset-0 cursor-pointer" onClick={togglePlay}>
            <video 
                ref={videoRef}
                src="/videos/mechanics_intro.mp4" 
                loop 
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
             
             {/* Play Button */}
             {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-all">
                     <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                         <Play className="w-8 h-8 text-white fill-white ml-1" />
                     </div>
                 </div>
             )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-4">
             <button 
                onClick={(e) => {
                    e.stopPropagation()
                    setIsMuted(!isMuted)
                }}
                className="p-2 rounded-full bg-black/40 border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
             >
                 {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] mix-blend-overlay" />
    </motion.div>
  )
}

function MechanicCard({
  title,
  category,
  subtitle,
  detailText,
  index,
  image,
}: {
  title: string
  category: string
  subtitle: string
  detailText: string
  index: number
  image: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col justify-between p-8 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
    >
      {/* Background Image on Hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="font-mono text-xs tracking-widest text-white/40 mb-4 uppercase">{category}</div>
        <h3 className="font-serif text-2xl md:text-3xl mb-2">{title}</h3>
        <p className="font-sans text-sm text-white/60 mb-6">{subtitle}</p>
      </div>

      <div className="relative z-10 mt-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <p className="font-sans text-sm text-white/80 leading-relaxed">
                {detailText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/50 hover:text-white transition-colors"
        >
          {isOpen ? "Less Details" : "Learn More"}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.div>
  )
}
