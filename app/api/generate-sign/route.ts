import { type NextRequest, NextResponse } from "next/server"
import { isInappropriate, suggestAlternative } from "@/app/lib/content-filter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Frontend sends { word: "..." } so we need to accept 'word'
    const word = body.word || body.text

    console.log("[v0] API request received for word:", word)

    if (!word) {
      console.log("[v0] No word in request body:", body)
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    if (isInappropriate(word)) {
      console.log("[v0] Blocked inappropriate word:", word)
      return NextResponse.json({ error: suggestAlternative(word) }, { status: 400 })
    }

    const apiKey = process.env.SIGNSPEAKAPIKEY
    console.log("[v0] API key found:", apiKey ? `Yes (${apiKey.substring(0, 8)}...)` : "No")

    if (!apiKey) {
      console.error("[v0] API key not found")
      return NextResponse.json(
        {
          error: `The sign for "${word}" isn't available right now`,
        },
        { status: 404 },
      )
    }

    const wordLower = word.toLowerCase().trim()
    console.log("[v0] Making Sign-Speak API request for:", wordLower)

    const response = await fetch("https://api.sign-speak.com/produce-sign", {
      method: "POST",
      headers: {
        "X-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english: wordLower,
        request_class: "BLOCKING",
        identity: "FEMALE",
        model_version: "SLP.2.xs",
      }),
    })

    console.log("[v0] Sign-Speak API response status (FEMALE):", response.status)

    if (!response.ok) {
      console.log("[v0] FEMALE avatar failed, trying MALE avatar fallback...")
      const fallbackResponse = await fetch("https://api.sign-speak.com/produce-sign", {
        method: "POST",
        headers: {
          "X-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english: wordLower,
          request_class: "BLOCKING",
          identity: "MALE",
          model_version: "SLP.2.xs",
        }),
      })

      console.log("[v0] Sign-Speak API response status (MALE):", fallbackResponse.status)

      if (!fallbackResponse.ok) {
        console.log("[v0] Both avatars failed for:", wordLower)
        return NextResponse.json(
          {
            error: `The sign for "${word}" isn't available right now`,
          },
          { status: 404 },
        )
      }

      const videoBlob = await fallbackResponse.blob()
      console.log("[v0] Video blob size (MALE):", videoBlob.size)
      return new Response(videoBlob, {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      })
    } else {
      const videoBlob = await response.blob()
      console.log("[v0] Video blob size (FEMALE):", videoBlob.size)
      return new Response(videoBlob, {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      })
    }
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json(
      {
        error: `The sign service isn't available right now`,
      },
      { status: 500 },
    )
  }
}
