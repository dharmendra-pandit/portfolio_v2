// Zero-token checks that run before any model call.

export const MAX_INPUT_CHARS = 300

const GREETING = /^(hi+|hey+|hello+|yo|hola|namaste|good (morning|afternoon|evening)|thanks?( you)?|thank u|ok(ay)?|cool|nice|great)[\s!.?]*$/i

// Requests that are clearly not about the portfolio owner. Kept deliberately
// narrow so genuine questions ("can he write REST APIs?") still reach the model.
const OFF_TOPIC = [
  /```/,
  // Imperative writing requests ("write me a python script…"), but not "did he write…?"
  /^\s*(please\s+)?((can|could|will|would)\s+you\s+)?(write|generate|create|compose|draft|make|build)\b.{0,40}\b(code|program|script|function|essay|poem|story|song|lyrics|email|letter|article|blog|app)\b/i,
  /\b(solve|debug|fix|explain)\s+(this|my|the following)\s+(code|bug|error|problem|equation|question)\b/i,
  /\btranslate\b/i,
  /\b(recipe|weather|horoscope|lottery|stock price|crypto price)\b/i,
  /\btell me a joke\b/i,
  /\b(ignore|forget|disregard)\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)\b/i,
  /\b(system prompt|your instructions|jailbreak|developer mode|DAN mode)\b/i,
]

export type GuardResult =
  | { kind: 'ok' }
  | { kind: 'greeting' }
  | { kind: 'off-topic' }
  | { kind: 'invalid'; message: string }

export function checkQuestion(text: string): GuardResult {
  const q = text.trim()
  if (q.length < 2) return { kind: 'invalid', message: 'Please type a question.' }
  if (q.length > MAX_INPUT_CHARS) {
    return { kind: 'invalid', message: `Please keep questions under ${MAX_INPUT_CHARS} characters.` }
  }
  if (GREETING.test(q)) return { kind: 'greeting' }
  if (OFF_TOPIC.some((re) => re.test(q))) return { kind: 'off-topic' }
  return { kind: 'ok' }
}

/** Normalise a first-turn question so repeat clicks on suggestions hit the answer cache. */
export function cacheKey(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}
