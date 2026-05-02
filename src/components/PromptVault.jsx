import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookmarkCheck, Star, Copy, Check, Mail, Search, Sparkles, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'intro-ai-prompt-vault-favorites-v1'

/**
 * Curated prompt library — every example prompt from across the deck,
 * organized by category. Audience can browse, favorite, copy, and email.
 *
 * To add a prompt: add an entry to PROMPTS with category + text + (optional) note.
 */
const PROMPTS = [
  // Customer communication
  { id: 'cc-1', category: 'Customer Communication', tags: ['restaurant', 'reviews'], text: 'Reply to this 2-star Yelp review about a cold pizza, in a warm Burbank-local tone, owner-signed.' },
  { id: 'cc-2', category: 'Customer Communication', tags: ['service'], text: 'Draft a friendly text reminder for a 9am Burbank dental appointment tomorrow for a returning patient. Tone: neighborly, never corporate.' },
  { id: 'cc-3', category: 'Customer Communication', tags: ['service'], text: 'Write a polished post-meeting summary for a marketing strategy call with a Burbank gym owner — positive, confident, action-oriented.' },
  { id: 'cc-4', category: 'Customer Communication', tags: ['retail'], text: 'A customer DM\'d asking if a sweater would fit a 5\'9" woman who normally wears medium. Draft a friendly, helpful reply that does not over-promise.' },

  // Marketing & content
  { id: 'mc-1', category: 'Marketing & Content', tags: ['social'], text: 'Take this product launch announcement and create: an Instagram post, a LinkedIn post, an email subject line, and 3 ad headlines.' },
  { id: 'mc-2', category: 'Marketing & Content', tags: ['restaurant'], text: 'Draft an Instagram caption for tonight\'s special at a Burbank trattoria: handmade pumpkin ravioli with sage butter. Make it warm, local, not over-stylized.' },
  { id: 'mc-3', category: 'Marketing & Content', tags: ['retail'], text: 'Write a 2-sentence product description for a "vintage cream linen blazer, women\'s size M, $148" — voice should be confident and Magnolia Park boutique-feeling, not corporate.' },
  { id: 'mc-4', category: 'Marketing & Content', tags: ['retail', 'ads'], text: 'Generate 3 Meta ad headline variations for a Burbank candle shop\'s holiday collection — short, sensory, no clichés.' },

  // Operations & admin
  { id: 'op-1', category: 'Operations & Admin', tags: ['meetings'], text: 'Here is my 45-minute meeting transcript. Give me decisions made, action items by owner, and a 3-sentence summary.' },
  { id: 'op-2', category: 'Operations & Admin', tags: ['meetings'], text: 'Turn this rough meeting note into a clean follow-up email: "Talked w/ Sarah re: branding refresh, she likes the moodboard, wants to add navy, send revised pricing by Friday."' },
  { id: 'op-3', category: 'Operations & Admin', tags: ['inbox'], text: 'I have 47 unread emails. Help me think through how to triage them in 15 minutes — what should I look at first, what can wait, what should I just delete?' },
  { id: 'op-4', category: 'Operations & Admin', tags: ['inbox'], text: 'Summarize this 40-message thread in 3 bullet points. Focus on what was decided and what is still open.' },

  // Coach / consultant
  { id: 'cc2-1', category: 'Coach / Consultant', tags: ['repurpose'], text: 'I gave a 30-minute talk on "the cost of saying yes too fast." Give me: 1 LinkedIn post, 1 newsletter intro paragraph, and 3 hooks for short-form video — no buzzwords.' },
  { id: 'cc2-2', category: 'Coach / Consultant', tags: ['repurpose'], text: 'Take this single insight and reformat it for 3 audiences: "Most founders confuse motion with progress." → LinkedIn post, an email subject line, and a 30-second video script.' },
  { id: 'cc2-3', category: 'Coach / Consultant', tags: ['email'], text: 'Outline a 5-day email mini-course for small business owners titled "The 4 questions every Friday."' },

  // Trades & home services
  { id: 'tr-1', category: 'Trades & Home Services', tags: ['quotes'], text: 'Turn this voice-memo dictation into a professional written quote: "Hey it\'s Mike, just left the Patel house in Burbank, kitchen reno, want quartz counters about 60 sqft, demo existing tile, install soft-close cabinets, ballpark twelve to fifteen grand parts and labor, 4 weeks start to finish."' },
  { id: 'tr-2', category: 'Trades & Home Services', tags: ['customer'], text: 'Write a polite "running 15 minutes late" text from a Burbank plumber to a customer — warm, owns it, no excuses.' },
  { id: 'tr-3', category: 'Trades & Home Services', tags: ['follow-up'], text: 'Draft a follow-up email 3 days after a roofing estimate: friendly nudge, no pressure, restates the price.' },

  // Decision support / research
  { id: 'rs-1', category: 'Research & Analysis', tags: ['competitive'], text: 'Read these 6 competitor websites. What do they all promise? What do they all leave out? Where is the opening for me?' },
  { id: 'rs-2', category: 'Research & Analysis', tags: ['data'], text: 'Here is 12 months of sales data. Which days are dead? What product moves on Tuesdays vs Saturdays? What should I bundle?' },

  // Habits / good prompting
  { id: 'hb-1', category: 'Better Prompting', tags: ['structure'], text: 'Before drafting this proposal, ask me 5 questions you need answered to do it well.' },
  { id: 'hb-2', category: 'Better Prompting', tags: ['iterate'], text: 'Make this 30% shorter, drop the buzzwords, and add a specific example from a Burbank business.' },
  { id: 'hb-3', category: 'Better Prompting', tags: ['voice'], text: 'Write 3 more posts in the same voice as this one: [paste your best Instagram caption].' }
]

const CATEGORIES = ['All', ...Array.from(new Set(PROMPTS.map(p => p.category)))]

function loadFavorites() {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch { return new Set() }
}

function saveFavorites(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {}
}

export default function PromptVault({ open, onClose }) {
  const [favorites, setFavorites] = useState(() => loadFavorites())
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    if (open) setFavorites(loadFavorites())
  }, [open])

  const visible = useMemo(() => {
    let list = PROMPTS
    if (category !== 'All') list = list.filter(p => p.category === category)
    if (showFavOnly) list = list.filter(p => favorites.has(p.id))
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.text.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [category, showFavOnly, query, favorites])

  function toggleFav(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites(next)
      return next
    })
  }

  async function copyOne(id, text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // Fallback: select & copy via temporary textarea
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    }
  }

  function emailFavorites() {
    const favPrompts = PROMPTS.filter(p => favorites.has(p.id))
    if (favPrompts.length === 0) {
      alert('Tap the star on prompts you like first, then email yourself the list.')
      return
    }
    const subject = encodeURIComponent('My AI prompt vault — Intro to AI workshop')
    const body = encodeURIComponent([
      'My favorite prompts from the Intro to AI workshop:',
      '',
      ...favPrompts.flatMap((p, i) => [
        `${i + 1}. ${p.category}`,
        `"${p.text}"`,
        ''
      ]),
      '— Sent from the Intro to AI workshop deck'
    ].join('\n'))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  function clearFavorites() {
    if (favorites.size === 0) return
    if (!confirm(`Clear all ${favorites.size} favorite prompts?`)) return
    setFavorites(new Set())
    saveFavorites(new Set())
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: 'var(--bg-base)', opacity: 0.92 }}
            onClick={onClose}
          />

          <motion.div
            className="relative glass-strong rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-5 border-b" style={{ borderColor: 'var(--border-base)' }}>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    Prompt Vault · {PROMPTS.length} prompts · {favorites.size} saved
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                    Your take-home prompt library.
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition shrink-0"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search prompts…"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/8 transition border border-white/8 focus:border-cyan-400/40 text-sm"
                />
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setShowFavOnly(!showFavOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                    showFavOnly
                      ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-200'
                      : 'bg-white/5 border-white/10 text-white/65 hover:border-white/25'
                  }`}
                >
                  <Star className={`h-3 w-3 inline mr-1 ${showFavOnly ? 'fill-yellow-300' : ''}`} />
                  Favorites ({favorites.size})
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                      category === c
                        ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-white/65 hover:border-white/25'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto elegant-scroll px-6 sm:px-8 py-5">
              {visible.length === 0 ? (
                <div className="text-center text-white/45 py-12">
                  {showFavOnly ? 'No favorites yet — tap the star on prompts you want to save.' : 'No prompts match.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {visible.map(p => (
                    <PromptRow
                      key={p.id}
                      prompt={p}
                      favorited={favorites.has(p.id)}
                      onToggleFav={() => toggleFav(p.id)}
                      onCopy={() => copyOne(p.id, p.text)}
                      copied={copiedId === p.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 sm:px-8 py-4 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: 'var(--border-base)' }}>
              <button
                onClick={emailFavorites}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold transition hover:scale-[1.01]"
              >
                <Mail className="h-4 w-4" />
                Email me my favorites ({favorites.size})
              </button>
              {favorites.size > 0 && (
                <button
                  onClick={clearFavorites}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-white/60 hover:text-red-300 transition border border-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PromptRow({ prompt, favorited, onToggleFav, onCopy, copied }) {
  return (
    <div
      className="group rounded-xl border p-4 hover:border-cyan-400/30 transition"
      style={{ borderColor: 'var(--border-base)', backgroundColor: 'var(--bg-card)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 font-semibold">
          {prompt.category}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onToggleFav}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
              favorited ? 'text-yellow-300' : 'text-white/40 hover:text-yellow-300'
            }`}
            aria-label={favorited ? 'Unfavorite' : 'Favorite'}
            title={favorited ? 'Saved to favorites' : 'Save to favorites'}
          >
            <Star className={`h-4 w-4 ${favorited ? 'fill-yellow-300' : ''}`} />
          </button>
          <button
            onClick={onCopy}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-cyan-300 transition"
            aria-label="Copy"
            title="Copy prompt"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        {/* Always visible favorite indicator */}
        {favorited && (
          <div className="opacity-100 group-hover:opacity-0 transition">
            <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
          </div>
        )}
      </div>
      <div className="font-mono text-sm text-white/90 leading-relaxed">
        {prompt.text}
      </div>
    </div>
  )
}

/**
 * Floating action button (FAB) that opens the vault. Shown on every slide.
 * Positioned bottom-left so it doesn't clash with bottom-right chrome.
 */
export function PromptVaultFAB({ onOpen }) {
  const [count, setCount] = useState(() => loadFavorites().size)

  useEffect(() => {
    function syncCount() {
      setCount(loadFavorites().size)
    }
    window.addEventListener('storage', syncCount)
    // Also poll occasionally for same-tab updates
    const t = setInterval(syncCount, 1500)
    return () => {
      window.removeEventListener('storage', syncCount)
      clearInterval(t)
    }
  }, [])

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      onClick={onOpen}
      className="fixed bottom-20 left-6 z-30 group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition"
      aria-label="Open prompt vault"
      title="My prompt vault"
    >
      <BookmarkCheck className="h-4 w-4" />
      <span className="hidden sm:inline">Prompts</span>
      {count > 0 && (
        <span className="ml-0.5 h-5 min-w-[20px] px-1.5 rounded-full bg-yellow-300 text-yellow-900 text-[11px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </motion.button>
  )
}
