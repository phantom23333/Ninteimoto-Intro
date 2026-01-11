"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { EffectComposer, Bloom, Noise, ChromaticAberration, Scanline, Glitch } from "@react-three/postprocessing"
import * as THREE from "three"
import { Suspense } from "react"
import { ASSETS } from "@/lib/assets"

// -----------------------------------------------------------------------------
// MAZE SHADER: Digital, Glitchy, Structural
// -----------------------------------------------------------------------------

const MazeShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uColor: { value: new THREE.Color("#10b981") }, // Emerald Green
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uHover;
    
    varying vec2 vUv;

    // Pseudo-random
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vec2 uv = vUv;
        
        // Digital Glitch Shift
        float glitch = step(0.99, sin(uTime * 10.0 + uv.y * 10.0)) * 0.02;
        uv.x += glitch * uHover;
        
        vec4 texColor = texture2D(uTexture, uv);
        
        // Brightness Map
        float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        
        // Quantize Structure (Digital Look)
        float structure = smoothstep(0.3, 0.35, brightness);
        
        // Scanlines
        float scan = sin(uv.y * 100.0 + uTime * 5.0) * 0.1;
        
        // Color Composition
        vec3 finalColor = uColor * structure;
        
        // Add brightness boost on structure
        finalColor += vec3(0.8, 1.0, 0.8) * structure * 0.5;
        
        // Add scanlines to background
        finalColor += vec3(0.0, 0.1, 0.0) * scan;
        
        // Alpha: Structure + slight scanline background
        float alpha = structure + (scan * 0.1);
        
        // Vignette
        float dist = distance(vUv, vec2(0.5));
        alpha *= smoothstep(0.6, 0.2, dist);

        gl_FragColor = vec4(finalColor, alpha);
    }
  `
}

// -----------------------------------------------------------------------------
// LABYRINTH SHADER: Ethereal, Organic, Foggy
// -----------------------------------------------------------------------------

const LabyrinthShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uColor: { value: new THREE.Color("#e2e8f0") }, // White/Slate
    uHover: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uHover;
    
    varying vec2 vUv;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    float fbm(vec2 st) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
            v += a * noise(st);
            st *= 2.0;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 uv = vUv;
        
        // Slow Warping
        vec2 warp = vec2(
            fbm(uv + uTime * 0.1),
            fbm(uv + uTime * 0.1 + 100.0)
        ) * 0.02;
        
        vec4 texColor = texture2D(uTexture, uv + warp);
        
        float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        float structure = smoothstep(0.2, 0.6, brightness);
        
        // Ethereal Fog
        float fog = fbm(uv * 3.0 - uTime * 0.15);
        
        vec3 finalColor = uColor;
        
        // Mask with structure
        float alpha = structure * 0.2;
        
        // Add Fog highlight
        alpha += structure * fog * 0.3;
        
        // Pulse
        float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
        alpha += structure * pulse * 0.1;

        // Circular Fade
        float dist = distance(vUv, vec2(0.5));
        alpha *= smoothstep(0.5, 0.2, dist);

        gl_FragColor = vec4(finalColor, alpha);
    }
  `
}

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

function MazeVisual({ isHovered }: { isHovered: boolean }) {
    // Maze: Digital, Structural, Green
    // Using maze.png as requested and scaling it up
    const texture = useTexture(ASSETS.images.textures.maze)
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)
    const { viewport } = useThree()
    
    // Scale: Larger to show detail (Amplified as requested)
    const size = Math.min(viewport.width, viewport.height) * 2.5
    
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
            materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                isHovered ? 1 : 0,
                0.1
            )
        }
    })

    return (
        <mesh ref={meshRef} scale={[size, size, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                args={[MazeShaderMaterial]}
                uniforms-uTexture-value={texture}
                transparent
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    )
}

function LabyrinthVisual({ isHovered }: { isHovered: boolean }) {
    // Labyrinth: Ethereal, Circular, White
    // Using specific Labyrinth png
    const texture = useTexture(ASSETS.images.textures.labyrinth)
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)
    const { viewport } = useThree()
    
    // Scale: Contained for circular shape
    const size = Math.min(viewport.width, viewport.height) * 2.0

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
            materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                isHovered ? 1 : 0,
                0.05
            )
        }
    })

    return (
        <mesh ref={meshRef} scale={[size, size, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                args={[LabyrinthShaderMaterial]}
                uniforms-uTexture-value={texture}
                transparent
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    )
}

function FallbackVisual() {
    return (
        <mesh scale={[2, 2, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#333" wireframe transparent opacity={0.1} />
        </mesh>
    )
}

export function VisualCanvas({ type, isHovered }: { type: 'maze' | 'labyrinth', isHovered: boolean }) {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas resize={{ scroll: false }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={<FallbackVisual />}>
            {type === 'maze' ? (
                <MazeVisual isHovered={isHovered} />
            ) : (
                <LabyrinthVisual isHovered={isHovered} />
            )}
        </Suspense>
        <EffectComposer>
             <Bloom 
                luminanceThreshold={0.2} 
                mipmapBlur 
                intensity={0.6} 
                radius={0.5} 
             />
             <Noise opacity={0.1} />
             <ChromaticAberration offset={[0.002, 0.002]} />
             {/* Add slight Glitch for Maze only? Hard to pass conditional prop to EffectComposer easily without re-mounting. Keeping common FX for now. */}
        </EffectComposer>
      </Canvas>
    </div>
  )
}
