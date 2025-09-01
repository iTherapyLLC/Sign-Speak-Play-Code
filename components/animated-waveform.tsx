"use client"

import type React from "react"

interface AnimatedWaveformProps {
  isActive: boolean
  className?: string
}

export const AnimatedWaveform: React.FC<AnimatedWaveformProps> = ({ isActive, className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-orange-500 rounded-full transition-all duration-300 ${isActive ? "animate-pulse" : ""}`}
          style={{
            height: isActive ? `${Math.random() * 20 + 10}px` : "4px",
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  )
}
