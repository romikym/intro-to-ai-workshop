import { motion } from 'framer-motion'

/**
 * Slide 01 — Title.
 * Subtitle removed. All remaining text bumped +2pt for stage readability.
 */
export default function Slide01_Title() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 sm:px-14 pt-4 lg:pt-6 relative">
      {/* Presenting-partner logo — Burbank AI Alliance */}
      <motion.img
        src="/assets/burbank-ai-alliance.png"
        alt="Burbank AI Alliance"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 flex-shrink-0"
        style={{
          width: 'min(360px, 46vw)',
          height: 'auto',
          marginBottom: 'var(--sp-4)',
          filter: 'drop-shadow(0 4px 22px rgba(0,0,0,0.45))'
        }}
      />

      {/* Hero text block */}
      <div className="text-center z-10 max-w-[1400px] flex-shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans display-sans gradient-text-bright"
          style={{ fontSize: '112px', lineHeight: 0.96, marginBottom: 'var(--sp-4)', paddingBottom: '0.06em' }}
        >
          Introduction to{' '}
          <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>
            AI<span className="text-white/40 not-italic">.</span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.85 }}
          className="font-sans display-sans text-white/95"
          style={{ fontSize: '36px', lineHeight: 1.15 }}
        >
          Cutting through{' '}
          <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>the noise</span>.
        </motion.div>
      </div>

      {/* Presenters strip */}
      <div className="w-full" style={{ marginTop: 'var(--sp-4)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center text-white/65 font-sans uppercase font-bold"
          style={{ fontSize: '22px', letterSpacing: '0.28em', marginBottom: 'var(--sp-4)' }}
        >
          Presented by
        </motion.div>

        <div className="flex items-start justify-center" style={{ gap: '120px' }}>
          <PresenterCard presenterId="romik" delay={1.7} />
          <PresenterCard presenterId="jim" delay={1.85} />
        </div>
      </div>
    </div>
  )
}

const PRESENTERS = {
  romik: {
    name: 'Romik Hacobian',
    role: 'CEO · Media City Design',
    photo: '/assets/romik.jpg',
    logo: '/assets/mcd-logo.png',
    photoPos: 'center 25%',
    logoMaxH: 68,
    logoMaxW: 300
  },
  jim: {
    name: 'Jim Festante',
    role: 'CEO · Healthe Habits',
    photo: '/assets/jim.jpg',
    logo: '/assets/healthe-logo.png',
    photoPos: 'center center',
    // Healthe logo is more compact than MCD's wide wordmark — give it
    // more height so it visually matches the cyan logo's presence.
    logoMaxH: 96,
    logoMaxW: 300
  }
}

function PresenterCard({ presenterId, delay = 0 }) {
  const p = PRESENTERS[presenterId]
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      {/* Headshot */}
      <div className="relative" style={{ marginBottom: '10px' }}>
        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-accent-cyan/35 to-accent-indigo/25 blur-2xl" />
        <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-indigo" />
        <div className="relative rounded-full overflow-hidden bg-ink-800 ring-2 ring-ink-950"
             style={{ height: '96px', width: '96px' }}>
          <img
            src={p.photo}
            alt={p.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: p.photoPos }}
          />
        </div>
      </div>

      {/* Name + role — +2pt */}
      <div className="text-center">
        <div className="font-sans display-sans text-white leading-tight"
             style={{ fontSize: '27px' }}>
          {p.name}
        </div>
        <div className="text-white/85" style={{ fontSize: '19px', marginTop: '4px' }}>
          {p.role}
        </div>
      </div>

      {/* Logo — per-presenter sizing so visual weight matches across brands */}
      <div className="flex items-center justify-center"
           style={{ height: '84px', width: '300px', marginTop: '10px', overflow: 'visible' }}>
        <img
          src={p.logo}
          alt=""
          style={{
            maxHeight: `${p.logoMaxH}px`,
            maxWidth: `${p.logoMaxW}px`,
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.5))'
          }}
        />
      </div>
    </motion.div>
  )
}
