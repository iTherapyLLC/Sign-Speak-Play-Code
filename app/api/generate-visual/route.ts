import { type NextRequest, NextResponse } from "next/server"
import { isInappropriate } from "@/app/lib/content-filter"

const WORD_FUNCTIONS: Record<string, string> = {
  // Requests
  want: "request",
  more: "request",
  help: "request",
  please: "request",
  eat: "request",
  drink: "request",
  play: "request",
  go: "request",

  // Refusals
  no: "refusal",
  stop: "refusal",
  "don't want": "refusal",
  "all done": "refusal",

  // Commands/Directives
  walk: "command",
  break: "command",

  // Comments/Observations
  good: "comment",
  happy: "comment",
  sad: "comment",
  this: "comment",
  that: "comment",
  mad: "comment",
  sick: "comment",

  // Social/Polite
  "thank you": "social",
  yes: "agreement",

  // Questions
  what: "question",
  "don't know": "question",

  // Personal
  i: "personal",
  you: "personal",
  bathroom: "routine",
}

function getTeachingPrompt(word: string): string {
  const wordLower = word.toLowerCase()
  const wordFunction = WORD_FUNCTIONS[wordLower] || "communication"

  // High-quality prompts optimized for FLUX Pro
  const prompts: Record<string, string> = {
    request: `Professional photography of happy parent and smiling 4-year-old child in bright modern home, child pointing enthusiastically at desired item, parent holding it with warm smile, both making joyful eye contact, teaching moment for requesting "${word}", soft natural lighting, educational scene, 4K quality, hyperrealistic`,

    refusal: `Candid photo of cheerful parent offering colorful toy to happy 5-year-old child who is gently pushing it away with a big smile, both laughing together, positive boundary setting teaching "${word}", bright daylight through windows, warm family moment, photorealistic`,

    command: `Dynamic photo of joyful parent demonstrating action while excited child copies movement, both with huge smiles and engaged expressions, teaching "${word}" through active play, colorful playroom, professional lighting, hyperrealistic`,

    comment: `Beautiful scene of parent and 4-year-old child sitting together looking at picture book, both pointing and smiling at same page, shared attention moment teaching "${word}", cozy reading corner, golden hour lighting, high detail`,

    question: `Engaging photo of curious 5-year-old child with raised hands in questioning gesture, parent kneeling at eye level with encouraging smile, teaching "${word}" through play, bright educational playroom, professional lighting`,

    social: `Heartwarming moment of parent and 4-year-old child practicing polite interaction, both with genuine happy expressions, high-five gesture, teaching "${word}", warm home environment, natural lighting, photorealistic quality`,

    agreement: `Joyful scene of parent and child both nodding with big smiles, thumbs up gestures, positive reinforcement moment teaching "${word}", bright cheerful living room, professional photography`,

    personal: `Intimate photo of parent and child face to face, child pointing to self or parent with pride, both beaming with happiness during identity teaching for "${word}", warm educational moment, soft lighting`,

    routine: `Calm scene of parent helping child with daily routine, both relaxed and happy, teaching "${word}" in natural bathroom or bedroom setting, soft morning light, photorealistic`,

    communication: `Professional photo of happy parent and smiling 5-year-old child face to face on carpet, both using expressive hand gestures while communicating, teaching "${word}", bright living room, soft natural light, educational moment`,
  }

  return prompts[wordFunction] || prompts.communication
}

const FALLBACK_IMAGES: Record<string, string> = {
  request: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80",
  refusal: "https://images.unsplash.com/photo-1566665797739-1e64c2839d4c?w=1200&q=80",
  command: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200&q=80",
  comment: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
  question: "https://images.unsplash.com/photo-1593100126453-19b562a800c1?w=1200&q=80",
  social: "https://images.unsplash.com/photo-1453749024858-4bca89bd9edc?w=1200&q=80",
  agreement: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1200&q=80",
  personal: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80",
  routine: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80",
  default: "https://images.unsplash.com/photo-1444069069008-83a57aac43ac?w=1200&q=80",
}

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json()

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    if (isInappropriate(word)) {
      return NextResponse.json(
        {
          imageUrl: null,
          error: "Please try another word. We focus on educational, family-friendly communication.",
        },
        { status: 400 },
      )
    }

    const prompt = getTeachingPrompt(word)
    const wordFunction = WORD_FUNCTIONS[word.toLowerCase()] || "communication"

    console.log(`[Visual] Generating enhanced Flux image for "${word}" with function: ${wordFunction}`)

    try {
      const fluxResponse = await fetch("https://fal.run/fal-ai/flux-pro", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.FLUX_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 25,
          guidance_scale: 3.5,
          num_images: 1,
          safety_tolerance: 2,
        }),
      })

      if (fluxResponse.ok) {
        const responseText = await fluxResponse.text()
        console.log(`[Visual] Flux API response status: ${fluxResponse.status}`)

        try {
          const fluxData = JSON.parse(responseText)

          if (fluxData.images && fluxData.images.length > 0) {
            const imageUrl = fluxData.images[0].url
            console.log(`[Visual] Successfully generated enhanced Flux Pro image for: ${word}`)

            return NextResponse.json({
              imageUrl,
              wordFunction,
              provider: "flux-pro",
              model: "FLUX Pro",
              prompt: prompt,
              isParentChild: true,
            })
          }
        } catch (jsonError) {
          console.error(`[Visual] Flux API JSON parsing error:`, jsonError)
          console.error(`[Visual] Raw response:`, responseText.substring(0, 200))
        }
      } else {
        const errorText = await fluxResponse.text()
        console.error(`[Visual] Flux Pro API error: ${fluxResponse.status} - ${errorText}`)

        try {
          const fallbackResponse = await fetch("https://fal.run/fal-ai/flux-schnell", {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.FLUX_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: prompt,
              image_size: "landscape_4_3",
              num_inference_steps: 4,
              guidance_scale: 7.5,
              num_images: 1,
            }),
          })

          if (fallbackResponse.ok) {
            const fallbackText = await fallbackResponse.text()
            try {
              const fallbackData = JSON.parse(fallbackText)
              if (fallbackData.images && fallbackData.images.length > 0) {
                console.log(`[Visual] Using Flux Schnell fallback for: ${word}`)
                return NextResponse.json({
                  imageUrl: fallbackData.images[0].url,
                  wordFunction,
                  provider: "flux-schnell",
                  model: "FLUX Schnell",
                  isParentChild: true,
                })
              }
            } catch (fallbackJsonError) {
              console.error(`[Visual] Flux Schnell JSON parsing error:`, fallbackJsonError)
            }
          }
        } catch (fallbackError) {
          console.error(`[Visual] Flux Schnell fallback error:`, fallbackError)
        }
      }
    } catch (fluxError) {
      console.error("[Visual] Flux API error:", fluxError)
    }

    const fallbackImage = FALLBACK_IMAGES[wordFunction] || FALLBACK_IMAGES.default
    console.log(`[Visual] Using fallback image for "${word}" with function: ${wordFunction}`)

    return NextResponse.json({
      imageUrl: fallbackImage,
      wordFunction,
      provider: "fallback",
      isParentChild: true,
      error: "Using fallback image - Flux unavailable",
    })
  } catch (error) {
    console.error("[Visual] Error:", error)

    return NextResponse.json({
      imageUrl: FALLBACK_IMAGES.default,
      wordFunction: "teaching",
      fallback: true,
      isParentChild: true,
      error: "Image generation failed",
    })
  }
}
