import { type NextRequest, NextResponse } from "next/server"

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

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const diversityGroup = getDiversityRotation(word)

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `${prompt}. 
        
        CRITICAL REQUIREMENTS:
        - All text in images must be in English only
        - Feature ${diversityGroup} with authentic cultural representation
        - Ensure equal representation across different teaching scenarios`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", errorData)
      return NextResponse.json({ error: "Failed to generate image" }, { status: response.status })
    }

    const data = await response.json()
    const imageUrl = data.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL returned" }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
