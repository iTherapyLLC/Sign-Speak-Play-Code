"use client"

import type React from "react"

import { motion } from "framer-motion"
import { motionSystem } from "@/lib/motion/system"

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: motionSystem.duration.normal / 1000,
      ease: motionSystem.easing.standard,
    }}
  >
    {children}
  </motion.div>
)

export const CardEntrance = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: motionSystem.duration.smooth / 1000,
      delay,
      ease: motionSystem.easing.decelerate,
    }}
  >
    {children}
  </motion.div>
)

export const ButtonPress = ({ children, ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={motionSystem.spring.responsive}
    {...props}
  >
    {children}
  </motion.button>
)
