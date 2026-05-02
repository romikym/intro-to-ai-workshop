import { useState } from 'react'
import { motion } from 'framer-motion'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import LiveChat from '../LiveChat'
import PillarCard from '../effects/PillarCard'

const businesses = [
  {
    n: '01',
    pillLabel: 'Restaurant',
    title: 'Restaurant',
    tagline: 'Every review answered. Every special posted.',
    body: 'Daily Instagram from a photo. Replies to every Yelp. Promo plans from last week\'s reservations.',
    checklist: ['Yelp replies', 'Daily social'],
    theme: 'amber',
    demoTitle: 'Live demo · Restaurant',
    demoSub: 'Generating a real Yelp reply with Claude',
    suggestedPrompts: [
      'Write a warm, owner-signed reply to this 3-star Yelp review of a Burbank pizza place: "Pizza was great but service felt rushed during the dinner rush."',
      'A Burbank Italian restaurant just got their first 5-star review of the week. Write a genuine, non-corporate thank-you reply (under 60 words).',
      'Draft an Instagram caption for tonight\'s special at a Burbank trattoria: handmade pumpkin ravioli with sage butter. Make it warm, local, not over-stylized.'
    ]
  },
  {
    n: '02',
    pillLabel: 'Retail',
    title: 'Retail / E-commerce',
    tagline: 'A copywriter on every product.',
    body: '30 product descriptions in your brand voice. Meta ad variations. 80% of customer DMs handled.',
    checklist: ['Product copy', 'Ad variations'],
    theme: 'rose',
    demoTitle: 'Live demo · Retail',
    demoSub: 'Generating product copy with Claude',
    suggestedPrompts: [
      'Write a 2-sentence product description for a "vintage cream linen blazer, women\'s size M, $148" — voice should be confident and Magnolia Park boutique-feeling, not corporate.',
      'Generate 3 Meta ad headline variations for a Burbank candle shop\'s holiday collection — short, sensory, no clichés.',
      'A customer DM\'d asking if a sweater would fit a 5\'9" woman who normally wears medium. Draft a friendly, helpful reply that does not over-promise.'
    ]
  },
  {
    n: '03',
    pillLabel: 'Service',
    title: 'Service business',
    tagline: 'Recap emails, instantly.',
    body: 'Records every client call. Sends a polished recap by the time you\'re back at your desk. Drafts the proposal.',
    checklist: ['Call recaps', 'Proposal drafts'],
    theme: 'cyan',
    demoTitle: 'Live demo · Service business',
    demoSub: 'Drafting a client recap with Claude',
    suggestedPrompts: [
      'Draft a professional client recap email after a 30-minute discovery call with a Burbank dentist about updating their website. Include: 3 things we agreed on, 2 things to follow up on, and a next-step.',
      'Turn this rough meeting note into a clean follow-up email: "Talked w/ Sarah re: branding refresh, she likes the moodboard, wants to add navy, send revised pricing by Friday."',
      'Write a polished post-meeting summary for a marketing strategy call with a Burbank gym owner — positive, confident, action-oriented.'
    ]
  },
  {
    n: '04',
    pillLabel: 'Coach',
    title: 'Coach / Consultant',
    tagline: 'One talk, ten formats.',
    body: 'A 30-minute talk becomes a blog post, a LinkedIn carousel, an email newsletter, ten short-form scripts — same afternoon.',
    checklist: ['Repurpose long-form', 'LinkedIn & video'],
    theme: 'violet',
    demoTitle: 'Live demo · Coach',
    demoSub: 'Multi-format content with Claude',
    suggestedPrompts: [
      'I gave a 30-minute talk on "the cost of saying yes too fast." Give me: 1 LinkedIn post, 1 newsletter intro paragraph, and 3 hooks for short-form video — no buzzwords.',
      'Take this single insight and reformat it for 3 audiences: "Most founders confuse motion with progress." → LinkedIn post, an email subject line, and a 30-second video script.',
      'Outline a 5-day email mini-course for small business owners titled "The 4 questions every Friday."'
    ]
  },
  {
    n: '05',
    pillLabel: 'Trades',
    title: 'Trades & home services',
    tagline: 'Voice memo to written quote.',
    body: 'Drafts professional quotes from a voice memo on the drive home. Schedules follow-ups. Writes the right-tone "running late" text.',
    checklist: ['Voice → quote', 'Customer texts'],
    theme: 'emerald',
    demoTitle: 'Live demo · Trades',
    demoSub: 'Voice-memo to professional quote with Claude',
    suggestedPrompts: [
      'Turn this voice-memo dictation into a professional written quote: "Hey it\'s Mike, just left the Patel house in Burbank, kitchen reno, want quartz counters about 60 sqft, demo existing tile, install soft-close cabinets, ballpark twelve to fifteen grand parts and labor, 4 weeks start to finish."',
      'Write a polite "running 15 minutes late" text from a Burbank plumber to a customer — warm, owns it, no excuses.',
      'Draft a follow-up email 3 days after a roofing estimate: friendly nudge, no pressure, restates the price.'
    ]
  },
  {
    n: '06',
    pillLabel: 'Inbox',
    title: 'Anyone with an inbox',
    tagline: '40-message thread → three bullets.',
    body: 'Triages email by priority. Drafts replies for your review. Summarizes long threads into the decisions and the open items.',
    checklist: ['Email triage', 'Reply drafts'],
    theme: 'sky',
    demoTitle: 'Live demo · Inbox triage',
    demoSub: 'Email management with Claude',
    suggestedPrompts: [
      'I have 47 unread emails. Help me think through how to triage them in 15 minutes — what should I look at first, what can wait, what should I just delete?',
      'Summarize this 40-message thread in 3 bullet points: [paste thread]. Focus on what was decided and what is still open.',
      'Draft a polite "I\'m going to need to push our meeting to next week" email — friendly, brief, no over-explaining.'
    ]
  }
]

export default function Slide10_RealBusinesses() {
  const [activeIdx, setActiveIdx] = useState(null)
  const active = activeIdx !== null ? businesses[activeIdx] : null

  return (
    <>
      <SlideFrame>
        <SlideHeader
          eyebrow="Real Businesses, Real Use"
          title="What's working right now."
          presenter="romik"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 flex-1 content-start">
          {businesses.map((b, i) => (
            <PillarCard
              key={b.n}
              number={b.n}
              pillLabel={b.pillLabel}
              title={b.title}
              tagline={b.tagline}
              checklist={b.checklist}
              theme={b.theme}
              size="sm"
              delay={0.3 + i * 0.07}
              cta="Try this live with Claude"
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-center mt-6 text-base text-white/55 italic font-serif"
        >
          Click any industry to generate a real example live with Claude.
        </motion.div>
      </SlideFrame>

      {active && (
        <LiveChat
          open={activeIdx !== null}
          onClose={() => setActiveIdx(null)}
          title={active.demoTitle}
          subtitle={active.demoSub}
          suggestedPrompts={active.suggestedPrompts}
          maxTokens={600}
        />
      )}
    </>
  )
}
