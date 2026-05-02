import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex shader — displaces the sphere using simplex noise for organic motion.
const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisplacement;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 displacedPos = position;
    float noise = snoise(position * 1.5 + uTime * 0.15);
    float displacement = noise * 0.18 * uIntensity;
    displacedPos += normal * displacement;
    vDisplacement = displacement;
    vec4 mvPos = modelViewMatrix * vec4(displacedPos, 1.0);
    vPos = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisplacement;

  void main() {
    // Strong fresnel — emphasizes edges, leaves center almost transparent
    vec3 viewDir = normalize(-vPos);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

    vec3 cyan = vec3(0.133, 0.827, 0.933);     // #22D3EE
    vec3 blue = vec3(0.231, 0.510, 0.965);     // #3B82F6
    vec3 indigo = vec3(0.388, 0.400, 0.945);   // #6366F1

    float t = (vDisplacement + 0.2) / 0.4;
    vec3 color = mix(blue, cyan, fresnel);
    color = mix(color, indigo, smoothstep(0.0, 1.0, t * 0.5));

    // Edge-only emission — center is nearly transparent
    float alpha = fresnel * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`

function Sphere({ intensity = 0.6 }) {
  const meshRef = useRef()
  const wireRef = useRef()
  const materialRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: intensity }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      const target = intensity
      const current = materialRef.current.uniforms.uIntensity.value
      materialRef.current.uniforms.uIntensity.value += (target - current) * 0.04
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.05
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15
    }
  })

  // The wireframe is the most visible element; keep it very subtle except on hero slides
  const wireOpacity = Math.min(0.06, intensity * 0.15)

  return (
    <group>
      {/* Main displaced sphere — only edges glow now (fresnel-only) */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe overlay — very subtle */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.41, 4]} />
        <meshBasicMaterial
          color="#22D3EE"
          wireframe
          transparent
          opacity={wireOpacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Persistent WebGL background sphere.
 * intensity:
 *   0.0–0.2  — content slides: faint atmospheric edge
 *   0.4–0.6  — section transitions: noticeable but not dominant
 *   0.8–1.0  — title/closing slides: full hero
 */
export default function NeuralSphere({ intensity = 0.5, position = 'center' }) {
  // Camera distance scales inversely with intensity:
  // low intensity → camera far away → sphere small in frame
  // high intensity → camera close → sphere fills frame
  const cameraZ = 4 + (1 - intensity) * 8  // 4 (close) to 12 (far)

  // Translate the SPHERE itself (not the camera) for off-axis composition.
  // The viewport is roughly 16:9, so X offset of ~3 pushes sphere to the screen edge.
  let sphereOffset = [0, 0, 0]
  if (position === 'right')        sphereOffset = [3.0, 0, 0]
  if (position === 'left')         sphereOffset = [-3.0, 0, 0]
  if (position === 'top-right')    sphereOffset = [3.0, 1.6, 0]
  if (position === 'bottom-right') sphereOffset = [3.2, -1.4, 0]
  if (position === 'top-left')     sphereOffset = [-3.0, 1.6, 0]
  if (position === 'bottom-left')  sphereOffset = [-3.2, -1.4, 0]

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#22D3EE" />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#6366F1" />
        <group position={sphereOffset}>
          <Sphere intensity={intensity} />
        </group>
      </Canvas>
    </div>
  )
}
