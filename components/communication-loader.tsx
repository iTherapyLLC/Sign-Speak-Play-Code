"use client"

import { motion } from "framer-motion"

interface CommunicationLoaderProps {
  word: string
}

export const CommunicationLoader = ({ word }: CommunicationLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="flex items-center gap-8">
        {/* Person A */}
        <motion.div
          className="w-12 h-12 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Message transfer */}
        <div className="relative w-24">
          <motion.div
            className="absolute w-4 h-4 bg-purple-500 rounded-full"
            animate={{ x: [0, 80, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        {/* Person B */}
        <motion.div
          className="w-12 h-12 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Loading communication guide</p>
        <p className="text-lg font-bold text-indigo-600">"{word}"</p>
      </div>
    </div>
  )
}
