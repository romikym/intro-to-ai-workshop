import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

/**
 * QRCode — Animated viewfinder-style QR code that points to the current URL by default.
 *
 * Visual treatment:
 *   - Subtle glow halo behind
 *   - White rounded card (so the QR scans reliably from any phone)
 *   - Animated cyan corner brackets (camera viewfinder style)
 *   - Vertical scan line that sweeps across
 *
 * Props:
 *   value: string — what the QR encodes. Defaults to current page URL.
 *   size: number — pixel size, defaults to 240.
 *   label: string — small text below the QR
 */
export default function QRCode({
  value,
  size = 240,
  label = 'Scan to access this presentation'
}) {
  const [resolvedValue, setResolvedValue] = useState(value)

  useEffect(() => {
    if (value) {
      setResolvedValue(value)
    } else if (typeof window !== 'undefined') {
      setResolvedValue(window.location.origin + window.location.pathname)
    }
  }, [value])

  const padding = 20
  const totalSize = size + padding * 2

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: totalSize, height: totalSize }}>
        {/* Outer glow halo */}
        <div
          className="absolute -inset-6 rounded-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25), transparent 70%)',
            filter: 'blur(20px)'
          }}
        />

        {/* White card with QR */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl bg-white shadow-2xl flex items-center justify-center"
          style={{ width: totalSize, height: totalSize }}
        >
          {resolvedValue && (
            <QRCodeSVG
              value={resolvedValue}
              size={size}
              level="M"
              fgColor="#06090F"
              bgColor="#FFFFFF"
              imageSettings={undefined}
            />
          )}
        </motion.div>

        {/* Animated viewfinder corner brackets */}
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        {/* Scan line */}
        <motion.div
          className="absolute left-3 right-3 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #22D3EE 30%, #22D3EE 70%, transparent)',
            boxShadow: '0 0 12px #22D3EE',
            top: 0
          }}
          animate={{
            top: [`8px`, `${totalSize - 8}px`, `8px`]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {label && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm text-white/55 font-mono tracking-wider uppercase"
        >
          {label}
        </motion.div>
      )}
    </div>
  )
}

function CornerBracket({ position }) {
  const isTop = position.startsWith('t')
  const isLeft = position.endsWith('l')

  // Position offsets from the QR card edge
  const styles = {
    tl: { top: -8, left: -8 },
    tr: { top: -8, right: -8 },
    bl: { bottom: -8, left: -8 },
    br: { bottom: -8, right: -8 }
  }

  // Border styles for each corner
  const borderStyle = {
    tl: { borderTop: '2px solid #22D3EE', borderLeft: '2px solid #22D3EE', borderTopLeftRadius: '8px' },
    tr: { borderTop: '2px solid #22D3EE', borderRight: '2px solid #22D3EE', borderTopRightRadius: '8px' },
    bl: { borderBottom: '2px solid #22D3EE', borderLeft: '2px solid #22D3EE', borderBottomLeftRadius: '8px' },
    br: { borderBottom: '2px solid #22D3EE', borderRight: '2px solid #22D3EE', borderBottomRightRadius: '8px' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="absolute w-6 h-6 pointer-events-none"
      style={{
        ...styles[position],
        ...borderStyle[position],
        boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
      }}
    />
  )
}
