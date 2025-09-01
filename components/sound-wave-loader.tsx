"use client"

import { motion } from "framer-motion"

interface SoundWaveLoaderProps {
  word: string
}

export const SoundWaveLoader = ({ word }: SoundWaveLoaderProps) => {
  const bars = 5

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="flex items-center justify-center gap-1 h-24">
        {[...Array(bars)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
            animate={{
              height: [20, 60, 20],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Generating sign video</p>
        <p className="text-lg font-bold text-indigo-600">"{word}"</p>
      </div>
    </div>
  )
}
