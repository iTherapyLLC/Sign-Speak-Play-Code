import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.SIGN_SPEAK_API_KEY?.trim()

  if (!apiKey) {
    return NextResponse.json({
      error: "No API key found",
      envVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("sign")),
    })
  }

  console.log(`[v0] Debug: API key found, length: ${apiKey.length}, prefix: ${apiKey.substring(0, 8)}...`)

  try {
    // Try their health check or status endpoint
    console.log("[v0] Debug: Trying Sign-Speak status endpoint...")
    const response = await fetch("https://api.sign-speak.com/v1/status", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    console.log(`[v0] Debug: Status endpoint response: ${response.status}`)
    const data = await response.text()
    console.log(`[v0] Debug: Status response data: ${data}`)

    if (response.status === 404) {
      // Try alternative endpoints
      console.log("[v0] Debug: Status endpoint 404, trying alternative endpoints...")

      const endpoints = [
        "https://api.sign-speak.com/health",
        "https://api.sign-speak.com/v1/health",
        "https://api.sign-speak.com/status",
        "https://api.sign-speak.com/v1/produce-sign",
        "https://api.sign-speak.com/produce-sign",
      ]

      for (const endpoint of endpoints) {
        console.log(`[v0] Debug: Trying endpoint: ${endpoint}`)
        const testResponse = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        })
        console.log(`[v0] Debug: ${endpoint} returned ${testResponse.status}`)

        if (testResponse.status !== 404) {
          const testData = await testResponse.text()
          return NextResponse.json({
            workingEndpoint: endpoint,
            status: testResponse.status,
            data: testData,
            apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
          })
        }
      }
    }

    return NextResponse.json({
      status: response.status,
      data: data,
      apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
      message:
        response.status === 404
          ? "All endpoints returned 404 - API might be down or key invalid"
          : "Status check complete",
    })
  } catch (error) {
    console.error("[v0] Debug: Error testing Sign-Speak API:", error)
    return NextResponse.json({
      error: "Failed to connect to Sign-Speak API",
      details: error instanceof Error ? error.message : "Unknown error",
      apiKeyPrefix: `${apiKey.substring(0, 8)}...`,
    })
  }
}
