import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    console.log("[v0] ElevenLabs API - checking environment variables")
    console.log(
      "[v0] Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("ELEVEN")),
    )

    const apiKey = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABSAPIKEY || process.env.ELEVENLABS_API_KEY
    const voiceId =
      process.env.ELEVENLABSVOICEID ||
      process.env.ELEVEN_LABS_VOICE_ID ||
      process.env.DEFAULT_ELEVENLABS_VOICE_ID ||
      "woFXsAKyuJlZXRNgNAWd"

    console.log("[v0] API Key found:", !!apiKey)
    console.log("[v0] Voice ID:", voiceId)
    const trimmedApiKey = apiKey?.trim()

    if (!trimmedApiKey) {
      console.error("[v0] ElevenLabs API key missing - please add ELEVEN_LABS_API_KEY in project settings")
      return NextResponse.json(
        {
          error:
            "ElevenLabs API key not configured. Please add ELEVEN_LABS_API_KEY in your project environment variables.",
        },
        { status: 400 },
      )
    }

    if (!text) {
      return NextResponse.json({ error: "Text parameter is required" }, { status: 400 })
    }

    console.log("[v0] Making ElevenLabs API request for text:", text.substring(0, 50) + "...")

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": trimmedApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      console.error("[v0] ElevenLabs API error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("[v0] ElevenLabs error details:", errorText)

      if (response.status === 401) {
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.detail?.message?.includes("missing the permission text_to_speech")) {
            return NextResponse.json(
              {
                error: "PERMISSIONS_ERROR",
                message:
                  "Your ElevenLabs API key doesn't have text-to-speech permissions. Please upgrade your ElevenLabs subscription or use a different API key with TTS permissions.",
              },
              { status: 401 },
            )
          }
        } catch (parseError) {
          // If we can't parse the error, fall through to generic error
        }
      }

      throw new Error(`ElevenLabs API failed: ${response.status} ${response.statusText}`)
    }

    console.log("[v0] ElevenLabs API request successful")
    const audioBuffer = await response.arrayBuffer()
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("[v0] ElevenLabs route error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
