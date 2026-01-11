"use client"

import { motion } from "framer-motion"

export function BasicInfoSection() {
  const items = [
    {
      label: "项目定位",
      enLabel: "Project Positioning",
      value: "深度融合生成式 AI 技术与认知心理学的次时代 RPG，重新定义互动叙事体验。",
    },
    {
      label: "项目代号",
      enLabel: "Code Name",
      value: "Ninteimoto",
    },
    {
      label: "一句话介绍",
      enLabel: "Logline",
      value: "切片式记忆重构 RPG —— 利用生成式 AI 技术，让玩家在非线性的动态记忆迷宫中，体验无限可能的“如果”。",
    },
    {
      label: "游戏类型",
      enLabel: "Genre",
      value: "叙事驱动型 RPG (Narrative-driven RPG) / 沉浸式模拟 (Immersive Sim)",
    },
    {
      label: "目标平台",
      enLabel: "Platform",
      value: "多端互通 (Cross-platform)，优先登陆 PC，后续适配移动端/主机。",
    },
    {
      label: "开发引擎",
      enLabel: "Engine",
      value: "Unreal Engine 5.7.1",
    },
    {
      label: "核心技术栈",
      enLabel: "Tech Stack",
      value: "Metahuman, Generative AI (LLM, TTS, Motion Generation), Behavioral Psychology Model.",
    },
  ]

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="mb-16 border-b border-white/10 pb-8">
            <span className="font-mono text-xs tracking-widest text-emerald-500 uppercase block mb-4">
              01 - SESSION - 00
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              1. 基础信息 <span className="text-white/40 text-2xl md:text-3xl ml-2 font-light">(Basic Information)</span>
            </h2>
          </div>

          {/* Info Grid */}
          <div className="grid gap-8 md:gap-12">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="grid md:grid-cols-[200px,1fr] gap-4 md:gap-8 items-start group"
              >
                <div className="flex flex-col">
                  <span className="text-white/90 font-medium">{item.label}</span>
                  <span className="text-xs text-white/40 font-mono uppercase tracking-wider mt-1">
                    {item.enLabel}
                  </span>
                </div>
                <div className="text-white/70 font-light leading-relaxed group-hover:text-white transition-colors duration-300">
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
