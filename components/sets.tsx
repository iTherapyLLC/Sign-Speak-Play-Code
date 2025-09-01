"use client"

// components/sets.tsx

import { useState } from "react"
import { X } from "lucide-react"
import TeachingStepsComic from "./TeachingStepsComic"
import TeachingComicStrip from "./TeachingComicStrip"
import VisualLoadingAnimation from "./VisualLoadingAnimation"

const SetsComponent = () => {
  const [selectedWord, setSelectedWord] = useState("")
  const [loadingVisual, setLoadingVisual] = useState(false)
  const [visualUrl, setVisualUrl] = useState("")
  const [showComicStrip, setShowComicStrip] = useState(false)

  const getCoaching = async (word: string) => {
    // Simulate fetching coaching data
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const speakText = (text: string) => {
    // Simulate text-to-speech functionality
    console.log(text)
  }

  // Fix the generateVisualExample function (around line 290)
  const generateVisualExample = async (word: string) => {
    setLoadingVisual(true)
    // Remove this line - it's for desktop only
    // setShowStrategy(true);
    setShowComicStrip(false)

    const analysisPromise = getCoaching(word)

    try {
      const response = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          instruction: `Analyze the communication function of "${word}" (request, refusal, command, question, or comment). 
                       Create an image prompt showing a parent and child in a positive teaching moment for this word.
                       The scene should show the natural context where this word would be taught.
                       Focus on: diverse families, warm interactions, clear teaching moments.`,
        }),
      })

      const data = await response.json()
      setVisualUrl(data.imageUrl)

      await analysisPromise
    } catch (error) {
      console.error("Visual generation failed:", error)
    } finally {
      setLoadingVisual(false)
    }
  }

  // ... existing code here ...

  return (
    <div>
      {/* ... existing code here ... */}

      {showComicStrip && selectedWord && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h2 className="text-xl font-bold">Visual Guide: "{selectedWord}"</h2>
            <button
              onClick={() => {
                setShowComicStrip(false)
                setVisualUrl("") // Clear visual URL when closing
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {loadingVisual ? (
              <div className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <VisualLoadingAnimation word={selectedWord} />
                </div>
              </div>
            ) : visualUrl ? (
              <div className="p-4">
                <div className="bg-orange-100 rounded-lg p-2 mb-2">
                  <p className="text-xs font-medium text-orange-800">AI-Generated Teaching Scenario</p>
                </div>
                <img
                  src={visualUrl || "/placeholder.svg"}
                  alt={`Teaching scenario for ${selectedWord}`}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            ) : null}

            {/* Teaching Steps Comic */}
            <div className="p-4 border-t">
              <TeachingStepsComic word={selectedWord} />
            </div>

            {/* Teaching Comic Strip */}
            <div className="p-4 border-t">
              <TeachingComicStrip word={selectedWord} onClose={() => setShowComicStrip(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ... existing code here ... */}
    </div>
  )
}

export default SetsComponent
