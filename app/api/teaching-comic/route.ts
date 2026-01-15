import { type NextRequest, NextResponse } from "next/server"
import { validateInput } from "@/lib/content-filter"
import { getCachedImage, isSensitiveWord } from "@/lib/cached-images"

const ETHNIC_GROUPS = [
  "Asian family",
  "Black family",
  "White family",
  "Latino family",
  "Indigenous family",
  "Pacific Islander family",
]

const CULTURAL_REPRESENTATION_PRINCIPLES = `
Generate teaching scenarios showing families from diverse backgrounds with authentic, natural representation.

CORE PRINCIPLE: Every cultural group shares universal human experiences—love, challenge, growth, and learning. Show real families teaching real communication, not idealized representations.

REPRESENTATION GUIDELINES:
- Show authentic home environments—some tidy, some lived-in, all real
- Include various family structures: two parents, single parents, grandparents, extended family
- Display natural interactions: sometimes patient, sometimes tired, always human
- Avoid stereotypes in ANY direction—no group is perfect or problematic

VISUAL APPROACH:
- Focus on the teaching moment, not cultural performance
- Show parents as they are: sometimes confident, sometimes learning
- Include realistic settings: apartments, houses, parks—wherever families actually live
- Display genuine emotions: joy, frustration, concentration, breakthrough moments

UNIVERSAL HUMAN ELEMENTS TO EMPHASIZE:
- Parent exhaustion and determination
- Child resistance and breakthrough
- Sibling involvement (helpful and unhelpful)
- Messy kitchens, scattered toys, real life
- The universal struggle and triumph of teaching communication

Remember: The goal is helping ALL parents teach communication. Every family—regardless of background—faces the same challenge of helping their child find their voice.`

function getDiversityRotation(word: string): string {
  // Use word hash to ensure consistent but rotating diversity
  const hash = word.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % ETHNIC_GROUPS.length
  return ETHNIC_GROUPS[index]
}

function analyzeWordFunction(word: string): string {
  const w = word.toLowerCase()

  // Request words
  if (["want", "more", "help", "eat", "drink", "play", "give", "open"].includes(w)) {
    return "request"
  }

  // Refusal words
  if (["no", "stop", "don't want", "all done", "finished"].includes(w)) {
    return "refusal"
  }

  // Command words
  if (["go", "come", "sit", "stand", "wait", "look"].includes(w)) {
    return "command"
  }

  // Comment words
  if (["good", "bad", "hot", "cold", "big", "little", "yes", "like", "happy", "sad"].includes(w)) {
    return "comment"
  }

  // Question words
  if (["what", "where", "who", "why", "how"].includes(w)) {
    return "question"
  }

  // Affection words
  if (["i love you", "love", "love you", "hug", "kiss"].includes(w)) {
    return "affection"
  }

  // Default to request
  return "request"
}

async function generateContextualImage(
  word: string,
  communicationFunction: string,
  apiKey: string | undefined,
  hasValidApiKey: boolean,
): Promise<{ url: string; fromCache: boolean; sensitive: boolean } | null> {
  // Check for cached image first
  const cachedImage = getCachedImage(word)
  const sensitive = isSensitiveWord(word)

  // SENSITIVE WORDS: Always use cache, NEVER call Flux (risk of inappropriate generation)
  if (sensitive) {
    if (cachedImage) {
      console.log(`[v0] SENSITIVE word "${word}" - using cached image (Flux blocked)`)
      return { url: cachedImage.url, fromCache: true, sensitive: true }
    } else {
      // Sensitive word without cache - return null, do NOT call Flux
      console.warn(`[v0] SENSITIVE word "${word}" has no cached image - blocking Flux generation`)
      return null
    }
  }

  // SAFE WORDS: Try cache first, allow Flux fallback
  if (cachedImage) {
    console.log(`[v0] Using cached image for safe word: ${word}`)
    return { url: cachedImage.url, fromCache: true, sensitive: false }
  }

  // No cache for safe word - try Flux generation
  if (!hasValidApiKey || !apiKey) {
    console.log("[v0] No Flux API key available, skipping image generation")
    return null
  }

  console.log(`[v0] Safe word "${word}" not in cache - generating with Flux`)

  const contextPrompts: Record<string, (word: string) => string> = {
    request: (
      word: string,
    ) => `Documentary photograph of a PARENT teaching a TODDLER (18-36 months old baby) to communicate "${word}". 
Scene: Bright kitchen, parent kneeling at child's eye level, holding a desired item (snack or toy) just out of reach. 
The TODDLER is reaching toward the item with eager expression. Parent has patient, encouraging smile.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler, not older child).
Setting: Clean family home, natural daylight, educational teaching moment.`,

    refusal: (
      word: string,
    ) => `Documentary photograph of a PARENT teaching a TODDLER (18-36 months old baby) to communicate "${word}".
Scene: Kitchen table, parent offering food to seated toddler. TODDLER turning head away or pushing plate, showing refusal.
Parent has understanding, respectful expression accepting child's boundary.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler, not older child).
Setting: Clean family home, natural daylight, mealtime teaching moment.`,

    command: (
      word: string,
    ) => `Documentary photograph of a PARENT teaching a TODDLER (18-36 months old baby) to communicate "${word}".
Scene: Living room, toddler struggling with a container or toy, looking up at parent for help.
Parent waiting patiently for child to communicate before assisting.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler, not older child).
Setting: Clean family home, natural daylight, problem-solving teaching moment.`,

    comment: (
      word: string,
    ) => `Documentary photograph of a PARENT teaching a TODDLER (18-36 months old baby) to communicate "${word}".
Scene: Cozy reading nook, parent and toddler sitting together looking at a picture book or toy.
Both showing shared attention and genuine engagement with the object.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler, not older child).
Setting: Clean family home, natural daylight, bonding teaching moment.`,

    question: (
      word: string,
    ) => `Documentary photograph of a PARENT teaching a TODDLER (18-36 months old baby) to communicate "${word}".
Scene: Kitchen or playroom, parent holding two choices (snacks or toys) at toddler's eye level.
TODDLER looking thoughtfully at the options, considering which to choose.
MANDATORY: One adult parent (age 25-40) with ONE small toddler child (visibly a baby/toddler, not older child).
Setting: Clean family home, natural daylight, choice-making teaching moment.`,

    affection: (
      word: string,
    ) => `Documentary photograph of a MOTHER or FATHER with their TODDLER CHILD (18-36 months old baby).
Scene: Living room, single parent hugging or holding their small toddler child on their lap, both smiling warmly.
This is PARENTAL LOVE ONLY - a mother or father expressing love to their baby/toddler child.
MANDATORY SUBJECTS: Exactly ONE adult parent (age 25-40) with exactly ONE small toddler child (visibly a baby/toddler 18-36 months).
NO COUPLES - this is a single parent with their child, NOT two adults together.
Setting: Clean family home, natural daylight, loving parent-child bonding moment.
CRITICAL: This must show family love between parent and baby, NOT romantic love between adults.`,
  }

  const promptGenerator = contextPrompts[communicationFunction] || contextPrompts.request
  const basePrompt = promptGenerator(word)
  const diversityGroup = getDiversityRotation(word)

  try {
    console.log(
      `[v0] Generating image for word: ${word}, function: ${communicationFunction}, diversity: ${diversityGroup}`,
    )

    const response = await fetch("https://fal.run/fal-ai/flux-pro", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${basePrompt}

SUBJECT REQUIREMENTS (CRITICAL - DO NOT DEVIATE):
- Exactly ONE adult parent (mother or father, age 25-40)
- Exactly ONE toddler child (MUST be visibly 18-36 months old - a BABY/TODDLER, small child)
- This is a PARENT teaching their TODDLER child to communicate
- Show ${diversityGroup} with authentic, natural representation

PHOTOGRAPHY STYLE:
- Professional documentary/editorial photography
- Natural window lighting, soft shadows
- Clean, modern family home environment
- Shot on 35mm lens, shallow depth of field
- Warm, authentic emotional connection

ABSOLUTE RESTRICTIONS (NEVER INCLUDE):
- NO romantic couples or dating imagery
- NO two adults together (only ONE parent with ONE toddler)
- NO adult romantic love scenes
- NO teenagers or older children (child MUST be a toddler/baby aged 18-36 months)
- NO beards on women, NO gender-ambiguous adults
- NO text, labels, or watermarks
- NO inappropriate, suggestive, or adult content of any kind
- This is STRICTLY for teaching communication to TODDLERS in a family setting`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 4.0,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: 1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Flux API error: ${response.status}`, errorText)
      throw new Error(`Flux API error: ${response.status}`)
    }

    const data = await response.json()
    const imageUrl = data.images?.[0]?.url
    if (imageUrl) {
      console.log(`[v0] Image generated successfully for: ${word} with ${diversityGroup}`)
      return { url: imageUrl, fromCache: false, sensitive: false }
    } else {
      console.warn(`[v0] No image URL returned for: ${word}`)
      return null
    }
  } catch (error) {
    console.error("[v0] Image generation failed:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  let word = "communication"

  try {
    console.log("[v0] Teaching comic API called")

    const apiKey = process.env.FLUX_API_KEY
    const hasValidApiKey = apiKey && apiKey !== "dummy-key" && apiKey.length > 10

    if (hasValidApiKey) {
      console.log("[v0] Valid Flux API key found")
    } else {
      console.warn("[v0] No valid Flux API key found - using fallback mode only")
    }

    try {
      const body = await req.json()
      if (!body || typeof body !== "object") {
        throw new Error("Invalid request body format")
      }
      word = body.word
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          word: "communication",
          fallback: true,
        },
        { status: 400 },
      )
    }

    if (!word || typeof word !== "string" || word.trim().length === 0) {
      console.error("[v0] Invalid or missing word parameter:", word)
      return NextResponse.json(
        {
          error: "Word is required and must be a non-empty string",
          word: "communication",
          fallback: true,
        },
        { status: 400 },
      )
    }

    word = word.trim()

    const validation = validateInput(word)
    if (!validation.valid) {
      console.log("[v0] Content filter blocked word:", word)
      return NextResponse.json(
        {
          error: validation.message || "Invalid input",
          suggestions: validation.suggestions,
          word: "communication",
          fallback: true,
        },
        { status: 400 },
      )
    }

    console.log(`[v0] Processing word: ${word}`)

    const communicationFunction = analyzeWordFunction(word)
    console.log(`[v0] Word function: ${communicationFunction}`)

    let imageResult: { url: string; fromCache: boolean; sensitive: boolean } | null = null

    try {
      imageResult = await generateContextualImage(word, communicationFunction, apiKey, hasValidApiKey)
    } catch (error) {
      console.error("[v0] Failed to generate contextual image:", error)
      imageResult = null
    }

    const strategies = {
      request: {
        contexts: ["Snack time", "Toy play", "Getting dressed"],
        tip: "Create opportunities by pausing before giving what they want",
        avoid: "Giving items before child attempts communication",
      },
      refusal: {
        contexts: ["Mealtime", "Diaper changes", "Clean-up time"],
        tip: "Honor their refusal immediately when they communicate it",
        avoid: "Only teaching during negative situations",
      },
      command: {
        contexts: ["Opening containers", "Reaching high items", "Getting stuck"],
        tip: "Wait for them to direct you before helping",
        avoid: "Anticipating needs before they communicate",
      },
      comment: {
        contexts: ["Reading books", "Looking out window", "Playing together"],
        tip: "Follow their gaze and label what they see",
        avoid: "Testing without natural shared attention",
      },
      question: {
        contexts: ["Choosing snacks", "Picking activities", "Getting dressed"],
        tip: "Offer choices and wait for them to ask",
        avoid: "Answering for them too quickly",
      },
      affection: {
        contexts: ["Hugging time", "Kissing moments", "Comfort cuddles"],
        tip: "Demonstrate love and affection in a nurturing way",
        avoid: "Using inappropriate or overly romantic imagery",
      },
    }

    const strategy = strategies[communicationFunction] || strategies.request

    const fullStrategy = `FUNCTION: ${communicationFunction.charAt(0).toUpperCase() + communicationFunction.slice(1)}
Essential for ${
      communicationFunction === "request"
        ? "getting needs met"
        : communicationFunction === "refusal"
          ? "expressing boundaries"
          : communicationFunction === "command"
            ? "directing others"
            : communicationFunction === "comment"
              ? "sharing observations"
              : communicationFunction === "question"
                ? "seeking information"
                : "expressing love and affection"
    }

CONTEXTS:
${strategy.contexts.map((c) => `• ${c}`).join("\n")}

TIP: ${strategy.tip}

AVOID: ${strategy.avoid}`

    const response = {
      word,
      imageUrl:
        imageResult?.url || `/placeholder.svg?height=400&width=600&query=Teaching+${encodeURIComponent(word)}+communication`,
      strategy: fullStrategy,
      communicationFunction,
      aiGenerated: imageResult ? !imageResult.fromCache : false,
      fromCache: imageResult?.fromCache || false,
      sensitive: imageResult?.sensitive || isSensitiveWord(word),
      fallback: !imageResult,
      model: imageResult ? (imageResult.fromCache ? "cached" : "flux-pro") : "fallback",
    }

    console.log(`[v0] Returning successful response for: ${word}`)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Teaching comic generation error:", error)

    const errorResponse = {
      word,
      imageUrl: `/placeholder.svg?height=400&width=600&query=Teaching+${encodeURIComponent(word)}+communication`,
      strategy: `FUNCTION: Request
Essential for communicating "${word}"

CONTEXTS:
• During daily routines when "${word}" naturally occurs
• During play when the concept comes up
• At transition times

TIP: Create natural opportunities by pausing before providing what they want. Wait for any communication attempt.

AVOID: Requiring perfect pronunciation or sign formation - accept any approximation`,
      communicationFunction: "request",
      fallback: true,
      aiGenerated: false,
      model: "fallback",
      error: "API generation failed, using fallback content",
    }

    console.log(`[v0] Returning fallback response for: ${word}`)
    return NextResponse.json(errorResponse, { status: 200 })
  }
}
