import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles, MessageCircleQuestion } from 'lucide-react'
import LiveChat from '../LiveChat'
import QRCode from '../effects/QRCode'
import AmbientParticles from '../effects/AmbientParticles'
import MagneticButton from '../effects/MagneticButton'
import AskQuestion from '../AskQuestion'
import QuestionQueue from '../QuestionQueue'
import AnswerOverlay from '../AnswerOverlay'
import PresenterContactCard from '../PresenterContactCard'
import { PRESENTERS } from '../../lib/presenters'

export default function Slide13_Questions() {
  const [chatOpen, setChatOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [contactPresenter, setContactPresenter] = useState(null)

  // QR encodes the URL with ?ask=1 so audience scans → lands here → ask modal opens directly
  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?ask=1`
    : undefined

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <AmbientParticles count={70} />

        <div className="relative w-full h-full flex items-center justify-center px-8 sm:px-12 pt-10 lg:pt-14 z-10">
          <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            {/* LEFT */}
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-stage-eyebrow text-accent-cyan mb-6 font-sans"
              >
                Q&amp;A · Take-home
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans display-sans leading-[0.9] mb-7 text-stage-h1"
              >
                <span className="gradient-text-bright">Questions</span>
                <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>?</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="relative mb-9"
                style={{ maxWidth: 'none' }}
              >
                <div className="absolute -left-3 -top-7 font-serif text-[88px] text-accent-cyan/35 leading-none select-none">
                  &ldquo;
                </div>
                <blockquote
                  className="display-serif text-white/95 leading-tight pl-6"
                  style={{ fontStyle: 'italic', fontSize: '28px', whiteSpace: 'nowrap' }}
                >
                  AI won't replace you.
                  <span className="not-italic gradient-electric font-sans display-sans"> But someone using AI will.</span>
                </blockquote>
                <div className="text-stage-eyebrow text-white/45 mt-4 pl-6">
                  — ChatGPT
                </div>
              </motion.div>

              {/* Three CTAs — primary "Ask" highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                className="space-y-3 mb-3"
              >
                {/* Primary: Ask a question */}
                <MagneticButton
                  onClick={() => setAskOpen(true)}
                  strength={0.2}
                  className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-white font-semibold shadow-2xl shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-shadow w-full sm:w-auto"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-indigo blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
                  <MessageCircleQuestion className="h-6 w-6" />
                  <span className="text-2xl">Ask a question</span>
                  <div className="ml-2 px-2.5 py-1 rounded-full bg-white/20 text-xs uppercase tracking-wider font-bold">Live</div>
                </MagneticButton>

                {/* Secondary actions row */}
                <div className="flex flex-wrap gap-3">
                  <MagneticButton
                    onClick={() => setChatOpen(true)}
                    strength={0.18}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-accent-cyan/40 text-white text-sm font-medium transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat with Claude</span>
                  </MagneticButton>
                </div>
              </motion.div>

              {/* Mini presenter strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.7 }}
                className="flex items-center gap-12 mt-10 pt-7 border-t border-white/10"
              >
                <MiniPresenter
                  name="Romik Hacobian"
                  photo="/assets/romik.jpg"
                  logo="/assets/mcd-logo.png"
                  photoPos="center 25%"
                  logoMaxH={36}
                  logoMaxW={180}
                  onClick={() => setContactPresenter(PRESENTERS.romik)}
                />
                <MiniPresenter
                  name="Jim Festante"
                  photo="/assets/jim.jpg"
                  logo="/assets/healthe-logo.png"
                  photoPos="center 30%"
                  logoMaxH={56}
                  logoMaxW={180}
                  onClick={() => setContactPresenter(PRESENTERS.jim)}
                />
                <MiniPresenter
                  name="Claude"
                  isAI={true}
                  role="Live AI · Anthropic"
                />
              </motion.div>
            </div>

            {/* RIGHT: QR — hidden on mobile (audience is already on their phone,
                no need to scan). Aligned to top so it never collides with the
                live-queue panel that floats in the bottom-right of the slide. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex flex-col items-center lg:self-start lg:pt-2"
            >
              <div className="text-xs uppercase tracking-[0.4em] text-accent-cyan/80 font-semibold mb-5 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Scan to ask a question
              </div>

              <QRCode
                size={170}
                value={qrUrl}
                label="Or take the deck home"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                className="mt-6 max-w-xs text-center"
              >
                <div className="text-white/70 text-sm leading-relaxed">
                  Submit a question right from your phone — it'll appear on this screen instantly.
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <LiveChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Open Q&A"
        subtitle="Ask anything — let's explore together"
        suggestedPrompts={[
          'Give me 3 specific ways a small Burbank business could use AI this week.',
          "What's one thing AI is genuinely bad at that humans should keep doing?",
          'Write a prompt I could use tomorrow to draft my next email newsletter.',
          'How do I write an "AI Philosophy" for a 5-person business?'
        ]}
        maxTokens={800}
      />

      <AskQuestion open={askOpen} onClose={() => setAskOpen(false)} />
      {/* Live audience-question queue — bottom-right of slide. Hidden on mobile
          (mobile users get the AskQuestion modal via the floating FAB instead). */}
      <div className="hidden lg:block">
        <QuestionQueue
          hidden={!!activeQuestion}
          onAskClaude={(q) => setActiveQuestion(q)}
        />
      </div>

      {/* Theater-mode Claude answer — full-viewport takeover when presenter
          asks Claude to answer a queued question. */}
      {activeQuestion && (
        <AnswerOverlay
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
        />
      )}

      {/* Presenter contact card — opens when audience clicks Romik or Jim */}
      <PresenterContactCard
        presenter={contactPresenter}
        open={!!contactPresenter}
        onClose={() => setContactPresenter(null)}
      />
    </>
  )
}

function MiniPresenter({ name, photo, logo, photoPos, isAI, role, logoMaxH = 36, logoMaxW = 180, onClick }) {
  // Logo container height grows with logoMaxH so taller logos (like Healthe
  // Habits) get the room they need to match MCD's wider mark visually.
  const containerH = Math.max(36, logoMaxH)
  const Wrapper = onClick ? 'button' : 'div'
  const wrapperProps = onClick
    ? { onClick, className: 'flex items-center gap-5 group cursor-pointer text-left transition hover:scale-[1.02]', title: `Save ${name}'s contact` }
    : { className: 'flex items-center gap-5' }
  return (
    <Wrapper {...wrapperProps}>
      <div className="relative shrink-0">
        <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo opacity-90" />
        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-indigo/20 blur-2xl" />
        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-ink-800 ring-2 ring-ink-950 flex items-center justify-center">
          {isAI ? (
            <ClaudeAvatar />
          ) : (
            <img src={photo} alt={name} className="h-full w-full object-cover" style={{ objectPosition: photoPos }} />
          )}
        </div>
        {isAI && (
          <span className="absolute -bottom-0.5 right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-ink-950 animate-pulse" />
        )}
      </div>
      <div>
        <div className={`display-sans text-2xl text-white leading-tight font-medium ${onClick ? 'group-hover:text-accent-cyan transition' : ''}`}>
          {name}
          {onClick && (
            <span className="ml-2 inline-block text-[10px] uppercase tracking-[0.18em] text-accent-cyan/70 font-bold align-middle">
              Save contact
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center" style={{ height: `${containerH}px` }}>
          {isAI ? (
            <ClaudeWordmark role={role} />
          ) : (
            <img
              src={logo}
              alt=""
              className="object-contain"
              style={{
                maxHeight: `${logoMaxH}px`,
                maxWidth: `${logoMaxW}px`,
                width: 'auto',
                height: 'auto',
                filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'
              }}
            />
          )}
        </div>
      </div>
    </Wrapper>
  )
}

function ClaudeAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="qcl-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#5FB6FF" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#8E4EC6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0A0820" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="qcl-spark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#5FB6FF" />
          <stop offset="100%" stopColor="#C064F0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#qcl-bg)" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(95,182,255,0.22)" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(192,100,240,0.28)" strokeWidth="0.6" />
      <path d="M50 22 L52.4 45.4 L74 50 L52.4 54.6 L50 78 L47.6 54.6 L26 50 L47.6 45.4 Z"
            fill="url(#qcl-spark)" opacity="0.95">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="22s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function ClaudeWordmark({ role }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="qcw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2997FF" />
            <stop offset="100%" stopColor="#C064F0" />
          </linearGradient>
        </defs>
        <path d="M11 1 L12 9 L20 11 L12 13 L11 21 L10 13 L2 11 L10 9 Z" fill="url(#qcw-grad)" />
      </svg>
      <span className="font-sans uppercase font-bold text-white/65" style={{ fontSize: '11px', letterSpacing: '0.22em' }}>
        {role || 'LIVE AI · ANTHROPIC'}
      </span>
    </div>
  )
}

