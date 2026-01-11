"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { SakuraClassroom } from "@/components/sakura-classroom"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

export function ArtShowcase() {
  return (
    <section id="art-showcase" className="bg-black text-white">
      {/* 标题页 / 过渡 */}
      <div className="py-24 px-6 md:px-12 border-b border-white/10">
        <span className="font-mono text-xs tracking-[0.3em] text-emerald-500 uppercase mb-4 block">
            04 — AESTHETICS
        </span>
        <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight max-w-3xl">
            Immersive Art Gallery
        </h2>
        <p className="mt-6 text-white/60 max-w-xl font-sans text-lg">
            全屏沉浸式体验。每一个像素都经过精心雕琢，融合 NPR 非真实感渲染与次时代光影。
        </p>
      </div>

      {/* Part 1: Sakura Classroom (3D Scene) - Full Screen */}
      <div className="h-screen w-full relative border-b border-white/10 group overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* SakuraClassroom 自带 Canvas，直接铺满 */}
           <SakuraClassroom />
        </div>
        
        {/* 覆盖文字 */}
        <div className="absolute top-12 left-6 md:left-12 pointer-events-none z-10 mix-blend-difference text-white">
            <h3 className="font-serif text-3xl mb-2">Seasonal Classroom</h3>
            <p className="font-mono text-xs opacity-70 uppercase tracking-widest">Real-time 3D Rendering</p>
        </div>
      </div>

      {/* Part 2: Full Screen Lens Art 01 */}
      <FullScreenLensArt 
        index={1} 
        title="Target Render Reference" 
        subtitle="Concept Art / Environment"
        color="bg-gradient-to-br from-slate-900 to-black" 
        bilibiliId="BV1qyTNzVEey"
      />

      {/* Part 3: Full Screen Lens Art 02 */}
      <FullScreenLensArt 
        index={2} 
        title="Monetization Model"
        subtitle="Commercial Strategy"
        color="bg-gradient-to-bl from-emerald-950 to-black" 
      >
        <div className="max-w-5xl mx-auto space-y-12 text-white/90 select-text cursor-auto py-12 px-6">
            <div className="border-l-2 border-emerald-500 pl-6">
                <p className="text-2xl font-light text-white tracking-wide">Free to Play + Value-Added Services</p>
                <p className="text-sm text-white/50 mt-2 font-mono uppercase">Core Strategy</p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 text-sm">
                {/* Column 1 */}
                <div className="space-y-6">
                    <h4 className="text-lg font-mono text-emerald-400 font-bold uppercase tracking-wider border-b border-emerald-500/20 pb-2">Diegetic Advertising</h4>
                    <p className="text-white/60 leading-relaxed text-xs">
                        AI-driven ad placements integrated strictly within the narrative to maintain immersion (Reverse CBT).
                    </p>
                    <ul className="space-y-4 text-xs">
                        <li className="flex gap-3">
                            <span className="text-emerald-500 font-bold shrink-0">Environment:</span> 
                            <span className="text-white/50">Dynamic ads on in-game screens based on player interests.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-500 font-bold shrink-0">Character:</span> 
                            <span className="text-white/50">Context-aware product mentions by NPCs in natural dialogue.</span>
                        </li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    <h4 className="text-lg font-mono text-emerald-400 font-bold uppercase tracking-wider border-b border-emerald-500/20 pb-2">In-App Purchases</h4>
                    <ul className="space-y-4 text-xs">
                        <li>
                            <div className="text-emerald-500 font-bold mb-1">Scenario Packs</div>
                            <div className="text-white/50">Unlock exclusive memory fragments or parallel timelines.</div>
                        </li>
                        <li>
                            <div className="text-emerald-500 font-bold mb-1">Psychological Tools</div>
                            <div className="text-white/50">"God View" to see hidden stats; "Time Rewind" to reset dialogues.</div>
                        </li>
                        <li>
                            <div className="text-emerald-500 font-bold mb-1">Persona Tuning</div>
                            <div className="text-white/50">Subscription to fine-tune NPC personality traits.</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </FullScreenLensArt>
    </section>
  )
}

// 全屏透镜交互组件
function FullScreenLensArt({ 
    index, title, subtitle, color, bilibiliId, children
}: { 
    index: number, title: string, subtitle: string, color: string, bilibiliId?: string, children?: React.ReactNode
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handlePlayClick = () => {
      setIsPlaying(true)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("h-screen w-full relative overflow-hidden cursor-none group", color)}
    >
        {/* 背景内容 (可以是图片) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
            {children ? (
                <div className="w-full h-full flex flex-col justify-center items-center text-left pointer-events-auto overflow-y-auto z-10 p-12">
                   {children}
                </div>
            ) : bilibiliId ? (
                 <div className="w-full h-full flex items-center justify-center pointer-events-auto">
                    {!isPlaying ? (
                        <div className="relative w-[80%] max-w-4xl aspect-video bg-black/50 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors z-30" onClick={handlePlayClick}>
                            <div className="absolute top-6 left-6 z-20 pointer-events-none text-left">
                                 <h3 className="font-serif text-2xl text-white/90 drop-shadow-md">目标渲染参照</h3>
                                 <p className="font-mono text-xs text-white/50 uppercase tracking-widest mt-1">Target Render Reference</p>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white ml-1 fill-white" />
                            </div>
                            <div className="absolute bottom-6 text-white/60 font-mono text-xs uppercase tracking-widest">
                                Watch Concept Video
                            </div>
                        </div>
                    ) : (
                        <div className="w-[80%] max-w-4xl aspect-video z-30 shadow-2xl">
                            <iframe 
                                src={`//player.bilibili.com/player.html?bvid=${bilibiliId}&page=1&autoplay=1&high_quality=1&danmaku=0`} 
                                className="w-full h-full rounded-lg"
                                scrolling="no" 
                                allow="autoplay; fullscreen"
                                style={{ border: 0 }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-[20vw] font-serif font-bold text-white/5 select-none">
                    ART.0{index}
                </div>
            )}
        </div>

        {/* Lens / 手电筒效果 - 只在未播放时显示 */}
        {!isPlaying && (
            <motion.div 
                className="absolute w-64 h-64 rounded-full border border-white/20 bg-white/5 backdrop-blur-[2px] shadow-[0_0_50px_rgba(255,255,255,0.1)] pointer-events-none z-20 mix-blend-overlay"
                style={{ 
                    left: mousePos.x - 128, 
                    top: mousePos.y - 128,
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            >
                 {/* Lens 中心的高光点 */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
            </motion.div>
        )}

        {/* 底部信息 - 播放时隐藏 */}
        {!isPlaying && (
            <div className="absolute bottom-12 left-6 md:left-12 z-10 pointer-events-none">
                <div className="font-mono text-xs text-white/40 mb-2 uppercase tracking-widest">{subtitle}</div>
                <h3 className="font-serif text-4xl md:text-5xl text-white/90">{title}</h3>
            </div>
        )}

        {/* 交互提示 */}
        {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {bilibiliId ? "Click to Play" : "Lens Mode Active"}
            </div>
        )}
    </div>
  )
}
