import { NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"

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
  like: "comment",
  "i love you": "affection",
  love: "affection",
  "love you": "affection",
  hug: "affection",
  kiss: "affection",
}

const STOCK_IMAGE_FALLBACKS: Record<string, string> = {
  like: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
  no: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
  stop: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
  more: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
  want: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
  help: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
  yes: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  go: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
  happy: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  sad: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
  default: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
}

const ETHNIC_GROUPS = [
  "Asian family",
  "Black family",
  "White family",
  "Latino family",
  "Indigenous family",
  "Pacific Islander family",
]

function getDiversityRotation(word: string): string {
  const hash = word.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % ETHNIC_GROUPS.length
  return ETHNIC_GROUPS[index]
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json()

    const validation = validateInput(word)
    if (!validation.valid) {
      console.log("[v0] Content filter blocked word:", word)
      return NextResponse.json(
        {
          error: validation.message || "Invalid input",
          suggestions: validation.suggestions,
          fallback: true,
        },
        { status: 400 },
      )
    }

    const apiKey = process.env.FLUX_API_KEY

    if (!apiKey) {
      console.error("Flux API key not found")
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        wordFunction: WORD_FUNCTIONS[word.toLowerCase()] || "request",
        fallback: true,
        fallbackReason: "API key not configured",
      })
    }

    const wordFunction = WORD_FUNCTIONS[word.toLowerCase()] || "request"
    const diversityGroup = getDiversityRotation(word)

    const improvedPrompts: Record<string, string> = {
      response: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) to communicate "${word}".
Parent kneeling at toddler's eye level, demonstrating the concept with clear gestures.
Toddler watching attentively with curious expression.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Bright, clean family home, natural daylight.`,

      request: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) to request "${word}".
Parent holding desired item just out of toddler's reach, waiting for communication attempt.
Toddler reaching toward item with eager, wanting expression.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Bright kitchen, natural daylight, snack time scenario.`,

      refusal: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) to refuse "${word}".
Parent offering item to toddler, toddler turning away or pushing item with clear "no" expression.
Parent accepting refusal with understanding smile.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Kitchen table, mealtime, natural daylight.`,

      command: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) the command "${word}".
Parent waiting patiently while toddler tries to communicate a need.
Toddler looking up at parent for help with a task.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Living room, natural daylight, problem-solving moment.`,

      question: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) to ask "${word}".
Parent holding two choices at toddler's eye level.
Toddler looking thoughtfully at options, deciding which to choose.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Kitchen or playroom, natural daylight, choice-making moment.`,

      comment: `Documentary photograph: PARENT teaching TODDLER (18-36 months old baby) to express "${word}".
Parent and toddler sharing attention on an interesting object or book.
Both showing genuine engagement and connection.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
Setting: Cozy reading area, natural daylight, bonding moment.`,

      affection: `Documentary photograph: PARENT expressing love to their TODDLER (18-36 months old baby).
Parent hugging, holding, or cuddling their small toddler child.
Both parent and toddler smiling warmly, showing loving parent-child bond.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler).
This is PARENTAL LOVE - a mother or father with their baby child.
Setting: Cozy living room, natural daylight, nurturing family moment.`,
    }

    const basePrompt = improvedPrompts[wordFunction] || improvedPrompts["request"]

    console.log(`[v0] Generating image for word: ${word} with function: ${wordFunction}, diversity: ${diversityGroup}`)

    const response = await fetch("https://fal.run/fal-ai/flux-pro", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${basePrompt}

SUBJECT REQUIREMENTS (CRITICAL - DO NOT DEVIATE):
- Exactly ONE adult parent (mother or father, age 25-40)
- Exactly ONE toddler child (MUST be visibly 18-36 months old - a BABY/TODDLER, small child)
- Show ${diversityGroup} with authentic, natural representation
- This is a PARENT teaching their TODDLER child to communicate

PHOTOGRAPHY STYLE:
- Professional documentary/editorial photography
- Natural window lighting, soft shadows
- Clean, modern family home environment
- Warm, authentic emotional connection

ABSOLUTE RESTRICTIONS (NEVER INCLUDE):
- NO romantic or adult couple imagery
- NO teenagers or older children (child MUST be a toddler/baby)
- NO two adults together without a toddler
- NO text, labels, or watermarks
- NO inappropriate content of any kind
- This is ONLY for teaching communication to TODDLERS`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 4.0,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: 2,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Flux error:", error)

      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default

      return NextResponse.json({
        imageUrl: fallbackUrl,
        wordFunction: wordFunction,
        fallback: true,
        fallbackReason: "API error - using curated image",
      })
    }

    const data = await response.json()

    if (!data.images?.[0]?.url) {
      const fallbackUrl = STOCK_IMAGE_FALLBACKS[word.toLowerCase()] || STOCK_IMAGE_FALLBACKS.default
      return NextResponse.json({
        imageUrl: fallbackUrl,
        wordFunction: wordFunction,
        fallback: true,
        fallbackReason: "Invalid image response - using curated image",
      })
    }

    return NextResponse.json({
      imageUrl: data.images[0].url,
      wordFunction: wordFunction,
      safetyChecked: true,
      aiGenerated: true,
    })
  } catch (error) {
    console.error("Visual generation error:", error)
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
