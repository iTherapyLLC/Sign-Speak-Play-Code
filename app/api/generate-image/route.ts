import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"
import { getCachedImage, isSensitiveWord } from "@/lib/cached-images"

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

export async function POST(request: NextRequest) {
  try {
    const { word, prompt } = await request.json()

    if (!word || !prompt) {
      return NextResponse.json({ error: "Word and prompt are required" }, { status: 400 })
    }

    const validation = validateInput(word)
    if (!validation.valid) {
      console.log("[v0] Content filter blocked word:", word)
      return NextResponse.json(
        {
          error: validation.message || "Invalid input",
          suggestions: validation.suggestions,
        },
        { status: 400 },
      )
    }

    // Check sensitivity and cache
    const cachedImage = getCachedImage(word)
    const sensitive = isSensitiveWord(word)

    // SENSITIVE WORDS: Always use cache, NEVER call Flux
    if (sensitive) {
      if (cachedImage) {
        console.log(`[v0] SENSITIVE word "${word}" - using cached image (Flux blocked)`)
        return NextResponse.json({
          imageUrl: cachedImage.url,
          fromCache: true,
          sensitive: true,
          safetyChecked: true,
        })
      } else {
        // Sensitive word without cache - return error, do NOT call Flux
        console.warn(`[v0] SENSITIVE word "${word}" has no cached image - blocking Flux`)
        return NextResponse.json({
          error: "Sensitive word requires cached image - Flux generation blocked for safety",
          sensitive: true,
        }, { status: 400 })
      }
    }

    // SAFE WORDS: Try cache first
    if (cachedImage) {
      console.log(`[v0] Using cached image for safe word: ${word}`)
      return NextResponse.json({
        imageUrl: cachedImage.url,
        fromCache: true,
        sensitive: false,
        safetyChecked: true,
      })
    }

    // SAFE WORDS: No cache - try Flux generation
    console.log(`[v0] Safe word "${word}" not in cache - generating with Flux`)

    const apiKey = process.env.FLUX_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Flux API key not configured" }, { status: 500 })
    }

    const diversityGroup = getDiversityRotation(word)

    const response = await fetch("https://fal.run/fal-ai/flux-pro", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Professional photo-realistic image: ${prompt}

        Feature ${diversityGroup} with authentic representation.

        PHOTO-REALISTIC REQUIREMENTS:
        - High-quality photography style
        - Natural lighting and composition
        - Authentic parent-child interaction (ONE parent with ONE toddler aged 18-36 months)
        - Clean, family-friendly environment
        - Professional educational context

        CRITICAL SAFETY REQUIREMENTS:
        - Family-friendly content only
        - Age-appropriate scenario
        - Natural, appropriate clothing
        - Warm, nurturing interaction
        - No text in image

        ABSOLUTE RESTRICTIONS (NEVER INCLUDE):
        - NO romantic couples or dating imagery
        - NO two adults together (only ONE parent with ONE toddler)
        - NO adult romantic love scenes
        - NO teenagers or older children
        - NO beards on women, NO gender-ambiguous adults
        - NO inappropriate, suggestive, or adult content
        - This is STRICTLY for teaching communication to TODDLERS`,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: 1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Flux API error:", errorData)
      return NextResponse.json({ error: "Failed to generate image" }, { status: response.status })
    }

    const data = await response.json()
    const imageUrl = data.images?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL returned" }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
