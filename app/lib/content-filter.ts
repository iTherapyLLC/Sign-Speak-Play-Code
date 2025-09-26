// Comprehensive blocked terms list using Set for O(1) lookups
const BLOCKED_TERMS = new Set([
  // Profanity
  "fuck",
  "shit",
  "damn",
  "hell",
  "ass",
  "bitch",
  "bastard",
  "crap",
  "piss",
  "whore",
  "slut",
  "asshole",
  "motherfucker",
  "goddamn",

  // Sexual terms
  "sex",
  "porn",
  "dick",
  "pussy",
  "cock",
  "penis",
  "vagina",
  "boob",
  "tit",
  "breast",
  "nipple",
  "naked",
  "nude",

  // Violence
  "kill",
  "murder",
  "suicide",
  "rape",
  "assault",
  "torture",
  "stab",
  "shoot",
  "die",
  "death",
  "blood",
  "gun",
  "knife",
  "weapon",
  "hurt",
  "pain",
  "violence",
  "fight",
  "attack",
  "destroy",

  // Drugs/alcohol
  "cocaine",
  "heroin",
  "meth",
  "weed",
  "marijuana",
  "drug",
  "alcohol",
  "drunk",
  "beer",
  "wine",

  // Slurs and hate speech
  "nigger",
  "faggot",
  "retard",
  "kike",
  "spic",
  "chink",
  "tranny",
  "hate",
  "stupid",
  "idiot",

  // Additional concerning terms for children's app
  "molest",
  "pedophile",
  "trafficking",
  "kidnap",
  "abuse",

  // Body functions (keeping some for educational alternatives)
  "poop",
  "pee",
  "fart",
  "butt",
])

// Common letter substitutions used to bypass filters
const SUBSTITUTIONS: Record<string, string[]> = {
  a: ["@", "4"],
  e: ["3"],
  i: ["1", "!"],
  o: ["0"],
  s: ["$", "5"],
  u: ["v"],
  l: ["1"],
  t: ["7"],
}

// Educational alternatives for common inappropriate words
const EDUCATIONAL_ALTERNATIVES: Record<string, string> = {
  poop: "potty",
  pee: "potty",
  butt: "bottom",
  stupid: "frustrated",
  hate: "dislike",
  kill: "stop",
  die: "finished",
  toilet: "bathroom",
  hurt: "ouch",
}

/**
 * Normalize text to catch bypass attempts
 */
function normalizeText(text: string): string[] {
  if (!text) return []

  // Basic normalization
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .trim()

  // Generate variations with common substitutions reversed
  const variations = [normalized]

  // Reverse common letter substitutions
  let variant = normalized
  for (const [letter, substitutes] of Object.entries(SUBSTITUTIONS)) {
    for (const sub of substitutes) {
      variant = variant.replace(new RegExp(sub, "g"), letter)
    }
  }
  if (variant !== normalized) {
    variations.push(variant)
  }

  // Check with spaces removed (catches "f u c k")
  variations.push(normalized.replace(/\s/g, ""))

  return variations
}

/**
 * Enhanced inappropriate content filter
 */
export function isInappropriate(text: string): boolean {
  if (!text) return false

  const variations = normalizeText(text)

  // Check all variations against blocked terms
  for (const variant of variations) {
    // Check full phrase
    for (const term of BLOCKED_TERMS) {
      if (variant.includes(term)) {
        console.warn(`[Content Filter] Blocked term detected: ${term}`)
        return true
      }
    }

    // Check individual words
    const words = variant.split(" ")
    for (const word of words) {
      if (BLOCKED_TERMS.has(word)) {
        console.warn(`[Content Filter] Blocked word detected: ${word}`)
        return true
      }
    }
  }

  return false
}

/**
 * Check if a word might be misspelled profanity
 * Uses Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Advanced filter with fuzzy matching for misspellings
 */
export function isInappropriateAdvanced(text: string): boolean {
  if (!text) return false

  // First try the standard check
  if (isInappropriate(text)) return true

  // Check for close misspellings of profanity (distance of 1-2 characters)
  const normalized = text.toLowerCase().replace(/[^a-z]/g, "")
  const commonProfanity = ["fuck", "shit", "dick", "pussy", "cock"]

  for (const profanity of commonProfanity) {
    if (levenshteinDistance(normalized, profanity) <= 2) {
      console.warn(`[Content Filter] Possible misspelled profanity detected`)
      return true
    }
  }

  return false
}

/**
 * Provide helpful alternative suggestions based on context
 */
export function suggestAlternative(text: string): string {
  const lowered = text.toLowerCase()

  // Check for educational alternatives first
  const alternative = getEducationalAlternative(text)
  if (alternative) {
    return `Try "${alternative}" instead - it's more appropriate for learning!`
  }

  // Context-specific suggestions
  if (lowered.includes("kill") || lowered.includes("murder")) {
    return "This word isn't appropriate for our educational app. Try 'stop' or 'no' instead."
  }

  if (lowered.includes("sex") || lowered.includes("fuck")) {
    return "Please use family-friendly words. This app is designed for teaching children."
  }

  if (lowered.includes("drug") || lowered.includes("alcohol")) {
    return "Let's focus on positive communication words like 'help', 'please', or 'thank you'."
  }

  // Default message
  return "Please try another word. We focus on educational, family-friendly communication."
}

export function getFilteredMessage(): string {
  return "Please try another word. We focus on educational, family-friendly communication."
}

export function getEducationalAlternative(word: string): string | null {
  const normalized = word.toLowerCase().trim()
  return EDUCATIONAL_ALTERNATIVES[normalized] || null
}

// Export for testing
export const _testInternals = {
  normalizeText,
  levenshteinDistance,
  BLOCKED_TERMS,
}
