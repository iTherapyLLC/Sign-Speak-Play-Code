"use client"

import { Lightbulb, RefreshCw } from "lucide-react"

interface ErrorData {
  error: string
  suggestions: string[]
  tip: string
}

interface NotFoundMessageProps {
  errorData: ErrorData
  onSuggestionClick: (word: string) => void
  onReset: () => void
}

export default function NotFoundMessage({ errorData, onSuggestionClick, onReset }: NotFoundMessageProps) {
  return (
    <div className="text-center py-8 flex flex-col items-center">
      <img src="/placeholder.svg?width=128&height=128" alt="Character shrugging" className="w-32 h-32 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops! Sign not found.</h2>
      <p className="text-lg text-red-600 mb-4">{errorData.error}</p>

      <div className="w-full max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg text-left mb-6">
        <h3 className="font-bold text-yellow-800 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Tip
        </h3>
        <p className="text-yellow-700">{errorData.tip}</p>
      </div>

      <div className="mt-4 w-full max-w-md">
        <p className="text-gray-600 mb-3 font-medium">Try one of these core words:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {errorData.suggestions.map((word) => (
            <button
              key={word}
              onClick={() => onSuggestionClick(word)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all"
      >
        <RefreshCw className="w-5 h-5" />
        Clear and Try Again
      </button>
    </div>
  )
}
