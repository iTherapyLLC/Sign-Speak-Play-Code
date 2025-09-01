"use client"

import type React from "react"
import { motion } from "framer-motion"

interface StrategyLoadingAnimationProps {
  word: string
}

export const StrategyLoadingAnimation: React.FC<StrategyLoadingAnimationProps> = ({ word }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="relative w-40 h-40">
        {/* Morphing shapes representing analysis */}
        <svg viewBox="0 0 160 160" className="w-full h-full">
          {/* Background circle */}
          <circle cx="80" cy="80" r="70" fill="none" stroke="url(#bgGradient)" strokeWidth="1" opacity="0.2" />

          {/* Animated analysis paths */}
          <motion.path
            d="M 80 40 Q 110 60 110 80 Q 110 100 80 120 Q 50 100 50 80 Q 50 60 80 40"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              times: [0, 0.3, 0.7, 1],
            }}
          />

          {/* Central pulse */}
          <motion.circle
            cx="80"
            cy="80"
            r="8"
            fill="url(#primaryGradient)"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Orbiting analysis nodes */}
          {["Function", "Context", "Strategy"].map((label, i) => (
            <motion.g
              key={label}
              initial={{ rotate: i * 120 }}
              animate={{ rotate: i * 120 + 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformOrigin: "80px 80px" }}
            >
              <circle cx="80" cy="25" r="4" fill="#6366f1" opacity="0.8" />
            </motion.g>
          ))}

          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ddd6fe" />
              <stop offset="100%" stopColor="#e9d5ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700 text-center">Analyzing communication context</h3>

        {/* Animated progress labels */}
        <div className="flex justify-center gap-2">
          {["Function", "Context", "Strategy"].map((label, i) => (
            <motion.span
              key={label}
              className="text-xs px-2 py-1 rounded-full bg-gray-100"
              animate={{
                backgroundColor: ["#f3f4f6", "#ddd6fe", "#f3f4f6"],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            >
              {label}
            </motion.span>
          ))}
        </div>

        <p className="text-xs text-purple-600 font-semibold text-center uppercase tracking-wide">{word}</p>
      </div>
    </div>
  )
}
