"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Volume2, X, BookOpen, PlayCircle, FileText } from "lucide-react"
import { ConversationWave } from "./anim/conversation-wave"
import { SpeechBubbles } from "./anim/speech-bubbles"
import { MicBars } from "./anim/mic-bars"
import { AnalyzingHeader } from "./anim/analyzing-header"
import { TeachingComicStrip } from "./teaching-comic-strip"
import { TeachingStepsComic } from "./teaching-steps-comic"
import Box from "@mui/material/Box"

const DEFAULT_GRID = [
  { text: "I", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "You", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "This", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "That", color: "bg-orange-600 hover:bg-orange-700 text-white" },
  { text: "Yes", color: "bg-green-600 hover:bg-green-700 text-white" },
  { text: "No", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Want", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { text: "Don't Want", color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { text: "Good", color: "bg-pink-500 hover:bg-pink-600 text-white" },
  { text: "Don't Like", color: "bg-gray-700 hover:bg-gray-800 text-white" },
  { text: "More", color: "bg-purple-600 hover:bg-purple-700 text-white" },
  { text: "All Done", color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { text: "Eat", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "Drink", color: "bg-cyan-500 hover:bg-cyan-600 text-white" },
  { text: "GO", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "Stop", color: "bg-red-600 hover:bg-red-700 text-white" },
  { text: "Walk", color: "bg-teal-500 hover:bg-teal-600 text-white" },
  { text: "Break", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { text: "Happy", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { text: "Sad", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "Mad", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Sick", color: "bg-gray-500 hover:bg-gray-600 text-white" },
  { text: "Help", color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { text: "Don't Know", color: "bg-pink-600 hover:bg-pink-700 text-white" },
  { text: "What", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "Bathroom", color: "bg-yellow-600 hover:bg-yellow-700 text-white" },
  { text: "Play", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "Please", color: "bg-teal-600 hover:bg-teal-700 text-white" },
  { text: "Thank You", color: "bg-purple-600 hover:bg-purple-700 text-white" },
]

let globalAnimationQueue = []
let globalQueueIndex = 0

function getNextAnimation() {
  if (globalAnimationQueue.length === 0 || globalQueueIndex >= globalAnimationQueue.length) {
    const indices = [...Array(5)].map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    globalAnimationQueue = indices
    globalQueueIndex = 0
  }
  const animationIndex = globalAnimationQueue[globalQueueIndex]
  globalQueueIndex++
  return animationIndex
}

const GuideImageSlot = ({ loading, imageUrl, word }: { loading: boolean; imageUrl: string; word: string }) => {
  return (
    <div className="p-4">
      <div
        className="
          relative isolate overflow-hidden
          w-full rounded-lg bg-gray-100
          aspect-[4/3] min-h-[220px]
        "
      >
        {/* Spinner (clipped inside slot) */}
        {loading && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Generating teaching scenario for "{word}"…</p>
            </div>
          </div>
        )}

        {/* Image (fills slot when ready) */}
        {!loading && imageUrl && (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Teaching scenario for ${word}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

const VisualLoadingAnimation = ({ word }: { word: string }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-2" />
    <p className="text-xs text-gray-600">Generating teaching scenario for "{word}"…</p>
  </div>
)

const CompactDeleteButton = ({
  onClick,
  label,
  position = "top-right",
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  position?: "top-right" | "top-left"
}) => {
  const pos = position === "top-left" ? "top-1.5 left-1.5 right-auto" : "top-1.5 right-1.5 left-auto"

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      aria-label={`Remove ${label}`}
      className={`
        absolute ${pos} z-10
        p-3 -m-3                   
        rounded-full
        transition transform
        hover:scale-105 active:scale-95
        md:opacity-0 md:group-hover:opacity-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300
        touch-manipulation
      `}
    >
      <span
        className="
          grid place-items-center
          h-5 w-5                    
          rounded-full
          bg-red-500/90 text-white
          shadow-sm ring-1 ring-white/60
          backdrop-blur-[2px]
        "
      >
        <X className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}

export default function SignSpeakAndPlay() {
  const [customButtons, setCustomButtons] = useState(DEFAULT_GRID.slice(0, 9))
  const [selectedWord, setSelectedWord] = useState("")
  const [customWord, setCustomWord] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [showStrategy, setShowStrategy] = useState(false)
  const [error, setError] = useState("")
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [loadingVisual, setLoadingVisual] = useState(false)
  const [visualUrl, setVisualUrl] = useState("")
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const [wordAnalysis, setWordAnalysis] = useState<Record<string, string>>({})
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showTeachingDrawer, setShowTeachingDrawer] = useState(false)
  const [showComicStrip, setShowComicStrip] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(0.5)
  const [showDescription, setShowDescription] = useState(false)
  const [signDescription, setSignDescription] = useState("")
  const [inputWord, setInputWord] = useState("")
  const [inputText, setInputText] = useState("")
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (videoUrl) {
      console.log("[v0] videoUrl changed:", videoUrl)
      console.log("[v0] isLoading:", isLoading)
      console.log("[v0] error:", error)
    }
  }, [videoUrl, isLoading, error])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedButtons = localStorage.getItem("customWordButtons")
      if (savedButtons) {
        try {
          setCustomButtons(JSON.parse(savedButtons))
        } catch (error) {
          console.error("Failed to parse saved buttons:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isMobile && videoUrl && !error) {
      console.log("[v0] Auto-showing video modal on mobile for:", selectedWord)
      setShowVideoModal(true)
    }
  }, [videoUrl, isMobile, error, selectedWord])

  useEffect(() => {
    // Pick the first word from the default grid or use "Want"
    const loadWord = "Want"
    // Small delay to ensure component is ready
    setTimeout(() => {
      generateSign(loadWord)
    }, 500)
  }, []) // Empty array = run once when page loads

  const fetchSignDescription = async (word: string) => {
    try {
      const response = await fetch("/api/sign-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      })
      const data = await response.json()
      setSignDescription(data.description)
    } catch (error) {
      console.error("Failed to fetch sign description:", error)
      setSignDescription(`Hand movements for "${word}": Watch how the hands move and try to copy the shape and motion.`)
    }
  }

  const generateSign = async (word: string) => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLastRequest))
    }
    setLastRequestTime(Date.now())

    setSelectedWord(word)
    setShowStrategy(false)
    setIsLoading(true)
    setError("")
    setShowDescription(false)

    fetchSignDescription(word)

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
      setVideoUrl("")
    }

    if (isMobile) {
      setShowVideoModal(true)
    }

    // if (isMobile) {
    //   setShowVideoModal(true)
    // }

    const startTime = Date.now()

    try {
      console.log("[v0] Making API request for word:", word)

      const response = await fetch("/api/sign-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: word }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (response.status === 200) {
        const blob = await response.blob()
        console.log("[v0] Blob received - Size:", blob.size, "Type:", blob.type)

        if (blob.size === 0) {
          throw new Error("Received empty video blob")
        }

        if (!blob.type.includes("video") && blob.size > 0) {
          console.warn("[v0] Unexpected blob type:", blob.type)
        }

        const url = URL.createObjectURL(blob)
        console.log("[v0] Created video URL:", url)

        setTimeout(() => {
          setVideoUrl(url)
          setIsLoading(false)
        }, 100)
      } else if (response.status === 202) {
        const data = await response.json()
        console.log("[v0] Request downgraded to BATCH:", data.batch_id)
        setError("Processing is taking longer than expected. Please try again.")
        setIsLoading(false)
      } else {
        const errorData = await response.json()
        console.log("[v0] Error response data:", errorData)
        setError(errorData.error || `Sign not available for "${word}"`)
        setIsLoading(false)
      }

      const elapsed = Date.now() - startTime
      if (elapsed < 1500) {
        await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed))
      }
    } catch (err) {
      console.error("[v0] Frontend error:", err)
      setError(`The sign for "${word}" isn't available right now`)
      setIsLoading(false)
    }
  }

  const speakText = async (text: string) => {
    setIsPlayingAudio(true)
    try {
      let contentToSpeak = text

      if (showStrategy && selectedWord && wordAnalysis[selectedWord] && text.includes("Teaching strategy")) {
        contentToSpeak = `Here's how to teach the word ${selectedWord}. ${wordAnalysis[selectedWord]}`
      }

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: contentToSpeak,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => {
          setIsPlayingAudio(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          console.error("Audio playback failed")
          setIsPlayingAudio(false)
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      } else {
        console.error("Failed to generate speech")
        setIsPlayingAudio(false)
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      setIsPlayingAudio(false)
    }
  }

  const generateVisualExample = async (word: string) => {
    setLoadingVisual(true)
    try {
      const r = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, instruction: `Teaching scenario for "${word}"` }),
      })
      const j = await r.json()
      setVisualUrl(j.imageUrl || "")
    } catch (e) {
      console.error("Visual gen failed:", e)
      setVisualUrl("")
    } finally {
      setLoadingVisual(false)
    }
  }

  const getPracticeSteps = (word: string) => {
    return [
      `Create opportunities where your child needs "${word}"`,
      `Model the sign while saying the word`,
      `Accept any attempt - approximations count!`,
      `Respond immediately when they try to communicate`,
    ]
  }

  const getCriticalTip = (word: string) => {
    return `Your child doesn't need to form the perfect sign. Any attempt to communicate "${word}" counts as success! Accepting approximations reduces your anxiety, prevents giving up too early, and accelerates your child's communication attempts.`
  }

  const generateTeachingPlan = (word: string) => {
    return {
      word,
      steps: getPracticeSteps(word),
      tips: [
        "Keep latency low: model → quick wait → reinforce.",
        "Use small pieces so you have more teaching moments.",
        "Say and sign together to strengthen the cue.",
      ],
    }
  }

  const addCustomWord = () => {
    if (customWord.trim() && customButtons.length < 30) {
      const colors = [
        "bg-blue-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-yellow-500",
        "bg-indigo-500",
        "bg-teal-500",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const newButton = {
        text: customWord.trim(),
        color: randomColor,
      }

      const updatedButtons = [...customButtons, newButton]
      setCustomButtons(updatedButtons)
      if (typeof window !== "undefined") {
        localStorage.setItem("customWordButtons", JSON.stringify(updatedButtons))
      }
      setCustomWord("")
    }
  }

  const handleSearch = () => {
    if (customWord.trim()) {
      generateSign(customWord.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const deleteWord = (index: number) => {
    const updatedButtons = customButtons.filter((_, i) => i !== index)
    setCustomButtons(updatedButtons)
    if (typeof window !== "undefined") {
      localStorage.setItem("customWordButtons", JSON.stringify(updatedButtons))
    }
  }

  const ASLLoadingAnimation = ({ word }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8" style={{ textAlign: "center" }}>
        <Box
          sx={{
            width: "100%",
            minHeight: 140,
            display: "grid",
            placeItems: "center",
            justifySelf: "center",
            alignSelf: "center",
          }}
        >
          <ConversationWave width={260} height={120} />
        </Box>
        <div className="text-center">
          <p className="text-sm text-gray-600">Preparing sign</p>
          <p className="text-lg font-bold text-indigo-600">"{word}"</p>
        </div>
      </div>
    )
  }

  const getLoadingAnimation = (context: "sign" | "speech" | "strategy", word: string) => {
    switch (context) {
      case "sign":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8" style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center w-full mb-4">
              <ConversationWave width={260} height={120} />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Preparing sign</p>
              <p className="text-lg font-bold text-indigo-600">"{word}"</p>
            </div>
          </div>
        )
      case "speech":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8" style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center w-full mb-4">
              <MicBars width={180} height={28} />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Generating speech</p>
              <p className="text-lg font-bold text-indigo-600">"{word}"</p>
            </div>
          </div>
        )
      case "strategy":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8" style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center w-full mb-4">
              <SpeechBubbles leftLabel="Parent" rightLabel="Child" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Analyzing strategy</p>
              <p className="text-lg font-bold text-indigo-600">"{word}"</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8" style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center w-full mb-4">
              <AnalyzingHeader />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-indigo-600">"{word}"</p>
            </div>
          </div>
        )
    }
  }

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const MobileVideoModal = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <h2 className="text-xl font-bold">{selectedWord}</h2>
        <button
          onClick={() => {
            setShowVideoModal(false)
            if (videoUrl) {
              URL.revokeObjectURL(videoUrl)
              setVideoUrl("")
            }
          }}
          className="p-2"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading ? (
          <ASLLoadingAnimation word={selectedWord} />
        ) : error ? (
          <div className="text-white text-center">
            <p className="text-lg mb-2">{error}</p>
            <p className="text-sm opacity-75">Try a different word or check back later</p>
          </div>
        ) : videoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-w-full max-h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              controls={false}
              onLoadedMetadata={(e) => {
                const video = e.target as HTMLVideoElement
                video.playbackRate = playbackSpeed
                video.play().catch((err) => {
                  console.log("Video autoplay failed:", err)
                })
              }}
              onError={(e) => {
                console.error("[v0] Video error:", e)
                console.error("[v0] Video error details:", e.target.error)
              }}
              onCanPlay={() => {
                console.log("Video can play")
              }}
            />

            <div className="absolute bottom-4 left-4 flex gap-2">
              {[0.25, 0.5, 0.75, 1].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changePlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    playbackSpeed === speed ? "bg-blue-500 text-white" : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                >
                  {speed === 1 ? "Normal" : `${speed}x`}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-4 bg-white rounded-t-3xl">
        {videoUrl && (
          <div className="mb-3">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
            >
              {showDescription ? "▼" : "▶"} How to make this sign
            </button>
            {showDescription && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700 mb-3">{signDescription}</div>
            )}
          </div>
        )}

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            <Button
              onClick={() => speakText(selectedWord)}
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600"
              disabled={isPlayingAudio}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {isPlayingAudio ? "Speaking..." : "Speak Word"}
            </Button>

            <Button onClick={() => setShowStrategy(!showStrategy)} variant="outline" className="flex-shrink-0">
              <BookOpen className="mr-2 h-4 w-4" />
              {showStrategy ? "Show Video" : "Teaching Guide"}
            </Button>

            <Button
              onClick={() => {
                setShowVideoModal(false)
                setTimeout(() => {
                  setShowComicStrip(true)
                  if (selectedWord) {
                    generateVisualExample(selectedWord)
                  }
                }, 100)
              }}
              variant="outline"
              className="flex-shrink-0"
            >
              <FileText className="mr-2 h-4 w-4" />
              Visual Guide
            </Button>
          </div>
        </div>

        {showStrategy && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl max-h-60 overflow-auto">
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-bold text-lg">Teaching Guide</h3>
            </div>

            <div className="mb-6">
              <TeachingStepsComic word={selectedWord} />
            </div>

            {loadingAnalysis ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : wordAnalysis[selectedWord] ? (
              <div className="whitespace-pre-wrap text-gray-700 text-sm">{wordAnalysis[selectedWord]}</div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {getPracticeSteps(selectedWord).map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-bold text-yellow-700">{i + 1}.</span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-orange-100 rounded">
                  <p className="text-sm font-medium">{getCriticalTip(selectedWord)}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const getCoaching = async (word: string) => {
    const key = word.toLowerCase().trim()
    if (wordAnalysis[key]) return wordAnalysis[key]

    setLoadingAnalysis(true)
    try {
      const r = await fetch("/api/analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      })

      const j = await r.json()
      // Defensive checks
      if (!j?.analysis) throw new Error("No analysis in response")

      setWordAnalysis((prev) => ({ ...prev, [key]: j.analysis }))
      return j.analysis
    } catch (e) {
      console.error("Analysis failed:", e)
      const fallback = `FUNCTION: comment — quick connection using "${word}".\nCONTEXTS: books · play · shared attention.\nTIP: Point + sign together.\nAVOID: Testing without context.`
      setWordAnalysis((prev) => ({ ...prev, [key]: fallback }))
      return fallback
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const handleSign = () => {
    if (inputText.trim()) {
      generateSign(inputText.trim())
    }
  }

  const handleAdd = () => {
    if (inputText.trim() && customButtons.length < 30) {
      const colors = [
        "bg-blue-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-yellow-500",
        "bg-indigo-500",
        "bg-teal-500",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const newButton = {
        text: inputText.trim(),
        color: randomColor,
      }

      const updatedButtons = [...customButtons, newButton]
      setCustomButtons(updatedButtons)
      if (typeof window !== "undefined") {
        localStorage.setItem("customWordButtons", JSON.stringify(updatedButtons))
      }
      setInputText("")
    }
  }

  const addWord = (word: string) => {
    if (word.trim() && customButtons.length < 30) {
      const colors = [
        "bg-blue-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-yellow-500",
        "bg-indigo-500",
        "bg-teal-500",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const newButton = {
        text: word.trim(),
        color: randomColor,
      }

      const updatedButtons = [...customButtons, newButton]
      setCustomButtons(updatedButtons)
      if (typeof window !== "undefined") {
        localStorage.setItem("customWordButtons", JSON.stringify(updatedButtons))
      }
    }
  }

  const openTeachingGuide = async (word: string) => {
    if (!word) return
    setSelectedWord(word)
    // reset any stale media so we don't flash old content
    setVisualUrl("")
    setShowStrategy(false)
    setShowVideoModal(false) // ensure video modal isn't fighting the guide
    setShowGuide(true)

    // kick both tasks at once; UI will fill as they land
    setLoadingVisual(true)
    getCoaching(word).catch(() => {}) // strategy
    generateVisualExample(word).finally(() => setLoadingVisual(false)) // image
  }

  if (isMobile) {
    return (
      <div className="h-screen-safe bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-mobile-base text-center bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <h1 className="text-mobile-2xl font-black">
            <span className="text-blue-600">Sign</span>
            <span className="text-gray-400">, </span>
            <span className="text-purple-600">Speak</span>
            <span className="text-gray-400">, & </span>
            <span className="text-pink-600">Play</span>
          </h1>
          <p className="text-mobile-sm text-gray-600 mt-1">Click buttons or type in words to see them signed</p>
        </div>

        <div className="flex-1 overflow-y-auto p-mobile-base pb-safe-32 mobile-scroll">
          <Card className="p-mobile-lg mb-mobile-base">
            <div className="max-h-96 overflow-y-auto mobile-scroll">
              <div className="grid grid-cols-3 gap-mobile-base min-h-0">
                {customButtons.map((word, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => {
                        console.log("Button clicked:", word.text)
                        generateSign(word.text)
                      }}
                      className={`${word.color} text-white rounded-2xl font-bold
                                w-full aspect-square flex items-center justify-center
                                text-mobile-base shadow-md active:scale-95 transition-transform
                                overflow-hidden min-h-[88px] touch-manipulation select-none`}
                    >
                      {word.text}
                    </button>

                    <CompactDeleteButton label={word.text} onClick={() => deleteWord(index)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-2xl p-mobile-base shadow-sm border border-gray-200">
              <p className="text-mobile-sm text-gray-600 mb-mobile-sm font-medium">Add words or sign:</p>

              <div className="flex flex-col gap-mobile-sm">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateSign(inputText)}
                  placeholder="Type any word..."
                  className="flex-1 px-mobile-base py-mobile-sm border border-gray-300 rounded-xl
                           text-mobile-base placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-orange-500 focus:border-transparent touch-optimized"
                />

                <div className="flex flex-col gap-mobile-xs">
                  <button
                    onClick={() => addWord(inputText)}
                    disabled={!inputText.trim()}
                    className="w-full btn-mobile-base bg-gray-600 text-white rounded-xl font-semibold
                             disabled:bg-gray-300 disabled:text-gray-500 transition-colors
                             shadow-md touch-optimized"
                  >
                    Add
                  </button>

                  <button
                    onClick={() => generateSign(inputText)}
                    disabled={!inputText.trim() || isLoading}
                    className="w-full btn-mobile-base bg-orange-500 text-white rounded-xl font-semibold
                             disabled:bg-gray-300 disabled:text-gray-500 transition-colors
                             shadow-md touch-optimized"
                  >
                    {isLoading ? "Signing..." : "Sign"}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {selectedWord && (
            <Card className="p-mobile-lg mb-mobile-base">
              <div className="flex items-center justify-between mb-mobile-base">
                <h3 className="text-mobile-xl font-bold text-orange-600">{selectedWord}</h3>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 
                           rounded-lg text-mobile-sm font-medium touch-optimized min-h-[44px]"
                >
                  <FileText className="h-4 w-4" />
                  Description
                </button>
              </div>

              {showDescription && (
                <div className="mb-mobile-base p-mobile-base bg-blue-50 rounded-lg">
                  <p className="text-mobile-sm text-blue-800 leading-relaxed">
                    {signDescription || "Loading description..."}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-mobile-base safe-area-pb">
          <div className="flex justify-center gap-mobile-base">
            {/* Speak */}
            <button
              onClick={() => selectedWord && speakText(selectedWord)}
              disabled={!selectedWord || isPlayingAudio}
              className="flex-1 btn-mobile-base bg-orange-500 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              <span className="text-mobile-sm">{isPlayingAudio ? "Speaking..." : "Speak"}</span>
            </button>

            {/* Teaching Guide (image + strategy) */}
            <button
              onClick={() => selectedWord && openTeachingGuide(selectedWord)}
              disabled={!selectedWord}
              className="flex-1 btn-mobile-base bg-blue-600 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-mobile-sm">Teaching Guide</span>
            </button>
          </div>
        </div>

        {showVideoModal && <MobileVideoModal />}

        {showGuide && selectedWord && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
              <h2 className="text-xl font-bold">Teaching Guide: "{selectedWord}"</h2>
              <button
                onClick={() => {
                  setShowGuide(false)
                  setVisualUrl("")
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-white">
              <GuideImageSlot loading={loadingVisual} imageUrl={visualUrl} word={selectedWord} />

              {/* Steps */}
              <div className="p-4 border-t">
                <TeachingStepsComic word={selectedWord} />
              </div>

              {/* Strategy text or fallback */}
              <div className="p-4 border-t">
                {loadingAnalysis ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : wordAnalysis[selectedWord?.toLowerCase?.()] ? (
                  <div className="whitespace-pre-wrap text-gray-700 text-sm">
                    {wordAnalysis[selectedWord.toLowerCase()]}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {getPracticeSteps(selectedWord).map((step, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="font-bold text-yellow-700">{i + 1}.</span>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-orange-100 rounded">
                      <p className="text-sm font-medium">{getCriticalTip(selectedWord)}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Optional funneler back to sign video */}
              <div className="p-4 border-t flex items-center gap-2">
                <Button
                  onClick={() =>
                    speakText(
                      `Teaching strategy for ${selectedWord}. ${wordAnalysis[selectedWord?.toLowerCase?.()] || getPracticeSteps(selectedWord).join(". ")}`,
                    )
                  }
                  variant="outline"
                  disabled={isPlayingAudio}
                  className="text-sm"
                >
                  <Volume2 className="mr-2 h-4 w-4" /> {isPlayingAudio ? "Speaking..." : "Narrate Guide"}
                </Button>
                <Button
                  onClick={() => {
                    setShowGuide(false)
                    if (!videoUrl) generateSign(selectedWord)
                    setShowVideoModal(true)
                  }}
                  variant="outline"
                  className="text-sm"
                >
                  <PlayCircle className="mr-2 h-4 w-4" /> Show Sign Video
                </Button>
              </div>

              {/* Comics */}
              <div className="p-4 border-t">
                <TeachingComicStrip word={selectedWord} onClose={() => setShowGuide(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col">
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-96 flex-shrink-0 flex flex-col">
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-2xl font-bold">Sign, Speak & Play</h1>
            <p className="text-sm text-gray-600">Click buttons or type in words to see them signed</p>
          </div>

          <Card className="flex-1 p-3 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {customButtons.map((word, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => generateSign(word.text)}
                      className={`${word.color} text-white rounded-lg font-semibold text-sm
                                aspect-square flex items-center justify-center w-full
                                transform transition-all hover:scale-105 overflow-hidden select-none`}
                    >
                      {word.text}
                    </button>

                    <CompactDeleteButton label={word.text} onClick={() => deleteWord(index)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
              <p className="text-xs text-gray-600 mb-2 font-medium">Add words or sign:</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type any word..."
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-full px-4 border-gray-200"
                />
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="rounded-full px-6 bg-orange-500 hover:bg-orange-600"
                  disabled={!customWord.trim()}
                >
                  Sign
                </Button>
                <Button
                  onClick={addCustomWord}
                  size="sm"
                  variant="outline"
                  className="rounded-full px-6 bg-green-50 hover:bg-green-100 border-green-300"
                  disabled={!customWord.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Type a word and click Sign to try it, or Add to save it to your grid
              </p>
            </div>
          </Card>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <Card className="flex-1 p-4 flex flex-col min-h-0">
            {selectedWord ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-3 text-orange-600 flex-shrink-0">{selectedWord}</h2>

                <div className="flex-1 mb-4 min-h-0">
                  {showStrategy ? (
                    <div className="h-full bg-yellow-50 rounded-lg p-4 overflow-auto">
                      <div className="flex items-center justify-center mb-3">
                        <BookOpen className="h-5 w-5 text-orange-600 mr-2" />
                        <h3 className="font-bold text-lg">Teaching Guide</h3>
                      </div>

                      <div className="mb-6">
                        <TeachingStepsComic word={selectedWord} />
                      </div>

                      <GuideImageSlot loading={loadingVisual} imageUrl={visualUrl} word={selectedWord} />

                      {loadingAnalysis ? (
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ) : wordAnalysis[selectedWord] ? (
                        <div className="prose prose-sm">
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <h3 className="font-bold text-lg flex-shrink-0">Teaching Guide</h3>
                            <Button
                              onClick={() =>
                                speakText(`Teaching strategy for ${selectedWord}. ${wordAnalysis[selectedWord]}`)
                              }
                              size="sm"
                              variant="outline"
                              disabled={isPlayingAudio}
                              className="text-xs flex-shrink-0"
                            >
                              <Volume2 className="mr-1 h-3 w-3" />
                              {isPlayingAudio ? "Speaking..." : "Audio"}
                            </Button>
                          </div>
                          <div className="whitespace-pre-wrap text-gray-700 mb-4">{wordAnalysis[selectedWord]}</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <h3 className="font-bold text-lg flex-shrink-0">Teaching Guide</h3>
                            <Button
                              onClick={() =>
                                speakText(
                                  `Teaching strategy for ${selectedWord}. ${getPracticeSteps(selectedWord).join(". ")} ${getCriticalTip(selectedWord)}`,
                                )
                              }
                              size="sm"
                              variant="outline"
                              disabled={isPlayingAudio}
                              className="text-xs flex-shrink-0"
                            >
                              <Volume2 className="mr-1 h-3 w-3" />
                              {isPlayingAudio ? "Speaking..." : "Audio"}
                            </Button>
                          </div>
                          <div className="space-y-2 mb-4">
                            {getPracticeSteps(selectedWord).map((step, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="font-bold text-yellow-700">{i + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-3 bg-orange-100 rounded mb-4">
                            <p className="text-sm font-medium">{getCriticalTip(selectedWord)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="h-full rounded-2xl overflow-hidden relative">
                      {!isLoading && !error && videoUrl && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1">
                            <PlayCircle className="h-4 w-4 text-white" />
                            <span className="text-white text-sm font-medium">Sign Video</span>
                          </div>
                        </div>
                      )}

                      {isLoading ? (
                        <ASLLoadingAnimation word={selectedWord} />
                      ) : error ? (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-800">
                          <div className="text-center p-4">
                            <p className="text-lg mb-2 font-medium">{error}</p>
                            <p className="text-sm opacity-75">Try a different word or check back later</p>
                          </div>
                        </div>
                      ) : videoUrl ? (
                        <>
                          <video
                            key={videoUrl}
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-full object-contain bg-white"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            onLoadedMetadata={(e) => {
                              console.log("[v0] Video metadata loaded")
                              const video = e.target as HTMLVideoElement
                              video.playbackRate = playbackSpeed
                              video
                                .play()
                                .then(() => {
                                  console.log("[v0] Video playing successfully")
                                })
                                .catch((err) => {
                                  console.error("[v0] Video play failed:", err)
                                })
                            }}
                            onError={(e) => {
                              console.error("[v0] Video error:", e)
                              const video = e.target as HTMLVideoElement
                              console.error("[v0] Video error details:", video.error)
                              setError("Video playback failed")
                            }}
                            onCanPlay={() => {
                              console.log("[v0] Video can play")
                            }}
                            style={{ pointerEvents: "none" }}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>

                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                            <div className="flex justify-between items-end">
                              <div className="flex gap-2 mb-2">
                                {[0.25, 0.5, 0.75, 1].map((speed) => (
                                  <button
                                    key={speed}
                                    onClick={() => changePlaybackSpeed(speed)}
                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                      playbackSpeed === speed
                                        ? "bg-blue-500 text-white"
                                        : "bg-black/50 text-white hover:bg-black/70"
                                    }`}
                                  >
                                    {speed === 1 ? "Normal" : `${speed}x`}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => setShowDescription(!showDescription)}
                                className="text-white text-sm hover:text-blue-300 flex items-center gap-1"
                              >
                                {showDescription ? "▼" : "▶"} How to make this sign
                              </button>
                            </div>
                            {showDescription ? (
                              <div className="mt-2 p-3 bg-black/70 rounded-lg text-white text-sm">
                                {signDescription}
                              </div>
                            ) : (
                              <p className="text-white text-sm text-center font-medium drop-shadow-lg">
                                Any approximation counts — accept all attempts
                              </p>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button onClick={() => speakText(selectedWord)} className="flex-1" disabled={isPlayingAudio}>
                    <Volume2 className="mr-2 h-4 w-4" />
                    {isPlayingAudio ? "Speaking..." : "Speak Word"}
                  </Button>
                  <Button onClick={() => setShowStrategy(!showStrategy)} variant="outline" className="flex-1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {showStrategy ? "Show Video" : "Teaching Guide"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowComicStrip(true)
                      generateVisualExample(selectedWord)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Visual Guide
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👆</div>
                  <p className="text-xl text-gray-600">Click any word to see the sign</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      {showVideoModal && <MobileVideoModal />}

      {showComicStrip && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h2 className="text-xl font-bold">Teaching Guide: "{selectedWord}"</h2>
            <button
              onClick={() => setShowComicStrip(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6 max-w-4xl mx-auto">
              <div className="mb-8">
                <TeachingStepsComic word={selectedWord} />
              </div>
              <div className="border-t pt-8">
                <TeachingComicStrip word={selectedWord} onClose={() => setShowComicStrip(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
