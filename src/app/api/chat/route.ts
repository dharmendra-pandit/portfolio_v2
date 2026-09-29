import { PROFILE } from '@/data/portfolio'
import { SYSTEM_PROMPT, REFUSAL } from '@/lib/assistant/knowledge'
import { cacheKey, checkQuestion } from '@/lib/assistant/guard'

export const maxDuration = 30

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const MODEL = 'deepseek-flash'
const MAX_OUTPUT_TOKENS = 280
const HISTORY_TURNS = 4 // last 2 exchanges are enough context for follow-ups
const GREETING_REPLY =
  "Hi! Ask me anything about Dharmendra — his projects, skills, experience, or how to get in touch."

type ChatMessage = { role: 'user' | 'assistant'; content: string }

// ---------- Best-effort, per-instance protection (no external services) ----------

const RATE = { perMinute: 8, perDay: 60 }
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < day)
  const lastMinute = recent.filter((t) => now - t < 60_000).length
  if (lastMinute >= RATE.perMinute || recent.length >= RATE.perDay) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.delete(hits.keys().next().value!)
  return false
}

// ---------- Weekly budget: hard cap on DeepSeek calls across all visitors ----------

const WEEKLY_LIMIT = 50
const WEEKLY_LIMIT_REPLY = `The assistant has answered all the questions it can this week. Please email Dharmendra at ${PROFILE.email} — he'd be happy to help.`
let localWeek = { id: '', count: 0 }

/** UTC date of this week's Monday, e.g. "2026-09-28". */
function weekId(now = new Date()) {
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

/**
 * Reserves one model call from this week's budget; false once it's spent.
 * Uses Upstash Redis (REST) when configured so the count is shared by every
 * serverless instance; otherwise falls back to a per-instance counter.
 */
async function takeWeeklySlot() {
  const id = weekId()
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

  if (url && token) {
    try {
      const key = `chat:week:${id}`
      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify([['INCR', key], ['EXPIRE', key, 8 * 24 * 60 * 60]]),
        signal: AbortSignal.timeout(3_000),
      })
      const [incr] = (await res.json()) as { result?: number }[]
      if (typeof incr?.result === 'number') return incr.result <= WEEKLY_LIMIT
    } catch (err) {
      console.error('[chat] weekly counter unavailable, using in-memory count', err)
    }
  }

  if (localWeek.id !== id) localWeek = { id, count: 0 }
  localWeek.count += 1
  return localWeek.count <= WEEKLY_LIMIT
}

// First-turn answers are identical for everyone (suggested questions especially),
// so serve repeats from memory instead of paying for them again.
const answers = new Map<string, { text: string; at: number }>()
const ANSWER_TTL = 6 * 60 * 60 * 1000

function cachedAnswer(key: string) {
  const hit = answers.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > ANSWER_TTL) {
    answers.delete(key)
    return null
  }
  return hit.text
}

function remember(key: string, text: string) {
  if (answers.size >= 200) answers.delete(answers.keys().next().value!)
  answers.set(key, { text, at: Date.now() })
}

// ---------- Helpers ----------

const text = (body: string, init?: ResponseInit & { source?: string }) =>
  new Response(body, {
    ...init,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init?.source ? { 'X-Chat-Source': init.source } : {}),
    },
  })

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 40) return null
  const out: ChatMessage[] = []
  for (const m of input) {
    if (!m || typeof m !== 'object') return null
    const { role, content } = m as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    out.push({ role, content })
  }
  return out[out.length - 1].role === 'user' ? out : null
}

// ---------- Route ----------

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return text('Invalid request.', { status: 400 })
  }

  const messages = parseMessages((body as { messages?: unknown })?.messages)
  if (!messages) return text('Invalid request.', { status: 400 })

  const question = messages[messages.length - 1].content.trim()
  const verdict = checkQuestion(question)
  if (verdict.kind === 'invalid') return text(verdict.message, { status: 400 })
  if (verdict.kind === 'greeting') return text(GREETING_REPLY, { source: 'rule' })
  if (verdict.kind === 'off-topic') return text(REFUSAL, { source: 'rule' })

  const isFirstTurn = messages.length === 1
  const key = cacheKey(question)
  if (isFirstTurn) {
    const cached = cachedAnswer(key)
    if (cached) return text(cached, { source: 'cache' })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (rateLimited(ip)) {
    return text("You're asking a lot quickly — please wait a minute and try again.", { status: 429 })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return text('The assistant is not configured yet.', { status: 503 })

  if (!(await takeWeeklySlot())) return text(WEEKLY_LIMIT_REPLY, { status: 429, source: 'budget' })

  // Trim history: only recent turns, and clip long assistant replies.
  const history = messages.slice(-HISTORY_TURNS).map((m) => ({
    role: m.role,
    content: m.role === 'assistant' ? m.content.slice(0, 600) : m.content.slice(0, 300),
  }))

  let upstream: Response
  try {
    upstream = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        // System prompt first and byte-identical every time → prefix cache hits.
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        thinking: { type: 'disabled' }, // no reasoning tokens for simple Q&A
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
        stream: true,
        stream_options: { include_usage: true },
      }),
      signal: AbortSignal.timeout(25_000),
    })
  } catch (err) {
    console.error('[chat] upstream request failed', err)
    return text('The assistant is unavailable right now. Please try again shortly.', { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    console.error('[chat] upstream error', upstream.status, await upstream.text().catch(() => ''))
    return text('The assistant is unavailable right now. Please try again shortly.', { status: 502 })
  }

  // Re-stream DeepSeek's SSE as plain text chunks.
  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let answer = ''

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const data = line.startsWith('data:') ? line.slice(5).trim() : ''
            if (!data || data === '[DONE]') continue
            try {
              const chunk = JSON.parse(data)
              const delta: string | undefined = chunk.choices?.[0]?.delta?.content
              if (delta) {
                answer += delta
                controller.enqueue(encoder.encode(delta))
              }
              if (chunk.usage && process.env.NODE_ENV === 'development') {
                const u = chunk.usage
                console.info(
                  `[chat] tokens in=${u.prompt_tokens} (cache hit ${u.prompt_cache_hit_tokens ?? 0}) out=${u.completion_tokens}`,
                )
              }
            } catch {
              // Ignore keep-alives / partial lines.
            }
          }
        }
        if (isFirstTurn && answer.trim()) remember(key, answer.trim())
      } catch (err) {
        console.error('[chat] stream interrupted', err)
        if (!answer) controller.enqueue(encoder.encode('Sorry, something went wrong. Please try again.'))
      } finally {
        controller.close()
      }
    },
    cancel() {
      reader.cancel().catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Chat-Source': 'model',
    },
  })
}
