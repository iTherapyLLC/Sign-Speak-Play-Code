"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface SignLoadingAnimationProps {
  word: string
}

export const SignLoadingAnimation: React.FC<SignLoadingAnimationProps> = ({ word }) => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="relative w-48 h-48">
        {/* Base circle with subtle pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Hand gesture abstraction */}
        <svg className="absolute inset-4" viewBox="0 0 120 120" fill="none">
          <motion.path
            d="M60 30 Q70 35 75 45 L75 65 Q75 75 65 80 L55 80 Q45 75 45 65 L45 45 Q50 35 60 30"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: phase > 1 ? 1 : 0,
              opacity: phase > 0 ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Animated dots representing finger positions */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={60 + Math.cos((i * Math.PI) / 2.5) * 25}
              cy={55 + Math.sin((i * Math.PI) / 2.5) * 25}
              r="4"
              fill="#6366f1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase >= i / 2 ? 1 : 0,
                opacity: phase >= i / 2 ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                ease: "backOut",
              }}
            />
          ))}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Progress indicator */}
        <motion.div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-300"
              animate={{
                backgroundColor: phase >= i ? "#6366f1" : "#e5e7eb",
                scale: phase === i ? 1.3 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-600 mb-1">Generating sign video</h3>
        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          "{word}"
        </p>
      </motion.div>
    </div>
  )
}
