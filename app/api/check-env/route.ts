import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    signSpeak: !!(process.env.SIGNSPEAKAPIKEY || process.env.SIGN_SPEAK_API_KEY),
    openai: !!(process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY),
    eleven: !!(process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABSAPIKEY),
    voiceId: !!process.env.DEFAULT_ELEVENLABS_VOICE_ID,
    nodeEnv: process.env.NODE_ENV,
  })
}
