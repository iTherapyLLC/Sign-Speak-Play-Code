"use client"

import * as React from "react"

export type TeachingFrame = {
  title: string
  bubbleParent: string
  bubbleChild: string
  alt: string
  imageUrl: string
}

export type TeachingPayload = {
  word: string
  socialFunction: string
  frames: TeachingFrame[]
  tips: string[]
}

export function useTeachingStrategy() {
  const [data, setData] = React.useState<TeachingPayload | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async (word: string, fn: string, ctx?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/teach/${encodeURIComponent(word)}?fn=${fn}&ctx=${encodeURIComponent(ctx || "")}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, load, setData }
}
