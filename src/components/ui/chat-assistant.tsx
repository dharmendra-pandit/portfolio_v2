'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, MessageCircle, X } from 'lucide-react'
import { PROFILE } from '@/data/portfolio'
import { useIntroDone } from '@/lib/intro'
import { cn } from '@/lib/utils'

type Msg = { role: 'user' | 'assistant'; content: string }
type Usage = { count: number; since: number }

const MAX_CHARS = 300
const HISTORY_SENT = 4
const MAX_QUESTIONS = 3
const USAGE_KEY = 'dp-assistant-usage'
const USAGE_WINDOW = 24 * 60 * 60 * 1000
const SUGGESTIONS = [
  'What does he work on?',
  'Show me his AI projects',
  "What's his tech stack?",
  'How can I contact him?',
]
const LIMIT_MESSAGE = `Thanks for chatting! You've used all ${MAX_QUESTIONS} questions for today. To know more, email Dharmendra at ${PROFILE.email} or connect on ${PROFILE.links.linkedin.replace(/^https?:\/\/(www\.)?/, '')} — he'd be happy to hear from you.`
const EASE = [0.16, 1, 0.3, 1] as const

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
  const introDone = useIntroDone()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [usage, setUsage] = useState(loadUsage)
  const remaining = Math.max(0, MAX_QUESTIONS - usage.count)
  const limitReached = remaining === 0
  const scroller = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250)
  }, [open])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => () => abort.current?.abort(), [])

  const close = () => {
    setOpen(false)
    launcher.current?.focus()
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
      inputRef.current?.focus()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask about Dharmendra"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: EASE }}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className="fixed inset-x-3 bottom-24 z-[70] flex h-[min(560px,calc(100svh-8rem))] origin-bottom-right flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] sm:inset-x-auto sm:right-6 sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-[#121f28]">
                DP
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Ask about Dharmendra</p>
                <p className="truncate text-xs text-muted-foreground">AI assistant · answers from this portfolio only</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-pill hover:text-foreground"
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
                Hi! I can tell you about Dharmendra&apos;s projects, skills, experience and how to reach him.
              </Bubble>

              {messages.length === 0 && !limitReached && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border border-coral/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-coral hover:text-[#121f28]"
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
              <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-coral">
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
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || limitReached || !input.trim()}
                  aria-label="Send question"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-coral text-[#121f28] transition-opacity disabled:opacity-40"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 flex justify-between px-2 text-[11px] text-muted-foreground">
                <span>Only portfolio questions are answered.</span>
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

      <AnimatePresence>
        {introDone && (
          <motion.button
            ref={launcher}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? 'Close assistant' : 'Ask the AI assistant about Dharmendra'}
            aria-expanded={open}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.8 }}
            className="fixed bottom-5 right-5 z-[70] flex size-14 items-center justify-center rounded-full bg-coral text-[#121f28] shadow-[0_12px_30px_-8px_rgba(255,113,91,0.6)] sm:bottom-6 sm:right-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'chat'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
              </motion.span>
            </AnimatePresence>
            {!open && messages.length === 0 && !limitReached && (
              <span className="absolute -right-0.5 -top-0.5 flex size-3.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-coral/70" />
                <span className="relative size-3.5 rounded-full border-2 border-background bg-emerald-400" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ role, children }: { role: Msg['role']; children: React.ReactNode }) {
  return (
    <div className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          role === 'user'
            ? 'rounded-br-sm bg-coral text-[#121f28]'
            : 'rounded-bl-sm bg-pill text-foreground',
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
      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-pill px-4 py-3.5">
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
              className="font-medium text-coral-ink underline decoration-coral/40 underline-offset-2 hover:decoration-coral"
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
