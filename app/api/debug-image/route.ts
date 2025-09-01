import { NextResponse } from "next/server"

const hasApiKey = !!process.env.OPENAI_API_KEY
console.log("API Key present:", hasApiKey)
console.log("API Key prefix:", process.env.OPENAI_API_KEY?.substring(0, 7))

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
  return ETHNIC_GROUPS[hash % ETHNIC_GROUPS.length]
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Configuration Error",
          details: "OPENAI_API_KEY not found in environment variables",
          solution: "Add OPENAI_API_KEY to V0 environment settings",
        },
        { status: 500 },
      )
    }

    const { word, category } = await req.json()

    if (!word || !category) {
      return NextResponse.json({ error: "Missing word or category" }, { status: 400 })
    }

    const familyType = getDiversityRotation(word)

    const apiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3", // Use dall-e-3 as fallback since gpt-image-1 might not be available
        prompt: `Simple cartoon of a diverse ${familyType}. Parent teaching child the word "${word}". All text in English only.`,
        n: 1,
        size: "1024x1024",
      }),
    })

    const responseText = await apiResponse.text()
    console.log("API Response Status:", apiResponse.status)
    console.log("API Response:", responseText)

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error: "OpenAI API Error",
          status: apiResponse.status,
          details: responseText,
          headers: Object.fromEntries(apiResponse.headers.entries()),
        },
        { status: apiResponse.status },
      )
    }

    const data = JSON.parse(responseText)

    return NextResponse.json({
      success: true,
      imageUrl: data.data[0].url,
      model: "dall-e-3",
      prompt: `Word: ${word}`,
      familyType: familyType,
    })
  } catch (error: any) {
    console.error("Debug route error:", error)

    return NextResponse.json(
      {
        error: "Server Error",
        message: error?.message || "Unknown error",
        type: error?.constructor?.name || "Error",
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 },
    )
  }
}
