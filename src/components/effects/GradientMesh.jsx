import { motion } from 'framer-motion'

/**
 * GradientMesh — multi-radial gradient creating a dreamy mesh effect.
 * Replicates the Media City Design website's pillar card headers with
 * vibrant overlapping color blobs that drift slowly.
 */

export const THEMES = {
  // Media City Design's three website pillars
  systems: {
    base: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
    blobs: [
      { x: '10%', y: '20%', color: '#3B82F6', size: '90%', opacity: 0.95 },
      { x: '85%', y: '15%', color: '#A855F7', size: '85%', opacity: 0.9 },
      { x: '40%', y: '95%', color: '#1E40AF', size: '110%', opacity: 0.85 },
      { x: '90%', y: '85%', color: '#22D3EE', size: '60%', opacity: 0.85 }
    ],
    pillColor: '#3B82F6',
    accent: '#67E8F9'
  },
  marketing: {
    base: 'linear-gradient(135deg, #1E1B4B 0%, #500724 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#A855F7', size: '85%', opacity: 0.9 },
      { x: '85%', y: '30%', color: '#F472B6', size: '85%', opacity: 0.95 },
      { x: '50%', y: '95%', color: '#F97316', size: '95%', opacity: 0.95 },
      { x: '10%', y: '85%', color: '#7C3AED', size: '60%', opacity: 0.85 }
    ],
    pillColor: '#F97316',
    accent: '#FB923C'
  },
  design: {
    base: 'linear-gradient(135deg, #1E1B4B 0%, #500724 100%)',
    blobs: [
      { x: '20%', y: '20%', color: '#EC4899', size: '85%', opacity: 0.95 },
      { x: '85%', y: '25%', color: '#A855F7', size: '85%', opacity: 0.9 },
      { x: '50%', y: '95%', color: '#3B82F6', size: '110%', opacity: 0.9 },
      { x: '10%', y: '85%', color: '#F472B6', size: '60%', opacity: 0.85 }
    ],
    pillColor: '#A855F7',
    accent: '#C084FC'
  },

  // AI presentation themes
  cyan: {
    base: 'linear-gradient(135deg, #082F49 0%, #1E3A8A 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#22D3EE', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#3B82F6', size: '85%', opacity: 0.9 },
      { x: '50%', y: '95%', color: '#0891B2', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#67E8F9', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#22D3EE',
    accent: '#67E8F9'
  },
  emerald: {
    base: 'linear-gradient(135deg, #052E2B 0%, #14532D 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#10B981', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#34D399', size: '85%', opacity: 0.95 },
      { x: '50%', y: '95%', color: '#059669', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#6EE7B7', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#10B981',
    accent: '#6EE7B7'
  },
  violet: {
    base: 'linear-gradient(135deg, #2E1065 0%, #1E1B4B 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#A855F7', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#8B5CF6', size: '85%', opacity: 0.9 },
      { x: '50%', y: '95%', color: '#7C3AED', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#C4B5FD', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#A855F7',
    accent: '#C4B5FD'
  },
  amber: {
    base: 'linear-gradient(135deg, #451A03 0%, #7C2D12 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#F59E0B', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#FBBF24', size: '85%', opacity: 0.95 },
      { x: '50%', y: '95%', color: '#D97706', size: '95%', opacity: 0.9 },
      { x: '15%', y: '85%', color: '#FCD34D', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#F59E0B',
    accent: '#FCD34D'
  },
  rose: {
    base: 'linear-gradient(135deg, #4C0519 0%, #500724 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#EC4899', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#F472B6', size: '85%', opacity: 0.9 },
      { x: '50%', y: '95%', color: '#BE185D', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#FBCFE8', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#EC4899',
    accent: '#F9A8D4'
  },
  sky: {
    base: 'linear-gradient(135deg, #082F49 0%, #0C4A6E 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#0EA5E9', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#38BDF8', size: '85%', opacity: 0.95 },
      { x: '50%', y: '95%', color: '#0284C7', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#7DD3FC', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#0EA5E9',
    accent: '#7DD3FC'
  },
  indigo: {
    base: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
    blobs: [
      { x: '15%', y: '20%', color: '#6366F1', size: '90%', opacity: 0.95 },
      { x: '85%', y: '30%', color: '#818CF8', size: '85%', opacity: 0.9 },
      { x: '50%', y: '95%', color: '#4F46E5', size: '95%', opacity: 0.9 },
      { x: '90%', y: '85%', color: '#A5B4FC', size: '55%', opacity: 0.85 }
    ],
    pillColor: '#6366F1',
    accent: '#A5B4FC'
  }
}

export default function GradientMesh({ theme = 'cyan', className = '', animate = true, style = {} }) {
  const config = THEMES[theme] || THEMES.cyan

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: config.base, ...style }}
    >
      {config.blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            filter: 'blur(45px) saturate(1.4)',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            opacity: blob.opacity || 0.9
          }}
          animate={animate ? {
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.2, 0.9, 1]
          } : undefined}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Top highlight for "lit from above" feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% -20%, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
      />

      {/* Subtle bottom shadow for depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)'
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}
