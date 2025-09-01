import { experimental_transcribe as transcribe } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File | null

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "No audio file provided." }, { status: 400 })
    }

    const audioBuffer = await audioFile.arrayBuffer()

    const { text } = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audioBuffer,
      contentType: "audio/wav",
    })

    return NextResponse.json({ success: true, text })
  } catch (error) {
    console.error("Transcription error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      {
        success: false,
        error: "Transcription failed.",
        details: `Please ensure your OPENAI_API_KEY is set correctly. Details: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}
