import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EXAMPLES = [
  { prompt: 'The cat sat on the', predictions: [
    { token: ' mat', prob: 0.42 }, { token: ' couch', prob: 0.18 },
    { token: ' floor', prob: 0.11 }, { token: ' bed', prob: 0.08 },
    { token: ' chair', prob: 0.06 }
  ]},
  { prompt: 'Burbank is famous for', predictions: [
    { token: ' its', prob: 0.31 }, { token: ' the', prob: 0.22 },
    { token: ' being', prob: 0.14 }, { token: ' Warner', prob: 0.09 },
    { token: ' media', prob: 0.07 }
  ]},
  { prompt: 'The customer wanted a refund because', predictions: [
    { token: ' the', prob: 0.38 }, { token: ' they', prob: 0.21 },
    { token: ' he', prob: 0.11 }, { token: ' she', prob: 0.10 },
    { token: ' it', prob: 0.07 }
  ]}
]

/**
 * TokenPrediction — same compact card, BIGGER type for stage readability.
 * No height growth — text only.
 */
export default function TokenPrediction() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [stage, setStage] = useState('typing')

  const example = EXAMPLES[exampleIdx]
  const top = example.predictions[0]

  useEffect(() => {
    setStage('typing')
    const t1 = setTimeout(() => setStage('predicting'), 1200)
    const t2 = setTimeout(() => setStage('revealed'), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [exampleIdx])

  useEffect(() => {
    const t = setTimeout(() => setExampleIdx((i) => (i + 1) % EXAMPLES.length), 6500)
    return () => clearTimeout(t)
  }, [exampleIdx])

  return (
    <div className="w-full">
      {/* Prompt + predicted token */}
      <div className="font-mono leading-tight flex items-baseline flex-wrap"
           style={{ fontSize: '34px', marginBottom: '18px' }}>
        <span className="text-white/95">{example.prompt}</span>
        <AnimatePresence mode="wait">
          {stage !== 'typing' && (
            <motion.span
              key={`${exampleIdx}-${stage}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="gradient-electric font-semibold"
            >
              {top.token}
            </motion.span>
          )}
        </AnimatePresence>
        {stage === 'typing' && <span className="caret text-white/85" />}
      </div>

      {/* Section label */}
      <div className="font-sans uppercase font-bold text-white/65"
           style={{ fontSize: '15px', letterSpacing: '0.22em', marginBottom: '12px' }}>
        Next-token probability
      </div>

      {/* Probability bars — bigger labels and percentages */}
      <div className="flex flex-col" style={{ gap: '10px' }}>
        {example.predictions.map((pred, i) => {
          const isWinner = i === 0
          const visible = stage !== 'typing'
          return (
            <motion.div
              key={`${exampleIdx}-${pred.token}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -10 }}
              transition={{ delay: visible ? i * 0.06 : 0, duration: 0.35 }}
              className="flex items-center gap-3"
            >
              <div className="font-mono text-white/95 shrink-0 text-right"
                   style={{ width: '130px', fontSize: '20px' }}>
                "{pred.token.trim()}"
              </div>
              <div className="flex-1 bg-white/8 rounded-full overflow-hidden" style={{ height: '8px' }}>
                <motion.div
                  className={`h-full rounded-full ${isWinner ? 'bg-gradient-to-r from-accent-cyan to-accent-indigo' : 'bg-white/30'}`}
                  initial={{ width: 0 }}
                  animate={{ width: visible ? `${pred.prob * 100}%` : 0 }}
                  transition={{ delay: visible ? 0.25 + i * 0.06 : 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="font-mono text-white/85 tabular-nums shrink-0"
                   style={{ width: '60px', fontSize: '20px' }}>
                {(pred.prob * 100).toFixed(0)}%
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer caption — bigger, brighter */}
      <div className="flex items-end justify-between gap-4" style={{ marginTop: '16px' }}>
        <motion.p
          className="text-white/85 leading-snug max-w-md"
          style={{ fontSize: '17px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === 'revealed' ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          It doesn't "know" the answer — it predicts the most statistically likely next token.
        </motion.p>
        <div className="flex gap-2 shrink-0">
          {EXAMPLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setExampleIdx(i)}
              className={`rounded-full transition-all ${i === exampleIdx ? 'w-7 bg-accent-cyan' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
              style={{ height: '6px' }}
              aria-label={`Example ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
