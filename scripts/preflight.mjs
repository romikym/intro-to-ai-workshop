#!/usr/bin/env node
/**
 * Pre-push preflight check.
 * Verifies every .js / .jsx file under src/ parses successfully with
 * Babel (which understands JSX). Catches the OneDrive sync corruption
 * pattern (duplicate trailing junk past the last valid '}') before it
 * reaches the Netlify build.
 *
 * Exits 0 on success, 1 on any parse failure.
 *
 * Run manually:  npm run preflight
 * Wired as git pre-push hook via .githooks/pre-push.
 */
import { parse } from '@babel/parser'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')

// ANSI color codes — terminal-friendly output even on Windows
const RED   = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const DIM   = '\x1b[2m'
const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) {
      walk(full, out)
    } else if (entry.endsWith('.jsx') || entry.endsWith('.js')) {
      out.push(full)
    }
  }
  return out
}

function checkFile(file) {
  const code = readFileSync(file, 'utf8')

  // Quick heuristic: detect trailing junk after the last top-level '}'.
  // Pattern: a closing '}' followed by anything that isn't whitespace,
  // a comment, or another close paren/brace.
  const trailing = code.match(/}\s*\n([^\s\/].*)/s)
  // Note: babel parse will catch real syntax errors. The heuristic above
  // is informational; we rely on parse() for the actual verdict.

  try {
    parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      errorRecovery: false
    })
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      message: err.message,
      line: err.loc?.line,
      column: err.loc?.column
    }
  }
}

function main() {
  console.log(`${BOLD}preflight${RESET} ${DIM}— verifying src/ parses${RESET}`)
  let files
  try {
    files = walk(SRC)
  } catch (err) {
    console.error(`${RED}Could not walk ${SRC}:${RESET} ${err.message}`)
    process.exit(2)
  }

  const failures = []
  for (const file of files) {
    const r = checkFile(file)
    if (!r.ok) failures.push({ file, ...r })
  }

  if (failures.length === 0) {
    console.log(`${GREEN}✓${RESET} ${files.length} files parsed cleanly`)
    process.exit(0)
  }

  console.log(`${RED}${BOLD}✗ ${failures.length} file(s) failed to parse:${RESET}\n`)
  for (const f of failures) {
    const rel = relative(ROOT, f.file)
    console.log(`  ${RED}${BOLD}${rel}${RESET}`)
    console.log(`    ${YELLOW}${f.message}${RESET}`)
    if (f.line) {
      console.log(`    ${DIM}at line ${f.line}, column ${f.column}${RESET}`)
      try {
        const code = readFileSync(f.file, 'utf8').split('\n')
        const start = Math.max(0, f.line - 3)
        const end = Math.min(code.length, f.line + 1)
        for (let i = start; i < end; i++) {
          const marker = i + 1 === f.line ? `${RED}>${RESET} ` : '  '
          console.log(`    ${marker}${DIM}${String(i + 1).padStart(4)}${RESET}  ${code[i]}`)
        }
      } catch {}
    }
    console.log()
  }

  console.log(`${YELLOW}Common fix:${RESET} this is usually OneDrive sync leaving duplicate`)
  console.log(`content past a function's closing '}'. Open the file in Notepad,`)
  console.log(`scroll to the bottom, delete anything after the last valid '}',`)
  console.log(`save, and re-run.\n`)
  process.exit(1)
}

main()
