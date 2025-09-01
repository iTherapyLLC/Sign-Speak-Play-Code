import { type NextRequest, NextResponse } from "next/server"

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

async function analyzeWordFunction(word: string, apiKey: string | undefined, hasValidApiKey: boolean): Promise<string> {
  if (!hasValidApiKey || !apiKey) {
    console.log("[v0] No OpenAI API key available, using fallback word analysis")
    return "request"
  }

  try {
    console.log(`[v0] Analyzing word function for: ${word}`)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Categorize the communication function of this word. Respond with ONLY one word: request, refusal, command, comment, or question.",
          },
          {
            role: "user",
            content: word,
          },
        ],
        temperature: 0.3,
        max_tokens: 10,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const result = data.choices[0].message.content?.toLowerCase().trim() || "request"
    console.log(`[v0] Word function analysis result: ${result}`)
    return ["request", "refusal", "command", "comment", "question"].includes(result) ? result : "request"
  } catch (error) {
    console.error("[v0] Word function analysis failed:", error)
    return "request"
  }
}

async function generateContextualImage(
  word: string,
  communicationFunction: string,
  apiKey: string | undefined,
  hasValidApiKey: boolean,
): Promise<string | null> {
  if (!hasValidApiKey || !apiKey) {
    console.log("[v0] No OpenAI API key available, skipping image generation")
    return null
  }

  const contextPrompts = {
    request: `Real family moment: Parent and child in lived-in kitchen. Parent holds desired snack, pausing expectantly while child reaches. Parent looks tired but patient - this is the 5th time today. Maybe dishes in sink, toys on counter. Child might be frustrated or having breakthrough moment. Natural teaching opportunity in real life.`,
    refusal: `Authentic mealtime: Parent offering food to child who clearly doesn't want it. Child turning away, parent respecting boundary while holding alternative. Kitchen shows signs of real family life - not perfect, not messy, just lived-in. Parent teaching "${word}" with genuine patience despite exhaustion.`,
    command: `Real daily struggle: Child trying to open stubborn container, getting frustrated. Parent nearby folding laundry or doing dishes, waiting for child to ask for help. Home environment shows real family life - comfortable but not staged. Teaching moment emerging from genuine need.`,
    comment: `Natural shared attention: Parent and child looking at something interesting together - book with worn pages, toy that's been loved, or something outside window. Both genuinely engaged. Home setting shows real family life with authentic details.`,
    question: `Choice-making moment: Parent holding two realistic options, child considering. Maybe it's snack time and parent is tired, or getting dressed and running late. Real family dynamics - not perfect patience, but genuine care. Teaching questioning in authentic context.`,
  }

  const prompt = contextPrompts[communicationFunction] || contextPrompts.request
  const diversityGroup = getDiversityRotation(word)

  try {
    console.log(
      `[v0] Generating image for word: ${word}, function: ${communicationFunction}, diversity: ${diversityGroup}`,
    )
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Educational illustration for parent teaching child to communicate "${word}". ${prompt} 
        
        Show a ${diversityGroup} in a natural home setting. Capture a genuine moment—perhaps the parent is tired but determined, the child might be frustrated or having a breakthrough.
        
        ${CULTURAL_REPRESENTATION_PRINCIPLES}
        
        Style: Warm, realistic illustration. Focus on universal human connection, not cultural showcase. This is about the challenge every parent faces: helping their child communicate when words don't come easily.
        
        CRITICAL REQUIREMENTS:
        - All text in images must be in English only
        - Show authentic, lived-in environments (not perfect homes)
        - Display genuine emotions and real family dynamics
        - Focus on the universal teaching moment
        - No text except English speech bubbles when absolutely necessary`,
        size: "1792x1024",
        quality: "hd",
        style: "natural",
        n: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const imageUrl = data.data[0]?.url
    if (imageUrl) {
      console.log(`[v0] Image generated successfully for: ${word} with ${diversityGroup}`)
      return imageUrl
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

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY
    const hasValidApiKey = apiKey && apiKey !== "dummy-key" && apiKey.length > 10

    if (hasValidApiKey) {
      console.log("[v0] Valid OpenAI API key found")
    } else {
      console.warn("[v0] No valid OpenAI API key found - using fallback mode only")
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
    console.log(`[v0] Processing word: ${word}`)

    let communicationFunction = "request"
    let imageUrl: string | null = null

    try {
      communicationFunction = await analyzeWordFunction(word, apiKey, hasValidApiKey)
    } catch (error) {
      console.error("[v0] Failed to analyze word function:", error)
      communicationFunction = "request"
    }

    try {
      imageUrl = await generateContextualImage(word, communicationFunction, apiKey, hasValidApiKey)
    } catch (error) {
      console.error("[v0] Failed to generate contextual image:", error)
      imageUrl = null
    }

    // Generate appropriate teaching strategy
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
              : "seeking information"
    }

CONTEXTS:
${strategy.contexts.map((c) => `• ${c}`).join("\n")}

TIP: ${strategy.tip}

AVOID: ${strategy.avoid}`

    const response = {
      word,
      imageUrl:
        imageUrl || `/placeholder.svg?height=400&width=600&query=Teaching+${encodeURIComponent(word)}+communication`,
      strategy: fullStrategy,
      communicationFunction,
      aiGenerated: !!imageUrl,
      fallback: !imageUrl,
      model: imageUrl ? "dall-e-3" : "fallback",
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
