import { type NextRequest, NextResponse } from "next/server"
import { isInappropriate, suggestAlternative } from "@/app/lib/content-filter"

const SYSTEM_PROMPT = `
You are an SLP coach. In ≤150 words, give parent-friendly, *word-specific* guidance.
Output EXACTLY these sections, no extras:

FUNCTION: <request/refusal/comment/question/social/other + 1 line why>
CONTEXTS: <3 bullet-like phrases, daily-life natural moments>
TIP: <1 specific modeling tip parents can do now>
AVOID: <1 common mistake to avoid>

Keep tone warm, concrete, and pragmatic. Do NOT repeat generic steps. Tailor to the word.
`

function normalizeWord(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/["""']/g, '"')
}

function extractFunction(analysis: string): string {
  const functionMatch = analysis.match(/FUNCTION:\s*(\w+)/i)
  if (functionMatch) {
    const func = functionMatch[1].toLowerCase()
    if (["request", "refusal", "comment", "question", "social"].includes(func)) {
      return func === "refusal" ? "refuse" : func
    }
  }
  return "request"
}

async function callGPT5(word: string) {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY

  console.log("[v0] Environment variable check:")
  console.log("[v0] OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
  console.log("[v0] OPENAIAPIKEY exists:", !!process.env.OPENAIAPIKEY)
  console.log("[v0] Final API key exists:", !!key)
  console.log(
    "[v0] Available env vars containing 'OPENAI':",
    Object.keys(process.env).filter((k) => k.includes("OPENAI")),
  )

  if (!key) {
    console.error("[v0] OpenAI API key not found in environment variables")
    console.error("[v0] This is likely a V0 fork issue - environment variables didn't transfer properly")
    console.error("[v0] Checked variables: OPENAI_API_KEY, OPENAIAPIKEY")
    throw new Error("Missing OpenAI API key")
  }

  console.log(`[v0] OpenAI API key exists: ${!!key}`)
  console.log(`[v0] OpenAI API key starts with: ${key?.substring(0, 10)}`)

  const body = {
    model: "gpt-4", // Changed from gpt-5 to gpt-4 for better availability
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Word: "${word}"\nAudience: parents teaching an autistic or minimally verbal child with sign.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 400,
  }

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  })

  if (!r.ok) {
    const error = await r.text()
    console.error(`[v0] OpenAI API error: HTTP ${r.status}: ${error}`)
    throw new Error(`OpenAI GPT-4 HTTP ${r.status}: ${error}`)
  }

  const j = await r.json()
  const text = j?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error("GPT-4 returned empty")
  return text
}

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json()
    const normalized = normalizeWord(String(word || ""))

    if (!normalized) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    if (isInappropriate(normalized)) {
      console.log("[v0] Blocked inappropriate word from analysis:", normalized)
      return NextResponse.json(
        {
          error: "Content not appropriate for educational analysis",
          suggestion: suggestAlternative(normalized),
        },
        { status: 400 },
      )
    }

    const analysis = await callGPT5(normalized)

    // Verify format
    if (!/FUNCTION:/i.test(analysis) || !/CONTEXTS:/i.test(analysis)) {
      throw new Error("GPT-4 returned unexpected format")
    }

    const communicationFunction = extractFunction(analysis)

    return NextResponse.json(
      {
        word: normalized,
        analysis,
        source: "gpt-4",
        function: communicationFunction,
        ts: Date.now(),
      },
      { status: 200, headers: { "content-type": "application/json" } },
    )
  } catch (err: any) {
    console.error("[v0] analyze-word GPT-4 error:", err?.message || err)

    // Fallback if GPT-4 fails
    const { word } = await req.json().catch(() => ({ word: "the word" }))
    const w = normalizeWord(String(word || "the word"))

    if (isInappropriate(w)) {
      return NextResponse.json(
        {
          error: "Content not appropriate for educational analysis",
          suggestion: suggestAlternative(w),
        },
        { status: 400 },
      )
    }

    const wordAnalyses: Record<string, string> = {
      want: `FUNCTION: request — core word for expressing desires and needs.

CONTEXTS: • mealtime choices • toy selection • activity preferences

TIP: Hold preferred items briefly before giving. Accept reaching, looking, or any gesture as "want." Wait 3 seconds for response.

AVOID: Requiring perfect sign before responding - honor any communication attempt immediately.`,

      no: `FUNCTION: refusal — essential boundary-setting word for rejection.

CONTEXTS: • unwanted foods • stopping activities • declining requests

TIP: Honor all "no" attempts immediately without question. Model with exaggerated head shake plus sign.

AVOID: Ignoring or overriding child's refusal signals - this breaks trust and reduces future communication.`,

      "don't want": `FUNCTION: refusal — clear rejection of offered items or activities.

CONTEXTS: • non-preferred foods • ending liked activities • refusing help

TIP: Present item, accept any negative gesture as "don't want." Model sign with firm head shake.

AVOID: Forcing child to accept after they've indicated "don't want" - respect their autonomy.`,

      more: `FUNCTION: request — continuation signal for extending enjoyable experiences.

CONTEXTS: • snack time portions • play activity turns • sensory experiences

TIP: Give small amounts initially. Pause and wait for "more" signal before continuing activity.

AVOID: Giving everything at once - eliminates natural motivation to communicate "more."`,

      help: `FUNCTION: request — assistance signal for challenging tasks.

CONTEXTS: • opening containers • reaching high items • difficult puzzles

TIP: Wait 3-5 seconds before helping. Set up slightly challenging situations. Celebrate any help-seeking attempt.

AVOID: Jumping in too quickly to help - children need time to recognize they need assistance.`,

      stop: `FUNCTION: refusal — boundary-setting word for ending activities.

CONTEXTS: • tickling games • rough play • overwhelming sensory input

TIP: Stop immediately when signed, even mid-activity. This builds trust in communication power.

AVOID: Continuing "just a little more" after stop - this teaches that their communication doesn't matter.`,
    }

    const specificFallback = wordAnalyses[w.toLowerCase()]
    const fallback =
      specificFallback ||
      `FUNCTION: request — useful for gaining access to "${w}" or indicating preference.

CONTEXTS: • mealtime choices • play choices • routines that naturally include "${w}"

TIP: Pause and hold the item/action for a beat, model the sign and say "${w}", then wait expectantly. Reinforce any approximation immediately.

AVOID: Over-prompting. If you physically shape the hands every time, the sign won't become intentional—fade prompts quickly.`

    const fallbackFunction = extractFunction(fallback)

    return NextResponse.json(
      {
        word: w,
        analysis: fallback,
        source: "fallback",
        function: fallbackFunction,
        ts: Date.now(),
      },
      { status: 200 },
    )
  }
}
