"use client"

import { useState } from "react"

export default function TestImageGeneration() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testWord, setTestWord] = useState("hello")
  const [testCategory, setTestCategory] = useState("request")

  const testImageGeneration = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/debug-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: testWord,
          category: testCategory,
        }),
      })

      const data = await response.json()
      setResult(data)

      // Log to console for debugging
      console.log("API Response:", data)
    } catch (error) {
      console.error("Test failed:", error)
      setResult({ error: "Network error", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Generation Debug Test</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Test Word:</label>
          <input
            type="text"
            value={testWord}
            onChange={(e) => setTestWord(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter test word"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category:</label>
          <select
            value={testCategory}
            onChange={(e) => setTestCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="request">Request</option>
            <option value="response">Response</option>
            <option value="refusal">Refusal</option>
            <option value="command">Command</option>
            <option value="question">Question</option>
            <option value="comment">Comment</option>
          </select>
        </div>

        <button
          onClick={testImageGeneration}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test Image Generation"}
        </button>
      </div>

      {result && (
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-bold mb-2">API Response:</h2>

          {result.imageUrl && (
            <div className="mb-4">
              <h3 className="font-semibold">Generated Image:</h3>
              <img
                src={result.imageUrl || "/placeholder.svg"}
                alt="Generated"
                className="mt-2 max-w-md border rounded"
              />
            </div>
          )}

          {result.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
              <h3 className="font-semibold text-red-700">Error:</h3>
              <p className="text-red-600">{result.error}</p>
              {result.details && <pre className="mt-2 text-sm text-red-500">{result.details}</pre>}
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold">Full Response:</h3>
            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Test Image Generation" to attempt creating an image</li>
          <li>Check the console (F12 → Console tab) for detailed logs</li>
          <li>The error details will show the exact OpenAI API response</li>
          <li>Check your deployment logs for server-side console output</li>
        </ol>
      </div>
    </div>
  )
}
