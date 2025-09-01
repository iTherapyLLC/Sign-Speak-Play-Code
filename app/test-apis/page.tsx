"use client"

import { useState } from "react"

export default function TestAPIs() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<any>({})

  const testSignSpeak = async () => {
    setLoading((prev) => ({ ...prev, signSpeak: true }))
    try {
      const res = await fetch("/api/sign-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: "hello" }),
      })
      const data = await res.text()
      setResults((prev) => ({
        ...prev,
        signSpeak: {
          status: res.status,
          success: res.ok,
          response: data.substring(0, 100) + (data.length > 100 ? "..." : ""),
        },
      }))
    } catch (e) {
      setResults((prev) => ({ ...prev, signSpeak: { status: "ERROR", error: e.message } }))
    }
    setLoading((prev) => ({ ...prev, signSpeak: false }))
  }

  const testOpenAI = async () => {
    setLoading((prev) => ({ ...prev, openAI: true }))
    try {
      const res = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: "test",
        }),
      })
      const data = await res.json()
      setResults((prev) => ({
        ...prev,
        openAI: {
          status: res.status,
          success: res.ok,
          fallback: data.fallback,
          reason: data.fallbackReason,
        },
      }))
    } catch (e) {
      setResults((prev) => ({ ...prev, openAI: { status: "ERROR", error: e.message } }))
    }
    setLoading((prev) => ({ ...prev, openAI: false }))
  }

  const testElevenLabs = async () => {
    setLoading((prev) => ({ ...prev, elevenLabs: true }))
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "test" }),
      })
      const success = res.ok && res.headers.get("content-type")?.includes("audio")
      setResults((prev) => ({
        ...prev,
        elevenLabs: {
          status: res.status,
          success: success,
          contentType: res.headers.get("content-type"),
        },
      }))
    } catch (e) {
      setResults((prev) => ({ ...prev, elevenLabs: { status: "ERROR", error: e.message } }))
    }
    setLoading((prev) => ({ ...prev, elevenLabs: false }))
  }

  const testAnalyzeWord = async () => {
    setLoading((prev) => ({ ...prev, analyzeWord: true }))
    try {
      const res = await fetch("/api/analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: "help" }),
      })
      const data = await res.json()
      setResults((prev) => ({
        ...prev,
        analyzeWord: {
          status: res.status,
          success: res.ok,
          source: data.source,
          hasAnalysis: !!data.analysis,
        },
      }))
    } catch (e) {
      setResults((prev) => ({ ...prev, analyzeWord: { status: "ERROR", error: e.message } }))
    }
    setLoading((prev) => ({ ...prev, analyzeWord: false }))
  }

  const testAll = async () => {
    await Promise.all([testSignSpeak(), testOpenAI(), testElevenLabs(), testAnalyzeWord()])
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Status Check</h1>

      <div className="mb-6">
        <button
          onClick={testAll}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          Test All APIs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sign-Speak API */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Sign-Speak API</h2>
          <button
            onClick={testSignSpeak}
            disabled={loading.signSpeak}
            className="block w-full px-4 py-2 bg-blue-500 text-white rounded mb-3 disabled:opacity-50"
          >
            {loading.signSpeak ? "Testing..." : "Test Sign Video Generation"}
          </button>
          <div className="text-sm">
            <div>Status: {results.signSpeak?.status || "Not tested"}</div>
            <div>Success: {results.signSpeak?.success ? "✅" : results.signSpeak ? "❌" : "⏳"}</div>
            {results.signSpeak?.error && <div className="text-red-600">Error: {results.signSpeak.error}</div>}
          </div>
        </div>

        {/* OpenAI API */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">OpenAI API</h2>
          <button
            onClick={testOpenAI}
            disabled={loading.openAI}
            className="block w-full px-4 py-2 bg-green-500 text-white rounded mb-3 disabled:opacity-50"
          >
            {loading.openAI ? "Testing..." : "Test Image Generation"}
          </button>
          <div className="text-sm">
            <div>Status: {results.openAI?.status || "Not tested"}</div>
            <div>Success: {results.openAI?.success ? "✅" : results.openAI ? "❌" : "⏳"}</div>
            <div>Fallback: {results.openAI?.fallback ? "Yes" : "No"}</div>
            {results.openAI?.reason && <div className="text-orange-600">Reason: {results.openAI.reason}</div>}
            {results.openAI?.error && <div className="text-red-600">Error: {results.openAI.error}</div>}
          </div>
        </div>

        {/* ElevenLabs API */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">ElevenLabs API</h2>
          <button
            onClick={testElevenLabs}
            disabled={loading.elevenLabs}
            className="block w-full px-4 py-2 bg-purple-500 text-white rounded mb-3 disabled:opacity-50"
          >
            {loading.elevenLabs ? "Testing..." : "Test Text-to-Speech"}
          </button>
          <div className="text-sm">
            <div>Status: {results.elevenLabs?.status || "Not tested"}</div>
            <div>Success: {results.elevenLabs?.success ? "✅" : results.elevenLabs ? "❌" : "⏳"}</div>
            <div>Content-Type: {results.elevenLabs?.contentType || "N/A"}</div>
            {results.elevenLabs?.error && <div className="text-red-600">Error: {results.elevenLabs.error}</div>}
          </div>
        </div>

        {/* Analyze Word API */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Analyze Word API</h2>
          <button
            onClick={testAnalyzeWord}
            disabled={loading.analyzeWord}
            className="block w-full px-4 py-2 bg-orange-500 text-white rounded mb-3 disabled:opacity-50"
          >
            {loading.analyzeWord ? "Testing..." : "Test Word Analysis"}
          </button>
          <div className="text-sm">
            <div>Status: {results.analyzeWord?.status || "Not tested"}</div>
            <div>Success: {results.analyzeWord?.success ? "✅" : results.analyzeWord ? "❌" : "⏳"}</div>
            <div>Source: {results.analyzeWord?.source || "N/A"}</div>
            <div>Has Analysis: {results.analyzeWord?.hasAnalysis ? "Yes" : "No"}</div>
            {results.analyzeWord?.error && <div className="text-red-600">Error: {results.analyzeWord.error}</div>}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Variables Required:</h3>
        <ul className="text-sm space-y-1">
          <li>• SIGNSPEAKAPIKEY - For sign video generation</li>
          <li>• OPENAI_API_KEY or OPENAIAPIKEY - For image generation and word analysis</li>
          <li>• ELEVENLABS_API_KEY or ELEVENLABSAPIKEY - For text-to-speech</li>
          <li>• DEFAULT_ELEVENLABS_VOICE_ID - Voice ID for speech synthesis</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  )
}
