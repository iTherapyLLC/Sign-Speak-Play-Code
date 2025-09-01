import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Please provide text to translate" }, { status: 400 })
    }

    const normalizedText = text.toLowerCase().trim()
    const GIPHY_API_KEY = process.env.GIPHY_API_KEY

    // FIRST: Check hardcoded verified GIFs
    const VERIFIED_GIFS: Record<string, any> = {
      help: {
        gifUrl: "https://media.giphy.com/media/l0MYQo0iDSTlnRifK/giphy.gif",
        instruction: "Flat hand on top of fist, lift up together",
        socialFunction: "Requesting",
        source: "Sign with Robert (Verified)",
      },
      more: {
        gifUrl: "https://media.giphy.com/media/l0MYrIceNktY1mdzO/giphy.gif",
        instruction: "Fingertips of both hands tap together",
        socialFunction: "Requesting",
        source: "Sign with Robert (Verified)",
      },
      please: {
        gifUrl: "https://media.giphy.com/media/3oz8xxZjw8HJxLcmD6/giphy.gif",
        instruction: "Rub flat hand in circles on chest",
        socialFunction: "Requesting",
        source: "Sign with Robert (Verified)",
      },
      eat: {
        gifUrl: "https://media.giphy.com/media/l3vRhFBHY2JT5QIdq/giphy.gif",
        instruction: "Flat hand taps mouth like eating",
        socialFunction: "Daily needs",
        source: "Sign with Robert (Verified)",
      },
      drink: {
        gifUrl: "https://media.giphy.com/media/l4JyRPtPMj6CksKf6/giphy.gif",
        instruction: "C-shape hand tilted to mouth",
        socialFunction: "Daily needs",
        source: "Sign with Robert (Verified)",
      },
      bathroom: {
        gifUrl: "https://media.giphy.com/media/26DONjlzKa7fM9HUI/giphy.gif",
        instruction: "Make T with hand, shake side to side",
        socialFunction: "Daily needs",
        source: "Sign with Robert (Verified)",
      },
      yes: {
        gifUrl: "https://media.giphy.com/media/l4Jz0THKhQLo61NBK/giphy.gif",
        instruction: "Fist nods up and down",
        socialFunction: "Accepting",
        source: "Sign with Robert (Verified)",
      },
      "thank you": {
        gifUrl: "https://media.giphy.com/media/l0MYrlUnFtq25TQR2/giphy.gif",
        instruction: "Touch chin, move hand forward",
        socialFunction: "Social",
        source: "Sign with Robert (Verified)",
      },
      sorry: {
        gifUrl: "https://media.giphy.com/media/3o7TKq0oNLk8ljH7vG/giphy.gif",
        instruction: "Fist circles on chest",
        socialFunction: "Social",
        source: "Sign with Robert (Verified)",
      },
    }

    // Check verified GIFs first
    if (VERIFIED_GIFS[normalizedText]) {
      const sign = VERIFIED_GIFS[normalizedText]
      return NextResponse.json({
        gifUrl: sign.gifUrl,
        instruction: sign.instruction,
        word: normalizedText,
        displayWord: text,
        socialFunction: sign.socialFunction,
        hasVideo: true,
        verified: true,
        source: sign.source,
      })
    }

    // Handle simple variations that map to verified GIFs
    const variations: Record<string, string> = {
      thanks: "thank you",
      toilet: "bathroom",
      potty: "bathroom",
      restroom: "bathroom",
    }

    if (variations[normalizedText] && VERIFIED_GIFS[variations[normalizedText]]) {
      const mappedWord = variations[normalizedText]
      const sign = VERIFIED_GIFS[mappedWord]
      return NextResponse.json({
        gifUrl: sign.gifUrl,
        instruction: sign.instruction,
        word: mappedWord,
        displayWord: text,
        originalWord: normalizedText,
        socialFunction: sign.socialFunction,
        hasVideo: true,
        verified: true,
        source: sign.source,
      })
    }

    // SECOND: Try to find on GIPHY (for want, no, all done, stop, go, mad)
    if (GIPHY_API_KEY) {
      // Search specifically for Sign with Robert content
      const searchQueries = [
        `signwithrobert ${normalizedText}`,
        `"sign with robert" ${normalizedText}`,
        `sign language ${normalizedText} signwithrobert`,
      ]

      // Special handling for "mad" - search for "angry"
      if (normalizedText === "mad") {
        searchQueries.push(`signwithrobert angry`)
        searchQueries.push(`"sign with robert" angry`)
      }

      for (const query of searchQueries) {
        try {
          const searchUrl = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=50&rating=g`
          const response = await fetch(searchUrl)
          const data = await response.json()

          if (data.data && data.data.length > 0) {
            // Filter for Sign with Robert content
            for (const gif of data.data) {
              const username = gif.username?.toLowerCase() || ""
              const title = gif.title?.toLowerCase() || ""
              const slug = gif.slug?.toLowerCase() || ""

              // STRICT FILTER: Must be from Sign with Robert
              const isSignWithRobert =
                username === "signwithrobert" ||
                username.includes("signwithrobert") ||
                title.includes("sign with robert")

              if (isSignWithRobert) {
                // Check if it matches the word we're looking for
                const isCorrectWord =
                  title.includes(normalizedText) ||
                  slug.includes(normalizedText) ||
                  (normalizedText === "all done" && (title.includes("all done") || title.includes("finished"))) ||
                  (normalizedText === "finished" && (title.includes("finished") || title.includes("all done"))) ||
                  (normalizedText === "done" && (title.includes("done") || title.includes("finished"))) ||
                  (normalizedText === "no" && title.includes("no")) ||
                  (normalizedText === "want" && title.includes("want")) ||
                  (normalizedText === "stop" && title.includes("stop")) ||
                  (normalizedText === "go" && title.includes("go")) ||
                  (normalizedText === "mad" && (title.includes("angry") || title.includes("mad")))

                if (isCorrectWord) {
                  // Verify it's not inappropriate
                  const inappropriate = ["hate", "fuck", "shit", "kill", "die", "stupid"]
                  const hasInappropriate = inappropriate.some((word) => title.includes(word))

                  if (!hasInappropriate) {
                    return NextResponse.json({
                      gifUrl: gif.images.fixed_height.url,
                      instruction: getInstruction(normalizedText),
                      word: normalizedText,
                      displayWord: text,
                      title: gif.title,
                      socialFunction: getSocialFunction(normalizedText),
                      hasVideo: true,
                      verified: true,
                      source: "Sign with Robert (GIPHY)",
                    })
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`Search failed for: ${query}`, error)
        }
      }
    }

    // THIRD: Return instructions only for essential words
    const instruction = getInstruction(normalizedText)
    if (instruction) {
      return NextResponse.json({
        gifUrl: null,
        instruction: instruction,
        word: normalizedText,
        displayWord: text,
        socialFunction: getSocialFunction(normalizedText),
        hasVideo: false,
        hasInstruction: true,
        source: "Instructions",
      })
    }

    // Word not found
    return NextResponse.json(
      {
        error: `Sign not available for "${text}"`,
        message: "Try these core functional words:",
        availableWords: [
          "want",
          "more",
          "help",
          "stop",
          "go",
          "eat",
          "drink",
          "bathroom",
          "yes",
          "no",
          "all done",
          "please",
          "thank you",
          "happy",
          "sad",
          "mad",
          "i",
          "you",
          "mom",
          "dad",
        ],
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}

function getInstruction(word: string): string | null {
  const instructions: Record<string, string> = {
    // CRITICAL REQUESTING/CONTROL WORDS
    want: "Both hands out, palms up, pull toward body with bent fingers",
    no: "First two fingers snap down to thumb",
    stop: "Edge of flat hand chops down onto other palm",
    go: "Both index fingers point forward and arc away",
    "all done": "Both hands up, palms facing you, flip outward",
    finished: "Both hands up, palms facing you, flip outward",
    done: "Both hands up, palms facing you, flip outward",
    break: "Both hands together, then snap apart",

    // PEOPLE (ESSENTIAL)
    i: "Point to yourself with index finger",
    me: "Point to yourself with index finger",
    you: "Point at the person you're talking to",
    it: "Point at object",
    that: "Point at distant object",

    // FAMILY
    mom: "Thumb on chin, fingers spread",
    mommy: "Thumb on chin, fingers spread",
    dad: "Thumb on forehead, fingers spread",
    daddy: "Thumb on forehead, fingers spread",

    // EMOTIONS (BASIC)
    happy: "Flat hand circles up on chest",
    sad: "Both hands pull down face",
    mad: "Claw hand pulls away from face",
    angry: "Claw hand pulls away from face",
    sick: "Middle finger to forehead and stomach",
    hurt: "Index fingers point at each other and tap",

    // ACTIVITIES (BASIC)
    walk: "Flat hands alternate like feet walking",
    play: "Y-hands (thumb and pinky out) shake",
    sleep: "Hand slides down face",

    // DAILY NEEDS
    milk: "Open and close fist like milking",
    water: "W with three fingers, tap chin",
    hungry: "Hand moves down from throat to stomach",
    tired: "Hands drop down from shoulders",

    // SIMPLE QUESTIONS
    what: "Both hands palm-up, shake side to side",
    where: "Index finger up, shake side to side",

    // SOCIAL
    love: "Cross arms over chest",
    hello: "Hand moves out from forehead",
    bye: "Wave hand",
    "bye bye": "Wave hand",
  }

  return instructions[word] || null
}

function getSocialFunction(sign: string): string {
  const functions: Record<string, string[]> = {
    Requesting: ["want", "more", "help", "please", "eat", "drink", "bathroom", "milk", "water"],
    "Refusing/Controlling": ["no", "stop", "all done", "finished", "done", "break"],
    Accepting: ["yes", "ok"],
    Feelings: ["happy", "sad", "mad", "angry", "sick", "hurt", "tired", "hungry"],
    "Daily Needs": ["eat", "drink", "bathroom", "sleep", "milk", "water", "hungry", "tired"],
    Social: ["please", "thank you", "sorry", "hello", "goodbye", "love", "thanks", "bye", "bye bye"],
    Questions: ["what", "where"],
    People: ["i", "you", "mom", "dad", "me", "mommy", "daddy", "it", "that"],
    Directing: ["go", "stop", "come", "wait"],
    Activities: ["play", "walk", "sleep"],
  }

  for (const [func, words] of Object.entries(functions)) {
    if (words.includes(sign)) {
      return func
    }
  }
  return "Core Vocabulary"
}
