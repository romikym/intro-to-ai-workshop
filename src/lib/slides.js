// Slide metadata: presenter, section, speaker notes for the talk.
// These notes are visible to the presenter only (press 'S' to toggle).

export const SECTIONS = {
  PART_1: {
    id: 'part-1',
    label: 'Part 1 — The Reality Check',
    presenter: 'Jim Festante',
    company: 'Healthe Habits',
    color: 'cyan'
  },
  PART_2: {
    id: 'part-2',
    label: 'Part 2 — The Practical Playbook',
    presenter: 'Romik Hacobian',
    company: 'Media City Design',
    color: 'blue'
  }
}

export const slidesMeta = [
  {
    id: 1,
    section: 'PART_1',
    title: 'Introduction to AI',
    notes: [
      'Welcome the audience. Pace yourself — first impression matters.',
      'Introduce yourselves briefly: Romik (Media City Design) + Jim (Healthe Habits).',
      'Set the frame: "Today is not a sales pitch for AI. It is a working knowledge of what it is, what it actually does, and what it cannot replace."',
      'Promise: 30 minutes from now you will have a clear point of view AND something concrete to do this week.'
    ]
  },
  {
    id: 2,
    section: 'PART_1',
    title: 'Introduction',
    notes: [
      'The "Adopt AI or Die" narrative is a marketing line — it benefits platforms that need to recoup massive infrastructure investment.',
      'Reframe: AI is software. Brutally resource-intensive software. Each query consumes electricity and fresh water (server cooling).',
      'Stop treating it as magic. Start treating it as a tool with operating costs, biases, and limits.',
      'Key shift: Oracle (gives you answers) -> Tool (requires a skilled operator).'
    ]
  },
  {
    id: 3,
    section: 'PART_1',
    title: 'What AI Is',
    notes: [
      'Strip away the sci-fi. An LLM does not "know" anything — it predicts the next most likely token.',
      'Show the live demo: "The cat sat on the ___" — watch it predict.',
      'It is built to sound confident, not to be accurate. Using it as a search engine or legal/factual checker is a liability.',
      'It predicts the statistical middle. By design, it produces average output.',
      'Average kills local brands. If you outsource your voice to AI, your brand becomes generic.'
    ]
  },
  {
    id: 4,
    section: 'PART_1',
    title: 'Workforce Readiness',
    notes: [
      'The future workforce does not need to know how to generate AI content — they need the critical thinking skills to audit it.',
      'Outsourcing problem-solving to AI atrophies the corporate muscle for innovation (similar to how digital lobbies degrade physical social skills).',
      'AI is great for: formatting, summarizing internal transcripts, overcoming the blank page.',
      'Human stays as the driver. Always.'
    ]
  },
  {
    id: 5,
    section: 'PART_1',
    title: 'Beyond AI / Back to Basics',
    notes: [
      'The internet is flooding with cheap, synthetic AI spam. SEO is dying. Digital trust is plummeting.',
      'As digital content becomes worthless, authentic local human connection becomes a premium good.',
      'Burbank businesses have a massive advantage. Lean into physical storefronts, local partnerships, community hubs.',
      'You cannot automate a handshake at a Chamber event.'
    ]
  },
  {
    id: 6,
    section: 'PART_1',
    title: 'Deployment Strategy',
    notes: [
      'Do not buy a single AI enterprise license until you have written a one-page "AI Philosophy" for your staff.',
      'Define exactly what the tool is allowed to do, and where human oversight is strictly mandatory.',
      'This is the single highest-leverage thing a small business can do in 2026.',
      'Hand-off to Romik: "Now that we know what to be careful about — let us talk about what is actually working."'
    ]
  },
  {
    id: 7,
    section: 'PART_2',
    title: 'AI for Real Estate',
    notes: [
      'This half is the practical playbook.',
      'Four parts: what AI can actually do, the major tools, real use cases by industry, and how to start this week.',
      'Set the frame: "I will not show you something that does not save you time, money, or sanity."'
    ]
  },
  {
    id: 8,
    section: 'PART_2',
    title: 'Meet the AI Assistants',
    notes: [
      'DEMO MOMENT — click "Try Live Demo" to actually run a prompt.',
      'These are all chat-based assistants. They can all do most things.',
      'Frame them as smart assistants. Differences are small — mostly what each one does best.',
      'Claude: listing descriptions, analyzing contracts & disclosures, tricky client situations.',
      'ChatGPT: everyday client emails and social captions, plus image generation.',
      'Gemini: drafting in Docs, summarizing client email threads, pipeline in Sheets.',
      'Copilot: Excel deal trackers, listing-presentation decks, Outlook, Teams recap.',
      'Perplexity: neighborhood research, market data, fact-checking with sources.'
    ]
  },
  {
    id: 9,
    section: 'PART_2',
    title: 'What AI Can Do',
    notes: [
      'Six concrete categories. Hover/click each card for examples.',
      'Talk to clients: lead replies, follow-ups, review responses in your voice.',
      'Market a listing: turn one property into an MLS description, social, and email.',
      'Run your business: disclosure & inspection recaps, showing notes cleaned up.',
      'Know your market: neighborhood & comp context, competing agents, long PDFs.',
      'Make visuals: listing flyers, open-house graphics, staging & social visuals.',
      'Read the numbers: pricing from comps, which lead sources actually convert.'
    ]
  },
  {
    id: 10,
    section: 'PART_2',
    title: 'AI in Real Estate',
    notes: [
      'This is the "show, don\'t tell" slide — six live animations of AI at work in a real estate practice.',
      'Listing lifecycle: AI helps at every stage — list, market, show, offer, close.',
      'Market a listing: one property fans out into an MLS description, social posts, an email blast, and a flyer.',
      'Draft the copy: a bland MLS blurb gets rewritten into polished, on-brand listing copy.',
      'Price from comps: comparable sales inform a suggested list price.',
      'Know your market: neighborhood comps and competing listings mapped at a glance.',
      'Time to close: faster days-on-market → SOLD. Let the visuals breathe; narrate one or two.'
    ]
  },
  {
    id: 11,
    section: 'PART_2',
    title: 'Start This Week',
    notes: [
      'Do not try to overhaul everything. Pick one tool, one task, and start.',
      '1. Pick one tool (Claude or ChatGPT — do not compare ten).',
      '2. Pick one task (listing descriptions, buyer follow-ups, social posts).',
      '3. Spend 30 focused minutes on it.',
      '4. Save your best prompts — they become assets.',
      '5. Add one new task per week. By week six you have AI handling six recurring tasks.'
    ]
  },
  {
    id: 12,
    section: 'PART_2',
    title: 'Questions',
    notes: [
      'Open the floor. Audience can also use the live chat to ask anything from their phone (QR code on screen).',
      'Closing thought: "AI will not replace you. But someone using AI will."',
      'Thank the Burbank Chamber, thank the audience, exchange cards.'
    ]
  }
]

export function getSlideMeta(id) {
  return slidesMeta.find(s => s.id === id)
}
