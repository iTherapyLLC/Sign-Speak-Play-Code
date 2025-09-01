import { type NextRequest, NextResponse } from "next/server"

const signDescriptions = {
  want: "Both hands open, palms up, pull toward your body like you're gathering something you desire.",
  more: "Bring fingertips of both hands together repeatedly, like you're pinching something.",
  help: "Make a fist with one hand, place it on your opposite flat palm, and lift both hands up together.",
  stop: "One hand flat, the other hand chops down onto it at a right angle.",
  yes: "Make a fist and nod it up and down like your hand is nodding 'yes'.",
  no: "Extend index and middle finger together, tap them against thumb like a bird's beak closing.",
  eat: "Bring fingertips together near mouth, move toward mouth like bringing food to eat.",
  drink: "Make C-shape with hand, bring to mouth and tilt up like drinking from a cup.",
  go: "Point both index fingers at each other, then flip them forward in the direction you want to go.",
  like: "Place hand on chest with thumb and middle finger extended, pull away from chest.",
  "don't want": "Start with 'want' position, then shake head and push hands away.",
  "all done": "Both hands up, palms facing out, then flip them over showing the backs.",
  please: "Flat hand on chest, move in circular motion like you're polishing your heart.",
  "thank you": "Fingertips to lips, then move hand forward toward the person you're thanking.",
  i: "Point to yourself with index finger touching your chest.",
  you: "Point directly at the person you're talking to.",
  this: "Point down at something close to you with your index finger.",
  that: "Point away from you at something in the distance.",
  happy: "Flat hand on chest, brush upward repeatedly with a smile.",
  sad: "Both hands in front of face, fingers drooping down like tears falling.",
  mad: "Claw-like hands near face, pull down with angry expression.",
  sick: "Middle finger to forehead, other middle finger to stomach, both hands move slightly.",
  bathroom: "Shake a closed fist with thumb between index and middle finger.",
  play: "Make 'Y' handshapes with both hands, shake them back and forth playfully.",
  walk: "Both hands flat, palms down, alternate moving them forward like walking feet.",
  break: "Both hands in fists, thumbs up, then break them apart by bending at the knuckles.",
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    const description =
      signDescriptions[word.toLowerCase()] ||
      `Hand movements for "${word}": Watch how the hands move and try to copy the shape and motion.`

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Sign description error:", error)
    return NextResponse.json({ error: "Failed to get sign description" }, { status: 500 })
  }
}
