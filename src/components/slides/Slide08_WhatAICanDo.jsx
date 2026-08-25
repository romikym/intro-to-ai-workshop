import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, BookOpen, Wand2 } from 'lucide-react'
import SlideFrame from '../SlideFrame'
import { PresenterChip } from '../Presenters'

const categories = [
  { n: '01', pillLabel: 'Communication', title: 'Talk to clients',   tagline: 'Reply with your voice, at machine speed.', items: ['Lead replies & follow-ups', 'Review & referral responses'], accent: 'var(--c-electric)',  examplePrompt: 'Draft a warm follow-up to a buyer who toured 3 homes last month and went quiet — no pressure, just add value and offer next steps.' },
  { n: '02', pillLabel: 'Marketing',     title: 'Market a listing',  tagline: 'One property, ten pieces of content.',         items: ['MLS descriptions', 'Just-listed social & email'],     accent: 'var(--c-amber)',     examplePrompt: 'For this 3BR/2BA Burbank craftsman, write: an MLS listing description, an Instagram caption, and a just-listed email to my database.' },
  { n: '03', pillLabel: 'Operations',    title: 'Run your business', tagline: 'Less paperwork, more closings.',                items: ['Disclosure & inspection recaps', 'Showing notes cleaned up'],   accent: 'var(--c-teal)',      examplePrompt: 'Here is a 38-page inspection report. Give me the 5 things my buyer actually needs to know, and 3 questions to ask the seller.' },
  { n: '04', pillLabel: 'Research',      title: 'Know your market',  tagline: "Read what you don't have time to read.",        items: ['Neighborhood & comp context', 'Competing agents scanned'], accent: 'var(--c-electric-soft)', examplePrompt: 'Read these 5 competing Burbank agents’ websites. What do they all promise? What do they all leave out? Where is my opening?' },
  { n: '05', pillLabel: 'Design',        title: 'Make visuals',      tagline: 'A designer in your pocket.',                    items: ['Listing flyers & open-house graphics', 'Staging & social visuals'],    accent: 'var(--c-violet)',    examplePrompt: 'Generate 4 open-house flyer directions for a Burbank craftsman home — warm, upscale, family-friendly, no stock-photo clichés.' },
  { n: '06', pillLabel: 'Decisions',     title: 'Read the numbers',  tagline: 'Patterns you would otherwise miss.',            items: ['Pricing strategy from comps', 'Lead-source & pipeline patterns'], accent: 'var(--c-coral)',     examplePrompt: 'Here is 12 months of my closings and lead sources. Which sources actually convert? Where should I spend my marketing next quarter?' }
]

/**
 * The showcase prompt — a single best-in-class prompt the presenter can
 * open during the talk to demonstrate good prompting practice. Each line
 * is annotated with the technique being used.
 */
const SHOWCASE_PROMPT = {
  title: 'The Realtor Growth Strategy prompt',
  subtitle: 'A high-leverage prompt that demonstrates good prompting',
  lines: [
    {
      text: 'You are an expert real estate business coach for agents working in Burbank, CA.',
      tag: 'Role + locality',
      color: 'var(--c-electric)'
    },
    {
      text: 'I am a realtor with [N] active listings. My biggest challenge right now is [LEAD GEN / CONVERSION / WINNING LISTINGS].',
      tag: 'Concrete context',
      color: 'var(--c-amber)'
    },
    {
      text: "Before answering, ask me 3 questions you'd need to give specific advice — not generic guidance.",
      tag: 'Make it ask first',
      color: 'var(--c-violet)'
    },
    {
      text: 'Then, based on my answers, give me:',
      tag: null
    },
    {
      text: '  1. The single highest-leverage move I can make this week',
      indent: true
    },
    {
      text: '  2. Two things I should stop doing immediately',
      indent: true
    },
    {
      text: '  3. One creative idea I probably haven\'t considered',
      indent: true
    },
    {
      text: 'Be direct, specific, and skip filler.',
      tag: 'Tone control',
      color: 'var(--c-teal)'
    }
  ]
}

export default function Slide08_WhatAICanDo() {
  const [activeIdx, setActiveIdx] = useState(null)
  const [showcaseOpen, setShowcaseOpen] = useState(false)

  return (
    <>
      <SlideFrame>
        {/* Custom header — title left, showcase button + presenter right */}
        <div className="flex items-start justify-between gap-6"
             style={{ marginBottom: 'var(--sp-7)' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0"
          >
            <div className="text-stage-eyebrow font-sans" style={{ color: 'var(--c-electric)', marginBottom: 'var(--sp-3)' }}>
              What AI Can Do
            </div>
            <h2 className="font-sans display-sans text-stage-h2 gradient-text-bright">
              Six concrete categories.
            </h2>
          </motion.div>

          <div className="flex items-center gap-4 shrink-0">
            <SamplePromptButton onClick={() => setShowcaseOpen(true)} />
            <PresenterChip presenterId="romik" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 flex-1 min-h-0">
          {categories.map((c, i) => (
            <CategoryCard key={c.n} {...c} delay={0.3 + i * 0.07} onClick={() => setActiveIdx(i)} />
          ))}
        </div>
      </SlideFrame>

      {/* Per-card example prompt modal (existing) */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" onClick={() => setActiveIdx(null)} />
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="relative glass-strong rounded-3xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-white/8 flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                       style={{ color: categories[activeIdx].accent }}>
                    {categories[activeIdx].pillLabel}
                  </div>
                  <h3 className="display-sans text-3xl text-white leading-tight">
                    {categories[activeIdx].title}
                  </h3>
                </div>
                <button onClick={() => setActiveIdx(null)}
                        className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition shrink-0">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-8 py-7">
                <div className="text-xs uppercase tracking-[0.2em] text-white/65 mb-3 font-bold">Try this prompt</div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-5 font-mono text-base text-white/95 leading-relaxed">
                  "{categories[activeIdx].examplePrompt}"
                </div>
                <div className="text-sm text-white/65 mt-4 italic font-serif">
                  Copy → paste into Claude or ChatGPT → fill in your own details.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showcase prompt modal — a beautifully animated reveal */}
      <ShowcasePromptModal open={showcaseOpen} onClose={() => setShowcaseOpen(false)} />
    </>
  )
}

/** Top-right button — opens the showcase prompt */
function SamplePromptButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 rounded-2xl font-semibold transition-all"
      style={{
        padding: '12px 20px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-electric) 22%, transparent), color-mix(in srgb, var(--c-violet) 18%, transparent))',
        border: '1px solid color-mix(in srgb, var(--c-electric) 50%, transparent)',
        color: '#fff',
        boxShadow: '0 8px 28px -10px color-mix(in srgb, var(--c-electric) 60%, transparent)'
      }}
    >
      <Sparkles className="h-5 w-5" style={{ color: 'var(--c-electric-soft)' }} />
      <span>Sample Prompt</span>
      <span className="font-sans uppercase font-bold rounded-full px-2 py-0.5"
            style={{
              fontSize: '10px',
              letterSpacing: '0.18em',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff'
            }}>
        LIVE
      </span>
    </motion.button>
  )
}

/* ============================================================================
   Showcase Prompt Modal — beautifully animated reveal of a high-leverage
   prompt that demonstrates good prompting practice.

   Animation choreography:
   1. Backdrop fades in, blurs
   2. Modal scales up from below with spring
   3. Header sparkle line traces left-to-right
   4. Each prompt line fades in sequentially, with technique tag sliding in
      from the right
   5. "Copy" CTA pulses subtly
   ============================================================================ */
function ShowcasePromptModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'rgba(7, 6, 15, 0.94)' }} onClick={onClose} />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.92, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="relative rounded-3xl w-full max-w-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0E0C20 0%, #0A0820 100%)',
              border: '1px solid color-mix(in srgb, var(--c-electric) 35%, var(--border-base))',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 60px -20px color-mix(in srgb, var(--c-electric) 30%, transparent)'
            }}
          >
            {/* Sparkle trace along top edge */}
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--c-electric), var(--c-violet), transparent)' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Header */}
            <div className="px-9 py-7 border-b border-white/8 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="rounded-xl flex items-center justify-center shrink-0"
                     style={{
                       height: '56px', width: '56px',
                       background: 'linear-gradient(135deg, var(--c-electric), var(--c-violet))',
                       boxShadow: '0 8px 28px -8px color-mix(in srgb, var(--c-electric) 70%, transparent)'
                     }}>
                  <Wand2 className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans uppercase font-bold text-white/65"
                       style={{ fontSize: '12px', letterSpacing: '0.22em', marginBottom: '4px' }}>
                    SAMPLE PROMPT · BURBANK CHAMBER
                  </div>
                  <h3 className="display-sans text-white leading-tight"
                      style={{ fontSize: '32px' }}>
                    {SHOWCASE_PROMPT.title}
                  </h3>
                  <div className="display-serif text-white/85 leading-snug"
                       style={{ fontSize: '17px', fontStyle: 'italic', marginTop: '4px' }}>
                    {SHOWCASE_PROMPT.subtitle}
                  </div>
                </div>
              </div>
              <button onClick={onClose}
                      className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Prompt body */}
            <div className="px-9 py-8" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <div className="font-sans uppercase font-bold text-white/55 flex items-center gap-2"
                   style={{ fontSize: '12px', letterSpacing: '0.22em', marginBottom: 'var(--sp-4)' }}>
                <BookOpen className="h-3.5 w-3.5" />
                The prompt
              </div>

              <div className="font-mono leading-relaxed text-white"
                   style={{ fontSize: '17px' }}>
                {SHOWCASE_PROMPT.lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.13, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start justify-between gap-6"
                    style={{
                      padding: '8px 0',
                      borderBottom: i < SHOWCASE_PROMPT.lines.length - 1 ? '1px dashed rgba(255,255,255,0.06)' : 'none',
                      paddingLeft: line.indent ? '20px' : 0,
                      color: line.indent ? 'rgba(255,255,255,0.85)' : '#fff'
                    }}
                  >
                    <span className="flex-1 min-w-0">{line.text}</span>
                    {line.tag && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85 + i * 0.13, duration: 0.5 }}
                        className="font-sans uppercase font-bold rounded-full whitespace-nowrap shrink-0"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.22em',
                          padding: '4px 10px',
                          color: line.color,
                          background: `color-mix(in srgb, ${line.color} 14%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${line.color} 38%, transparent)`
                        }}
                      >
                        {line.tag}
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + SHOWCASE_PROMPT.lines.length * 0.13, duration: 0.55 }}
              className="px-9 py-6 border-t border-white/8 flex items-center justify-between gap-4"
            >
              <div className="display-serif text-white/85 italic" style={{ fontSize: '17px' }}>
                Replace the brackets. Paste into Claude or ChatGPT. Watch what happens.
              </div>
              <button
                onClick={() => {
                  const text = SHOWCASE_PROMPT.lines.map(l => l.text).join('\n')
                  navigator.clipboard?.writeText(text)
                }}
                className="inline-flex items-center gap-2 rounded-xl font-semibold transition-all"
                style={{
                  padding: '10px 18px',
                  fontSize: '15px',
                  background: 'linear-gradient(135deg, var(--c-electric), var(--c-violet))',
                  color: '#fff',
                  boxShadow: '0 8px 24px -8px color-mix(in srgb, var(--c-electric) 70%, transparent)'
                }}
              >
                <Check className="h-4 w-4" /> Copy prompt
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Compact 6-up category card — bigger text, real button CTA. */
function CategoryCard({ n, pillLabel, title, tagline, items, accent, delay, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="deck-card group flex flex-col"
      style={{ '--card-accent': accent, padding: '22px 24px' }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: '10px' }}>
        <div className="font-mono font-bold inline-flex items-center px-2.5 py-1 rounded"
             style={{
               fontSize: '13px',
               backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
               color: accent,
               border: `1px solid color-mix(in srgb, ${accent} 36%, transparent)`
             }}>
          {n}
        </div>
      </div>

      <div className="font-sans uppercase font-bold"
           style={{ fontSize: '13px', letterSpacing: '0.22em', color: accent, marginBottom: '6px' }}>
        {pillLabel}
      </div>

      <div className="display-sans text-white leading-[1.05]"
           style={{ fontSize: '30px', marginBottom: '8px' }}>
        {title}
      </div>

      <div className="display-serif text-white/95 leading-snug"
           style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '14px' }}>
        {tagline}
      </div>

      <div className="bg-white/12" style={{ height: '1px', marginBottom: '12px' }} />

      <ul className="flex flex-col" style={{ gap: '8px', marginBottom: '14px' }}>
        {items.map((item, j) => (
          <li key={j} className="flex items-start gap-2.5 text-white/95"
              style={{ fontSize: '18px' }}>
            <Check className="shrink-0" strokeWidth={3}
                   style={{ color: accent, height: '16px', width: '16px', marginTop: '6px' }} />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all"
        style={{
          padding: '12px 16px',
          fontSize: '15px',
          color: accent,
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 38%, transparent)`
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `color-mix(in srgb, ${accent} 22%, transparent)` }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `color-mix(in srgb, ${accent} 12%, transparent)` }}
      >
        <Sparkles className="h-4 w-4" />
        See example prompt
        <span aria-hidden="true">→</span>
      </button>
    </motion.div>
  )
}
