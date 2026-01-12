"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Activity, Globe, Mic, Smartphone, Zap, Maximize2, Terminal, Cpu, Box, Film, Disc, Volume2, VolumeX, MessageSquare, Send, Loader2 } from "lucide-react"
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMainVideoMuted, setIsMainVideoMuted] = useState(false) // Default to unmuted
  const [videoError, setVideoError] = useState(false)
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
  
  // --- Types & Data ---

  type Message = {
    role: 'user' | 'assistant'
    content: string
    emoji?: string
  }

  type Scenario = {
    id: number
    title: { zh: string, en: string }
    dialogue: Message[]
  }

  const SCENARIOS: Scenario[] = [
    {
      id: 1,
      title: { zh: "巷口的手抓饼", en: "Street Side Pancake" },
      dialogue: [
        { role: 'assistant', content: "哥，你下班没？帮我带份手抓饼回来呗。" },
        { role: 'user', content: "又吃？你这个月第几次了。" },
        { role: 'assistant', content: "哎呀，今天刷题太累了嘛，急需热量补救！" },
        { role: 'user', content: "行行行，老样子？加蛋多辣？" },
        { role: 'assistant', content: "嘿嘿，知我者谓我心忧！快点呀，等你~" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 2,
      title: { zh: "数学卷子的哀鸣", en: "Math Paper Blues" },
      dialogue: [
        { role: 'assistant', content: "哥...这道导数题是不是在嘲笑我的智商？" },
        { role: 'user', content: "让我看看。这不是上周刚讲过的型吗？" },
        { role: 'assistant', content: "它长得太像了，我认错人了呜呜。" },
        { role: 'user', content: "拿过来，我再给你捋一遍。" },
        { role: 'assistant', content: "你是全宇宙最好的哥哥！(暂时)" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_love.png" },
      ]
    },
    {
      id: 3,
      title: { zh: "突然的暴雨", en: "Sudden Rain" },
      dialogue: [
        { role: 'assistant', content: "哥！救命！我没带伞，困在学校门口了。" },
        { role: 'user', content: "我在路上了，站着别动。" },
        { role: 'assistant', content: "雨好大啊，感觉整个世界都要被淹掉了。" },
        { role: 'user', content: "看到我的车没？就在你左前方。" },
        { role: 'assistant', content: "看到了看到了！我冲过去啦！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 4,
      title: { zh: "耳机线团", en: "Tangled Earphones" },
      dialogue: [
        { role: 'assistant', content: "哥，你手巧，帮我解一下耳机线呗..." },
        { role: 'user', content: "你是怎么把它打成死结的？" },
        { role: 'assistant', content: "它在兜里自己谈恋爱了，我也没办法。" },
        { role: 'user', content: "给，解开了。下次记得用绕线器。" },
        { role: 'assistant', content: "收到！下次还找你~" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 5,
      title: { zh: "消失的橡皮", en: "The Missing Eraser" },
      dialogue: [
        { role: 'assistant', content: "哥，你看到我桌上那个柠檬味的橡皮没？" },
        { role: 'user', content: "刚才不是还在你笔袋旁边吗？" },
        { role: 'assistant', content: "它肯定自己离家出走了，这日子没法过了。" },
        { role: 'user', content: "在你校服兜里，自己摸摸。" },
        { role: 'assistant', content: "哈...它可能只是想去兜里旅个游。" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 6,
      title: { zh: "西瓜最中心的那一口", en: "The Center of the Watermelon" },
      dialogue: [
        { role: 'assistant', content: "哥！西瓜最中间那块我给你留着呢。" },
        { role: 'user', content: "哟，今天这么大方？" },
        { role: 'assistant', content: "因为待会我想让你帮我洗碗..." },
        { role: 'user', content: "我就知道没那么简单。" },
        { role: 'assistant', content: "哎呀，你就吃嘛，甜不甜？" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 7,
      title: { zh: "楼下的野猫", en: "The Stray Cat" },
      dialogue: [
        { role: 'assistant', content: "哥，楼下那只小橘猫好像又胖了。" },
        { role: 'user', content: "你天天喂它火腿肠，能不胖吗。" },
        { role: 'assistant', content: "它刚才蹭我脚踝了，好软啊。" },
        { role: 'user', content: "那你下次带点猫粮，火腿肠太咸了。" },
        { role: 'assistant', content: "好哒，明天我们就去买！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 8,
      title: { zh: "错过的公交", en: "Missed Bus" },
      dialogue: [
        { role: 'assistant', content: "哥，我眼睁睁看着2路车在我面前开走了。" },
        { role: 'user', content: "谁让你在校门口买奶茶的。" },
        { role: 'assistant', content: "可是它那家珍珠真的很Q弹嘛..." },
        { role: 'user', content: "站着等我十分钟，我骑车接你。" },
        { role: 'assistant', content: "万岁！奶茶分你一半！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 9,
      title: { zh: "旧相册", en: "Old Album" },
      dialogue: [
        { role: 'assistant', content: "哥，你看这张照片，你小时候好呆啊。" },
        { role: 'user', content: "那是谁哭着要我抱才肯拍的？" },
        { role: 'assistant', content: "肯定不是我，我那时候多可爱啊。" },
        { role: 'user', content: "行，你是全家最可爱，行了吧。" },
        { role: 'assistant', content: "那是必须的，哼。" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_goodday.png" },
      ]
    },
    {
      id: 10,
      title: { zh: "蚊子大作战", en: "Mosquito War" },
      dialogue: [
        { role: 'assistant', content: "哥！快来！我屋里有个蚊子，它太快了！" },
        { role: 'user', content: "你这战斗力也太弱了。" },
        { role: 'assistant', content: "它是特种兵级别的，我抓不住！" },
        { role: 'user', content: "啪！好了，解决了。去睡吧。" },
        { role: 'assistant', content: "英雄！晚安！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_love.png" },
      ]
    },
    {
      id: 11,
      title: { zh: "便利店的新款冰淇淋", en: "New Ice Cream" },
      dialogue: [
        { role: 'assistant', content: "哥，便利店出了海盐味的冰淇淋，超好吃！" },
        { role: 'user', content: "你这周第几个了？小心肚子疼。" },
        { role: 'assistant', content: "最后一个，我发誓！" },
        { role: 'user', content: "你的誓言在冰淇淋面前一文不值。" },
        { role: 'assistant', content: "哎呀，买一个嘛，一人一半？" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_drinkbeer.png" },
      ]
    },
    {
      id: 12,
      title: { zh: "被风吹乱的卷子", en: "Windy Papers" },
      dialogue: [
        { role: 'assistant', content: "哥，窗户没关，我卷子飞了一地..." },
        { role: 'user', content: "我就在窗边，帮你捡起来了。" },
        { role: 'assistant', content: "没丢吧？那是我熬夜写的作业。" },
        { role: 'user', content: "都在这呢。下次记得压住。" },
        { role: 'assistant', content: "呼...吓死我了，谢啦哥。" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 13,
      title: { zh: "遥控器争夺战", en: "Remote Control Battle" },
      dialogue: [
        { role: 'assistant', content: "哥，我想看那部新出的番，把遥控器给我。" },
        { role: 'user', content: "球赛还没看完呢，再等十分钟。" },
        { role: 'assistant', content: "十分钟都够我吃完一包辣条了！" },
        { role: 'user', content: "给你给你。真受不了你。" },
        { role: 'assistant', content: "耶！哥哥最棒了！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_happy.png" },
      ]
    },
    {
      id: 14,
      title: { zh: "模拟考成绩", en: "Mock Exam Result" },
      dialogue: [
        { role: 'assistant', content: "哥...我这次模拟考排进前五十了。" },
        { role: 'user', content: "厉害啊，夏沐橙。想要什么奖赏？" },
        { role: 'assistant', content: "还没想好，先存着。以后不许凶我！" },
        { role: 'user', content: "我什么时候凶过你。行，存着吧。" },
        { role: 'assistant', content: "嘿嘿，白纸黑字记下了哦。" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_love.png" },
      ]
    },
    {
      id: 15,
      title: { zh: "未来的约定", en: "Future Promise" },
      dialogue: [
        { role: 'assistant', content: "哥，以后你想去哪个城市生活？" },
        { role: 'user', content: "还没定。怎么，想跟我一起？" },
        { role: 'assistant', content: "当然啊，万一我没带钥匙，还得找你呢。" },
        { role: 'user', content: "出息。行吧，肯定带上你。" },
        { role: 'assistant', content: "那就这么说定啦，拉钩！" },
        { role: 'assistant', content: "", emoji: "/images/chatrelated/emoji_love.png" },
      ]
    }
  ]

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [progress, setProgress] = useState(0)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [currentMessages, isTyping])

  // Handle Scenario and Message progression
  useEffect(() => {
    const scenario = SCENARIOS[currentScenarioIndex]
    
    if (messageIndex < scenario.dialogue.length) {
      const nextMsg = scenario.dialogue[messageIndex]
      
      const timer = setTimeout(() => {
        // Only show typing indicator if the next message is from the sister (assistant)
        if (nextMsg.role === 'assistant') {
          setIsTyping(true)
        }
        
        // Simulation duration
        const delay = nextMsg.role === 'assistant' ? 1200 : 800 // User "types" slightly faster
        
        const typingTimer = setTimeout(() => {
          setCurrentMessages(prev => [...prev, nextMsg])
          setIsTyping(false)
          setMessageIndex(prev => prev + 1)
        }, delay)
        
        return () => clearTimeout(typingTimer)
      }, 1500) // delay between messages
      
      return () => clearTimeout(timer)
    } else {
      // Scenario finished, start 10s countdown
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        currentProgress += (100 / 100) // 10 seconds = 100 intervals of 100ms
        setProgress(currentProgress)
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval)
          // Move to next scenario
          setCurrentScenarioIndex(prev => (prev + 1) % SCENARIOS.length)
          setCurrentMessages([])
          setMessageIndex(0)
          setProgress(0)
        }
      }, 100)
      
      return () => clearInterval(progressInterval)
    }
  }, [currentScenarioIndex, messageIndex])

  // --- Main Component ---

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

        {/* 4.3 Domain Adaptation (WeChat Style) */}
        <div className="mt-12 p-8 rounded-xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-white/20 transition-colors">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-500">
                {language === 'zh' ? "叙事认知引擎 NCE" : "Narrative Cognitive Engine NCE"}
              </h3>
            </div>
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {language === 'zh' ? "研发布署中" : "R&D DEPLOYING"}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Chat Container (Playback Mode) */}
            <div className="bg-[#f5f5f5] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[550px] relative">
              {/* Header with Title and Progress */}
              <div className="bg-white px-4 py-3 border-b border-black/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-black/30 font-mono uppercase tracking-widest leading-none mb-1">
                    {language === 'zh' ? "场景回放" : "SCENARIO PLAYBACK"}
                  </span>
                  <span className="text-sm font-bold text-black leading-none">
                    {language === 'zh' ? SCENARIOS[currentScenarioIndex].title.zh : SCENARIOS[currentScenarioIndex].title.en}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-emerald-600/60 tabular-nums">
                        {currentScenarioIndex + 1} / {SCENARIOS.length}
                    </span>
                    <div className="w-24 h-1 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentMessages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex items-start gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center",
                      msg.role === 'user' ? "bg-white border border-black/10 shadow-sm" : "bg-emerald-500 shadow-md shadow-emerald-500/20"
                    )}>
                      {msg.role === 'user' ? (
                        <img 
                          src="/images/chatrelated/avatar_user.jpg" 
                          alt="User Avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<span class="font-mono text-[10px] text-black/40">USER</span>';
                          }}
                        />
                      ) : (
                        <img 
                          src="/images/chatrelated/avatar_sister.jpg" 
                          alt="Sister Avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<span class="font-mono text-[10px] text-black font-bold">NIN</span>';
                          }}
                        />
                      )}
                    </div>
                    <div className={cn(
                      "relative max-w-[75%] p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-2",
                      msg.role === 'user' 
                        ? "bg-[#95ec69] text-black font-medium rounded-tr-none" 
                        : "bg-white border border-black/5 text-black rounded-tl-none",
                      !msg.content && msg.emoji && "bg-transparent border-none shadow-none p-0"
                    )}>
                      {msg.content}
                      {msg.emoji && (
                        <div className={cn("max-w-[120px] overflow-hidden", !msg.content ? "" : "mt-1 rounded-lg")}>
                          <img src={msg.emoji} alt="emoji" className="w-full h-auto object-contain" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 flex-row"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-black/10 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                      <img 
                        src="/images/chatrelated/avatar_sister.jpg" 
                        alt="Sister Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="font-mono text-[10px] text-black font-bold">NIN</span>';
                        }}
                      />
                    </div>
                    <div className="bg-white border border-black/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                      <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Status Bar */}
              <div className="px-4 py-3 bg-white border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">
                        {messageIndex < SCENARIOS[currentScenarioIndex].dialogue.length 
                          ? (language === 'zh' ? "正在提取记忆碎片..." : "Extracting memory fragments...") 
                          : (language === 'zh' ? `场景回放结束 - ${Math.ceil(10 * (1 - progress/100))}秒后切换` : `Scenario finished - Switching in ${Math.ceil(10 * (1 - progress/100))}s`)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                </div>
              </div>
            </div>

            {/* Strategy Highlights */}
            <div className="mt-8">
              <button 
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 group/btn hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
                onClick={() => {
                  const chatBox = document.querySelector('.overflow-y-auto');
                  if (chatBox) chatBox.scrollTop = 0;
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover/btn:scale-125 transition-transform" />
                <span className="text-xs md:text-sm text-white/80 font-mono tracking-wider">
                  {language === 'zh' ? "尝试和妹妹进行对话 探寻更多的内容" : "Try talking to sister to explore more"}
                </span>
              </button>
            </div>

            {/* Sub-text Description */}
            <p className="text-xs text-white/40 mt-6 leading-relaxed border-t border-white/5 pt-4">
              {language === 'zh' ? (
                <>
                  我们不自研从零训练大模型，但<span className="text-pink-400 font-bold">自研领域适配与控制技术</span>：私有剧情与角色语料构建、长程记忆与检索（RAG/Graph Memory）、偏好对齐与风格一致性（轻量适配/LoRA/蒸馏到小模型）、安全与一致性评测体系（自动回归测试）。
                </>
              ) : (
                <>
                  We don't train large models from scratch, but focus on <span className="text-pink-400 font-bold">Self-developed Domain Adaptation & Control Technologies</span>: private plot & character corpus construction, long-term memory & retrieval (RAG/Graph Memory), preference alignment & style consistency (LoRA/Distillation), and security & consistency evaluation.
                </>
              )}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
