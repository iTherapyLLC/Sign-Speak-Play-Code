import { type NextRequest, NextResponse } from "next/server"

const WORD_FUNCTIONS: Record<string, string> = {
  more: "request",
  want: "request",
  help: "request",
  please: "request",
  stop: "refusal",
  no: "refusal",
  "all done": "refusal",
  "don't want": "refusal",
  yes: "response",
  go: "command",
  come: "command",
  look: "command",
  what: "question",
  where: "question",
  happy: "comment",
  sad: "comment",
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

const GROUPS = ["Asian", "Black", "White", "Latino", "Indigenous", "Pacific Islander", "Mixed"]
const familyFor = (seed: string) =>
  GROUPS[(seed || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GROUPS.length]

const BANNED_OBJECTS = [
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
  "electrical outlet",
  "exposed socket",
  "dangling cord around neck",
  "medication",
  "pill",
  "cleaning chemical",
  "detergent",
  "bleach",
  "plastic bag over head",
  "small choking hazards like coins, button batteries, marbles",
]

const SAFE_OBJECTS = [
  "board books",
  "stuffed animals",
  "soft blocks",
  "crayons in a cup",
  "age-appropriate finger foods already prepared",
  "cups with lids",
  "bowls with cut fruit",
]

function safeSceneFor(wordRaw: string) {
  const w = wordRaw.toLowerCase().trim()
  switch (w) {
    case "don't want":
    case "dont want":
    case "no":
      return `Refusal shown safely: child uses an open-hand push-away gesture or gentle head shake; caregiver responds calmly with acceptance.
              If at a table, keep surfaces clear; absolutely no utensils or sharp objects in frame.`
    case "eat":
      return `Food context is safe: age-appropriate finger foods already prepared on plate; no knives, no cutting, no cooking, no hot surfaces.`
    case "drink":
      return `Drinks are safe: closed-lid cup or bottle; no hot beverages; no kettle, stove, or open flame.`
    case "this":
    case "that":
    case "more":
    case "help":
    case "please":
    case "thank you":
    default:
      return `Use everyday safe items (books, toys, blocks). Avoid kitchen tools, hot items, and small chokeable parts.`
  }
}

function buildSafePrompt(word: string) {
  const family = familyFor(word)

  const safetyBlock = `
SAFETY REQUIREMENTS (MANDATORY):
- Do NOT depict or show: ${BANNED_OBJECTS.join(", ")}.
- No cooking, no cutting, no hot surfaces, no medication or chemicals, no exposed outlets, no cords around neck, no sharp edges.
- If in a kitchen/dining space, keep all utensils out of frame; explicitly avoid knives.
- Use only safe, everyday objects (e.g., ${SAFE_OBJECTS.join(", ")}).
- Calm, warm expressions; no fear, threat, anger, or distress.
  `.trim()

  const sceneBlock = `
Create a medium-shot scene that teaches the word "${word}".
- Show one ${family} caregiver and one child interacting in a natural, tidy home setting.
- Hands and shared activity visible; body language clearly communicates the concept.
- ${safeSceneFor(word)}
- If you are about to include any restricted item from the list above, choose a different approach that communicates the concept safely.
- On-image text (if any) must be ENGLISH ONLY.
- Avoid stereotypes; keep it real, warm, and respectful.
  `.trim()

  const craftBlock = `
FRAMING:
- Medium shot; clean composition; natural daylight; soft shadows.
- Avoid tight headshots or studio portraits. No glamor lighting.
- No watermarks or logos.
  `.trim()

  return `${sceneBlock}\n\n${safetyBlock}\n\n${craftBlock}`
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
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        wordFunction: WORD_FUNCTIONS[word.toLowerCase()] || "request",
        fallback: true,
        fallbackReason: "API key not configured",
      })
    }

    const wordFunction = WORD_FUNCTIONS[word.toLowerCase()] || "request"
    const prompt = buildSafePrompt(word)

    console.log(`[v0] Generating safe image for word: ${word} with function: ${wordFunction}`)

    let imageUrl = await generateImage({ key, prompt })

    if (!imageUrl) {
      const softer =
        prompt +
        `
REPHRASE SAFETY: absolutely avoid knives, sharp utensils, and any hazardous items.
Prefer books, blocks, or playful scenes; if at a table, keep it clear and safe.`
      imageUrl = await generateImage({ key, prompt: softer })
    }

    if (!imageUrl) {
      const fallback = buildSafePrompt("reading together")
      imageUrl = await generateImage({ key, prompt: fallback })
    }

    if (!imageUrl) {
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        wordFunction: wordFunction,
        fallback: true,
        fallbackReason: "AI generation failed - using curated image",
      })
    }

    return NextResponse.json({
      imageUrl,
      wordFunction: wordFunction,
      safetyChecked: true,
      aiGenerated: true,
    })
  } catch (e: any) {
    console.error("[v0] Visual generation error:", e)
    const fallbackUrl = STOCK_IMAGE_FALLBACKS.default
    return NextResponse.json(
      {
        imageUrl: fallbackUrl,
        wordFunction: "request",
        fallback: true,
        fallbackReason: "System error - using curated image",
      },
      { status: 200 },
    )
  }
}
