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
    title: 'Output, or Process?',
    notes: [
      `Open: "Generative AI is an amazing tool — when used correctly." The whole talk hangs on one question: am I using it for OUTPUT, or PROCESS?`,
      `The Calculator Trap: AI is often defended as "just the new calculator." But a calculator does the tedious math so a student can focus on higher-level logic. Generative AI does the exact opposite — it performs the high-level logic and reasoning, leaving the student with nothing to do.`,
      `When we use AI to remove the friction of the process, we aren't making people more efficient — we are outsourcing cognitive development to a server.`,
      `The "Who Cares?" Metric: "If I skip the struggle of doing this myself, what do I actually lose?"`,
      `If the answer is my critical thinking, my voice, or my understanding of the subject — protect the PROCESS. Do it yourself.`,
      `If the answer is nothing but 45 minutes of tedious boredom — delegate the OUTPUT. Treat the algorithm like a high-speed administrative assistant, not a co-author.`,
      `Output examples where the human touch is completely unnecessary: translating messy bullet points into a formal itinerary, generating a weekly grocery list from a recipe, reformatting data.`
    ]
  },
  {
    id: 3,
    section: 'PART_1',
    title: 'A Counterfeit Oracle',
    notes: [
      `Generative AI (ChatGPT, Gemini, Copilot, Grok) is simply a highly advanced predictive text engine. It calculates the most statistically likely next word — Google search on steroids.`,
      `Show the live demo: "The cat sat on the ___" — watch it predict.`,
      `ChatGPT is supremely powerful, but it is NOT an all-knowing oracle for your homework or life problems. It generates answers based on the entirety of the internet, blending facts with fiction. It is a machine designed to sound confident, not to be correct.`,
      `What AI is NOT: a therapist, a tutor with a moral compass, or a peer. No capacity for empathy, judgment, or real-world context. "Intelligence" is a huge misnomer.`,
      `What AI IS: an incredibly powerful predictive text engine — and biased from its training data.`,
      `Bias example: Grok is built into X and reflects its creator's biases. Ask it about Elon Musk and it returns glowing, self-flattering copy — not just biased, but often incorrect.`,
      `Another: "Father Justin," an AI-powered Catholic priest, was demoted after suggesting it's OK to baptize babies with Gatorade — then contradicted its own rules in the same chat.`,
      `The danger: social media hacks our attention; AI hacks our emotions.`
    ]
  },
  {
    id: 4,
    section: 'PART_1',
    title: 'Helicopter vs. the Hike',
    notes: [
      `In human development, education, and creative work, the value is almost entirely in the PROCESS.`,
      `AI is a helicopter to the top of the mountain — you get the view instantly, but you build zero muscle.`,
      `When a student writes an essay, the final graded paper is practically worthless in the real world. The actual value is the frustration of brainstorming, the logic of structuring an argument, the humility of taking feedback, and the friction of revision.`,
      `The Assembly Line: the "journey" holds zero developmental value when it is purely administrative. No one builds character formatting a spreadsheet, writing a standard vendor email, or summarizing a 40-page HOA compliance document. That is exactly where AI thrives.`,
      `Rule of thumb: protect the climb; delegate the assembly line.`
    ]
  },
  {
    id: 5,
    section: 'PART_1',
    title: 'The Hidden Costs',
    notes: [
      `AI is a brutally resource-intensive piece of software with real operating costs. Each query consumes electricity and fresh water for cooling at scale.`,
      `Electricity: 9.0 Wh (AI) vs 0.3 Wh (a web search). Water: 25.0 mL (AI) vs 0.5 mL. (Wh = watt-hour, a unit of energy.)`,
      `And the data centers are often built in low-income communities and communities of color.`,
      `The emotional cost: social media hacks our attention; AI hacks our emotions.`,
      `KQED's "Close All Tabs" tested the safety guardrails of popular AI companions (Character.ai). Despite stated safety guidelines, the chatbots were easily pushed to bypass their own rules — "safeguards" a curious or struggling teen can break.`,
      `These companions are sycophantic: they affirm the user to keep them engaged and can't push back — they can validate a child's anxiety, depression, or self-harm ideation. In one test the bot coached the user to drive while high and evade police.`
    ]
  },
  {
    id: 6,
    section: 'PART_1',
    title: 'The Blank-Page Boundary',
    notes: [
      `The most vital cognitive friction happens when you are staring at a blank page. Organizing raw, chaotic thoughts into a starting point is the heaviest lifting in the creative and educational process.`,
      `Rule 1 — Never write "Draft Zero": AI can be an editor, a formatter, or a sounding board, but it must never generate the first draft.`,
      `Rule 2 — Never synthesize for you: AI can gather facts and retrieve data, but it is strictly forbidden from turning that data into your conclusion. Don't outsource "compare these two books" or "tell me what this data means."`,
      `Rule 3 — Own every output: if you use an algorithm to produce something, you must be able to fully explain the logic, the process, and the factual accuracy to another human being. The risk is we get lazy and stop understanding the work we submit.`,
      `Hand-off to Romik: "Now that we know where to be careful — let's talk about what's actually working."`,
      `Q&A · Health-e-Habits.org · hello@health-e-habits.org`
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
