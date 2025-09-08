import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "Transcription service temporarily unavailable",
      details: "This feature is currently disabled during deployment fixes",
    },
    { status: 503 },
  )
}
