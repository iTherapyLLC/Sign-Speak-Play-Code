import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const word = body.word || body.text

    console.log("[v0] API request received for word:", word)

    if (!word) {
      console.log("[v0] No word in request body:", body)
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
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

    const apiKey = process.env.SIGN_SPEAK_API_KEY
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

    const response = await fetch("https://api.sign-speak.com/v1/sign", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: wordLower,
        avatar: "FEMALE",
        format: "mp4",
      }),
    })

    console.log("[v0] Sign-Speak API response status (FEMALE):", response.status)
    console.log("[v0] Sign-Speak API response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Sign-Speak API error response (FEMALE):", errorText)

      // Try MALE avatar if FEMALE fails
      console.log("[v0] Trying MALE avatar fallback...")
      const fallbackResponse = await fetch("https://api.sign-speak.com/v1/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: wordLower,
          avatar: "MALE",
          format: "mp4",
        }),
      })

      console.log("[v0] Sign-Speak API response status (MALE):", fallbackResponse.status)

      if (!fallbackResponse.ok) {
        const fallbackErrorText = await fallbackResponse.text()
        console.log("[v0] Sign-Speak API error response (MALE):", fallbackErrorText)
        console.log("[v0] Both avatars failed for:", wordLower)
        return NextResponse.json(
          {
            error: `The sign for "${word}" isn't available right now`,
          },
          { status: 404 },
        )
      }

      const signData = await fallbackResponse.json()
      console.log("[v0] Sign-Speak API success response (MALE):", signData)
      const videoUrl = signData.videoUrl || signData.url || signData.video

      if (videoUrl) {
        console.log("[v0] Fetching video from URL:", videoUrl)
        const videoResponse = await fetch(videoUrl)
        const videoBlob = await videoResponse.blob()
        console.log("[v0] Video blob size:", videoBlob.size)
        return new Response(videoBlob, {
          headers: { "Content-Type": "video/mp4" },
        })
      }
    } else {
      const signData = await response.json()
      console.log("[v0] Sign-Speak API success response (FEMALE):", signData)
      const videoUrl = signData.videoUrl || signData.url || signData.video

      if (videoUrl) {
        console.log("[v0] Fetching video from URL:", videoUrl)
        const videoResponse = await fetch(videoUrl)
        const videoBlob = await videoResponse.blob()
        console.log("[v0] Video blob size:", videoBlob.size)
        return new Response(videoBlob, {
          headers: { "Content-Type": "video/mp4" },
        })
      }
    }

    console.log("[v0] No video URL found in response")
    return NextResponse.json(
      {
        error: `The sign for "${word}" isn't available right now`,
      },
      { status: 404 },
    )
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
