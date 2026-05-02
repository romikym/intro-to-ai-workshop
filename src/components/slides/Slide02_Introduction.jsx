import { motion } from 'framer-motion'
import { Zap, Droplets, Cpu, Wrench } from 'lucide-react'
import SlideFrame, { SlideHeader, PointCard } from '../SlideFrame'
import { CostMeterAnchor } from '../AnchorVisuals'

export default function Slide02_Introduction() {
  const points = [
    { icon: Cpu,      headline: '"Adopt AI or Die"',     body: 'A marketing line. Tech platforms push it because they need you dependent.' },
    { icon: Zap,      headline: 'Not magic. Software.',   body: 'A brutally resource-intensive piece of software with real operating costs.' },
    { icon: Droplets, headline: 'Real physical costs',    body: 'Each query consumes electricity and fresh water for cooling at scale.' },
    { icon: Wrench,   headline: 'Oracle → Tool',          body: 'Stop asking it for answers. Use it as an instrument that needs a skilled operator.' }
  ]

  return (
    <SlideFrame>
      <SlideHeader eyebrow="Introduction" title="Look behind the curtain." presenter="jim" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 flex-1 min-h-0 items-stretch">
        {/* LEFT: 4 point cards in a 2x2 grid — bigger text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {points.map((p, i) => {
            const Icon = p.icon
            return (
              <PointCard key={i} delay={0.2 + i * 0.08}>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-cyan/15 to-accent-blue/10 border border-accent-cyan/25 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-accent-cyan" />
                  </div>
                  <div className="min-w-0">
                    <div className="display-sans text-white leading-tight"
                         style={{ fontSize: '26px', marginBottom: '8px' }}>
                      {p.headline}
                    </div>
                    <div className="text-white/90 leading-snug" style={{ fontSize: '17px' }}>
                      {p.body}
                    </div>
                  </div>
                </div>
              </PointCard>
            )
          })}
        </div>

        {/* RIGHT: anchor visual — dramatic cost meter */}
        <div className="deck-card flex flex-col justify-center"
             style={{ '--card-accent': 'var(--c-amber)', minHeight: '420px', padding: '24px 28px' }}>
          <CostMeterAnchor />
        </div>
      </div>
    </SlideFrame>
  )
}
