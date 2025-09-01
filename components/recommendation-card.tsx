"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TeachingPlan } from "../types/teaching"
import { ComicStrip } from "./comic-strip"

interface RecommendationCardProps {
  plan: TeachingPlan
  defaultView?: "comic" | "video" | "text"
  onAskPreference?: (choice: "comic" | "video" | "text") => void
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  plan,
  defaultView = "comic",
  onAskPreference,
}) => {
  const [view, setView] = React.useState<"comic" | "video" | "text">(defaultView)
  const hasVideo = Boolean(plan.demoVideoUrl)

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold">Teach "{plan.word}"</h2>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={view === "comic" ? "default" : "outline"}
                onClick={() => {
                  setView("comic")
                  onAskPreference?.("comic")
                }}
                className="text-xs"
              >
                Visual Guide
              </Button>
              <Button
                size="sm"
                variant={view === "text" ? "default" : "outline"}
                onClick={() => {
                  setView("text")
                  onAskPreference?.("text")
                }}
                className="text-xs"
              >
                Text Steps
              </Button>
              {hasVideo && (
                <Button
                  size="sm"
                  variant={view === "video" ? "default" : "outline"}
                  onClick={() => {
                    setView("video")
                    onAskPreference?.("video")
                  }}
                  className="text-xs"
                >
                  Video
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            {view === "comic" && <ComicStrip frames={plan.quickSequence} />}

            {view === "video" && hasVideo && plan.demoVideoUrl && (
              <Card className="overflow-hidden rounded-2xl">
                <div className="relative aspect-video">
                  <video src={plan.demoVideoUrl} controls className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-1">See it in action</h3>
                  <p className="text-xs text-gray-600">Short demo: model → prompt → child imitates.</p>
                </CardContent>
              </Card>
            )}

            {view === "text" && (
              <ol className="space-y-2 pl-4">
                {plan.steps.map((step, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    <span className="font-bold text-orange-600">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {plan.tips && plan.tips.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-sm mb-2">Tips</h3>
              <ul className="space-y-1 pl-4">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-600">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
