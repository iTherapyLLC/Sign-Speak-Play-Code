import type * as React from "react"
import type { TeachingFrame } from "@/hooks/use-teaching-strategy"

export const TeachingStrip: React.FC<{ frames: TeachingFrame[] }> = ({ frames }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {frames.map((f, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <div className="relative aspect-square bg-gray-50">
            <img src={f.imageUrl || "/placeholder.svg"} alt={f.alt} className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {i + 1}
            </div>
          </div>
          <div className="p-3">
            <h4 className="font-bold text-sm mb-1">{f.title}</h4>
            <p className="text-xs text-gray-600">
              {f.bubbleParent && `Parent: "${f.bubbleParent}"`}
              {f.bubbleParent && f.bubbleChild && " • "}
              {f.bubbleChild && `Child: "${f.bubbleChild}"`}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
