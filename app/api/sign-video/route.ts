import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"

const videoCache = new Map<string, { data: ArrayBuffer; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour cache

let lastApiCallTime = 0
const MIN_REQUEST_INTERVAL = 3000 // 3 seconds between API calls

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, baseDelay = 5000): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If rate limited (429), wait longer and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const delay = retryAfter ? Number.parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt)

        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      return response
    } catch (error) {
      lastError = error as Error
      const delay = baseDelay * Math.pow(2, attempt)
      console.log(`Request failed, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error("Max retries exceeded")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const word = body.word || body.text

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    const validation = validateInput(word)
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.message || "Invalid input",
          suggestions: validation.suggestions,
        },
        { status: 400 },
      )
    }

    const apiKey = process.env.SIGN_SPEAK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const wordLower = word.toLowerCase().trim()
    const cacheKey = wordLower

    const cached = videoCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for "${wordLower}"`)
      return new Response(cached.data, {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
          "X-Cache": "HIT",
        },
      })
    }

    const now = Date.now()
    const timeSinceLastCall = now - lastApiCallTime
    if (timeSinceLastCall < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastCall
      console.log(`Throttling: waiting ${waitTime}ms before API call`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
    lastApiCallTime = Date.now()

    console.log(`Processing sign for: "${wordLower}"`)

    let response = await fetchWithRetry("https://api.sign-speak.com/produce-sign", {
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

    if (response.status === 404) {
      console.log(`FEMALE avatar unavailable for "${wordLower}", trying MALE`)

      // Wait before second request
      await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL))
      lastApiCallTime = Date.now()

      response = await fetchWithRetry("https://api.sign-speak.com/produce-sign", {
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
    }

    if (response.status === 200) {
      const arrayBuffer = await response.arrayBuffer()
      console.log(`Success! Video size: ${arrayBuffer.byteLength} bytes`)

      videoCache.set(cacheKey, { data: arrayBuffer, timestamp: Date.now() })

      // Clean up old cache entries (keep max 50)
      if (videoCache.size > 50) {
        const oldestKey = videoCache.keys().next().value
        if (oldestKey) videoCache.delete(oldestKey)
      }

      return new Response(arrayBuffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
          "X-Cache": "MISS",
        },
      })
    }

    if (response.status === 429) {
      return NextResponse.json(
        { error: "The sign service is busy. Please wait a few seconds and try again." },
        { status: 429 },
      )
    }

    console.log(`No avatar available for "${wordLower}"`)
    return NextResponse.json({ error: `The sign for "${word}" isn't available yet` }, { status: 404 })
  } catch (error) {
    console.error("Sign-Speak API error:", error)
    if (error instanceof Error && error.message.includes("Max retries")) {
      return NextResponse.json(
        { error: "The sign service is busy. Please wait a few seconds and try again." },
        { status: 429 },
      )
    }
    return NextResponse.json({ error: "The sign service isn't available right now" }, { status: 500 })
  }
}
