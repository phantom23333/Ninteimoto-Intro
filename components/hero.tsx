"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SentientSphere } from "./sentient-sphere"

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])


  /* 
  // Auto-scroll logic removed as per user request to cancel previous deployment logic
  /*
  const hasScrolled = useRef(false)

  const scrollToConcept = () => {
    if (hasScrolled.current) return
    const element = document.getElementById('concept')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      hasScrolled.current = true
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToConcept()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])
  */

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
    >
      {/* 3D Sphere Background */}
      <div className="absolute inset-0">
        <SentientSphere />
      </div>

      {/* Typography Overlay */}
      <motion.div style={{ opacity, scale }} className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
        
        {/* Main Title & Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-6 max-w-4xl"
        >
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight text-white mix-blend-difference">
            NINTEIMOTO
          </h1>
          
          <div className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-light tracking-widest text-white/80 uppercase">
              Sliced Memory Reconstruction RPG
            </h2>
            <p className="font-sans text-sm md:text-base tracking-wide text-white/60">
              "在无限的记忆回路中，寻找被遗忘的真相。"
            </p>
          </div>
        </motion.div>

        {/* Center Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16"
        >
          <button
            data-cursor-hover
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 border border-white/20 rounded-full" />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
             {/* Labyrinth Shader Effect Simulation (CSS Pattern) */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1zm4 0h2v2h-2V1zm4 0h2v2h-2V1zM1 5h2v2H1V5zm4 0h2v2H5V5zm4 0h2v2H9V5zm4 0h2v2h-2V5zm4 0h2v2h-2V5zM1 9h2v2H1V9zm4 0h2v2H5V9zm4 0h2v2H9V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zM1 13h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            />
            
            <span className="relative font-mono text-sm tracking-[0.2em] uppercase text-white group-hover:text-white transition-colors">
              Enter Labyrinth
            </span>
          </button>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
