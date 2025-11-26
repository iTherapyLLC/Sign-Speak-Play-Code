import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"

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
        - Authentic parent-child interaction
        - Clean, family-friendly environment
        - Professional educational context
        
        CRITICAL SAFETY REQUIREMENTS:
        - Family-friendly content only
        - Age-appropriate scenario
        - Natural, appropriate clothing
        - Warm, nurturing interaction
        - No text in image`,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: 2,
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
