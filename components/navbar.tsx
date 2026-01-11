"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

const navLinks = [
  { label: "Concept", labelZh: "概念", href: "#concept" },
  { label: "Mechanics", labelZh: "机制", href: "#mechanics" },
  { label: "Tech", labelZh: "技术", href: "#tech" },
  { label: "Roadmap", labelZh: "路线图", href: "#roadmap" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : ""
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 my-0 md:px-12 md:py-5">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="group flex items-center gap-2"
          >
            <span className="font-mono text-xs tracking-widest text-white/70 group-hover:text-white transition-colors">NINTEIMOTO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform duration-300" />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={link.label}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="group relative font-mono text-xs tracking-wider text-white/50 hover:text-white transition-colors duration-300"
                >
                  <span className="text-white/30 mr-1">0{index + 1}</span>
                  {(language === 'zh' ? link.labelZh : link.label).toUpperCase()}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Status Indicator & Lang Switch */}
          <div className="hidden md:flex items-center gap-6">
            <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
            >
                [{language === 'zh' ? 'EN' : '中文'}]
            </button>
            <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs tracking-wider text-white/50">SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
            >
                {language === 'zh' ? 'EN' : '中文'}
            </button>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Toggle menu"
            >
                <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-white origin-center"
                />
                <motion.span
                animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="w-6 h-px bg-white"
                />
                <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-white origin-center"
                />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="group text-4xl font-serif tracking-tight text-white"
                >
                  <span className="text-white/30 font-mono text-sm mr-2">0{index + 1}</span>
                  {language === 'zh' ? link.labelZh : link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mt-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs tracking-wider text-white/50">SYSTEM ONLINE</span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
