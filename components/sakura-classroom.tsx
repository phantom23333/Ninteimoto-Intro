"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture, PerspectiveCamera, Environment } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing"
import * as THREE from "three"
import React from 'react'
import { ASSETS } from "@/lib/assets"

// -----------------------------------------------------------------------------
// Seasonal Particle System
// -----------------------------------------------------------------------------

type SeasonType = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

interface SeasonalParticlesProps {
  season: SeasonType
}

const PARTICLE_COUNT = 300 

function SeasonalParticles({ season }: SeasonalParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // 1. Define Geometries based on Season
  const geometries = useMemo(() => {
    // Spring: Sakura Petal (Heart-like)
    const sakuraShape = new THREE.Shape()
    sakuraShape.moveTo(0, 0)
    sakuraShape.bezierCurveTo(0.05, 0.05, 0.1, 0.15, 0, 0.25)
    sakuraShape.bezierCurveTo(-0.02, 0.22, -0.02, 0.22, -0.05, 0.25)
    sakuraShape.bezierCurveTo(-0.15, 0.15, -0.05, 0.05, 0, 0)
    const sakuraGeo = new THREE.ShapeGeometry(sakuraShape)

    // Summer: Green Leaf (Simple Oval)
    const leafShape = new THREE.Shape()
    leafShape.moveTo(0, 0)
    leafShape.quadraticCurveTo(0.1, 0.1, 0, 0.3) // Right side
    leafShape.quadraticCurveTo(-0.1, 0.1, 0, 0)  // Left side
    const leafGeo = new THREE.ShapeGeometry(leafShape)

    // Autumn: Maple Leaf (Star-like)
    const mapleShape = new THREE.Shape()
    const s = 0.08 // scale factor
    mapleShape.moveTo(0, 0)
    mapleShape.lineTo(1*s, 1*s); mapleShape.lineTo(2*s, 0.5*s); mapleShape.lineTo(1.5*s, 1.5*s); // Right bottom
    mapleShape.lineTo(2.5*s, 2*s); mapleShape.lineTo(1.5*s, 2.5*s); // Right top
    mapleShape.lineTo(0, 3.5*s); // Top
    mapleShape.lineTo(-1.5*s, 2.5*s); mapleShape.lineTo(-2.5*s, 2*s); // Left top
    mapleShape.lineTo(-1.5*s, 1.5*s); mapleShape.lineTo(-2*s, 0.5*s); mapleShape.lineTo(-1*s, 1*s); // Left bottom
    mapleShape.lineTo(0, 0)
    const mapleGeo = new THREE.ShapeGeometry(mapleShape)

    // Winter: Snow (Circle/Hexagon)
    const snowGeo = new THREE.CircleGeometry(0.06, 6)

    return { Spring: sakuraGeo, Summer: leafGeo, Autumn: mapleGeo, Winter: snowGeo }
  }, [])

  // 2. Initialize Particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 25
      const y = Math.random() * 15 + 5
      const z = (Math.random() - 0.5) * 15
      
      const speed = 0.01 + Math.random() * 0.04
      const swayX = 0.5 + Math.random() * 1.5
      const swayZ = 0.2 + Math.random() * 0.8
      
      const rotSpeedX = (Math.random() - 0.5) * 2
      const rotSpeedY = (Math.random() - 0.5) * 2
      const rotSpeedZ = (Math.random() - 0.5) * 2

      temp.push({ 
        x, y, z, 
        initialX: x, initialZ: z,
        speed, swayX, swayZ,
        rotSpeedX, rotSpeedY, rotSpeedZ,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        // Color is now dynamic per season
        baseColor: new THREE.Color()
      })
    }
    return temp
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 3. Update Colors based on Season
  useEffect(() => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        let color
        if (season === 'Spring') {
            color = new THREE.Color(Math.random() > 0.5 ? "#ffc0cb" : "#ffd7e6")
        } else if (season === 'Summer') {
            // Varied Greens
            color = new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.8, 0.4 + Math.random() * 0.2)
        } else if (season === 'Autumn') {
             // Red/Orange/Yellow
            const hue = Math.random() * 0.15 // 0.0 to 0.15 (Red to Yellow)
            color = new THREE.Color().setHSL(hue, 1.0, 0.5)
        } else { // Winter
            color = new THREE.Color("#ffffff")
        }
        
        // Add variation
        if (season !== 'Winter') color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1)
        
        particle.baseColor = color
        meshRef.current!.setColorAt(i, color)
      })
      meshRef.current.instanceColor!.needsUpdate = true
    }
  }, [particles, season])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const time = state.clock.getElapsedTime()

    particles.forEach((particle, i) => {
      // Seasonal Behavior Adjustments
      let activeSpeed = particle.speed
      let activeSway = 1.0
      
      if (season === 'Winter') {
        activeSpeed *= 0.8 // Snow falls slower
        activeSway = 0.5 // Less swaying
      } else if (season === 'Summer' || season === 'Autumn') {
        activeSway = 1.2 // Leaves flutter more
      }

      particle.y -= activeSpeed
      
      const windOffset = Math.sin(time * 0.5 + particle.y * 0.5) * 0.5 * activeSway
      particle.x = particle.initialX + Math.sin(time * particle.swayX + i) * 1.5 * activeSway + windOffset
      particle.z = particle.initialZ + Math.cos(time * particle.swayZ + i) * 1 * activeSway + windOffset

      // Rotation
      const tumbleSpeed = 1 + activeSpeed * 10
      particle.rotation.x += particle.rotSpeedX * 0.01 * tumbleSpeed
      particle.rotation.y += particle.rotSpeedY * 0.01 * tumbleSpeed
      particle.rotation.z += particle.rotSpeedZ * 0.01 * tumbleSpeed
      dummy.rotation.copy(particle.rotation)

      if (particle.y < -8) {
        particle.y = 12 + Math.random() * 5
        particle.x = (Math.random() - 0.5) * 25
        particle.initialX = particle.x
        particle.initialZ = (Math.random() - 0.5) * 15
        particle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      }

      dummy.position.set(particle.x, particle.y, particle.z)
      
      let scale = 1.0 + Math.sin(time * 2 + i) * 0.1
      if (season === 'Winter') scale *= 0.6 // Smaller snow
      
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  // We key the instancedMesh by geometry to force re-creation when shape changes
  // This is simpler than trying to update geometry in place for InstancedMesh
  return (
    <instancedMesh 
      key={season} 
      ref={meshRef} 
      args={[geometries[season], undefined, PARTICLE_COUNT]} 
      receiveShadow 
      castShadow
    >
      <meshStandardMaterial 
        side={THREE.DoubleSide} 
        transparent 
        opacity={season === 'Winter' ? 0.8 : 0.9}
        roughness={season === 'Winter' ? 0.2 : 0.5} // Snow is shinier
        metalness={0.1}
      />
    </instancedMesh>
  )
}

// -----------------------------------------------------------------------------
// Background (Classroom)
// -----------------------------------------------------------------------------

function Background({ season }: { season: SeasonType }) {
  // Map season to image file
  const imageMap = {
    Spring: ASSETS.images.backgrounds.classroomSpring,
    Summer: ASSETS.images.backgrounds.classroomSummer,
    Autumn: ASSETS.images.backgrounds.classroomAutumn,
    Winter: ASSETS.images.backgrounds.classroomWinter
  }
  
  // NOTE: This uses useLoader which suspends. If file is missing, it will throw.
  // We can't easily catch a suspense throw inside the component except with an Error Boundary around it.
  // BUT, to be safe for a demo, we can just use useTexture with a fallback if we could, 
  // but useTexture doesn't support fallback natively in that way.
  // Instead, let's use a simpler approach: try to load, if fail, show color.
  // However, useTexture is the standard way in R3F.
  // Let's rely on the user adding the files, but to prevent the WHITE SCREEN crash,
  // we will add a dedicated ErrorBoundary component here.

  const texture = useTexture(imageMap[season])

  const { viewport, camera } = useThree()
  
  const aspect = (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height

  // 1. Move background further back to avoid particle clipping (particles go up to z=-7.5)
  const bgZ = -10
  const cameraZ = 5
  const distance = cameraZ - bgZ // 15
  
  // 2. Calculate the visible plane dimensions at depth bgZ
  // @ts-ignore
  const vFov = camera.fov * Math.PI / 180
  const heightAtDepth = 2 * Math.tan(vFov / 2) * distance
  const widthAtDepth = heightAtDepth * viewport.aspect // viewport.aspect is w/h

  // 3. Set a "Cinematic" scale (e.g., 85% of screen width)
  // This creates the "floating screen" look without it being tiny
  const scaleFactor = 0.85 
  
  const targetWidth = widthAtDepth * scaleFactor
  const targetHeight = heightAtDepth * scaleFactor

  // Contain logic: Fit image within the target box
  let scale: [number, number, number] = [targetWidth, targetWidth / aspect, 1]
  
  // If height blows out of bounds, constrain by height instead
  if (scale[1] > targetHeight) {
    scale = [targetHeight * aspect, targetHeight, 1]
  }

  return (
    <mesh position={[0, 0, bgZ]} scale={scale} castShadow receiveShadow>
      <planeGeometry />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.2} 
        metalness={0.1}
        side={THREE.DoubleSide}
        // Enable tone mapping for lighting interaction if desired, 
        // but usually screens are emissive or just texture.
        // Let's make it slightly reactive to light but mostly the texture.
        toneMapped={false} 
        emissive={new THREE.Color("#ffffff")}
        emissiveMap={texture}
        emissiveIntensity={0.5} // Self-illuminated screen look
      />
    </mesh>
  )
}

// Simple Error Boundary for the Background
class BackgroundErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// -----------------------------------------------------------------------------
// Seasons / Lighting Controller
// -----------------------------------------------------------------------------

const SEASON_CONFIG = [
  { name: "Spring", color: "#ffecf2", intensity: 1.5, ambient: 0.8, position: [5, 10, 5] },
  { name: "Summer", color: "#fffae0", intensity: 2.5, ambient: 0.6, position: [2, 12, 2] }, 
  { name: "Autumn", color: "#ffaa7a", intensity: 2.0, ambient: 0.5, position: [-8, 5, 8] },
  { name: "Winter", color: "#e0f7fa", intensity: 1.2, ambient: 0.9, position: [0, 8, 10] },
] as const

interface SeasonLightingProps {
  season: SeasonType
  nextSeason: SeasonType
  transitionProgress: number
}

function SeasonLighting({ season, nextSeason, transitionProgress }: SeasonLightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null)
  const ambientLightRef = useRef<THREE.AmbientLight>(null)

  const currentConfig = SEASON_CONFIG.find(s => s.name === season)!
  const nextConfig = SEASON_CONFIG.find(s => s.name === nextSeason)!

  useFrame(() => {
    if (dirLightRef.current && ambientLightRef.current) {
      const t = transitionProgress

      // Interpolate Color
      const c1 = new THREE.Color(currentConfig.color)
      const c2 = new THREE.Color(nextConfig.color)
      const mixedColor = c1.lerp(c2, t)
      
      dirLightRef.current.color.copy(mixedColor)
      ambientLightRef.current.color.copy(mixedColor)

      // Interpolate Intensity
      dirLightRef.current.intensity = THREE.MathUtils.lerp(currentConfig.intensity, nextConfig.intensity, t)
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(currentConfig.ambient, nextConfig.ambient, t)

      // Interpolate Position
      const p1 = new THREE.Vector3(...currentConfig.position as [number, number, number])
      const p2 = new THREE.Vector3(...nextConfig.position as [number, number, number])
      const mixedPos = p1.lerp(p2, t)
      dirLightRef.current.position.copy(mixedPos)
    }
  })

  return (
    <>
      <ambientLight ref={ambientLightRef} />
      <directionalLight 
        ref={dirLightRef} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="city" /> 
    </>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function SakuraClassroom() {
  const [mounted, setMounted] = useState(false)
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [lerpFactor, setLerpFactor] = useState(0)

  // Use a ref to drive the animation loop independent of React renders
  const progressRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    
    // Custom animation loop for season transition
    let lastTime = performance.now()
    const DURATION = 8000 // 8 seconds per season
    const TRANSITION = 3000 // 3 seconds transition time
    
    const animate = (time: number) => {
      const delta = time - lastTime
      
      // Update internal progress (0 to 1)
      // We actually want a state machine: Holding -> Transitioning -> Holding
      // But simple linear interpolation with wrap-around is easier:
      // We control "seasonIndex" and a generic "progress"
      
      // Let's keep the interval logic but animate the transition explicitly
      requestAnimationFrame(animate)
    }
    // Actually, simpler logic:
    // Use interval to switch index, use useFrame (inside canvas) or another interval for lerp
    // But we need the state 'seasonIndex' to be passed down.
    
    const interval = setInterval(() => {
        setSeasonIndex(prev => (prev + 1) % SEASON_CONFIG.length)
        // Reset lerp
        setLerpFactor(0) 
        progressRef.current = 0
    }, DURATION)

    // Separate loop for smooth transition value update
    const transitionInterval = setInterval(() => {
        if (progressRef.current < 1) {
            progressRef.current += 16 / TRANSITION // approx 60fps
            setLerpFactor(Math.min(progressRef.current, 1))
        }
    }, 16)

    return () => {
        clearInterval(interval)
        clearInterval(transitionInterval)
    }
  }, [])

  if (!mounted) return <div className="w-full h-full bg-black/10" />

  const currentSeason = SEASON_CONFIG[seasonIndex].name as SeasonType
  const nextSeason = SEASON_CONFIG[(seasonIndex + 1) % SEASON_CONFIG.length].name as SeasonType

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-white/10 shadow-2xl group">
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Pass current season to particles */}
        <SeasonalParticles season={currentSeason} />

        {/* Background with Suspense fallback and Error Boundary */}
        <BackgroundErrorBoundary fallback={<color attach="background" args={["#1a1a1a"]} />}>
          <React.Suspense fallback={<color attach="background" args={["#1a1a1a"]} />}>
             <Background season={currentSeason} />
          </React.Suspense>
        </BackgroundErrorBoundary>
        
        <SeasonLighting 
            season={currentSeason} 
            nextSeason={nextSeason} 
            transitionProgress={lerpFactor} 
        />
        
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} radius={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
          <Noise opacity={0.02} /> 
        </EffectComposer>
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute bottom-6 left-6 text-white/90 font-light pointer-events-none select-none z-10">
        <h3 className="text-xl font-medium tracking-wide drop-shadow-lg">Seasonal Simulation</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <p className="text-sm opacity-90 drop-shadow-md">
            Season: <span className="font-semibold text-yellow-200">{currentSeason}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
