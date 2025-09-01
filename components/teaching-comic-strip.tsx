"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, BookOpen } from "lucide-react"
import { AnimatedWaveform } from "./animated-waveform"
import { VisualGuideLoader } from "./visual-guide-loader"

interface TeachingComicProps {
  word: string
  onClose?: () => void
}

export const TeachingComicStrip: React.FC<TeachingComicProps> = ({ word, onClose }) => {
  const [comic, setComic] = useState<any>(null)
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [loadingVisual, setLoadingVisual] = useState(true)

  useEffect(() => {
    loadTeachingStrategy()
  }, [word])

  const loadTeachingStrategy = async () => {
    setLoading(true)
    setLoadingVisual(true)

    try {
      const response = await fetch("/api/teaching-comic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Log what model was used
      console.log(`[v0] Visual Guide generated using: ${data.model || "fallback"}`)
      console.log(`[v0] Communication function: ${data.communicationFunction}`)

      setComic(data)
      setAnalysis(data.strategy)
    } catch (error) {
      console.error("Failed to generate visual guide:", error)
      setComic({
        imageUrl: `https://via.placeholder.com/1792x1024/FFF5E6/FF6B35?text=Teaching+${word}`,
        fallback: true,
      })
      setAnalysis(getDefaultStrategy(word))
    } finally {
      setLoading(false)
      setLoadingVisual(false)
    }
  }

  const speakStrategy = async () => {
    setSpeaking(true)
    const text = `Teaching ${word}. ${analysis}`

    try {
      await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then(async (res) => {
        const blob = await res.blob()
        const audio = new Audio(URL.createObjectURL(blob))
        audio.onended = () => setSpeaking(false)
        await audio.play()
      })
    } catch (error) {
      console.error("Speech failed:", error)
      setSpeaking(false)
    }
  }

  const getDefaultStrategy = (word: string) => {
    return `FUNCTION: Communication
Essential for expressing "${word}"

CONTEXTS:
• During daily routines when "${word}" naturally occurs
• During play when the concept comes up
• At transition times

TIP: Create natural opportunities by pausing before providing what they want. Wait for any communication attempt.

AVOID: Requiring perfect pronunciation or sign formation - accept any approximation`
  }

  if (loading) {
    return <VisualGuideLoader />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">"{word}"</h3>
        <Button onClick={speakStrategy} disabled={speaking} size="sm" variant="outline">
          <Volume2 className="mr-2 h-4 w-4" />
          {speaking ? (
            <div className="flex items-center space-x-2">
              <AnimatedWaveform isActive={true} />
              <span>Narrating...</span>
            </div>
          ) : (
            "Narrate Guide"
          )}
        </Button>
      </div>

      {loadingVisual ? (
        <Card className="p-0 bg-gray-50">
          <VisualGuideLoader />
        </Card>
      ) : comic?.imageUrl ? (
        <Card className="overflow-hidden">
          <div className="relative">
            <img
              src={comic.imageUrl || "/placeholder.svg"}
              alt={`Visual teaching guide for "${word}"`}
              className="w-full aspect-video object-cover rounded-lg"
              onError={(e) => {
                console.error("Image failed to load:", comic.imageUrl)
                e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=Teaching+${word}+sign+language`
              }}
            />
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold">
              {comic.aiGenerated ? "AI-Generated" : "Curated"} Teaching Scenario
            </div>
            {comic.fallback && (
              <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                Curated Image
              </div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-bold mb-2">How to Teach "{word}"</h4>
            <p className="text-sm text-gray-600 mb-3">
              This visual guide shows natural parent-child interactions for teaching communication.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 bg-gray-50">
          <div className="p-8 text-center text-gray-500">
            <p>Visual guide temporarily unavailable</p>
          </div>
        </Card>
      )}

      <Card className="bg-blue-50 p-4">
        <div className="flex items-center mb-2">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <h4 className="font-bold">Teaching Context</h4>
        </div>
        <p className="text-sm whitespace-pre-wrap text-gray-700">{analysis}</p>
      </Card>
    </div>
  )
}
