/**
 * Content Filter for Sign Language Teaching App
 *
 * This filter protects children by blocking inappropriate words across all app features.
 * Uses word-boundary matching to only block standalone profanities, not substrings.
 *
 * Examples:
 * - "fuck" -> blocked (standalone profanity)
 * - "hello" -> allowed (contains "hell" but is a different word)
 * - "cockatoo" -> allowed (contains "cock" but is a different word)
 * - "shitake" -> allowed (contains "shit" but is a different word)
 */

// Blocklist of inappropriate standalone words (free morphemes)
// These are only blocked when they appear as complete words, not as substrings
const BLOCKED_WORDS = new Set([
  // Profanity
  "fuck",
  "fucking",
  "fucked",
  "fucker",
  "fucks",
  "shit",
  "shitting",
  "shitty",
  "shits",
  "ass",
  "asshole",
  "bitch",
  "bitches",
  "bitching",
  "bastard",
  "bastards",
  "damn",
  "damned",
  "dammit",
  "hell",
  "crap",
  "crappy",
  "piss",
  "pissed",
  "pissing",
  "cunt",
  "cunts",

  // Sexual content
  "sex",
  "sexual",
  "sexy",
  "penis",
  "vagina",
  "dick",
  "dicks",
  "cock",
  "cocks",
  "pussy",
  "boob",
  "boobs",
  "tit",
  "tits",
  "nude",
  "naked",
  "porn",
  "pornography",
  "rape",
  "raped",
  "raping",
  "rapist",
  "molest",
  "molestation",
  "orgasm",
  "masturbate",
  "masturbation",
  "erotic",

  // Violence
  "kill",
  "killing",
  "killed",
  "killer",
  "murder",
  "murderer",
  "murdered",
  "suicide",
  "suicidal",
  "torture",

  // Weapons
  "gun",
  "guns",
  "rifle",
  "pistol",
  "bomb",
  "bombs",
  "grenade",

  // Drugs
  "cocaine",
  "heroin",
  "meth",

  // Hate speech
  "racist",
  "racism",
  "nazi",
  "nazis",
  "terrorist",

  // Slurs
  "retard",
  "retarded",
])

/**
 * Check if a word or phrase is inappropriate for children
 * Returns true if the content should be blocked
 *
 * Uses word-boundary matching: only blocks when a blocked word appears
 * as a standalone word, not as a substring of another word.
 */
export function isInappropriate(text: string): boolean {
  if (!text || typeof text !== "string") {
    return true // Block empty/invalid input
  }

  const trimmed = text.trim()
  if (trimmed.length === 0) {
    return true
  }

  // Normalize: lowercase and split into words
  // This naturally handles word boundaries - "hello" is one word, not "hell" + "o"
  const normalized = trimmed.toLowerCase()

  // Split on whitespace and common word separators to get individual words
  const words = normalized.split(/[\s\-_]+/)

  // Check each word against the blocklist
  for (const word of words) {
    // Clean the word of punctuation but preserve the core word
    const cleanWord = word.replace(/[^a-z0-9]/g, "")

    if (BLOCKED_WORDS.has(cleanWord)) {
      return true
    }
  }

  return false
}

/**
 * Get a user-friendly error message with suggested alternatives
 */
export function suggestAlternative(word: string): string {
  const suggestions = [
    "want",
    "more",
    "help",
    "please",
    "thank you",
    "yes",
    "no",
    "stop",
    "go",
    "all done",
    "eat",
    "drink",
    "play",
    "happy",
    "sad",
  ]

  return `Please try another word. We focus on educational, family-friendly communication like: ${suggestions.slice(0, 5).join(", ")}, and more.`
}

/**
 * Get comprehensive list of suggested teaching words
 */
export function getSuggestedWords(): string[] {
  return [
    // Core requests
    "want",
    "more",
    "help",
    "please",
    "thank you",

    // Responses
    "yes",
    "no",
    "okay",

    // Actions
    "stop",
    "go",
    "all done",
    "wait",
    "come",
    "look",

    // Basic needs
    "eat",
    "drink",
    "bathroom",
    "sleep",
    "diaper",

    // Emotions
    "happy",
    "sad",
    "mad",
    "scared",
    "tired",

    // People
    "mom",
    "dad",
    "baby",
    "friend",

    // Activities
    "play",
    "walk",
    "run",
    "jump",
    "dance",
    "sing",

    // Descriptors
    "hot",
    "cold",
    "big",
    "small",
    "loud",
    "quiet",

    // Locations
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
  ]
}

/**
 * Validate and sanitize user input
 */
export function validateInput(text: string): {
  valid: boolean
  message?: string
  suggestions?: string[]
} {
  if (!text || typeof text !== "string") {
    return {
      valid: false,
      message: "Please enter a word to teach.",
    }
  }

  const trimmed = text.trim()

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: "Please enter a word to teach.",
    }
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      message: "Please enter a shorter word or phrase (50 characters or less).",
    }
  }

  if (isInappropriate(trimmed)) {
    return {
      valid: false,
      message: suggestAlternative(trimmed),
      suggestions: getSuggestedWords(),
    }
  }

  return { valid: true }
}
