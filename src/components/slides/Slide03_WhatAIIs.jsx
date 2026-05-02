import { motion } from 'framer-motion'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import TokenPrediction from '../TokenPrediction'

export default function Slide03_WhatAIIs() {
  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="What AI Is"
        title="It does not know things."
        presenter="jim"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 flex-1 min-h-0 items-stretch">
        {/* Live token prediction demo — fixed-height deck-card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="deck-card flex flex-col justify-center"
          style={{ '--card-accent': 'var(--c-electric)' }}
        >
          <TokenPrediction />
        </motion.div>

        {/* Argument */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col justify-center"
          style={{ gap: 'var(--sp-5)' }}
        >
          <Point delay={0.8}>
            An <span className="display-serif" style={{ fontStyle: 'italic', color: 'var(--c-electric)' }}>LLM</span> predicts the next most likely word. Built to sound confident — not to be accurate.
          </Point>

          <Point delay={1.0}>
            Using it as a search engine or factual checker exposes a small business to <span className="font-medium" style={{ color: 'var(--c-electric)' }}>massive liability</span>.
          </Point>

          <Point delay={1.2}>
            It predicts the <span className="display-serif" style={{ fontStyle: 'italic' }}>statistical middle</span>. Therefore AI guarantees <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>average</span> output.
          </Point>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="border-t border-white/10"
            style={{ paddingTop: 'var(--sp-5)', marginTop: 'var(--sp-3)' }}
          >
            <div className="display-sans text-white" style={{ fontSize: 'var(--fs-h4)', lineHeight: 1.05 }}>
              Average kills{' '}
              <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>local brands.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function Point({ children, delay }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="text-white/85 leading-snug"
      style={{ fontSize: 'var(--fs-body-lg)' }}
    >
      {children}
    </motion.p>
  )
}
