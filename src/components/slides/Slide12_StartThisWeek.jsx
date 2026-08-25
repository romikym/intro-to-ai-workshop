import { motion } from 'framer-motion'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import Timeline from '../effects/Timeline'

const steps = [
  {
    n: '01',
    title: 'Pick one tool',
    body: 'Claude or ChatGPT — commit to one for two weeks.'
  },
  {
    n: '02',
    title: 'Pick one task',
    body: 'Something you do every week: listing descriptions, buyer follow-ups, social posts.'
  },
  {
    n: '03',
    title: 'Spend 30 minutes',
    body: 'One focused session. Show examples, give context, iterate.'
  },
  {
    n: '04',
    title: 'Save your best prompt',
    body: 'When a prompt works, save it. That\'s now an asset.'
  },
  {
    n: '05',
    title: 'Add one task per week',
    body: 'By week six, AI is handling six recurring tasks for you.',
    accent: true
  }
]

export default function Slide12_StartThisWeek() {
  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="Start This Week"
        title={<>Pick one tool. <em className="gradient-text italic">Pick one task.</em></>}
        presenter="romik"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-white/65 text-xl lg:text-2xl -mt-6 mb-16 max-w-3xl leading-relaxed"
      >
        Don't try to overhaul everything. Start small, save what works, expand week by week.
      </motion.p>

      <div className="flex-1 flex flex-col justify-center">
        <Timeline steps={steps} delayBase={0.6} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.7 }}
        className="text-center mt-12"
      >
        <div className="font-serif text-3xl lg:text-4xl text-white/95 italic">
          Six weeks from now, that's <span className="gradient-text">six recurring tasks off your plate.</span>
        </div>
      </motion.div>
    </SlideFrame>
  )
}
