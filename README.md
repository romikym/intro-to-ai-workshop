# Introduction to AI — Workshop Presentation

An interactive keynote-style presentation for the Burbank Chamber AI workshop.
Presented by **Romik Hacobian** (Media City Design) and **Jim Festante** (Healthe Habits).

Built with Vite + React + Three.js + Framer Motion. Live AI demos powered by the Anthropic Claude API via a Netlify function.

---

## Quick start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run with Netlify Dev (serves the function + Vite together)
npx netlify dev

# OR — to run only the Vite dev server (live demos won't work)
npm run dev
```

Open `http://localhost:8888` (Netlify Dev) or `http://localhost:5173` (Vite-only).

> **For live demos to work, you must use `netlify dev`** — it serves both the React app and the `/.netlify/functions/chat` proxy that holds your API key.

---

## Deploying to Netlify

### Option 1 — Drag and drop (fastest)

```bash
npm run build
```

Then drag the `dist` folder to Netlify Drop (https://app.netlify.com/drop).

After deploy:
1. Open your site in Netlify
2. Site settings → **Environment variables**
3. Add `ANTHROPIC_API_KEY` with your key from https://console.anthropic.com/settings/keys
4. Redeploy

### Option 2 — Connect a Git repo

1. Push this folder to a GitHub repo
2. Netlify → **Add new site** → Import from Git
3. Build settings auto-detected from `netlify.toml`
4. Site settings → **Environment variables** → add `ANTHROPIC_API_KEY`
5. Trigger deploy

The `netlify/functions/chat.js` function deploys automatically.

---

## Presenter guide

### Keyboard shortcuts (during the talk)

| Key | What it does |
|---|---|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` | Jump to slide 1 |
| `End` | Jump to last slide |
| `1`–`9` | Jump to slide by number |
| `S` | Toggle speaker notes (your talking points for the current slide) |
| `O` | Slide overview — click any thumbnail to jump |
| `B` | Blackout the screen (press B again to restore) |
| `F` | Toggle fullscreen |
| `Esc` | Close any overlay |

### Tips for delivery

1. **Open in fullscreen** before you start. Press `F`.
2. **Speaker notes** — press `S` on any slide to see Jim's or Romik's talking points. Press `S` again to hide.
3. **The live demos are real.** On slides 9, 10, 11, and 13 you can take audience suggestions and run them live. The demos are wired to Claude via the Netlify function.
4. **If Wi-Fi fails** during a live demo, just close the modal and continue — the slide content is self-contained.

### Demo moments to plan around

- **Slide 3 — What AI Is.** The token prediction visualizer auto-cycles through three examples. Let it run while you explain "statistical middle." This visual sells the whole argument.
- **Slide 9 — Meet the Major AI Models.** Click "Try a live demo with Claude." Take an audience suggestion. Type it in. Press Enter. Let them watch it generate.
- **Slide 10 — Real Businesses, Real Use.** Six industry cards. Click any one. The suggested prompts are pre-loaded with Burbank-specific examples. Best move: ask the audience for THEIR business and generate something live for them.
- **Slide 11 — Four Habits.** Scroll down to "See habit #1 in action." Click "Run both prompts" to fire both side-by-side. Watch the difference.
- **Slide 13 — Questions.** Click "Or ask Claude live" to take a question and answer it in real time with the room.

---

## Project structure

```
intro-to-ai-workshop/
├── netlify/functions/chat.js     # Anthropic API proxy (holds the API key)
├── netlify.toml                  # Netlify build config
├── public/favicon.svg            # Favicon
├── src/
│   ├── App.jsx                   # Presentation shell (nav, transitions, overlays)
│   ├── main.jsx                  # Entry
│   ├── index.css                 # Tailwind + custom utilities
│   ├── components/
│   │   ├── NeuralSphere.jsx      # WebGL background sphere
│   │   ├── LiveChat.jsx          # Modal AI chat overlay
│   │   ├── TokenPrediction.jsx   # Slide 3's prediction visualizer
│   │   ├── SlideFrame.jsx        # Reusable slide layout components
│   │   └── slides/
│   │       ├── Slide01_Title.jsx
│   │       ├── ...
│   │       └── Slide13_Questions.jsx
│   ├── hooks/useKeyboard.js      # Keyboard navigation
│   └── lib/
│       ├── chat.js               # Client-side wrapper for the API
│       └── slides.js             # Slide metadata + speaker notes
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Edit speaker notes

Speaker notes for each slide live in `src/lib/slides.js`. Edit the `notes` array on any slide entry.

### Add or remove slides

1. Create a new component in `src/components/slides/`
2. Import and add it to `SLIDE_COMPONENTS` in `src/App.jsx`
3. Add a corresponding entry to `slidesMeta` in `src/lib/slides.js`
4. Add a sphere config entry in `SPHERE_CONFIG` in `App.jsx`

### Tweak the visual style

- **Colors and fonts** — `tailwind.config.js`
- **Background gradients and grain** — `src/index.css`
- **WebGL sphere intensity** — `SPHERE_CONFIG` in `src/App.jsx`
- **Slide transitions** — `App.jsx`, the `motion.div` wrapping each slide

---

## Troubleshooting

**"API key not configured"** — You haven't set `ANTHROPIC_API_KEY` in Netlify environment variables (or in your local `.env` if running `netlify dev`).

**Live demos return errors** — Check the browser console. If you see `Failed to fetch /.netlify/functions/chat`, you're running `npm run dev` instead of `netlify dev`. The function only runs under Netlify Dev.

**Sphere not animating / WebGL issues** — Make sure your browser supports WebGL2. Try Chrome or Edge.

**Slow startup** — The first load fetches Three.js and Framer Motion. Subsequent loads are cached.

---

## Credits

Design and engineering: **Media City Design** (Burbank, CA)
Workshop content: **Jim Festante** & **Romik Hacobian**

© 2026 Media City Design LLC
