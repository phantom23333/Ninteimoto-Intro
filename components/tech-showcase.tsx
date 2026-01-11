"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Activity, Globe, Mic, Smartphone, Zap, Maximize2, Terminal, Cpu, Box, Film, Disc, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

import { ASSETS } from "@/lib/assets"

// --- Types & Data ---

type AudioSample = {
  id: string
  label: string
  text: string
  src: string
}

type MotionSample = {
  id: string
  label: string
  prompt: string
  tags: string[]
  src: string
}

type LanguageData = {
  [key: string]: AudioSample[]
}

const MOTION_SAMPLES: MotionSample[] = [
  {
    id: 'm-1',
    label: 'Move',
    prompt: "A person hesitates and then walks towards the camera.",
    tags: ['Kinematic Integrity', 'Physics Awareness', 'Zero-Shot'],
    src: '/videos/motion/gen_action_01.mp4'
  },
  {
    id: 'm-2',
    label: 'Piano',
    prompt: "A person sits and plays the piano.",
    tags: ['Rhythm Sync', 'Joint Constraints', 'Style Transfer'],
    src: '/videos/motion/gen_action_02.mp4'
  },
  {
    id: 'm-3',
    label: 'Dance',
    prompt: "A person performs a dance routine by taking small steps.",
    tags: ['Env Interaction', 'Balance Control', 'Real-time Physics'],
    src: '/videos/motion/gen_action_03.mp4'
  }
]

const VOICE_SAMPLES: LanguageData = {
  CN: [
    { id: 'cn-1', label: 'Furious', text: '我说了多少次！不要用那种无辜的眼神看着我！这一切的灾难，全都是因为你的自私造成的！', src: '/audio/voices/zh_01_furious.wav' },
    { id: 'cn-2', label: 'Despair', text: '算了吧……不管再怎么努力，结局都不会改变的。我的心已经死了，你就让我一个人烂在泥里吧。', src: '/audio/voices/zh_02_despair.wav' },
    { id: 'cn-3', label: 'Fear', text: '别过来……求求你别过来！我听见他在门外的呼吸声了，他手里拿着刀，他真的会杀了我们的！', src: '/audio/voices/zh_03_fear.wav' },
  ],
  EN: [
    { id: 'en-1', label: 'Accusation', text: 'Get out of my face! I have given you everything I had, and you threw it away like it meant absolutely nothing!', src: '/audio/voices/en_01_accusation.wav' },
    { id: 'en-2', label: 'Epic', text: 'This is not the end, my friends. We will rise from the ashes of this defeat and show the world who we truly are.', src: '/audio/voices/en_02_epic.wav' },
    { id: 'en-3', label: 'Pleading', text: 'Please, I’m begging you... dont walk out that door. If you leave now, I dont think I can ever survive this alone.', src: '/audio/voices/en_03_pleading.wav' },
  ],
  JP: [
    { id: 'jp-1', label: 'Passionate', text: 'ふざけるな！俺は仲間を絶対に裏切ったりしない！たとえこの命が尽きようとも、お前を倒す！', src: '/audio/voices/ja_01_passionate.wav' },
    { id: 'jp-2', label: 'Grief', text: '嘘だと言ってよ……。あんなに約束したじゃない！ずっと一緒にいるって、指切りしたじゃないか！', src: '/audio/voices/ja_02_grief.wav' },
    { id: 'jp-3', label: 'Yandere', text: 'ねえ、どこへ行くの？逃げられると思ってる？あなたのその目も、心も、全部私のものなんだから……。', src: '/audio/voices/ja_03_yandere.wav' },
  ],
}

type LogEntry = {
  id: number
  text: string
  timestamp: string
}

const SAMPLE_LOGS = [
  "Initializing neural core...",
  "Loading memory slice [0x4F2A]...",
  "Injecting CBT parameters...",
  "Rendering frame 1404...",
  "Syncing lip-flap to audio stream...",
  "Emotion detected: Melancholic (0.87)...",
  "Updating prompt matrix...",
  "Physics engine ready...",
  "Connecting to live socket...",
]

// --- Helper Components ---

function StatusLight({ status }: { status: "live" | "processing" | "idle" }) {
  const color = status === "live" ? "bg-emerald-500" : status === "processing" ? "bg-amber-500" : "bg-white/20"
  const pulse = status === "live" || status === "processing"
  
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color, pulse && "animate-pulse shadow-[0_0_8px_currentColor]")} />
      <span className={cn("text-[10px] font-mono tracking-widest uppercase", pulse ? "text-white" : "text-white/40")}>
        {status === "live" ? "LIVE PROTOTYPE" : status === "processing" ? "PROCESSING" : "STANDBY"}
      </span>
    </div>
  )
}

function WaveformVisualizer({ isPlaying, color = "#10b981" }: { isPlaying: boolean; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const bars = 40
    const barWidth = canvas.width / bars

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < bars; i++) {
        const height = isPlaying 
          ? Math.random() * canvas.height * 0.8 
          : Math.sin(Date.now() * 0.005 + i * 0.5) * 5 + 10 // Gentle idle wave
        
        const x = i * barWidth
        const y = (canvas.height - height) / 2
        
        ctx.fillStyle = color
        ctx.globalAlpha = 0.6
        ctx.fillRect(x, y, barWidth - 2, height)
      }
      
      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [isPlaying, color])

  return <canvas ref={canvasRef} width={300} height={40} className="w-full h-full" />
}

// --- Main Component ---

export function TechShowcase() {
  const { language } = useLanguage()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [activeLang, setActiveLang] = useState('CN')
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)
  const [activeMotionIndex, setActiveMotionIndex] = useState(0)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [activeAudio, setActiveAudio] = useState<string | null>(null)
  const audioRef1 = useRef<HTMLAudioElement>(null)
  const audioRef2 = useRef<HTMLAudioElement>(null)
  const ttsAudioRef = useRef<HTMLAudioElement>(null)
  const baseModelAudioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const logsContainerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMainVideoMuted, setIsMainVideoMuted] = useState(false) // Default to unmuted
  const [videoError, setVideoError] = useState(false)

  const togglePlay = () => {
      if (videoRef.current) {
          if (videoRef.current.paused) {
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    console.error("Play failed:", e);
                    // If autoplay blocked, try muting
                    if (!isMainVideoMuted) {
                        setIsMainVideoMuted(true);
                        // Retry play after mute
                        setTimeout(() => {
                            videoRef.current?.play()
                                .then(() => setIsPlaying(true))
                                .catch(console.error);
                        }, 50);
                    }
                });
          } else {
              videoRef.current.pause();
              setIsPlaying(false);
          }
      }
  }

  const toggleAudio = (id: string) => {
    if (activeAudio === id) {
      if (id === 'track1') audioRef1.current?.pause()
      if (id === 'track2') audioRef2.current?.pause()
      setActiveAudio(null)
    } else {
      if (activeAudio === 'track1') audioRef1.current?.pause()
      if (activeAudio === 'track2') audioRef2.current?.pause()
      
      if (id === 'track1') audioRef1.current?.play()
      if (id === 'track2') audioRef2.current?.play()
      setActiveAudio(id)
    }
  }

  // Reset sample index when language changes
  useEffect(() => {
    setActiveSampleIndex(0)
    setActiveDemo(null)
    if (ttsAudioRef.current) {
        ttsAudioRef.current.pause()
        ttsAudioRef.current.currentTime = 0
    }
    if (baseModelAudioRef.current) {
        baseModelAudioRef.current.pause()
        baseModelAudioRef.current.currentTime = 0
    }
    // Also reset/pause video if needed, though activeDemo change handles UI
  }, [activeLang])

  // Sync video with TTS audio
  useEffect(() => {
      if (activeDemo === 'tts' && videoRef.current) {
          videoRef.current.currentTime = 0
          videoRef.current.play()
      } else if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0 // Optional: reset to start
      }
  }, [activeDemo])

  const handleTTSToggle = () => {
    if (activeDemo === 'tts') {
      setActiveDemo(null)
      ttsAudioRef.current?.pause()
    } else {
      // Stop other audio if playing
      if (activeDemo === 'base_model' && baseModelAudioRef.current) {
          baseModelAudioRef.current.pause()
          baseModelAudioRef.current.currentTime = 0
      }
      
      setActiveDemo('tts')
      // Slight delay to allow state update or just play directly
      setTimeout(() => {
        if (ttsAudioRef.current) {
          ttsAudioRef.current.currentTime = 0
          ttsAudioRef.current.play()
        }
      }, 0)
    }
  }

  const handleBaseModelToggle = () => {
      if (activeDemo === 'base_model') {
          setActiveDemo(null)
          baseModelAudioRef.current?.pause()
      } else {
          // Stop TTS if playing
          if (activeDemo === 'tts' && ttsAudioRef.current) {
              ttsAudioRef.current.pause()
              ttsAudioRef.current.currentTime = 0
          }

          setActiveDemo('base_model')
          setTimeout(() => {
              if (baseModelAudioRef.current) {
                  baseModelAudioRef.current.currentTime = 0
                  baseModelAudioRef.current.play()
              }
          }, 0)
      }
  }

  // Log simulation
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      const now = new Date()
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      
      setLogs(prev => {
        const newLogs = [...prev, { id: Date.now(), text: SAMPLE_LOGS[index % SAMPLE_LOGS.length], timestamp: timeString }]
        if (newLogs.length > 3) newLogs.shift()
        return newLogs
      })
      index++
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="tech" className="py-24 md:py-32 bg-[#050505] text-white overflow-hidden relative">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
                <span className="font-mono text-xs tracking-[0.3em] text-emerald-500 uppercase mb-4 block flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    {language === 'zh' ? "03 — 研发实验室" : "03 — R&D LABS"}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                    {language === 'zh' ? "原型档案库" : "Prototype Registry"} <span className="text-white/30">{language === 'zh' ? "" : ""}</span>
                </h2>
            </div>
            <div className="font-mono text-xs text-right hidden md:block text-white/40">
                <div>SYS.VER.0.9.2</div>
                <div>BUILD: 2026.01.11</div>
            </div>
        </div>

        {/* 4.1 Core Terminal */}
        <div className="mb-12 relative group rounded-lg overflow-hidden border border-white/10 bg-black">
          {/* Top Bar */}
          <div className="h-8 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
             <div className="flex gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
             </div>
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                     <span className="font-serif text-xs text-white/40">{language === 'zh' ? "效果验证视频" : "Effect Verification Video"}</span>
                     <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">| Proof of Concept</span>
                 </div>
                 <a 
                    href="https://www.bilibili.com/video/BV1QmBhBNExA"  
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] hover:bg-pink-500/20 transition-colors"
                 >
                     <span>Bilibili</span>
                     <Maximize2 className="w-3 h-3" />
                 </a>
                 <span className="text-[10px] text-white/20 hidden sm:inline-block">Published on Bilibili</span>
             </div>
          </div>

          {/* Video Container */}
          <div className="aspect-video relative bg-black/50 overflow-hidden group/video">
             {/* Placeholder for Video */}
             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
                {/* Use video if available, else show placeholder icon */}
                {!videoError ? (
                    <video 
                        ref={videoRef}
                        src="/videos/project_ninteimoto_core_loop_alpha.mp4" 
                        loop 
                        controls
                        muted={isMainVideoMuted}
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover" 
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => {
                            console.error("Video Error:", e);
                            setVideoError(true);
                        }}
                    />
                ) : (
                    <div className="text-center relative z-10">
                        <Film className="w-12 h-12 text-red-500/40 mx-auto mb-4" />
                        <p className="font-mono text-sm text-red-400 uppercase tracking-widest">Video Unavailable</p>
                        <p className="font-serif italic text-white/20 mt-2">Check format (H.264) or connection</p>
                    </div>
                )}
                 {/* <div className="text-center relative z-10">
                    <Film className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="font-mono text-sm text-white/40 uppercase tracking-widest">Video Feed Offline</p>
                    <p className="font-serif italic text-white/20 mt-2">"Project Ninteimoto - Core Loop Alpha"</p>
                 </div> */}
             </div>

             {/* Play Button Overlay - Removed in favor of native controls */}
             {/* {!isPlaying && !videoError && ( ... )} */}

             {/* Overlays */}
             <div className="absolute top-6 left-6 z-20 pointer-events-none">
                 <StatusLight status={isPlaying ? "live" : "idle"} />
             </div>

             {/* Title Overlay - Removed as moved to top bar */}
             {/* <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                 <h3 className="font-serif text-lg text-white/90 drop-shadow-md">效果验证视频</h3>
                 <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Proof of Concept Demo</p>
             </div> */}

             {/* Audio Toggle */}
             <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMainVideoMuted(!isMainVideoMuted)
                    }}
                    className="p-2 rounded-full bg-black/40 border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
                 >
                     {isMainVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                 </button>
             </div>

             {/* Mock Logs */}
             <div className="absolute bottom-6 left-6 z-20 font-mono text-[10px] text-emerald-500/80 pointer-events-none">
                 {logs.map(log => (
                     <motion.div 
                        key={log.id} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1"
                     >
                         <span className="opacity-50">[{log.timestamp}]</span> {">"} {log.text}
                     </motion.div>
                 ))}
             </div>
             
             {/* Scanlines removed for better viewing experience */}
             {/* <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20" /> */}
             {/* <div className="absolute inset-0 pointer-events-none bg-emerald-500/5 mix-blend-overlay" /> */}
          </div>
          
          {/* Backlight Effect */}
          <div className="absolute -inset-1 bg-emerald-500/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>


        {/* 4.2 Multimodal Lab (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Module A: TTS Synthesizer */}
            <div className="lg:col-span-2 p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Mic className="w-4 h-4 text-emerald-500" />
                            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-500">{language === 'zh' ? "TTS 语音合成" : "TTS Synthesizer"}</h3>
                        </div>
                        <h4 className="font-serif text-2xl mb-1">{language === 'zh' ? "情感化语音合成" : "Emotive Voice Synthesis"}</h4>
                        <p className="text-sm text-white/50">{language === 'zh' ? "STATE OF THE ART 的多语言合成水平" : "State-of-the-art Multilingual Synthesis"}</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg">
                        {['EN', 'JP', 'CN'].map(lang => (
                            <button 
                                key={lang} 
                                onClick={() => setActiveLang(lang)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-mono rounded-md transition-all min-w-[3rem]",
                                    activeLang === lang 
                                        ? "bg-emerald-500 text-black font-bold shadow-sm" 
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="font-serif text-xl md:text-2xl text-white/80 leading-relaxed min-h-[4rem] flex items-center">
                        "{VOICE_SAMPLES[activeLang][activeSampleIndex].text}"
                    </div>

                    <div className="flex gap-2 mb-4">
                        {VOICE_SAMPLES[activeLang].map((sample, index) => (
                            <button
                                key={sample.id}
                                onClick={() => {
                                    setActiveSampleIndex(index)
                                    setActiveDemo(null)
                                }}
                                className={cn(
                                    "px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all",
                                    activeSampleIndex === index
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
                                )}
                            >
                                {sample.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="h-12 bg-black/40 rounded border border-white/5 overflow-hidden flex items-center px-4 relative">
                         {/* Waveform Visualization */}
                        <div className="absolute inset-0 z-0 opacity-50">
                             <WaveformVisualizer isPlaying={activeDemo === 'tts'} color={activeDemo === 'tts' ? '#10b981' : '#525252'} />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <audio 
                            ref={ttsAudioRef} 
                            src={VOICE_SAMPLES[activeLang][activeSampleIndex].src}
                            onEnded={() => setActiveDemo(null)}
                        />
                        <audio 
                            ref={baseModelAudioRef}
                            src="/audio/voices/base_model.wav"
                            onEnded={() => setActiveDemo(null)}
                        />
                        <button 
                            onClick={handleTTSToggle}
                            className={cn(
                                "flex-1 py-3 px-4 rounded border font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                activeDemo === 'tts' 
                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                        >
                            {activeDemo === 'tts' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            {activeDemo === 'tts' ? `Playing ${VOICE_SAMPLES[activeLang][activeSampleIndex].label}` : `Test ${VOICE_SAMPLES[activeLang][activeSampleIndex].label}`}
                        </button>
                         <button 
                            onClick={handleBaseModelToggle}
                            className={cn(
                                "px-4 py-3 rounded border font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2",
                                activeDemo === 'base_model'
                                    ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5"
                                    : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {activeDemo === 'base_model' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            Base Model
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Generation Preview (Moved here) */}
            <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-black min-h-[300px]">
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                     {/* Background Video Placeholder */}
                     <div className="absolute inset-0 opacity-40">
                        {/* Dynamic video source based on selection */}
                        <video 
                            ref={videoRef}
                            src={`/videos/voices/${VOICE_SAMPLES[activeLang][activeSampleIndex].src.split('/').pop()?.replace('.wav', '.mp4')}`}
                            loop 
                            muted 
                            playsInline
                            className="w-full h-full object-cover"
                        />
                     </div>
                     
                     <div className={cn("relative z-10 text-center p-6 transition-opacity duration-300", activeDemo === 'tts' ? "opacity-0" : "opacity-100")}>
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                             {activeDemo === 'tts' ? (
                                 <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
                             ) : (
                                 <Cpu className="w-8 h-8 text-white/20" />
                             )}
                         </div>
                         <h3 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-2">{language === 'zh' ? "口型生成" : "Lip-Sync Generated"}</h3>
                         <div className="font-serif text-lg text-white/90 mb-1">
                             {activeLang} — {VOICE_SAMPLES[activeLang][activeSampleIndex].label}
                         </div>
                         <p className="text-xs text-white/40">{language === 'zh' ? "实时音素映射" : "Real-time Viseme Mapping"}</p>
                     </div>
                 </div>

                 {/* Status Overlay */}
                 <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                     <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", activeDemo === 'tts' ? "bg-red-500 animate-pulse" : "bg-white/20")} />
                        <span className="font-mono text-[9px] text-white/40 uppercase">REC</span>
                     </div>
                     <Maximize2 className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" />
                 </div>
                 
                 {/* Wireframe/Noise Overlay */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </div>

            {/* Module C: Generative City Pop */}
             <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col group hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                    <Disc className="w-4 h-4 text-pink-500" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-pink-500">{language === 'zh' ? "音频精修" : "Audio Refinement"}</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                     {/* Hidden Audio Elements - Placeholders */}
                     <audio ref={audioRef1} src="/audio/bgm/voice_clone_suno_v5_demo.wav" loop />
                     <audio ref={audioRef2} src="/audio/bgm/voice_clone_suno_v5_demo (Remastered).wav" loop />

                     {/* Track 1 Control - Original v5 */}
                     <div 
                        className="flex items-center justify-between group/audio1 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors" 
                        onClick={() => toggleAudio('track1')}
                     >
                         <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0", activeAudio === 'track1' ? "bg-white/20 text-white" : "bg-white/5 text-white/40")}>
                             {activeAudio === 'track1' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                         </div>
                         <div className="flex-1 mx-4 flex flex-col justify-center min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-white/60 font-mono">{language === 'zh' ? "v5.0 基准模型" : "v5.0 BASELINE"}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-white/40 uppercase">{language === 'zh' ? "旧版" : "Legacy"}</span>
                              </div>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
                                  <div className={cn("h-full bg-white/40 transition-all duration-500", activeAudio === 'track1' ? "w-full animate-pulse" : "w-0")} />
                              </div>
                         </div>
                     </div>

                     {/* Track 2 Control - Remastered */}
                     <div 
                        className="relative flex items-center justify-between group/audio2 cursor-pointer p-3 rounded-lg border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 transition-colors mt-2" 
                        onClick={() => toggleAudio('track2')}
                     >
                         <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                             {language === 'zh' ? "新架构" : "New Architecture"}
                         </div>
                         <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0", activeAudio === 'track2' ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20" : "bg-pink-500/10 text-pink-500")}>
                             {activeAudio === 'track2' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                         </div>
                         <div className="flex-1 mx-4 flex flex-col justify-center min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-xs font-mono font-bold", activeAudio === 'track2' ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" : "text-pink-400")}>{language === 'zh' ? "v5.2 重制版" : "v5.2 REMASTERED"}</span>
                                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
                              </div>
                              <div className="h-1 bg-black/40 rounded-full overflow-hidden w-full">
                                  <div className={cn("h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500", activeAudio === 'track2' ? "w-full" : "w-0")} />
                              </div>
                         </div>
                     </div>

                     <div className="space-y-3 opacity-80 pt-2">
                         {['Vocal Consistency', 'Clarity', 'Range'].map((label, i) => (
                             <div key={label} className="flex items-center justify-between text-xs font-mono group">
                                 <span className="text-white/40 uppercase group-hover:text-white/60 transition-colors">
                                    {language === 'zh' ? (
                                        i === 0 ? "人声一致性" : i === 1 ? "清晰度" : "音域"
                                    ) : label}
                                 </span>
                                 <div className="flex items-center gap-3">
                                     {/* Comparison Bar */}
                                     <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                         {/* Baseline Marker */}
                                         <div className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10" style={{ left: i === 0 ? '65%' : i === 1 ? '70%' : '60%' }} />
                                         
                                         {/* Active Value */}
                                         <motion.div 
                                            className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", activeAudio === 'track2' ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-white/40")}
                                            initial={{ width: '0%' }}
                                            animate={{ 
                                                width: activeAudio === 'track2' ? `${92 + i * 2}%` : activeAudio === 'track1' ? `${65 + i * 5}%` : `${60 + i * 5}%` 
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                         />
                                     </div>
                                     <span className={cn("tabular-nums w-8 text-right font-bold", activeAudio === 'track2' ? "text-pink-400" : "text-white/40")}>
                                        {i === 0 ? (activeAudio === 'track2' ? "+42%" : "0%") : i === 1 ? (activeAudio === 'track2' ? "+28%" : "0%") : (activeAudio === 'track2' ? "+35%" : "0%")}
                                     </span>
                                 </div>
                             </div>
                         ))}
                     </div>
                     <p className="text-xs text-white/40 mt-2 leading-relaxed border-t border-white/5 pt-4">
                        {language === 'zh' ? (
                            <>"通过新的重采样架构，v5.2 Remastered 版本在保持原曲律动的同时，将<span className="text-pink-400 font-bold">人声一致性 (Vocal Consistency)</span> 提升至商业级交付标准。"</>
                        ) : (
                            <>"With the new resampling architecture, v5.2 Remastered elevates <span className="text-pink-400 font-bold">Vocal Consistency</span> to commercial delivery standards while maintaining the original groove."</>
                        )}
                     </p>
                </div>
            </div>

            {/* Semantic Motion Preview (Remaining Card) */}
            <div className="lg:col-span-2 group relative rounded-xl overflow-hidden border border-white/10 bg-black min-h-[400px]">
                    {/* Video Background */}
                    <div className="absolute inset-0 bg-gray-900">
                        {/* Placeholder video source - replace with actual generated video */}
                        <AnimatePresence mode="wait">
                            <motion.video 
                                key={MOTION_SAMPLES[activeMotionIndex].id}
                                src={MOTION_SAMPLES[activeMotionIndex].src} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                                className="w-full h-full object-cover group-hover:opacity-100 transition-opacity duration-500"
                            />
                        </AnimatePresence>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-gradient-to-t from-black via-transparent to-transparent">
                        <div className="flex justify-between items-start">
                             <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest">{language === 'zh' ? "生成式动作" : "Generative Action"}</span>
                             </div>

                             {/* Motion Selector Tabs */}
                             <div className="flex gap-1 bg-black/40 p-1 rounded-lg backdrop-blur-sm border border-white/10">
                                 {MOTION_SAMPLES.map((sample, index) => (
                                     <button
                                         key={sample.id}
                                         onClick={() => setActiveMotionIndex(index)}
                                         className={cn(
                                             "px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all",
                                             activeMotionIndex === index 
                                                 ? "bg-white/20 text-white shadow-sm" 
                                                 : "text-white/40 hover:text-white hover:bg-white/10"
                                         )}
                                     >
                                         {sample.label}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        <div className="space-y-4">
                             <div className="space-y-2">
                                 <div className="flex items-center gap-2 font-mono text-[10px] text-white/40 uppercase tracking-wider">
                                     <span>Input_Prompt</span>
                                     <span className="w-full h-px bg-white/10" />
                                 </div>
                                 <motion.p 
                                    key={MOTION_SAMPLES[activeMotionIndex].prompt}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-serif text-xl md:text-2xl text-white/90 leading-snug drop-shadow-lg"
                                 >
                                     "{MOTION_SAMPLES[activeMotionIndex].prompt}"
                                 </motion.p>
                             </div>
                             
                             <div className="grid grid-cols-3 gap-2">
                                 {MOTION_SAMPLES[activeMotionIndex].tags.map((tag) => (
                                     <motion.div 
                                        key={tag} 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-center text-white/60 uppercase backdrop-blur-sm"
                                     >
                                         {tag}
                                     </motion.div>
                                 ))}
                             </div>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </div>
        </div>

      </div>
    </section>
  )
}
