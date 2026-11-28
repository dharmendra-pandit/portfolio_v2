'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, MessageCircle, X } from 'lucide-react'
import { PROFILE } from '@/data/portfolio'
import { getLenis } from '@/lib/scroll'
import { cn } from '@/lib/utils'

type Msg = { role: 'user' | 'assistant'; content: string }
type Usage = { count: number; since: number }

const MAX_CHARS = 300
const HISTORY_SENT = 4
const MAX_QUESTIONS = 3
const USAGE_KEY = 'dp-assistant-usage'
const USAGE_WINDOW = 24 * 60 * 60 * 1000
const SUGGESTIONS = [
  'What is his current role?',
  'Which AI projects has he built?',
  'What is his technical stack?',
  'How can I contact him?',
]
const LIMIT_MESSAGE = `You have reached the limit of ${MAX_QUESTIONS} questions for today. For further information, please email Dharmendra at ${PROFILE.email} or connect on ${PROFILE.links.linkedin.replace(/^https?:\/\/(www\.)?/, '')}.`
const EASE = [0.16, 1, 0.3, 1] as const
// Phones in either orientation get a full-screen panel. Matches the `compact` variant in globals.css.
const COMPACT_QUERY = '(max-width: 639.98px), (max-height: 539.98px)'
const isCompact = () => window.matchMedia(COMPACT_QUERY).matches

// Questions are counted per browser for a day, so a reload doesn't reset the limit.
function loadUsage(): Usage {
  try {
    const saved = JSON.parse(localStorage.getItem(USAGE_KEY) ?? 'null') as Usage | null
    if (saved && Date.now() - saved.since < USAGE_WINDOW) return saved
  } catch {
    // Storage unavailable (SSR, private mode) — fall back to a fresh count.
  }
  return { count: 0, since: Date.now() }
}

function countQuestion(usage: Usage): Usage {
  const next = { count: usage.count + 1, since: usage.count === 0 ? Date.now() : usage.since }
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(next))
  } catch {
    // Non-critical: the in-memory count still applies for this visit.
  }
  return next
}

export const ChatAssistant = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [usage, setUsage] = useState(loadUsage)
  const remaining = Math.max(0, MAX_QUESTIONS - usage.count)
  const limitReached = remaining === 0
  const panel = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    if (!isCompact()) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250)
      return () => clearTimeout(timer)
    }

    // Full-screen on phones: don't auto-focus (the keyboard would hide the
    // suggestions) and freeze the page behind the panel.
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // iOS doesn't shrink the layout for the on-screen keyboard, so size the
    // panel to the visual viewport to keep the input above it.
    const vv = window.visualViewport
    const fit = () => {
      if (!vv || !panel.current) return
      panel.current.style.height = `${vv.height}px`
      panel.current.style.top = `${vv.offsetTop}px`
    }
    fit()
    vv?.addEventListener('resize', fit)
    vv?.addEventListener('scroll', fit)

    return () => {
      vv?.removeEventListener('resize', fit)
      vv?.removeEventListener('scroll', fit)
      document.body.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [open])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => () => abort.current?.abort(), [])

  const close = () => {
    setOpen(false)
    // The launcher is hidden behind the full-screen panel on phones; focus it once it's back.
    requestAnimationFrame(() => launcher.current?.focus())
  }

  const ask = async (raw: string) => {
    const question = raw.trim().slice(0, MAX_CHARS)
    if (!question || busy || limitReached) return

    setUsage(countQuestion(usage))

    const next: Msg[] = [...messages, { role: 'user', content: question }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)

    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    const write = (content: string) =>
      setMessages((prev) => {
        const copy = prev.slice()
        copy[copy.length - 1] = { role: 'assistant', content }
        return copy
      })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-HISTORY_SENT) }),
        signal: controller.signal,
      })
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        write(answer)
      }
      if (!answer.trim()) write('Sorry, I could not answer that. Please try again.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') write('Connection problem — please try again.')
    } finally {
      setBusy(false)
      // On phones, re-focusing would pop the keyboard over the answer.
      if (!isCompact()) inputRef.current?.focus()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-label="Ask about Dharmendra"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: EASE }}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className="fixed bottom-24 right-6 z-[70] flex h-[min(600px,calc(100dvh-8rem))] w-[380px] origin-bottom-right flex-col overflow-hidden rounded-md border border-border bg-card shadow-[0_24px_60px_-24px_rgba(13,34,51,0.45)] compact:inset-0 compact:h-dvh compact:w-full compact:rounded-none compact:border-0"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cta font-serif text-xs font-medium text-cta-foreground">
                DP
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Ask about Dharmendra</p>
                <p className="truncate text-xs text-muted-foreground">AI assistant. Answers are based on this portfolio only.</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                className="flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-pill hover:text-foreground compact:size-11"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scroller}
              data-lenis-prevent
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              <Bubble role="assistant">
                I can answer questions about Dharmendra&apos;s experience, projects, skills and contact details.
              </Bubble>

              {messages.length === 0 && !limitReached && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-sm border border-border px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-brass/60 hover:bg-brass/10 compact:px-4 compact:py-2.5 compact:text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) =>
                m.role === 'assistant' && !m.content && busy && i === messages.length - 1 ? (
                  <TypingDots key={i} />
                ) : (
                  <Bubble key={i} role={m.role}>
                    {m.role === 'assistant' ? <Linkified text={m.content} /> : m.content}
                  </Bubble>
                ),
              )}

              {limitReached && !busy && (
                <Bubble role="assistant">
                  <Linkified text={LIMIT_MESSAGE} />
                </Bubble>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                ask(input)
              }}
              className="border-t border-border p-3"
            >
              <div className="flex items-center gap-2 rounded-sm border border-input bg-background py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-brass">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  placeholder={limitReached ? 'Question limit reached' : 'Ask about his work…'}
                  autoComplete="off"
                  maxLength={MAX_CHARS}
                  disabled={limitReached}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none compact:text-base"
                />
                <button
                  type="submit"
                  disabled={busy || limitReached || !input.trim()}
                  aria-label="Send question"
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-cta text-cta-foreground transition-opacity disabled:opacity-30 compact:size-10"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 flex justify-between gap-3 px-2 text-[11px] text-muted-foreground">
                <span>Portfolio questions only</span>
                {input.length > MAX_CHARS - 60 ? (
                  <span className="tabular-nums">
                    {input.length}/{MAX_CHARS}
                  </span>
                ) : (
                  <span className="tabular-nums">
                    {remaining}/{MAX_QUESTIONS} questions left
                  </span>
                )}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? 'Close assistant' : 'Ask the AI assistant about Dharmendra'}
        aria-expanded={open}
        className={cn(
          'fixed bottom-5 right-5 z-[70] flex size-12 items-center justify-center rounded-full bg-cta text-cta-foreground shadow-[0_12px_28px_-10px_var(--glow),0_8px_20px_-12px_rgba(13,34,51,0.6)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6',
          open && 'compact:hidden',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'chat'}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
          >
            {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </>
  )
}

function Bubble({ role, children }: { role: Msg['role']; children: React.ReactNode }) {
  return (
    <div className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap break-words rounded-md px-3.5 py-2.5 text-sm leading-relaxed',
          role === 'user' ? 'bg-cta text-cta-foreground' : 'bg-pill text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start" aria-label="Assistant is typing">
      <div className="flex gap-1 rounded-md bg-pill px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

const LINK = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|(?:github\.com|linkedin\.com|x\.com|kaggle\.com|hub\.docker\.com)\/[^\s),]+|\/[\w-]+\.pdf)/g

function Linkified({ text }: { text: string }) {
  const parts = text.split(LINK)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part
        const clean = part.replace(/[.,;:]+$/, '')
        const trailing = part.slice(clean.length)
        const href = clean.includes('@') && !clean.includes('/')
          ? `mailto:${clean}`
          : clean.startsWith('http') || clean.startsWith('/')
            ? clean
            : `https://${clean}`
        return (
          <span key={i}>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="font-medium text-brass underline decoration-brass/40 underline-offset-2 hover:decoration-brass"
            >
              {clean}
            </a>
            {trailing}
          </span>
        )
      })}
    </>
  )
}
