import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAIAPIKEY! })

const SYSTEM_PROMPT = `
You are "Storyboard Director" for parent-facing sign-language teaching cards.
Output MUST be valid JSON only.
Return a storyboard for ONE word and ONE social function as a 3-frame comic:
- Tone: warm, inclusive, practical. Audience: parents.
- Style: clean vector comic, flat colors, thick outlines, gentle shadows; square panels.
- Layout: three panels left→right; caregiver + child consistent.
- Camera: mid-shot, eye level; minimal background clutter.
- Speech bubbles: <= 4 words; use actual target word; avoid icons for verbs.
JSON schema:
{
  "word": "string",
  "socialFunction": "request|refuse|ask|command|comment",
  "frames": [
    { "title": "Introduce", "bubbleParent": "string", "bubbleChild": "string", "alt": "string" },
    { "title": "Model",     "bubbleParent": "string", "bubbleChild": "string", "alt": "string" },
    { "title": "Imitate",   "bubbleParent": "string", "bubbleChild": "string", "alt": "string" }
  ],
  "tips": ["string", "string"],
  "image_prompt": {
    "global": "One prompt describing style/palette/camera/characters for all 3 frames.",
    "frames": [{ "prompt": "string" }, { "prompt": "string" }, { "prompt": "string" }]
  }
}
Return JSON only.
`

async function getStoryboard(word: string, socialFunction: string, context: string) {
  const user = `Make a storyboard:
word: "${word}"
social function: "${socialFunction}"
context: "${context}"
Constraints: 3 frames = Introduce → Model → Imitate+Reinforce; fewest words in bubbles.`

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: user },
    ],
  })

  return JSON.parse(resp.choices[0].message.content!)
}

async function renderPanels(sb: any) {
  const prompts: string[] = sb.image_prompt.frames.map((f: any, i: number) => {
    const fr = sb.frames[i]
    const speech = [
      fr.bubbleParent ? `PARENT bubble: "${fr.bubbleParent}"` : "",
      fr.bubbleChild ? `CHILD bubble: "${fr.bubbleChild}"` : "",
    ]
      .filter(Boolean)
      .join(" | ")

    return [
      sb.image_prompt.global,
      f.prompt,
      `Add speech bubbles with EXACT text → ${speech}.`,
      "Square vector comic, flat colors, thick outlines, gentle soft shadow.",
      "Minimal clutter; no logos; no extra text.",
      "All text in images must be in English only. Do not include text in any other languages.",
    ].join("\n")
  })

  const urls: string[] = []
  for (const p of prompts) {
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt: p,
      size: "1024x1024",
    })
    urls.push(img.data[0].url!)
  }
  return urls
}

export async function GET(req: NextRequest, { params }: { params: { word: string } }) {
  try {
    const word = decodeURIComponent(params.word)
    const fn = req.nextUrl.searchParams.get("fn") || "request"
    const ctx = req.nextUrl.searchParams.get("ctx") || "snack at the kitchen table"

    const storyboard = await getStoryboard(word, fn, ctx)
    const images = await renderPanels(storyboard)

    const frames = storyboard.frames.map((f: any, i: number) => ({ ...f, imageUrl: images[i] }))

    return NextResponse.json({
      word,
      socialFunction: storyboard.socialFunction,
      frames,
      tips: storyboard.tips ?? [],
    })
  } catch (error) {
    console.error("Teaching strategy generation error:", error)
    return NextResponse.json({ error: "Failed to generate teaching strategy" }, { status: 500 })
  }
}
