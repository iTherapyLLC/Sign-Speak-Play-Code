"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Volume2, Play, Plus, X, Edit3, Lightbulb } from "lucide-react"

const DEFAULT_GRID = [
  { text: "I", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "You", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "This", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "That", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "Yes", color: "bg-green-600 hover:bg-green-700 text-white" },
  { text: "No", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Want", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { text: "Don't Want", color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { text: "Good", color: "bg-pink-500 hover:bg-pink-600 text-white" },
  { text: "Don't Like", color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { text: "More", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { text: "All Done", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "Eat", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "Drink", color: "bg-cyan-500 hover:bg-cyan-600 text-white" },
  { text: "GO", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "Stop", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Walk", color: "bg-teal-500 hover:bg-teal-600 text-white" },
  { text: "Break", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { text: "Happy", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { text: "Sad", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "Mad", color: "bg-red-500 hover:bg-red-600 text-white" },
  { text: "Sick", color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { text: "Help", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { text: "Don't Know", color: "bg-pink-500 hover:bg-pink-600 text-white" },
  { text: "What", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { text: "Bathroom", color: "bg-yellow-600 hover:bg-yellow-700 text-white" },
  { text: "Play", color: "bg-green-500 hover:bg-green-600 text-white" },
  { text: "Please", color: "bg-teal-500 hover:bg-teal-600 text-white" },
  { text: "Thank You", color: "bg-purple-500 hover:bg-purple-600 text-white" },
]

export default function SignSpeakAndPlayOriginal() {
  const [words, setWords] = useState(DEFAULT_GRID)
  const [selectedWord, setSelectedWord] = useState("")
  const [signVideoUrl, setSignVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(-1)

  const handleWordClick = async (index: number, word: string, event?: React.MouseEvent) => {
    if (editMode && event?.detail === 3) {
      // Triple-tap editing
      const newWord = prompt(`Change "${word}" to:`, word)
      if (newWord && newWord.trim()) {
        const updatedWords = [...words]
        updatedWords[index] = { ...updatedWords[index], text: newWord.trim() }
        setWords(updatedWords)
      }
      return
    }

    // Regular word activation
    setSelectedWord(word)
    setIsLoading(true)

    try {
      const response = await fetch("/api/sign-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const videoUrl = URL.createObjectURL(blob)
        setSignVideoUrl(videoUrl)
      } else {
        console.error("Failed to fetch sign video")
      }
    } catch (error) {
      console.error("Error fetching sign video:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await handleWordClick(-1, searchTerm.trim())
    }
  }

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      speechSynthesis.speak(utterance)
    }
  }

  const addNewWord = () => {
    const newWord = prompt("Enter new word:")
    if (newWord && newWord.trim()) {
      const colors = [
        "bg-blue-500 hover:bg-blue-600 text-white",
        "bg-green-500 hover:bg-green-600 text-white",
        "bg-purple-500 hover:bg-purple-600 text-white",
        "bg-orange-500 hover:bg-orange-600 text-white",
        "bg-pink-500 hover:bg-pink-600 text-white",
        "bg-teal-500 hover:bg-teal-600 text-white",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setWords([...words, { text: newWord.trim(), color: randomColor }])
    }
  }

  const deleteWord = (index: number) => {
    const updatedWords = words.filter((_, i) => i !== index)
    setWords(updatedWords)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Animated Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-black">
            <span
              className="text-blue-600"
              style={{ animation: "float 3s ease-in-out infinite", animationDelay: "0s" }}
            >
              Sign
            </span>
            <span className="text-gray-400 mx-3">,</span>
            <span
              className="text-purple-600"
              style={{ animation: "float 3s ease-in-out infinite", animationDelay: "0.5s" }}
            >
              Speak
            </span>
            <span className="text-gray-400 mx-3">,</span>
            <span className="text-gray-500 mx-3">&</span>
            <span
              className="text-pink-600"
              style={{ animation: "float 3s ease-in-out infinite", animationDelay: "1s" }}
            >
              Play
            </span>
          </h1>
          <p className="text-xl text-gray-600 mt-4">Double tap a word to learn its sign</p>
        </div>

        {/* How to Edit Button */}
        <div className="mb-4">
          <Button
            onClick={() => setEditMode(!editMode)}
            className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            How to Edit
          </Button>
        </div>

        {/* Tip Box */}
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">Tip: Triple-tap any word to change it to what your child needs!</span>
          </div>
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {words.map((word, index) => (
            <div key={index} className="relative group">
              <Button
                onClick={(e) => handleWordClick(index, word.text, e)}
                onMouseEnter={() => setHoveredButton(index)}
                onMouseLeave={() => setHoveredButton(-1)}
                className={`w-full h-16 text-lg font-semibold rounded-xl ${word.color} relative`}
              >
                {word.text}
                {editMode && hoveredButton === index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteWord(index)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Button>
            </div>
          ))}

          {/* Add Button */}
          <Button
            onClick={addNewWord}
            className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-600 rounded-xl"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>

        {/* Search and Speak Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search for any word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 rounded-r-none"
            />
            <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white rounded-l-none">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => speakWord(selectedWord || searchTerm)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Speak
          </Button>
        </div>

        {/* Video Display */}
        {selectedWord && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Sign for "{selectedWord}"</h2>

                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading sign video...</p>
                    </div>
                  ) : signVideoUrl ? (
                    <video src={signVideoUrl} autoPlay loop muted className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">ASL Sign Video for "{selectedWord}"</p>
                      <p className="text-sm text-gray-500 mt-1">Professional avatar demonstration</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleWordClick(-1, selectedWord)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Try Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
