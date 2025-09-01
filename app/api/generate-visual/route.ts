import { type NextRequest, NextResponse } from "next/server"

type SocialFunction = "request" | "refusal" | "command" | "comment" | "question" | "greeting" | "farewell" | "other"

function classifyLocal(w: string): SocialFunction {
  const s = w.toLowerCase().trim()
  const starts = (...xs: string[]) => xs.some((x) => s.startsWith(x))
  const has = (...xs: string[]) => xs.some((x) => s.includes(x))

  if (starts("hi", "hello", "hey", "good morning", "good afternoon", "good evening")) return "greeting"
  if (starts("bye", "goodbye", "see you", "good night")) return "farewell"

  if (starts("where", "what", "who", "why", "how", "which") || s.endsWith("?")) return "question"

  if (starts("stop", "wait", "don't touch", "dont touch", "freeze")) return "command"
  if (starts("no", "don't", "dont", "all done", "finished", "not")) return "refusal"

  if (starts("more", "want", "help", "please", "open", "give", "go", "eat", "drink", "play", "bathroom"))
    return "request"

  if (has("this", "that", "look", "wow", "yummy", "love")) return "comment"

  return "other"
}

async function classifyWithLLM(word: string, apiKey: string): Promise<SocialFunction> {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Classify the given word/phrase into one of: request, refusal, command, comment, question, greeting, farewell, other. " +
            "Reply ONLY with the label.",
        },
        { role: "user", content: word },
      ],
    }),
  })
  const j = await r.json()
  const label = (j?.choices?.[0]?.message?.content || "").toLowerCase().trim()
  const allowed = new Set<SocialFunction>([
    "request",
    "refusal",
    "command",
    "comment",
    "question",
    "greeting",
    "farewell",
    "other",
  ])
  return allowed.has(label as SocialFunction) ? (label as SocialFunction) : "other"
}

const SCENES_BY_FUNCTION: Record<SocialFunction, string[]> = {
  request: [
    "child gestures toward desired toy; caregiver models the word while offering it",
    "child reaches for closed-lid cup; caregiver models the word and hands the cup",
    "child points to more bubbles; caregiver pauses and models the word before resuming",
  ],
  refusal: [
    "child uses open-hand push-away; caregiver calmly accepts and models the word",
    "child turns head away from offered item; caregiver models the word and offers an alternative",
  ],
  command: [
    "caregiver models an open-palm 'stop' at a doorway during play; playful, safe context with toy stop card",
    "caregiver models 'wait' while holding a toy briefly before handing it to the child",
  ],
  comment: [
    "shared book reading; caregiver and child jointly attend to a picture while modeling the word",
    "child points at an object; caregiver models the word while looking at the same object",
  ],
  question: [
    "child looks curious and points; caregiver models the word while gesturing toward the item",
    "caregiver displays two choices and models a question cue; child considers options",
  ],
  greeting: [
    "doorway wave with caregiver and child; friendly neighbor waves back",
    "park entrance; caregiver models a wave while greeting a peer and parent",
  ],
  farewell: [
    "doorway goodbye with small wave; caregiver models the word as a friend leaves",
    "end of playdate; caregiver and child wave together toward a departing peer",
  ],
  other: [
    "low-clutter living room; caregiver and child interact with safe objects (books, blocks) illustrating the intent of the word",
  ],
}

const GROUPS = ["Asian", "Black", "White", "Latino", "Indigenous", "Pacific Islander", "Mixed"]
const familyFor = (seed: string) =>
  GROUPS[(seed || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GROUPS.length]

const BANNED = [
  "knife",
  "scissors",
  "blade",
  "razor",
  "saw",
  "gun",
  "weapon",
  "syringe",
  "needle",
  "broken glass",
  "glass shard",
  "open flame",
  "lit candle",
  "matches",
  "lighter",
  "hot stove",
  "boiling pot",
  "steam",
  "exposed outlet",
  "dangling cord around neck",
  "medication",
  "pills",
  "cleaning chemicals",
  "bleach",
  "detergent",
  "plastic bag over head",
  "small choking hazards like coins, button batteries, marbles",
]

const SAFE_PROPS = [
  "board books",
  "stuffed animals",
  "blocks",
  "closed-lid cups",
  "pre-cut fruit",
  "lidded snack bowls",
  "crayons in a cup",
  "soft toys",
]

function pick<T>(arr: T[], seed: string) {
  const i = (seed || "").split("").reduce((a, c) => a * 33 + c.charCodeAt(0), 1) % arr.length
  return arr[i]
}

function buildPrompt(word: string, fn: SocialFunction) {
  const family = familyFor(word)
  const scene = pick(SCENES_BY_FUNCTION[fn], word)

  return `
Create a medium-shot, text-free teaching scene for the word "${word}".

COMMUNICATIVE FUNCTION: ${fn.toUpperCase()}
SCENE: ${scene}

FRAMING & COMPOSITION:
- ${family} caregiver and one child in a tidy, safe home (or doorway for greetings/farewells).
- Hands and shared target clearly visible; eyes toward partner/target; rule-of-thirds composition.
- Minimal props (≤3), shallow depth of field, neutral palette. Avoid busy patterns/clutter.

STRICT SAFETY (MANDATORY):
- Do NOT show: ${BANNED.join(", ")}.
- No cooking, cutting, heat, chemicals, or hazardous items; no utensils in frame.
- Child is age-appropriate with childlike proportions and **no facial hair**.

TEXT POLICY:
- **No words/letters/signage/posters/captions anywhere in the image.** No watermarks/logos.

PREFERRED SAFE PROPS:
- ${SAFE_PROPS.join(", ")}.

If any restricted item would have appeared, choose a different safe depiction that still teaches "${word}".
`.trim()
}

async function generateImage({ key, prompt }: { key: string; prompt: string }) {
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    }),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`OpenAI image error: ${text}`)
  const data = JSON.parse(text)
  return data.data?.[0]?.url || null
}

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json()
    if (!word) return NextResponse.json({ error: "Word is required" }, { status: 400 })

    const key = process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY

    console.log("[v0] Environment variable check:")
    console.log("[v0] OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log("[v0] OPENAIAPIKEY exists:", !!process.env.OPENAIAPIKEY)
    console.log("[v0] Final API key exists:", !!key)

    if (!key) {
      console.error("[v0] OpenAI API key not found in environment variables")
      const fn = classifyLocal(word)
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        functionLabel: fn,
        sceneHint: pick(SCENES_BY_FUNCTION[fn], word),
        fallback: true,
        fallbackReason: "API key not configured",
      })
    }

    let fn = classifyLocal(word)
    if (fn === "other") {
      try {
        fn = await classifyWithLLM(word, key)
      } catch {
        /* keep 'other' */
      }
    }

    const prompt = buildPrompt(word, fn)

    console.log(`[v0] Generating safe image for word: ${word} with function: ${fn}`)

    let imageUrl = await generateImage({ key, prompt })

    if (!imageUrl) {
      const fallbackPrompt = buildPrompt("reading together", "comment")
      imageUrl = await generateImage({ key, prompt: fallbackPrompt })
    }

    if (!imageUrl) {
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        functionLabel: fn,
        sceneHint: pick(SCENES_BY_FUNCTION[fn], word),
        fallback: true,
        fallbackReason: "AI generation failed - using curated image",
      })
    }

    return NextResponse.json({
      imageUrl,
      functionLabel: fn,
      sceneHint: pick(SCENES_BY_FUNCTION[fn], word),
      safetyChecked: true,
      aiGenerated: true,
    })
  } catch (e: any) {
    console.error("[v0] Visual generation error:", e)
    const fallbackUrl = STOCK_IMAGE_FALLBACKS.default
    return NextResponse.json(
      {
        imageUrl: fallbackUrl,
        functionLabel: "other",
        sceneHint: "Safe interaction with books and toys",
        fallback: true,
        fallbackReason: "System error - using curated image",
      },
      { status: 200 },
    )
  }
}

const STOCK_IMAGE_FALLBACKS: Record<string, string> = {
  like: "https://images.unsplash.com/photo-1581579438747-1dc8d173ffb9?w=800&q=80",
  no: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
  stop: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
  more: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
  want: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
  help: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
  yes: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  go: "https://images.unsplash.com/photo-1544717297-fa95b6ee125a?w=800&q=80",
  happy: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  sad: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
  default: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
}
