import { motion } from 'framer-motion'
import SlideFrame, { SlideHeader } from '../SlideFrame'

const models = [
  {
    company: 'Anthropic',
    name: 'Claude',
    bestFor: 'Drafting listing descriptions, analyzing contracts & disclosures, thinking through tricky client situations.',
    accent: 'var(--c-amber)'
  },
  {
    company: 'OpenAI',
    name: 'ChatGPT',
    bestFor: 'Everyday client emails and social captions, brainstorming, plus image generation for listings.',
    accent: 'var(--c-teal)'
  },
  {
    company: 'Google',
    name: 'Gemini',
    bestFor: 'Helps write your emails, summarizes long message threads, and organizes your spreadsheets.',
    accent: 'var(--c-electric-soft)'
  },
  {
    company: 'Microsoft',
    name: 'Copilot',
    bestFor: 'Lives inside Excel, PowerPoint, and Outlook — the Microsoft apps you already use.',
    accent: 'var(--c-electric)'
  },
  {
    company: 'Perplexity',
    name: 'Perplexity',
    bestFor: 'Neighborhood research, market data, fact-checking with sources you can cite.',
    accent: 'var(--c-violet)'
  }
]

export default function Slide09_AIModels() {
  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="Meet the AI Assistants"
        title="They all do most things."
        presenter="romik"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-white/85 max-w-4xl leading-relaxed"
        style={{ fontSize: 'var(--fs-lead)', marginBottom: 'var(--sp-9)' }}
      >
        They're all smart assistants. The differences are small — mostly what each one does best.
      </motion.p>

      {/* Five model cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 flex-1 min-h-0"
           style={{ gap: 'var(--sp-5)' }}>
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="deck-card flex flex-col"
            style={{ '--card-accent': m.accent }}
          >
            {/* Company eyebrow */}
            <div className="font-sans uppercase font-bold text-white/65"
                 style={{ fontSize: '14px', letterSpacing: '0.22em', marginBottom: 'var(--sp-3)' }}>
              {m.company}
            </div>

            {/* MODEL NAME — Inter Tight 900 weight, full accent fill, no italic.
                Drop-shadow + inner-glow vibe via text-shadow. Reads from across the room. */}
            <div
              className="display-sans"
              style={{
                fontSize: '44px',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: m.accent,
                marginBottom: 'var(--sp-4)',
                textShadow: `0 0 40px color-mix(in srgb, ${m.accent} 35%, transparent)`
              }}
            >
              {m.name}
            </div>

            {/* Hairline */}
            <div style={{ height: '1px', background: `color-mix(in srgb, ${m.accent} 28%, transparent)`, marginBottom: 'var(--sp-4)' }} />

            {/* Best for */}
            <div>
              <span className="block uppercase font-bold text-white/55 font-sans"
                    style={{ fontSize: '12px', letterSpacing: '0.22em', marginBottom: 'var(--sp-2)' }}>
                Best for
              </span>
              <div className="text-white/90 leading-relaxed"
                   style={{ fontSize: '17px' }}>
                {m.bestFor}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SlideFrame>
  )
}
