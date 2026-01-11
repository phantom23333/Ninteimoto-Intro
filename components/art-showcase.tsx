"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { SakuraClassroom } from "@/components/sakura-classroom"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function ArtShowcase() {
  const { language } = useLanguage()

  return (
    <section id="art-showcase" className="bg-black text-white">
      {/* 标题页 / 过渡 */}
      <div className="py-24 px-6 md:px-12 border-b border-white/10">
        <span className="font-mono text-xs tracking-[0.3em] text-emerald-500 uppercase mb-4 block">
            {language === 'zh' ? "04 — 美学设计" : "04 — AESTHETICS"}
        </span>
        <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight max-w-3xl">
            {language === 'zh' ? "沉浸式艺术画廊" : "Immersive Art Gallery"}
        </h2>
        <p className="mt-6 text-white/60 max-w-xl font-sans text-lg">
            {language === 'zh' 
                ? "全屏沉浸式体验。每一个像素都经过精心雕琢，融合 NPR 非真实感渲染与次时代光影。" 
                : "Full-screen immersive experience. Every pixel carefully sculpted, blending NPR non-photorealistic rendering with next-gen lighting."}
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
            <h3 className="font-serif text-3xl mb-2">{language === 'zh' ? "四季教室" : "Seasonal Classroom"}</h3>
            <p className="font-mono text-xs opacity-70 uppercase tracking-widest">{language === 'zh' ? "实时 3D 渲染" : "Real-time 3D Rendering"}</p>
        </div>
      </div>

      {/* Part 2: Full Screen Lens Art 01 */}
      <FullScreenLensArt 
        index={1} 
        title={language === 'zh' ? "目标渲染参考" : "Target Render Reference"}
        subtitle={language === 'zh' ? "概念美术 / 环境" : "Concept Art / Environment"}
        color="bg-gradient-to-br from-slate-900 to-black" 
        bilibiliId="BV1qyTNzVEey"
      />

      {/* Part 3: Full Screen Lens Art 02 */}
      <FullScreenLensArt 
        index={2} 
        title={language === 'zh' ? "商业模式" : "Monetization Model"}
        subtitle={language === 'zh' ? "变现策略" : "Commercial Strategy"}
        color="bg-gradient-to-bl from-emerald-950 to-black" 
      >
        <div className="max-w-6xl mx-auto w-full text-white/90 select-text cursor-auto py-12 px-6 relative z-30">
            {/* Core Strategy Header */}
            <div className="relative mb-16 text-center">
                 <div className="inline-block border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md px-12 py-6 rounded-full shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                    <p className="text-3xl md:text-5xl font-light text-white tracking-widest font-serif">
                        {language === 'zh' ? "免费游玩" : "Free to Play"} <span className="text-emerald-500 mx-2 font-thin">+</span> {language === 'zh' ? "增值服务" : "Value-Added Services"}
                    </p>
                 </div>
                 <p className="text-xs text-white/40 mt-6 font-mono uppercase tracking-[0.3em]">
                    Core Monetization Strategy
                 </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Column 1: Diegetic Ads */}
                <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-emerald-500/30 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"/>
                    </div>
                    
                    <h4 className="text-2xl font-mono text-emerald-400 font-bold uppercase tracking-wider mb-8 flex items-center gap-4">
                        <span className="w-1.5 h-8 bg-emerald-500 block shadow-[0_0_15px_rgba(16,185,129,0.5)]"/>
                        {language === 'zh' ? "叙事化广告" : "Diegetic Advertising"}
                        <span className="text-xs text-white/30 font-normal normal-case ml-auto border border-white/10 px-2 py-1 rounded">Reverse CBT</span>
                    </h4>
                    
                    <p className="text-white/60 text-sm leading-relaxed mb-8 border-l border-white/10 pl-4 italic">
                        {language === 'zh' ? "\"AI驱动的原生植入，严格整合在叙事中以保持沉浸感。\"" : "\"AI-driven native placements, strictly integrated within narrative to maintain immersion.\""}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-black/40 border border-white/5 group-hover:border-emerald-500/20 transition-all hover:translate-x-1">
                            <div className="text-emerald-500 mt-1 p-2 bg-emerald-500/10 rounded-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <div className="text-emerald-100 font-bold text-base mb-1">{language === 'zh' ? "场景植入" : "Environment"}</div>
                                <div className="text-white/40 text-xs leading-relaxed">{language === 'zh' ? "基于玩家兴趣的动态屏幕广告，无缝融入环境。" : "Dynamic ads on in-game screens based on player interests."}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-black/40 border border-white/5 group-hover:border-emerald-500/20 transition-all hover:translate-x-1">
                            <div className="text-emerald-500 mt-1 p-2 bg-emerald-500/10 rounded-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <div>
                                <div className="text-emerald-100 font-bold text-base mb-1">{language === 'zh' ? "角色植入" : "Character"}</div>
                                <div className="text-white/40 text-xs leading-relaxed">{language === 'zh' ? "NPC自然对话中的上下文感知提及，拒绝生硬推销。" : "Context-aware product mentions by NPCs in natural dialogue."}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: IAP */}
                <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-purple-500/30 backdrop-blur-sm">
                     <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                         <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"/>
                    </div>

                    <h4 className="text-2xl font-mono text-purple-400 font-bold uppercase tracking-wider mb-8 flex items-center gap-4">
                        <span className="w-1.5 h-8 bg-purple-500 block shadow-[0_0_15px_rgba(168,85,247,0.5)]"/>
                        {language === 'zh' ? "应用内购" : "In-App Purchases"}
                        <span className="text-xs text-white/30 font-normal normal-case ml-auto border border-white/10 px-2 py-1 rounded">Value Services</span>
                    </h4>

                    <div className="space-y-4">
                        {[
                            { title: language === 'zh' ? "剧本扩展包" : "Scenario Packs", desc: language === 'zh' ? "解锁记忆碎片 / 平行时间线" : "Unlock exclusive memory fragments or parallel timelines", color: "text-purple-300", border: "group-hover:border-purple-500/30", bg: "bg-purple-500/10" },
                            { title: language === 'zh' ? "心理学工具" : "Psychological Tools", desc: language === 'zh' ? "上帝视角 (隐藏数值) / 时光倒流" : "\"God View\" (Hidden Stats) / Time Rewind", color: "text-blue-300", border: "group-hover:border-blue-500/30", bg: "bg-blue-500/10" },
                            { title: language === 'zh' ? "人格调优订阅" : "Persona Tuning", desc: language === 'zh' ? "深度微调NPC性格特质的订阅服务" : "Subscription to fine-tune NPC personality traits", color: "text-pink-300", border: "group-hover:border-pink-500/30", bg: "bg-pink-500/10" }
                        ].map((item, i) => (
                            <div key={i} className={`p-5 rounded-xl bg-black/40 border border-white/5 ${item.border} transition-all hover:scale-[1.02] flex items-center justify-between group/item`}>
                                <div>
                                    <div className={`font-bold text-base mb-1 ${item.color} flex items-center gap-2`}>
                                        <span className={`w-2 h-2 rounded-full ${item.bg}`}></span>
                                        {item.title}
                                    </div>
                                    <div className="text-white/40 text-xs ml-4">{item.desc}</div>
                                </div>
                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity text-white/20 transform translate-x-[-10px] group-hover/item:translate-x-0 duration-300">
                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
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
  const { language } = useLanguage()
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
                {bilibiliId 
                    ? (language === 'zh' ? "点击播放" : "Click to Play") 
                    : (language === 'zh' ? "透镜模式已激活" : "Lens Mode Active")}
            </div>
        )}
    </div>
  )
}
