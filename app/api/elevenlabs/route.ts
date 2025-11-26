import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    const apiKey = process.env.ELEVENLABS_API_KEY
    const voiceId = process.env.DEFAULT_ELEVENLABS_VOICE_ID || "woFXsAKyuJlZXRNgNAWd"

    const trimmedApiKey = apiKey?.trim()

    if (!trimmedApiKey) {
      return NextResponse.json(
        {
          error:
            "ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY in your project environment variables.",
        },
        { status: 400 },
      )
    }

    if (!text) {
      return NextResponse.json({ error: "Text parameter is required" }, { status: 400 })
    }

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
      const errorText = await response.text()

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

    const audioBuffer = await response.arrayBuffer()
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
