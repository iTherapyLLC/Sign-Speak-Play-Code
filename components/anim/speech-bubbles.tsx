"use client"

import type * as React from "react"
import { Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"

type Props = { size?: number; leftLabel?: string; rightLabel?: string; reduced?: boolean }

export const SpeechBubbles: React.FC<Props> = ({ size = 160, leftLabel = "You", rightLabel = "Child", reduced }) => {
  const theme = useTheme()
  const left = theme.palette.primary.main // teal
  const right = theme.palette.warning.main // coral

  const beat = reduced ? {} : { scale: [1, 1.06, 1] }

  return (
    <Box
      sx={{
        width: size * 1.6,
        height: size,
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      role="img"
      aria-label="Conversation turn-taking"
    >
      {/* Left bubble */}
      <motion.div
        style={bubbleStyle(left, theme)}
        animate={beat}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
      >
        {leftLabel}
      </motion.div>

      {/* small typing dots */}
      <motion.div
        style={{ width: 28, height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)" }}
        animate={reduced ? undefined : { opacity: [0.3, 0.9, 0.3] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4, ease: "easeInOut" }}
      />

      {/* Right bubble */}
      <motion.div
        style={bubbleStyle(right, theme)}
        animate={beat}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut", delay: 0.3 }}
      >
        {rightLabel}
      </motion.div>
    </Box>
  )
}

function bubbleStyle(color: string, theme: any): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 16,
    color: theme.palette.getContrastText(color),
    background: color,
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }
}
