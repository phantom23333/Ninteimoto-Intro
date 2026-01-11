"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { VisualCanvas } from "./concept-visuals"

export function ConceptSection() {
  const [activeSession, setActiveSession] = useState<'maze' | 'labyrinth'>('maze')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Auto-switch sessions every 5 seconds
    const interval = setInterval(() => {
        if (!isHovered) {
            setActiveSession(prev => prev === 'maze' ? 'labyrinth' : 'maze')
        }
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered])

  // Content for the sessions
  const content = {
    maze: {
        subtitle: "01 - SESSION - 00",
        title: "The Maze",
        desc: "Traditional Narrative",
        detail: "传统游戏如同迷宫（Maze），有明确的入口与出口。玩家的目标是解开谜题、击败敌人并逃离。一旦通关，这部分记忆即宣告死亡，无法再生。",
        color: "text-emerald-500",
        borderColor: "border-emerald-500/30",
        bgGradient: "from-emerald-950/20 to-black"
    },
    labyrinth: {
        subtitle: "01 - SESSION - 01",
        title: "The Labyrinth",
        desc: "Memory Circuit",
        detail: "Ninteimoto 构建了一个没有物理出口的回路。目标不是逃离，而是通过对话深入记忆核心。每一次选择都会基于蝴蝶效应重构叙事，让你在同一段记忆中抵达不同的真相深渊。",
        color: "text-indigo-400",
        borderColor: "border-indigo-500/30",
        bgGradient: "from-indigo-950/20 to-black"
    }
  }

  const activeContent = content[activeSession]

  return (
    <section id="concept" className="py-24 md:py-32 bg-black text-white relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16 space-x-12">
            <button 
                onClick={() => setActiveSession('maze')}
                className={cn(
                    "text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-2 border-b-2",
                    activeSession === 'maze' ? "text-emerald-400 border-emerald-400" : "text-white/30 border-transparent hover:text-white/60"
                )}
            >
                Session 00
            </button>
            <button 
                onClick={() => setActiveSession('labyrinth')}
                className={cn(
                    "text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-2 border-b-2",
                    activeSession === 'labyrinth' ? "text-indigo-400 border-indigo-400" : "text-white/30 border-transparent hover:text-white/60"
                )}
            >
                Session 01
            </button>
        </div>

        {/* Main Content Area - Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center h-[600px]">
            
            {/* Left: Text Content */}
            <div className="relative z-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSession}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={cn("font-mono text-xs tracking-widest uppercase mb-6", activeContent.color)}>
                            {activeContent.subtitle}
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-4 text-white">
                            {activeContent.title}
                        </h2>
                        <h3 className="font-sans text-xl text-white/60 mb-8 font-light tracking-wide">
                            {activeContent.desc}
                        </h3>
                        
                        <div className="relative pl-6 border-l border-white/10">
                            <p className="text-white/80 leading-relaxed text-lg max-w-md">
                                {activeContent.detail}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right: Visual Display */}
            <div 
                className="relative h-full w-full flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                 {/* Background Container for Visual */}
                 <motion.div 
                    layoutId="visual-container"
                    className={cn(
                        "absolute inset-0 rounded-3xl border backdrop-blur-sm transition-all duration-700 bg-gradient-to-br",
                        activeContent.borderColor,
                        activeContent.bgGradient
                    )}
                 >
                    {/* The 3D Canvas */}
                    <VisualCanvas type={activeSession} isHovered={isHovered} />
                    
                    {/* Decorative UI Overlay */}
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start opacity-30">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="flex justify-between items-end opacity-30">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                 </motion.div>
            </div>
        </div>
      </div>
    </section>
  )
}
