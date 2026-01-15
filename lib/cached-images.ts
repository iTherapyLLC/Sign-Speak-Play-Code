/**
 * Cached Teaching Images for Core Vocabulary
 *
 * Pre-approved, family-friendly images for common teaching words.
 *
 * SENSITIVE words (affection, family) ALWAYS use cached images - never call Flux
 * SAFE words (actions, objects) can fall back to Flux with strict filters
 */

export interface CachedImage {
  url: string
  alt: string
  category: string
  /** If true, ALWAYS use cache - never call Flux (risk of inappropriate generation) */
  sensitive: boolean
}

/**
 * Core vocabulary words with pre-approved teaching images.
 * Keys are lowercase for consistent lookup.
 */
export const CACHED_TEACHING_IMAGES: Record<string, CachedImage> = {
  // ============================================
  // SENSITIVE WORDS - Always use cache, never Flux
  // Risk of romantic/inappropriate image generation
  // ============================================

  // Affection - HIGH RISK of romantic interpretation
  "i love you": {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent hugging toddler with love",
    category: "affection",
    sensitive: true,
  },
  love: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Loving parent-child moment",
    category: "affection",
    sensitive: true,
  },
  "love you": {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent expressing love to toddler",
    category: "affection",
    sensitive: true,
  },
  hug: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent and toddler hugging",
    category: "affection",
    sensitive: true,
  },
  kiss: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent giving toddler a kiss on the forehead",
    category: "affection",
    sensitive: true,
  },

  // Family members - RISK of generating adult couples
  mom: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Mother with toddler",
    category: "people",
    sensitive: true,
  },
  mommy: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Mother with toddler",
    category: "people",
    sensitive: true,
  },
  mama: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Mother with toddler",
    category: "people",
    sensitive: true,
  },
  dad: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Father with toddler",
    category: "people",
    sensitive: true,
  },
  daddy: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Father with toddler",
    category: "people",
    sensitive: true,
  },
  papa: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Father with toddler",
    category: "people",
    sensitive: true,
  },
  baby: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Toddler with parent",
    category: "people",
    sensitive: true,
  },
  grandma: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Grandmother with toddler",
    category: "people",
    sensitive: true,
  },
  grandpa: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Grandfather with toddler",
    category: "people",
    sensitive: true,
  },
  grandmother: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Grandmother with toddler",
    category: "people",
    sensitive: true,
  },
  grandfather: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Grandfather with toddler",
    category: "people",
    sensitive: true,
  },
  nana: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Grandmother with toddler",
    category: "people",
    sensitive: true,
  },
  poppy: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Grandfather with toddler",
    category: "people",
    sensitive: true,
  },

  // ============================================
  // SAFE WORDS - Can use Flux with strict filters
  // Low risk of inappropriate generation
  // ============================================

  // Requests - SAFE
  want: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent helping toddler reach for desired item",
    category: "request",
    sensitive: false,
  },
  more: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent offering more food to toddler at mealtime",
    category: "request",
    sensitive: false,
  },
  help: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent helping toddler with a task",
    category: "request",
    sensitive: false,
  },
  please: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Parent teaching toddler polite requests",
    category: "request",
    sensitive: false,
  },
  "thank you": {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent and toddler sharing a grateful moment",
    category: "request",
    sensitive: false,
  },
  give: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent giving item to toddler",
    category: "request",
    sensitive: false,
  },
  open: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent helping toddler open something",
    category: "request",
    sensitive: false,
  },

  // Responses - SAFE
  yes: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Toddler nodding yes to parent",
    category: "response",
    sensitive: false,
  },
  no: {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
    alt: "Toddler shaking head no",
    category: "refusal",
    sensitive: false,
  },
  stop: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Parent teaching toddler to communicate stop",
    category: "refusal",
    sensitive: false,
  },
  "all done": {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Toddler signaling all done at mealtime",
    category: "refusal",
    sensitive: false,
  },
  "don't want": {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
    alt: "Toddler refusing offered item",
    category: "refusal",
    sensitive: false,
  },
  finished: {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Toddler signaling finished",
    category: "refusal",
    sensitive: false,
  },

  // Commands/Actions - SAFE
  go: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent and toddler ready to go",
    category: "command",
    sensitive: false,
  },
  come: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent calling toddler to come",
    category: "command",
    sensitive: false,
  },
  look: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler looking at something together",
    category: "command",
    sensitive: false,
  },
  wait: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent teaching toddler to wait patiently",
    category: "command",
    sensitive: false,
  },
  sit: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent teaching toddler to sit",
    category: "command",
    sensitive: false,
  },
  stand: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler standing with parent support",
    category: "command",
    sensitive: false,
  },

  // Basic needs - SAFE
  eat: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent feeding toddler at mealtime",
    category: "request",
    sensitive: false,
  },
  drink: {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Toddler drinking from sippy cup with parent",
    category: "request",
    sensitive: false,
  },
  sleep: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Parent putting toddler to sleep",
    category: "request",
    sensitive: false,
  },
  potty: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent helping with potty training",
    category: "request",
    sensitive: false,
  },
  bathroom: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent helping toddler with bathroom",
    category: "request",
    sensitive: false,
  },

  // Emotions - SAFE
  happy: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Happy toddler smiling with parent",
    category: "comment",
    sensitive: false,
  },
  sad: {
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
    alt: "Parent comforting sad toddler",
    category: "comment",
    sensitive: false,
  },
  mad: {
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
    alt: "Parent helping toddler express frustration",
    category: "comment",
    sensitive: false,
  },
  scared: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent comforting scared toddler",
    category: "comment",
    sensitive: false,
  },
  tired: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Tired toddler with parent",
    category: "comment",
    sensitive: false,
  },
  like: {
    url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
    alt: "Toddler showing they like something",
    category: "comment",
    sensitive: false,
  },
  good: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Parent praising toddler for good behavior",
    category: "comment",
    sensitive: false,
  },
  bad: {
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
    alt: "Parent teaching about bad feelings",
    category: "comment",
    sensitive: false,
  },

  // Directions - SAFE
  up: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent lifting toddler up",
    category: "direction",
    sensitive: false,
  },
  down: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Toddler wanting to get down",
    category: "direction",
    sensitive: false,
  },
  in: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent teaching in concept",
    category: "direction",
    sensitive: false,
  },
  out: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler wanting to go out",
    category: "direction",
    sensitive: false,
  },
  on: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent teaching on concept",
    category: "direction",
    sensitive: false,
  },
  off: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent teaching off concept",
    category: "direction",
    sensitive: false,
  },

  // Activities - SAFE
  play: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler playing together",
    category: "activity",
    sensitive: false,
  },
  walk: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent and toddler walking together",
    category: "activity",
    sensitive: false,
  },
  run: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler running with parent nearby",
    category: "activity",
    sensitive: false,
  },
  jump: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler jumping with parent support",
    category: "activity",
    sensitive: false,
  },
  dance: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler dancing together",
    category: "activity",
    sensitive: false,
  },
  sing: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent singing with toddler",
    category: "activity",
    sensitive: false,
  },
  read: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent reading book with toddler",
    category: "activity",
    sensitive: false,
  },

  // Descriptors - SAFE
  hot: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent teaching hot concept with warm food",
    category: "descriptor",
    sensitive: false,
  },
  cold: {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Parent teaching cold concept",
    category: "descriptor",
    sensitive: false,
  },
  big: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing big concept to toddler",
    category: "descriptor",
    sensitive: false,
  },
  small: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing small concept to toddler",
    category: "descriptor",
    sensitive: false,
  },
  little: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing little concept to toddler",
    category: "descriptor",
    sensitive: false,
  },
  loud: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent teaching loud concept",
    category: "descriptor",
    sensitive: false,
  },
  quiet: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent teaching quiet concept",
    category: "descriptor",
    sensitive: false,
  },

  // Questions - SAFE
  what: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent and toddler exploring what something is",
    category: "question",
    sensitive: false,
  },
  where: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler looking for something",
    category: "question",
    sensitive: false,
  },
  who: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent teaching who concept to toddler",
    category: "question",
    sensitive: false,
  },
  why: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent answering toddler's why question",
    category: "question",
    sensitive: false,
  },
  how: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent showing toddler how to do something",
    category: "question",
    sensitive: false,
  },
}

/**
 * List of sensitive words that should NEVER use Flux generation.
 * These have high risk of generating romantic/inappropriate content.
 */
export const SENSITIVE_WORDS = new Set([
  "i love you",
  "love",
  "love you",
  "hug",
  "kiss",
  "mom",
  "mommy",
  "mama",
  "dad",
  "daddy",
  "papa",
  "baby",
  "grandma",
  "grandpa",
  "grandmother",
  "grandfather",
  "nana",
  "poppy",
])

/**
 * Get a cached image for a word if available.
 * Returns null if no cached image exists.
 *
 * @param word - The word to look up (case-insensitive)
 * @returns CachedImage object or null
 */
export function getCachedImage(word: string): CachedImage | null {
  if (!word || typeof word !== "string") {
    return null
  }

  const normalizedWord = word.toLowerCase().trim()
  return CACHED_TEACHING_IMAGES[normalizedWord] || null
}

/**
 * Check if a word is sensitive and should ALWAYS use cached images.
 * Sensitive words should NEVER be sent to Flux due to risk of inappropriate generation.
 *
 * @param word - The word to check (case-insensitive)
 * @returns boolean - true if word is sensitive
 */
export function isSensitiveWord(word: string): boolean {
  if (!word || typeof word !== "string") {
    return false
  }

  const normalizedWord = word.toLowerCase().trim()

  // Check explicit sensitive list
  if (SENSITIVE_WORDS.has(normalizedWord)) {
    return true
  }

  // Also check if cached image is marked sensitive
  const cached = CACHED_TEACHING_IMAGES[normalizedWord]
  return cached?.sensitive === true
}

/**
 * Check if a word has a cached image available.
 *
 * @param word - The word to check (case-insensitive)
 * @returns boolean
 */
export function hasCachedImage(word: string): boolean {
  return getCachedImage(word) !== null
}

/**
 * Get all available cached words.
 *
 * @returns Array of cached word strings
 */
export function getCachedWords(): string[] {
  return Object.keys(CACHED_TEACHING_IMAGES)
}

/**
 * Get all sensitive words that require cached images.
 *
 * @returns Array of sensitive word strings
 */
export function getSensitiveWords(): string[] {
  return Array.from(SENSITIVE_WORDS)
}

/**
 * Get cached words by category.
 *
 * @param category - The category to filter by
 * @returns Array of cached word strings in that category
 */
export function getCachedWordsByCategory(category: string): string[] {
  return Object.entries(CACHED_TEACHING_IMAGES)
    .filter(([_, image]) => image.category === category)
    .map(([word, _]) => word)
}

/**
 * Get only safe (non-sensitive) cached words.
 *
 * @returns Array of safe word strings
 */
export function getSafeWords(): string[] {
  return Object.entries(CACHED_TEACHING_IMAGES)
    .filter(([_, image]) => !image.sensitive)
    .map(([word, _]) => word)
}
