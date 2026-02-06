"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Play, Pause, Activity, Mic, Cpu, Volume2, VolumeX, 
  Languages, MessageSquare, ShieldCheck,
  ChevronRight, BarChart3, Database, FileText,
  Layers, CheckCircle2, ExternalLink, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ArchitectureDiagram } from "./architecture-diagram"

// --- Types & Data ---

type AudioSample = {
  id: string
  label: string
  text: string
  src: string
}

type LanguageData = {
  [key: string]: AudioSample[]
}

const VOICE_SAMPLES: LanguageData = {
  EN: [
    { id: 'en-1', label: 'Accusation', text: 'Get out of my face! I have given you everything I had, and you threw it away like it meant absolutely nothing!', src: '/audio/voices/en_01_accusation.wav' },
    { id: 'en-2', label: 'Epic', text: 'This is not the end, my friends. We will rise from the ashes of this defeat and show the world who we truly are.', src: '/audio/voices/en_02_epic.wav' },
    { id: 'en-3', label: 'Pleading', text: 'Please, I’m begging you... dont walk out that door. If you leave now, I dont think I can ever survive this alone.', src: '/audio/voices/en_03_pleading.wav' },
  ],
  CN: [
    { id: 'cn-1', label: 'Furious', text: '我说了多少次！不要用那种无辜的眼神看着我！这一切的灾难，全都是因为你的自私造成的！', src: '/audio/voices/zh_01_furious.wav' },
    { id: 'cn-2', label: 'Despair', text: '算了吧……不管再怎么努力，结局都不会改变的。我的心已经死了，你就让我一个人烂在泥里吧。', src: '/audio/voices/zh_02_despair.wav' },
    { id: 'cn-3', label: 'Fear', text: '别过来……求求你别过来！我听见他在门外的呼吸声了，他手里拿着刀，他真的会杀了我们的！', src: '/audio/voices/zh_03_fear.wav' },
  ],
  JP: [
    { id: 'jp-1', label: 'Passionate', text: 'ふざけるな！俺は仲間を絶対に裏切ったりしない！たとえこの命が尽きようとも、お前を倒す！', src: '/audio/voices/ja_01_passionate.wav' },
    { id: 'jp-2', label: 'Grief', text: '嘘だと言ってよ……。あんなに約束したじゃない！ずっと一緒にいるって、指切りしたじゃないか！', src: '/audio/voices/ja_02_grief.wav' },
    { id: 'jp-3', label: 'Yandere', text: 'ねえ、どこへ行くの？逃げられると思ってる？あなたのその目也、心也、全部我的东西……。', src: '/audio/voices/ja_03_yandere.wav' },
  ],
}

// --- Helper Components ---

function WaveformVisualizer({ isPlaying, color = "#3b82f6" }: { isPlaying: boolean; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const bars = 60
    const barWidth = canvas.width / bars

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < bars; i++) {
        const height = isPlaying 
          ? Math.random() * canvas.height * 0.8 
          : Math.sin(Date.now() * 0.005 + i * 0.3) * 3 + 5
        
        const x = i * barWidth
        const y = (canvas.height - height) / 2
        
        ctx.fillStyle = color
        ctx.globalAlpha = isPlaying ? 0.8 : 0.3
        ctx.fillRect(x, y, barWidth - 1, height)
      }
      
      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [isPlaying, color])

  return <canvas ref={canvasRef} width={600} height={60} className="w-full h-full" />
}

export function AcademicShowcase() {
  const [activeLang, setActiveLang] = useState('EN')
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  
  // Real-time generation state
  const [rtEmotions, setRtEmotions] = useState({
    Happy: 0.5,
    Angry: 0.0,
    Sad: 0.0,
    Afraid: 0.0,
    Disgusted: 0.0,
    Melancholic: 0.0,
    Surprised: 0.0,
    Calm: 0.5
  })
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentSample = VOICE_SAMPLES[activeLang][activeSampleIndex]

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        // If at the end, reset to start
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        audioRef.current.playbackRate = 1.0;
        audioRef.current.preservesPitch = true;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.error("Audio play failed:", error));
        }
      }
      if (videoRef.current) {
        if (videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play();
      }
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [activeLang, activeSampleIndex])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-inter pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Project Page Header */}
      <header className="py-20 px-4 md:px-12 max-w-[1800px] mx-auto text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
          Multimodal Emotive Synthesis & Lip-Sync: <br />
          <span className="text-slate-500 font-bold text-2xl md:text-5xl mt-4 block">Zero-Shot Cross-Lingual Viseme Mapping</span>
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-2 text-2xl">
          <div className="group flex flex-col items-center">
            <span className="font-bold text-slate-800 border-b-2 border-transparent group-hover:border-blue-500 transition-all cursor-default">Hongyu Wan</span>
            <span className="text-sm text-slate-400 font-medium mt-1">hongyuwan@uvic.ca</span>
          </div>
          <div className="group flex flex-col items-center">
            <span className="font-bold text-slate-800 border-b-2 border-transparent group-hover:border-blue-500 transition-all cursor-default">Ji Yu</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 md:px-12 space-y-32">
        
        {/* Abstract */}
        <section className="space-y-8">
          <h2 className="text-4xl font-black border-b-4 border-slate-900 inline-block pb-1">Abstract</h2>
          <p className="text-2xl leading-relaxed text-slate-600 text-justify font-medium">
            We present a high-fidelity multimodal framework for emotive speech synthesis and synchronized 3D facial viseme generation. 
            By utilizing a <strong>UnifiedVoice GPT</strong> backbone with a novel <strong>Token-Level Concatenation</strong> strategy, 
            our system achieves superior emotional consistency and multilingual stability across <strong>Chinese, English, and Japanese</strong>. 
            The architecture fuses text, positional, and explicit language embeddings for every token, enabling zero-shot cross-lingual transfer 
            with fine-grained emotional control. Our demonstration showcases real-time inference capabilities with sub-second latency, 
            providing a practical solution for expressive digital human interactions.
          </p>
        </section>

        {/* Framework */}
        <section className="space-y-12">
          <h2 className="text-4xl font-black border-b-4 border-slate-900 inline-block pb-1">Framework</h2>
          <div className="space-y-16">
            <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-inner">
              <ArchitectureDiagram />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-800">Model Architecture</h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Utilizing a <strong>UnifiedVoice GPT</strong> backbone with a novel <strong>Token-Level Concatenation</strong> strategy. 
                  The architecture fuses text, positional, and explicit language embeddings for every token, ensuring superior emotional 
                  consistency and multilingual stability.
                </p>
              </div>
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-800">Key Innovations</h3>
                <ul className="space-y-6 text-slate-600">
                  <li className="flex items-start gap-4">
                    <span className="text-blue-600 font-black text-2xl">•</span>
                    <span className="text-xl font-medium"><strong>Zero-shot Transfer:</strong> Emotional prosody transfer to unseen languages.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-blue-600 font-black text-2xl">•</span>
                    <div className="space-y-4 flex-1">
                      <span className="text-xl font-medium"><strong>Fine-grained Control:</strong> 8-D latent vector manipulation.</span>
                      <div className="grid grid-cols-2 gap-x-10 gap-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        {[
                          { label: 'Happy', color: 'bg-yellow-400', val: 0.85 },
                          { label: 'Angry', color: 'bg-red-500', val: 0.12 },
                          { label: 'Sad', color: 'bg-blue-400', val: 0.05 },
                          { label: 'Afraid', color: 'bg-purple-500', val: 0.08 },
                          { label: 'Disgusted', color: 'bg-emerald-600', val: 0.02 },
                          { label: 'Melancholic', color: 'bg-indigo-400', val: 0.15 },
                          { label: 'Surprised', color: 'bg-orange-400', val: 0.30 },
                          { label: 'Calm', color: 'bg-slate-400', val: 0.95 },
                        ].map((emo) => (
                          <div key={emo.label} className="space-y-2">
                            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-400">
                              <span>{emo.label}</span>
                              <span>{emo.val.toFixed(2)}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${emo.val * 100}%` }} className={cn("h-full rounded-full", emo.color)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-blue-600 font-black text-2xl">•</span>
                    <span className="text-xl font-medium"><strong>vLLM Acceleration:</strong> 15x concurrency with TTFT &lt; 1.0s.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Dataset & Pipeline */}
        <section className="space-y-12">
          <h2 className="text-4xl font-black border-b-4 border-slate-900 inline-block pb-1">Dataset & Pipeline</h2>
          
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 space-y-10 border-b lg:border-b-0 lg:border-r border-slate-200">
                <h3 className="text-3xl font-black">Emilia-Pipe Workflow</h3>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: "Standardization", desc: "24kHz mono conversion" },
                    { title: "Source Separation", desc: "UVR-MDX vocal isolation" },
                    { title: "Speaker Diarization", desc: "Pyannote tracking" },
                    { title: "WhisperX ASR", desc: "Transcription & alignment" },
                    { title: "Quality Filtering", desc: "DNSMOS scoring > 3.0" },
                    { title: "Feature Extraction", desc: "Wav2Vec2-Bert & MaskGCT" },
                    { title: "Vector Quantization", desc: "GPT conditioning extraction" }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-[2rem] transition-all group">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-blue-600 transition-colors">{i+1}</div>
                      <div className="flex flex-1 justify-between items-center">
                        <span className="text-xl font-bold text-slate-700">{step.title}</span>
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-12 bg-slate-50/50 flex flex-col justify-center space-y-12">
                <div className="space-y-6">
                  <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Computational Resources</h4>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    Rigorous preprocessing on <strong>RTX 6000 Pro (120GB)</strong>.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl">
                    <div className="text-5xl font-black text-blue-600">400+ Hours</div>
                    <div className="text-sm font-black uppercase text-slate-400 mt-2 tracking-widest">Total GPU Compute Time</div>
                  </div>
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl">
                    <div className="text-5xl font-black text-slate-800">100+ Hours</div>
                    <div className="text-sm font-black uppercase text-slate-400 mt-2 tracking-widest">Feature Preprocessing</div>
                  </div>
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl">
                    <div className="text-5xl font-black text-emerald-600">106k</div>
                    <div className="text-sm font-black uppercase text-slate-400 mt-2 tracking-widest">Training Steps (200+ Hours)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                lang: 'Chinese (ZH)', 
                hours: '5,000h', 
                status: 'Cleaned', 
                links: [
                  { label: 'Emilia', url: 'https://huggingface.co/datasets/amphion/Emilia-Dataset' }
                ],
                details: [
                  { label: 'Emilia Baseline', status: 'Cleaned' },
                  { label: 'Emotional Subsets', status: 'Missing', color: 'text-red-500' }
                ]
              },
              { 
                lang: 'English (EN)', 
                hours: '4,000h', 
                status: 'Cleaned', 
                links: [
                  { label: 'Emilia', url: 'https://huggingface.co/datasets/amphion/Emilia-Dataset' }
                ],
                details: [
                  { label: 'Emilia Baseline', status: 'Cleaned' },
                  { label: 'Emotional Subsets', status: 'Missing', color: 'text-red-500' }
                ]
              },
              { 
                lang: 'Japanese (JP)', 
                hours: '4,500h', 
                status: 'Full Stack', 
                links: [
                  { label: 'Emilia', url: 'https://huggingface.co/datasets/amphion/Emilia-Dataset' },
                  { label: 'ESD Dataset', url: 'https://www.kaggle.com/datasets/nguyenthanhlim/emotional-speech-dataset-esd' },
                  { label: 'Japanese-FT-v2', url: 'https://huggingface.co/datasets/Aynursusuz/japanese-ft-dataset-v2' }
                ],
                details: [
                  { label: 'Emilia Baseline', status: 'Cleaned (3000h)' },
                  { label: 'Emotional (ESD/FT)', status: 'Cleaned (1500h)' }
                ]
              },
            ].map((item) => (
              <div key={item.lang} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-blue-100 transition-all space-y-6 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-black text-lg uppercase tracking-tight">{item.lang}</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-widest border border-blue-100">{item.status}</span>
                </div>
                <div className="text-5xl font-black text-slate-900">{item.hours}</div>
                
                <div className="space-y-2 flex-1">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-tighter">{detail.label}</span>
                      <span className={cn("uppercase tracking-tighter", detail.color || "text-emerald-600")}>{detail.status}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-50 flex flex-col gap-2">
                  {item.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" className="text-[10px] font-black text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2 uppercase tracking-widest">
                      <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Demos */}
        <section className="space-y-12">
          <h2 className="text-4xl font-black border-b-4 border-slate-900 inline-block pb-1">System Demos</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Controls */}
            <div className="lg:col-span-3 space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-12">
                <div className="space-y-6">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Languages className="w-5 h-5" /> Language
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['EN', 'CN', 'JP'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={cn(
                          "py-4 text-base font-black rounded-2xl border-2 transition-all",
                          activeLang === lang ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-50"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Emotion Sample
                  </label>
                  <div className="flex flex-col gap-4">
                    {VOICE_SAMPLES[activeLang].map((sample, index) => (
                      <button
                        key={sample.id}
                        onClick={() => setActiveSampleIndex(index)}
                        className={cn(
                          "px-6 py-5 text-left text-base rounded-[1.5rem] border-2 transition-all flex items-center justify-between group",
                          activeSampleIndex === index ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md" : "bg-white border-slate-50 text-slate-500 hover:bg-slate-50 hover:border-slate-200"
                        )}
                      >
                        <span className="font-black uppercase tracking-tight">{sample.label}</span>
                        <ChevronRight className={cn("w-6 h-6 transition-transform", activeSampleIndex === index ? "translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 shadow-inner">
                  <div className="flex items-center gap-4 text-emerald-700 mb-3">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-sm font-black uppercase tracking-widest">Training Progress</span>
                  </div>
                  <p className="text-lg text-emerald-600 font-bold">Steps: 106,000</p>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Lip-Sync Preview */}
              <div className="bg-slate-900 rounded-[3rem] overflow-hidden min-h-[600px] relative group shadow-2xl border-8 border-white flex items-center justify-center">
                <video 
                  ref={videoRef}
                  src={`/videos/voices/${currentSample.src.split('/').pop()?.replace('.wav', '.mp4')}`}
                  loop muted playsInline
                  className="w-full h-full object-contain opacity-90"
                  onEnded={() => setIsPlaying(false)}
                />
                <div className="absolute bottom-8 left-8 px-5 py-2 bg-black/60 backdrop-blur-xl rounded-2xl text-xs font-black font-mono text-white/90 border border-white/10 shadow-2xl uppercase tracking-widest">
                  VIS_SYNC: {activeLang}_{currentSample.label}
                </div>
              </div>

              {/* Text & Waveform Card */}
              <div className="bg-white rounded-[3rem] border border-slate-200 p-12 flex flex-col min-h-[600px] shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
                <div className="flex items-center gap-4 text-slate-300 mb-8">
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Synthesis Output</span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-y-auto py-4">
                  <p className="text-4xl font-inter text-slate-700 leading-relaxed italic text-center font-medium">
                    "{currentSample.text}"
                  </p>
                </div>
                <div className="mt-10 space-y-10">
                  <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden px-10 shadow-inner">
                    <WaveformVisualizer isPlaying={isPlaying} color="#3b82f6" />
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <button 
                      onClick={handleTogglePlay}
                      className={cn(
                        "flex-1 py-6 rounded-full font-black text-2xl transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center gap-4",
                        isPlaying ? "bg-amber-500 text-white shadow-amber-100" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                      )}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-8 h-8 fill-current" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-8 h-8 fill-current" />
                          Play Synthesis
                        </>
                      )}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="p-6 rounded-full hover:bg-slate-100 text-slate-400 transition-all active:scale-90 shrink-0">
                      {isMuted ? <VolumeX className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Generation */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b-4 border-slate-900 pb-1">
            <h2 className="text-4xl font-black">Real-time Generation</h2>
            <span className="px-6 py-2 bg-amber-100 text-amber-700 text-sm font-black uppercase rounded-full animate-pulse tracking-widest border border-amber-200">Work in Progress</span>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-16 space-y-12 border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="space-y-6">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Input Text
                  </label>
                  <textarea 
                    placeholder="Enter text to synthesize..."
                    className="w-full h-48 p-10 rounded-[2rem] border-2 border-slate-100 bg-slate-50 text-2xl font-inter focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none italic"
                  />
                </div>
                <div className="space-y-8">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Emotion Configuration (0.0 - 1.0)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    {Object.entries(rtEmotions).map(([emo, val]) => (
                      <div key={emo} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black uppercase text-slate-500 tracking-wider">{emo}</span>
                          <span className="text-sm font-black font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">{val.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.01" value={val}
                          onChange={(e) => setRtEmotions(prev => ({ ...prev, [emo]: parseFloat(e.target.value) }))}
                          className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-6 hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-200 group">
                  <Zap className="w-8 h-8 fill-amber-400 text-amber-400 group-hover:scale-125 transition-transform" />
                  Generate Neural Speech
                </button>
              </div>
              <div className="lg:col-span-5 bg-slate-50/30 p-20 flex flex-col items-center justify-center text-center space-y-12">
                <div className="w-40 h-40 rounded-[3rem] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center shadow-inner group">
                  <Mic className="w-16 h-16 text-slate-200 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-slate-400 uppercase tracking-[0.2em] text-base">Inference Status</h4>
                  <p className="text-xl text-slate-400 max-w-[320px] leading-relaxed font-medium italic">
                    The real-time inference engine is currently being optimized for <strong>vLLM</strong> integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Simple Academic Footer */}
      <footer className="mt-40 py-20 border-t border-slate-100 text-center space-y-8">
        <div className="flex justify-center gap-16 text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Dataset</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
        <p className="text-xs text-slate-300 font-black uppercase tracking-[0.5em]">
          © 2026 All Rights Reserved
        </p>
      </footer>

      {/* Hidden Audio */}
      <audio 
        ref={audioRef} 
        src={currentSample.src}
        onEnded={() => {
          setIsPlaying(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
      />
    </div>
  )
}
