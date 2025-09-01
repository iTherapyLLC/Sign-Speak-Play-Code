import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const word = body.word || body.text

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    const apiKey = process.env.SIGNSPEAKAPIKEY || process.env.SIGN_SPEAK_API_KEY

    console.log("[v0] Environment variable check:")
    console.log("[v0] SIGNSPEAKAPIKEY exists:", !!process.env.SIGNSPEAKAPIKEY)
    console.log("[v0] SIGN_SPEAK_API_KEY exists:", !!process.env.SIGN_SPEAK_API_KEY)
    console.log("[v0] Final API key exists:", !!apiKey)
    console.log(
      "[v0] Available env vars containing 'SIGN':",
      Object.keys(process.env).filter((k) => k.includes("SIGN")),
    )

    if (!apiKey) {
      console.error("[v0] Sign-Speak API key not found in environment variables")
      console.error("[v0] This is likely a V0 fork issue - environment variables didn't transfer properly")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const wordLower = word.toLowerCase().trim()
    console.log(`[v0] Processing sign for: "${wordLower}"`)

    console.log(`[v0] Sign-Speak API key exists: ${!!apiKey}`)
    console.log(`[v0] Sign-Speak API key starts with: ${apiKey?.substring(0, 10)}`)

    let response = await fetch("https://api.sign-speak.com/produce-sign", {
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

    console.log(`MALE avatar response: ${response.status}`)

    if (response.status !== 200) {
      console.log(`MALE avatar unavailable for "${wordLower}", trying FEMALE`)

      response = await fetch("https://api.sign-speak.com/produce-sign", {
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

      console.log(`FEMALE avatar response: ${response.status}`)
    }

    if (response.status === 200) {
      const blob = await response.blob()
      console.log(`Success! Video size: ${blob.size} bytes`)

      return new Response(blob, {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    console.log(`No avatar available for "${wordLower}"`)
    return NextResponse.json({ error: `The sign for "${word}" isn't available right now` }, { status: 404 })
  } catch (error) {
    console.error("[v0] Sign-Speak API error:", error)
    return NextResponse.json({ error: "The sign service isn't available right now" }, { status: 500 })
  }
}
