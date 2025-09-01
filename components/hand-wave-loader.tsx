"use client"

import { motion } from "framer-motion"

interface HandWaveLoaderProps {
  word: string
}

export const HandWaveLoader = ({ word }: HandWaveLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 128 128" className="w-full h-full">
          {/* Simple hand outline */}
          <motion.path
            d="M 64 90 L 64 40 M 50 50 L 50 30 M 78 50 L 78 30 M 56 45 L 56 28 M 72 45 L 72 28"
            stroke="#6366f1"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            animate={{
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "64px 90px" }}
          />

          {/* Motion lines */}
          <motion.path
            d="M 40 70 Q 30 65 20 70 M 88 70 Q 98 65 108 70"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </svg>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Preparing sign</p>
        <p className="text-lg font-bold text-indigo-600">"{word}"</p>
      </div>
    </div>
  )
}
