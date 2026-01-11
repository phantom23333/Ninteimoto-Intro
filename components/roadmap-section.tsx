"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const phases = [
  {
    phase: "01",
    date: "2026.02",
    title: "Web Prototype",
    desc: "原型验证"
  },
  {
    phase: "02",
    date: "2026.04",
    title: "Pre-Alpha",
    desc: "场景切片"
  },
  {
    phase: "03",
    date: "2026.06",
    title: "Vertical Slice",
    desc: "垂直切片"
  }
]

export function RoadmapSection() {
  const containerRef = useRef<HTMLElement>(null)
  
  return (
    <section id="roadmap" ref={containerRef} className="py-24 md:py-32 bg-[#080808] text-white border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
        >
             <span className="font-mono text-xs tracking-[0.3em] text-white/50 uppercase mb-4 block">05 — TIMELINE</span>
             <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">Roadmap</h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {phases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative flex flex-col items-center text-center md:items-start md:text-left bg-[#080808] md:bg-transparent p-6 md:p-0 rounded-xl border border-white/10 md:border-none"
              >
                 {/* Dot on Line */}
                 <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 bg-white rounded-full ring-4 ring-[#080808] group-hover:scale-125 transition-transform duration-300" />
                 
                 <div className="md:pl-8 w-full">
                    <div className="font-mono text-xs text-white/40 mb-2">{item.date}</div>
                    <div className="font-serif text-2xl mb-1">Phase {item.phase}</div>
                    <div className="font-sans text-lg font-medium text-white/90 mb-1">{item.title}</div>
                    <div className="font-sans text-sm text-white/60">{item.desc}</div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
