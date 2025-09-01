"use client"

export const VisualGuideLoader = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-32 h-32 mb-4">
      {/* Animated circles representing image generation */}
      <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-pulse" />
      <div className="absolute inset-2 border-4 border-yellow-200 rounded-full animate-ping" />
      <div
        className="absolute inset-4 border-4 border-orange-300 rounded-full animate-pulse"
        style={{ animationDelay: "200ms" }}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <div className="text-center">
      <p className="text-sm text-gray-600 mb-1">Creating visual teaching guide...</p>
      <div className="flex justify-center gap-1">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
)
