import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"

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

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json()
    const normalized = normalizeWord(String(word || ""))

    if (!normalized) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    const validation = validateInput(normalized)
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.message || "Invalid input",
          suggestions: validation.suggestions,
        },
        { status: 400 },
      )
    }

    const w = normalized.toLowerCase()

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

      yes: `FUNCTION: comment — affirmation word for agreement and confirmation.

CONTEXTS: • answering questions • confirming choices • expressing agreement

TIP: Ask simple yes/no questions about preferred items. Model enthusiastic head nod with sign.

AVOID: Only using during compliance situations - teach "yes" for genuine preferences too.`,

      please: `FUNCTION: social — politeness marker for requests.

CONTEXTS: • asking for snacks • requesting toys • seeking attention

TIP: Model "please" naturally during your own requests. Don't require it before responding to child's needs.

AVOID: Withholding items until child says "please" - this creates frustration, not politeness.`,

      "thank you": `FUNCTION: social — gratitude expression for received items or help.

CONTEXTS: • receiving snacks • getting help • accepting toys

TIP: Model "thank you" when child gives you something. Celebrate any attempt at gratitude.

AVOID: Forcing "thank you" before child can enjoy what they received - model, don't demand.`,

      eat: `FUNCTION: request — food-related communication for meals.

CONTEXTS: • mealtime routines • snack requests • hunger signals

TIP: Show food, sign "eat," then wait. Accept any gesture toward food as communication.

AVOID: Only using at scheduled mealtimes - respond to spontaneous hunger communication.`,

      drink: `FUNCTION: request — beverage-related communication for hydration.

CONTEXTS: • thirst signals • mealtime beverages • snack time

TIP: Hold cup visible but out of reach. Sign "drink" and wait for any communication attempt.

AVOID: Giving drinks on schedule only - honor spontaneous thirst communication.`,

      play: `FUNCTION: request — activity initiation for engagement.

CONTEXTS: • toy requests • game initiation • seeking interaction

TIP: Show favorite toy, sign "play," then wait. Accept reaching, looking, or vocalizing as communication.

AVOID: Starting play without waiting for child's communication - create opportunities to request.`,

      good: `FUNCTION: comment — positive feedback and praise.

CONTEXTS: • tasting food • completing tasks • positive experiences

TIP: Model "good" with enthusiastic expression when child experiences something positive.

AVOID: Overusing as empty praise - reserve for genuine positive experiences child can connect to.`,
    }

    const specificFallback = wordAnalyses[w]
    const fallback =
      specificFallback ||
      `FUNCTION: request — useful for gaining access to "${normalized}" or indicating preference.

CONTEXTS: • mealtime choices • play choices • routines that naturally include "${normalized}"

TIP: Pause and hold the item/action for a beat, model the sign and say "${normalized}", then wait expectantly. Reinforce any approximation immediately.

AVOID: Over-prompting. If you physically shape the hands every time, the sign won't become intentional—fade prompts quickly.`

    const fallbackFunction = extractFunction(fallback)

    return NextResponse.json(
      {
        word: normalized,
        analysis: fallback,
        source: "curated",
        function: fallbackFunction,
        ts: Date.now(),
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("[analyze-word] error:", err?.message || err)

    return NextResponse.json(
      {
        error: "Failed to analyze word",
        word: "communication",
        analysis: "Unable to provide analysis at this time.",
        source: "error",
        function: "request",
      },
      { status: 500 },
    )
  }
}
