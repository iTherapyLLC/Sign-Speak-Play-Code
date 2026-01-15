/**
 * Cached Teaching Images for Core Vocabulary
 *
 * Pre-approved, family-friendly images for common teaching words.
 * These bypass AI generation to ensure appropriate, consistent content.
 *
 * All images are from Unsplash (free for commercial use) featuring
 * authentic parent-child interactions for teaching communication.
 */

export interface CachedImage {
  url: string
  alt: string
  category: string
}

/**
 * Core vocabulary words with pre-approved teaching images.
 * Keys are lowercase for consistent lookup.
 */
export const CACHED_TEACHING_IMAGES: Record<string, CachedImage> = {
  // Requests
  want: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent helping toddler reach for desired item",
    category: "request",
  },
  more: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent offering more food to toddler at mealtime",
    category: "request",
  },
  help: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent helping toddler with a task",
    category: "request",
  },
  please: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Parent teaching toddler polite requests",
    category: "request",
  },
  "thank you": {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent and toddler sharing a grateful moment",
    category: "request",
  },

  // Responses
  yes: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Toddler nodding yes to parent",
    category: "response",
  },
  no: {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
    alt: "Toddler shaking head no",
    category: "refusal",
  },
  stop: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Parent teaching toddler to communicate stop",
    category: "refusal",
  },
  "all done": {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Toddler signaling all done at mealtime",
    category: "refusal",
  },
  "don't want": {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
    alt: "Toddler refusing offered item",
    category: "refusal",
  },

  // Commands/Actions
  go: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent and toddler ready to go",
    category: "command",
  },
  come: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent calling toddler to come",
    category: "command",
  },
  look: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler looking at something together",
    category: "command",
  },
  wait: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent teaching toddler to wait patiently",
    category: "command",
  },

  // Basic needs
  eat: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent feeding toddler at mealtime",
    category: "request",
  },
  drink: {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Toddler drinking from sippy cup with parent",
    category: "request",
  },
  sleep: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Parent putting toddler to sleep",
    category: "request",
  },

  // Emotions
  happy: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Happy toddler smiling with parent",
    category: "comment",
  },
  sad: {
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
    alt: "Parent comforting sad toddler",
    category: "comment",
  },
  mad: {
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80",
    alt: "Parent helping toddler express frustration",
    category: "comment",
  },
  scared: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Parent comforting scared toddler",
    category: "comment",
  },
  tired: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Tired toddler with parent",
    category: "comment",
  },
  like: {
    url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
    alt: "Toddler showing they like something",
    category: "comment",
  },

  // Affection - CRITICAL: Pre-approved parent-child images only
  "i love you": {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent hugging toddler with love",
    category: "affection",
  },
  love: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Loving parent-child moment",
    category: "affection",
  },
  "love you": {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent expressing love to toddler",
    category: "affection",
  },
  hug: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent and toddler hugging",
    category: "affection",
  },
  kiss: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent giving toddler a kiss on the forehead",
    category: "affection",
  },

  // People
  mom: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Mother with toddler",
    category: "people",
  },
  mommy: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Mother with toddler",
    category: "people",
  },
  dad: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Father with toddler",
    category: "people",
  },
  daddy: {
    url: "https://images.unsplash.com/photo-1476703993599-0a1dd7228f2d?w=800&q=80",
    alt: "Father with toddler",
    category: "people",
  },
  baby: {
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    alt: "Toddler with parent",
    category: "people",
  },

  // Directions
  up: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent lifting toddler up",
    category: "direction",
  },
  down: {
    url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80",
    alt: "Toddler wanting to get down",
    category: "direction",
  },
  in: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent teaching in concept",
    category: "direction",
  },
  out: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler wanting to go out",
    category: "direction",
  },

  // Activities
  play: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler playing together",
    category: "activity",
  },
  walk: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Parent and toddler walking together",
    category: "activity",
  },
  run: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler running with parent nearby",
    category: "activity",
  },
  jump: {
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    alt: "Toddler jumping with parent support",
    category: "activity",
  },
  dance: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler dancing together",
    category: "activity",
  },
  sing: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent singing with toddler",
    category: "activity",
  },
  read: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent reading book with toddler",
    category: "activity",
  },

  // Descriptors
  hot: {
    url: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",
    alt: "Parent teaching hot concept with warm food",
    category: "descriptor",
  },
  cold: {
    url: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    alt: "Parent teaching cold concept",
    category: "descriptor",
  },
  big: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing big concept to toddler",
    category: "descriptor",
  },
  small: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing small concept to toddler",
    category: "descriptor",
  },
  little: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent showing little concept to toddler",
    category: "descriptor",
  },

  // Questions
  what: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    alt: "Parent and toddler exploring what something is",
    category: "question",
  },
  where: {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    alt: "Parent and toddler looking for something",
    category: "question",
  },
  who: {
    url: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80",
    alt: "Parent teaching who concept to toddler",
    category: "question",
  },
}

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
