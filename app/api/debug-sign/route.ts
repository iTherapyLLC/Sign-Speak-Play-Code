import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.SIGNSPEAKAPIKEY?.trim()

  if (!apiKey) {
    return NextResponse.json({
      error: "No API key found",
      envVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("sign")),
    })
  }

  console.log(`[v0] Debug: API key found, length: ${apiKey.length}, prefix: ${apiKey.substring(0, 8)}...`)

  try {
    console.log("[v0] Debug: Testing Sign-Speak produce-sign endpoint...")
    const response = await fetch("https://api.sign-speak.com/produce-sign", {
      method: "POST",
      headers: {
        "X-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english: "hello",
        request_class: "BLOCKING",
        identity: "MALE",
        model_version: "SLP.2.xs",
      }),
    })

    console.log(`[v0] Debug: produce-sign endpoint response: ${response.status}`)

    if (response.status === 200) {
      const blob = await response.blob()
      console.log(`[v0] Debug: Success! Video blob size: ${blob.size} bytes`)
      return NextResponse.json({
        status: response.status,
        message: "API key is working correctly",
        videoSize: blob.size,
        apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
      })
    } else {
      const errorText = await response.text()
      console.log(`[v0] Debug: Error response: ${errorText}`)
      return NextResponse.json({
        status: response.status,
        error: errorText,
        apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
      })
    }
  } catch (error) {
    console.error("[v0] Debug: Error testing Sign-Speak API:", error)
    return NextResponse.json({
      error: "Failed to connect to Sign-Speak API",
      details: error instanceof Error ? error.message : "Unknown error",
      apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
    })
  }
}
