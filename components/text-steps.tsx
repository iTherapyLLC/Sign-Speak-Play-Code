"use client"

import type * as React from "react"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TeachingFrame } from "@/hooks/use-teaching-strategy"

type Props = {
  frames: TeachingFrame[]
  tips: string[]
  onSpeak?: (text: string) => void
  isPlayingAudio?: boolean
}

export const TextSteps: React.FC<Props> = ({ frames, tips, onSpeak, isPlayingAudio = false }) => {
  const steps = [`Introduce: ${frames[0]?.alt}`, `Model: ${frames[1]?.alt}`, `Imitate: ${frames[2]?.alt}`]

  const handleSpeak = () => {
    if (onSpeak) {
      const content = `Teaching steps: ${steps.join(". ")}. Tips: ${tips.join(". ")}`
      onSpeak(content)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Teaching Steps</h3>
        {onSpeak && (
          <Button
            onClick={handleSpeak}
            size="sm"
            variant="outline"
            disabled={isPlayingAudio}
            className="text-xs bg-transparent"
          >
            <Volume2 className="mr-1 h-3 w-3" />
            {isPlayingAudio ? "Speaking..." : "Tell me about the strategy"}
          </Button>
        )}
      </div>

      <ol className="space-y-2 pl-4">
        {steps.map((s, i) => (
          <li key={i} className="text-sm leading-relaxed">
            {s}
          </li>
        ))}
      </ol>

      {tips.length > 0 && (
        <>
          <hr className="my-4" />
          <div>
            <h4 className="font-bold text-sm mb-2">Tips</h4>
            <ul className="space-y-1 pl-4">
              {tips.map((t, i) => (
                <li key={i} className="text-xs text-gray-600">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
