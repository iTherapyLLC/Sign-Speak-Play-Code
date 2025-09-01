"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Volume2, Loader2, Play, Pause } from "lucide-react"

const API_KEY = process.env.NEXT_PUBLIC_SIGNSPEAKAPIKEY || process.env.SIGNSPEAKAPIKEY

const QUICK_WORDS = [
  { text: "I", color: "bg-blue-100 hover:bg-blue-200" },
  { text: "Me", color: "bg-yellow-100 hover:bg-yellow-200" },
  { text: "This", color: "bg-green-100 hover:bg-green-200" },
  { text: "That", color: "bg-yellow-100 hover:bg-yellow-200" },
  { text: "Yes", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "No", color: "bg-red-500 hover:bg-red-600 text-white" },

  { text: "Want", color: "bg-purple-100 hover:bg-purple-200" },
  { text: "Don't Want", color: "bg-gray-100 hover:bg-gray-200" },
  { text: "Like", color: "bg-pink-100 hover:bg-pink-200" },
  { text: "Don't Like", color: "bg-gray-100 hover:bg-gray-200" },
  { text: "More", color: "bg-indigo-100 hover:bg-indigo-200" },
  { text: "All Done", color: "bg-blue-100 hover:bg-blue-200" },

  { text: "Eat", color: "bg-purple-100 hover:bg-purple-200" },
  { text: "Drink", color: "bg-purple-100 hover:bg-purple-200" },
  { text: "GO", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "Stop", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Walk", color: "bg-indigo-100 hover:bg-indigo-200" },
  { text: "Break", color: "bg-pink-100 hover:bg-pink-200" },

  { text: "Happy", color: "bg-blue-100 hover:bg-blue-200" },
  { text: "Sad", color: "bg-indigo-100 hover:bg-indigo-200" },
  { text: "Mad", color: "bg-orange-100 hover:bg-orange-200" },
  { text: "Sick", color: "bg-gray-100 hover:bg-gray-200" },
  { text: "Help", color: "bg-blue-100 hover:bg-blue-200" },
  { text: "Don't Know", color: "bg-pink-100 hover:bg-pink-200" },

  { text: "What", color: "bg-orange-100 hover:bg-orange-200" },
  { text: "Where", color: "bg-red-100 hover:bg-red-200" },
  { text: "Bathroom", color: "bg-yellow-100 hover:bg-yellow-200" },
  { text: "Play", color: "bg-yellow-100 hover:bg-yellow-200" },
  { text: "Feel", color: "bg-purple-100 hover:bg-purple-200" },
  { text: "Thank You", color: "bg-purple-100 hover:bg-purple-200" },
]

export default function SignLanguageTranslator() {
  const [selectedWord, setSelectedWord] = useState("")
  const [customWord, setCustomWord] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoCache, setVideoCache] = useState<Record<string, string>>({})

  const generateSign = async (text: string) => {
    // Check cache first
    if (videoCache[text]) {
      setVideoUrl(videoCache[text])
      setSelectedWord(text)
      setIsPlaying(true)
      return
    }

    setIsLoading(true)
    setError("")
    setSelectedWord(text)

    // Clear previous video
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
      setVideoUrl("")
    }

    try {
      const response = await fetch("https://api.sign-speak.com/produce-sign", {
        method: "POST",
        headers: {
          "X-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english: text,
          request_class: "BLOCKING",
          identity: "MALE",
          model_version: "SLP.2.sm",
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        setVideoCache((prev) => ({ ...prev, [text]: url }))
        setIsPlaying(true)
      } else {
        throw new Error("Failed to generate sign")
      }
    } catch (err) {
      setError("Unable to generate sign. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (customWord.trim()) {
      generateSign(customWord.trim())
      setCustomWord("")
      setShowSearch(false)
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    return () => {
      Object.values(videoCache).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [videoCache])

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.play()
    }
  }, [videoUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🤟 Sign, Speak, and Play 🤟</h1>
          <p className="text-lg text-gray-600">Touch a word to learn the sign</p>
        </div>

        <Card className="mb-6 p-4 bg-white/90 backdrop-blur">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="ml-3 text-white">Generating sign for "{selectedWord}"...</p>
              </div>
            ) : videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                  autoPlay
                />
                <button
                  onClick={toggleVideo}
                  className="absolute bottom-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded">{selectedWord}</div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <p className="text-2xl mb-2">👋</p>
                  <p>Select a word to see the sign</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {QUICK_WORDS.map((word, index) => (
            <button
              key={index}
              onClick={() => generateSign(word.text)}
              disabled={isLoading}
              className={`
                ${word.color}
                p-4 rounded-2xl font-semibold text-lg
                transform transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md hover:shadow-lg
              `}
            >
              {word.text}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowSearch(!showSearch)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Other Words
          </Button>
          <Button
            onClick={() => selectedWord && speak(selectedWord)}
            disabled={!selectedWord}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            Speak
          </Button>
        </div>

        {showSearch && (
          <Card className="mt-4 p-4 bg-white/95 backdrop-blur">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type any word or phrase..."
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-lg py-6"
                autoFocus
              />
              <Button
                onClick={handleSearch}
                disabled={!customWord.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                Show Sign
              </Button>
              <Button onClick={() => setShowSearch(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {error && (
          <Card className="mt-4 p-4 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
