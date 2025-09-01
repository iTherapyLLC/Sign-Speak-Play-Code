import type * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { TeachingFrame } from "../types/teaching"

interface ComicStripProps {
  frames: TeachingFrame[]
}

export const ComicStrip: React.FC<ComicStripProps> = ({ frames }) => {
  return (
    <div role="group" aria-label="Teaching sequence visual guide" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {frames.map((f, idx) => (
        <Card key={idx} className="overflow-hidden border-2 border-gray-200 rounded-2xl shadow-lg">
          <div className="relative aspect-[4/3] flex items-center justify-center bg-gray-50">
            {f.media.type === "image" && f.media.src && (
              <img src={f.media.src || "/placeholder.svg"} alt={f.media.alt} className="w-full h-full object-contain" />
            )}

            {f.media.type === "video" && f.media.src && (
              <video src={f.media.src} aria-label={f.media.alt} className="w-full h-full object-cover" controls />
            )}

            {f.media.type === "placeholder" && (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 p-4 text-center">
                {f.media.alt}
              </div>
            )}

            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {idx + 1}
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-bold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-gray-600">{f.caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
