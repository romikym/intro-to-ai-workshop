import { useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Eye, MessageCircleQuestion, RotateCcw, Loader2, Play } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import { askClaude, typewriter } from '../../lib/chat'
import Card3D from '../effects/Card3D'
import MagneticButton from '../effects/MagneticButton'

const habits = [
  {
    n: '01',
    icon: Quote,
    title: 'Give it context',
    body: 'Tell it who you are, who your customer is, and what "good" looks like.',
    example: 'I run a Burbank dental practice. Patients are 35–55, mostly families. Write a friendly text reminder for tomorrow\'s appointment.'
  },
  {
    n: '02',
    icon: Eye,
    title: 'Show, don\'t just tell',
    body: 'Paste an example of a tone, format, or output you like. AI is a master mimic — show it the target.',
    example: 'Write 3 more posts in the same voice as this one: [paste your best Instagram caption].'
  },
  {
    n: '03',
    icon: MessageCircleQuestion,
    title: 'Make it ask first',
    body: 'If the task is fuzzy, instruct the AI to ask you clarifying questions before answering.',
    example: 'Before drafting this proposal, ask me 5 questions you need answered to do it well.'
  },
  {
    n: '04',
    icon: RotateCcw,
    title: 'Iterate, don\'t accept',
    body: 'First answer is rarely the best. Push back: "shorter," "more specific," "less corporate."',
    example: 'Make this 30% shorter, drop the buzzwords, and add a specific example from a Burbank business.'
  }
]

export default function Slide11_FourHabits() {
  const [demoMode, setDemoMode] = useState(false)

  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="Four Habits"
        title={<>Make AI <em className="gradient-text">10× better.</em></>}
        presenter="romik"
      />

      {!demoMode ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 flex-1 content-center">
            {habits.map((h, i) => (
              <motion.div
                key={h.n}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
              >
                <Card3D intensity={0.7} className="rounded-2xl">
                  <HabitCard {...h} />
                </Card3D>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="text-center mt-8"
          >
            <MagneticButton
              onClick={() => setDemoMode(true)}
              strength={0.2}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-accent-cyan/10 border border-white/10 hover:border-accent-cyan/40 text-base text-white/85 hover:text-accent-cyan transition"
            >
              <Play className="h-4 w-4 fill-current" />
              See habit #1 in action — live comparison
            </MagneticButton>
          </motion.div>
        </>
      ) : (
        <ContextComparison onBack={() => setDemoMode(false)} />
      )}
    </SlideFrame>
  )
}

function HabitCard({ n, icon: Icon, title, body, example }) {
  return (
    <div className="relative glass rounded-2xl p-7 lg:p-8 border border-white/10 hover:border-accent-cyan/30 transition overflow-hidden">
      {/* Subtle gradient glow in corner */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent-cyan/5 blur-3xl" />

      <div className="relative flex items-start gap-5 mb-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="font-serif text-5xl shrink-0 leading-none gradient-text"
        >
          {n}
        </motion.div>
        <div className="flex-1">
          <div className="font-serif text-2xl lg:text-3xl text-white/95 mb-2.5 leading-tight">{title}</div>
          <div className="text-white/65 text-base lg:text-lg leading-relaxed">{body}</div>
        </div>
        <Icon className="h-6 w-6 text-accent-cyan/60 shrink-0" />
      </div>
      <div className="relative mt-5 pt-5 border-t border-white/8">
        <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan/80 mb-2.5 font-semibold">Try</div>
        <div className="font-mono text-sm lg:text-base text-white/75 leading-relaxed italic">
          "{example}"
        </div>
      </div>
    </div>
  )
}

function ContextComparison({ onBack }) {
  const [running, setRunning] = useState(false)
  const [bareResult, setBareResult] = useState('')
  const [bareDisplayed, setBareDisplayed] = useState('')
  const [richResult, setRichResult] = useState('')
  const [richDisplayed, setRichDisplayed] = useState('')

  const barePrompt = 'Write a text reminder for tomorrow\'s appointment.'
  const richPrompt = `I run a Burbank dental practice. Patients are 35–55, mostly families. Tone is friendly, neighborly — never corporate. Write a text reminder for tomorrow's 9am appointment for a returning patient named Sarah.`

  async function runComparison() {
    setRunning(true)
    setBareResult(''); setBareDisplayed('')
    setRichResult(''); setRichDisplayed('')

    try {
      const [bare, rich] = await Promise.all([
        askClaude(barePrompt, { maxTokens: 200 }),
        askClaude(richPrompt, { maxTokens: 200 })
      ])
      setBareResult(bare)
      setRichResult(rich)
      typewriter(bare, setBareDisplayed, { speed: 14, chunkSize: 2 })
      typewriter(rich, setRichDisplayed, { speed: 14, chunkSize: 2 })
    } catch (err) {
      setBareDisplayed('[ Error reaching the API. Make sure ANTHROPIC_API_KEY is set in Netlify environment variables. ]')
      setRichDisplayed(err.message)
    } finally {
      setTimeout(() => setRunning(false), 1500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg text-white/70">
          Same task. <span className="text-white/45">Two prompts.</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={runComparison}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-white text-base font-medium hover:shadow-lg hover:shadow-accent-cyan/30 transition disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
            {running ? 'Generating…' : 'Run both prompts'}
          </button>
          <button onClick={onBack} className="text-base text-white/50 hover:text-white/85">← Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 flex-1">
        <div className="glass rounded-2xl p-7 border border-white/10 flex flex-col">
          <div className="text-xs uppercase tracking-[0.25em] text-white/45 font-semibold mb-3">Without context</div>
          <div className="font-mono text-base text-white/75 mb-5 italic">"{barePrompt}"</div>
          <div className="flex-1 mt-3 pt-5 border-t border-white/8">
            <div className="text-xs uppercase tracking-[0.25em] text-white/45 mb-3 font-semibold">Result</div>
            <div className="font-mono text-base lg:text-lg text-white/90 leading-relaxed whitespace-pre-wrap min-h-[120px]">
              {bareDisplayed}
              {running && bareDisplayed.length < bareResult.length && <span className="caret"></span>}
            </div>
          </div>
        </div>

        <div className="gradient-border p-7 flex flex-col">
          <div className="text-xs uppercase tracking-[0.25em] text-accent-cyan font-semibold mb-3">With context</div>
          <div className="font-mono text-base text-white/85 mb-5 italic leading-relaxed">"{richPrompt}"</div>
          <div className="flex-1 mt-3 pt-5 border-t border-white/10">
            <div className="text-xs uppercase tracking-[0.25em] text-accent-cyan mb-3 font-semibold">Result</div>
            <div className="font-mono text-base lg:text-lg text-white/95 leading-relaxed whitespace-pre-wrap min-h-[120px]">
              {richDisplayed}
              {running && richDisplayed.length < richResult.length && <span className="caret"></span>}
            </div>
          </div>
        </div>
      </div>

      {bareResult && richResult && !running && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6 text-base lg:text-lg text-white/55 italic font-serif"
        >
          Same model. Same task. The difference is what you tell it.
        </motion.div>
      )}
    </motion.div>
  )
}
