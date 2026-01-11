"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
  const [time, setTime] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0")
      setTime(`${hours}:${minutes}:${seconds}.${milliseconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 10)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="relative bg-[#050505] text-white">
      {/* Main CTA */}
      <motion.a
        href="#"
        data-cursor-hover
        className="relative block overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Curtain */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Content */}
        <div className="relative py-16 md:py-24 px-8 md:px-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
                 <p className="font-mono text-xs tracking-[0.2em] text-white/50 group-hover:text-black/50 transition-colors">NEXT STEPS</p>
                 <motion.h2
                  className="font-serif text-4xl md:text-6xl lg:text-8xl font-light tracking-tight text-center md:text-left"
                  animate={{
                    color: isHovered ? "#050505" : "#fafafa",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Join the <span className="italic">Waitlist</span>
                </motion.h2>
            </div>
           

            <motion.div
              animate={{
                rotate: isHovered ? 45 : 0,
                color: isHovered ? "#050505" : "#fafafa",
              }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16" />
            </motion.div>
          </div>
        </div>
      </motion.a>

      {/* Footer Info */}
      <div className="px-8 md:px-12 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Local Time */}
          <div className="font-mono text-xs tracking-widest text-white/40">
            <span className="mr-2">SYSTEM TIME</span>
            <span className="text-white tabular-nums">{time}</span>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {["Twitter", "Discord", "YouTube"].map((link) => (
              <a
                key={link}
                href="#"
                data-cursor-hover
                className="font-mono text-xs tracking-widest text-white/40 hover:text-white transition-colors duration-300 uppercase"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs tracking-widest text-white/40">© {new Date().getFullYear()} NINTEIMOTO</p>
        </div>
      </div>
    </footer>
  )
}
