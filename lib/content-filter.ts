/**
 * Content Filter for Sign Language Teaching App
 *
 * This filter protects children by blocking inappropriate words across all app features.
 * Categories blocked: profanity, sexual content, violence, drugs, hate speech, weapons
 */

// Comprehensive blocklist of inappropriate words
const BLOCKED_WORDS = new Set([
  // Profanity
  "fuck",
  "fucking",
  "fucked",
  "fucker",
  "fucks",
  "fuk",
  "f u c k",
  "f@ck",
  "f*ck",
  "shit",
  "shitting",
  "shitty",
  "shits",
  "sh!t",
  "sh*t",
  "ass",
  "asshole",
  "asses",
  "a$$",
  "bitch",
  "bitches",
  "bitching",
  "b!tch",
  "b*tch",
  "damn",
  "damned",
  "dammit",
  "hell",
  "hells",
  "crap",
  "crappy",
  "piss",
  "pissed",
  "pissing",
  "bastard",
  "bastards",

  // Sexual content
  "sex",
  "sexual",
  "sexy",
  "penis",
  "vagina",
  "dick",
  "cock",
  "pussy",
  "breast",
  "breasts",
  "boob",
  "boobs",
  "tit",
  "tits",
  "nude",
  "naked",
  "porn",
  "pornography",
  "rape",
  "molest",
  "molestation",
  "orgasm",
  "masturbate",
  "masturbation",
  "erotic",
  "arousal",

  // Violence
  "kill",
  "killing",
  "killed",
  "killer",
  "murder",
  "murderer",
  "murdered",
  "shoot",
  "shooting",
  "shot",
  "stab",
  "stabbing",
  "stabbed",
  "attack",
  "attacking",
  "attacked",
  "fight",
  "fighting",
  "beat",
  "beating",
  "punch",
  "punching",
  "kick",
  "kicking",
  "slap",
  "slapping",
  "blood",
  "bloody",
  "bleed",
  "bleeding",
  "die",
  "dying",
  "dead",
  "death",
  "suicide",
  "suicidal",
  "torture",

  // Weapons
  "gun",
  "guns",
  "rifle",
  "pistol",
  "knife",
  "knives",
  "blade",
  "bomb",
  "bombs",
  "explosive",
  "weapon",
  "weapons",
  "grenade",

  // Drugs
  "drug",
  "drugs",
  "cocaine",
  "heroin",
  "meth",
  "marijuana",
  "weed",
  "alcohol",
  "beer",
  "wine",
  "vodka",
  "whiskey",
  "drunk",
  "cigarette",
  "tobacco",
  "addict",

  // Hate speech
  "hate",
  "hating",
  "hated",
  "racist",
  "racism",
  "nazi",
  "nazis",
  "terrorist",

  // Other inappropriate
  "stupid",
  "idiot",
  "dumb",
  "moron",
  "retard",
  "retarded",
  "ugly",
  "suck",
  "sucks",
  "sucking",
])

/**
 * Check if a word or phrase is inappropriate for children
 * Returns true if the content should be blocked
 */
export function isInappropriate(text: string): boolean {
  if (!text || typeof text !== "string") {
    return true // Block empty/invalid input
  }

  // Normalize: lowercase, remove extra spaces, remove special characters used to bypass filters
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars like @, *, !
    .replace(/\s+/g, " ") // Normalize spaces

  // Check if the exact word/phrase is blocked
  if (BLOCKED_WORDS.has(normalized)) {
    return true
  }

  // Check if any blocked word appears in the text
  const words = normalized.split(/\s+/)
  for (const word of words) {
    if (BLOCKED_WORDS.has(word)) {
      return true
    }
  }

  // Check for partial matches (e.g., "fucking" contains "fuck")
  for (const blockedWord of BLOCKED_WORDS) {
    if (normalized.includes(blockedWord)) {
      return true
    }
  }

  // Check for character-separated attempts to bypass (e.g., "f u c k")
  const noSpaces = normalized.replace(/\s/g, "")
  for (const blockedWord of BLOCKED_WORDS) {
    if (noSpaces.includes(blockedWord.replace(/\s/g, ""))) {
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
