import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  // Audio transcription feature removed - not needed for sign language teaching app
  return NextResponse.json(
    {
      success: false,
      error: "Audio transcription is not available in this version.",
    },
    { status: 501 },
  )
}
