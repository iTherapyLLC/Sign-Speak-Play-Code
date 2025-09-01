"use client"

import { motion } from "framer-motion"

interface SpeechBubbleLoaderProps {
  word: string
}

export const SpeechBubbleLoader = ({ word }: SpeechBubbleLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Animated speech bubbles */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Main bubble */}
          <motion.path
            d="M 100 40 Q 160 40 160 80 L 160 120 Q 160 160 100 160 Q 40 160 40 120 L 40 80 Q 40 40 100 40 L 100 180 L 80 160"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Dots inside bubble */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={70 + i * 30}
              cy={100}
              r="6"
              fill="#6366f1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.2,
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Generating sign video</p>
        <p className="text-lg font-bold text-indigo-600">"{word}"</p>
      </div>
    </div>
  )
}
