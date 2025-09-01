"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTeachingStrategy } from "@/hooks/use-teaching-strategy"
import { TeachingStrip } from "./teaching-strip"
import { TextSteps } from "./text-steps"

type Props = {
  open: boolean
  onClose: () => void
  word: string
  socialFunction: "request" | "refuse" | "ask" | "command" | "comment"
  context?: string
  onSpeak?: (text: string) => void
  isPlayingAudio?: boolean
}

export const TeachingStrategyDrawer: React.FC<Props> = ({
  open,
  onClose,
  word,
  socialFunction,
  context,
  onSpeak,
  isPlayingAudio = false,
}) => {
  const { data, loading, error, load } = useTeachingStrategy()
  const [tab, setTab] = React.useState<0 | 1>(0)

  React.useEffect(() => {
    if (open) load(word, socialFunction, context)
  }, [open, word, socialFunction, context, load])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Teach "{word}"</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${tab === 0 ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setTab(0)}
            >
              Visual Guide
            </button>
            <button
              className={`px-4 py-2 font-medium ${tab === 1 ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setTab(1)}
            >
              Text Steps
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Building your teaching strategy…</p>
              </div>
            )}

            {error && <div className="text-red-600 text-center py-8">Error: {error}</div>}

            {!loading && data && (
              <>
                {tab === 0 && <TeachingStrip frames={data.frames} />}
                {tab === 1 && (
                  <TextSteps frames={data.frames} tips={data.tips} onSpeak={onSpeak} isPlayingAudio={isPlayingAudio} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
