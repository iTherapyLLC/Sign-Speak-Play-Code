import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABSAPIKEY
    const voiceId =
      process.env.ELEVENLABSVOICEID ||
      process.env.ELEVEN_LABS_VOICE_ID ||
      process.env.DEFAULT_ELEVENLABS_VOICE_ID ||
      "21m00Tcm4TlvDq8ikWAM"

    console.log("[v0] Environment variable check:")
    console.log("[v0] ELEVENLABS_API_KEY exists:", !!process.env.ELEVENLABS_API_KEY)
    console.log("[v0] ELEVEN_LABS_API_KEY exists:", !!process.env.ELEVEN_LABS_API_KEY)
    console.log("[v0] ELEVENLABSAPIKEY exists:", !!process.env.ELEVENLABSAPIKEY)
    console.log("[v0] Final API key exists:", !!apiKey)
    console.log("[v0] Voice ID:", voiceId)
    console.log(
      "[v0] Available env vars containing 'ELEVEN':",
      Object.keys(process.env).filter((k) => k.includes("ELEVEN")),
    )

    if (!apiKey) {
      console.error("[v0] ElevenLabs API key not found in any environment variable")
      console.error("[v0] This is likely a V0 fork issue - environment variables didn't transfer properly")
      console.error("[v0] Checked variables: ELEVENLABS_API_KEY, ELEVEN_LABS_API_KEY, ELEVENLABSAPIKEY")
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    console.log("[v0] Text to convert:", text.substring(0, 100))

    const requestBody = {
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }

    console.log("[v0] ElevenLabs request body:", JSON.stringify(requestBody))

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] ElevenLabs response status:", response.status)
    console.log("[v0] ElevenLabs response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] ElevenLabs API error response:", errorData)
      return NextResponse.json({ error: "Failed to generate speech" }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()
    console.log("[v0] Generated audio buffer size:", audioBuffer.byteLength)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Text-to-speech error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
