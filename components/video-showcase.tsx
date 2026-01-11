"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"
import { ASSETS } from "@/lib/assets"

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (videoRef.current && containerRef.current) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  return (
    <section className="relative py-32 px-8 md:px-12 bg-black/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">06 — SHOWCASE</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Visual Narrative</h2>
      </motion.div>

      <div className="relative w-full max-w-7xl mx-auto">
        <motion.div
          ref={containerRef}
          className="relative aspect-video rounded-xl overflow-hidden bg-black group shadow-2xl border border-white/10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            playsInline
            loop
            // Default source - replace with actual video path
            src={ASSETS.videos.demoReel} 
            poster={ASSETS.images.placeholders.generic} // Fallback poster
          >
            {/* You can add sources here */}
            {/* <source src={ASSETS.videos.demoReel} type="video/mp4" /> */}
          </video>

          {/* Fallback visual if no video source (for demo purposes) */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 pointer-events-none -z-10" />

          {/* Overlay / Initial Play Button */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
                onClick={togglePlay}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group/btn transition-colors hover:bg-white/20"
                >
                  <Play className="w-10 h-10 text-white fill-white translate-x-1 opacity-90 group-hover/btn:opacity-100" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-sm font-mono tracking-[0.2em] text-white/70 uppercase"
                >
                  Watch Showreel
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <motion.div
            className={cn(
              "absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
              isPlaying && isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress relative py-2"
              onClick={handleSeek}
            >
               <div className="absolute top-2 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white origin-left" 
                    style={{ width: `${progress}%` }} 
                  />
               </div>
               {/* Hover indicator could go here */}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                
                <div className="flex items-center gap-2 group/vol">
                  <button 
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </section>
  )
}
