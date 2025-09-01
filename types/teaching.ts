export type MediaType = "image" | "lottie" | "video" | "placeholder"

export interface FrameMedia {
  type: MediaType
  /** For image/video: URL. For lottie: JSON (import or URL). */
  src?: string
  /** For accessible alt text / captions */
  alt: string
  /** Optional Lottie JSON object if you import it */
  lottieJson?: object
  /** Start time in seconds for video trims (optional) */
  startAt?: number
  /** End time in seconds for video trims (optional) */
  endAt?: number
}

export interface TeachingFrame {
  title: string // e.g., "Introduce the sign"
  caption: string // short, parent-friendly line
  media: FrameMedia
}

export interface TeachingPlan {
  word: string // e.g., "more"
  quickSequence: TeachingFrame[] // 2–4 frames; default 3
  steps: string[] // detailed text steps
  tips?: string[] // optional extra tips
  // Optional: if you also have a simple demo video
  demoVideoUrl?: string
}
