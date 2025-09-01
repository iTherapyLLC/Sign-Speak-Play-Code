"use client"

import type * as React from "react"
import { Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"

type Props = { bars?: number; width?: number; height?: number; reduced?: boolean }

export const MicBars: React.FC<Props> = ({ bars = 12, width = 220, height = 36, reduced }) => {
  const theme = useTheme()
  const c = theme.palette.secondary.main // purple

  const arr = Array.from({ length: bars })
  const bw = width / (bars * 1.5)

  return (
    <Box
      sx={{
        width,
        height,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: `repeat(${bars}, 1fr)`,
        alignItems: "end",
        gap: bw / 2,
      }}
      role="img"
      aria-label="Audio input level"
    >
      {arr.map((_, i) => (
        <motion.i
          key={i}
          style={{ display: "block", width: bw, height: height * 0.2, background: c, borderRadius: 6, opacity: 0.9 }}
          animate={
            reduced ? undefined : { height: [height * 0.2, height * 0.9 * Math.random() + height * 0.3, height * 0.2] }
          }
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 0.9 + (i % 3) * 0.15,
            ease: "easeInOut",
            delay: (i % 6) * 0.05,
          }}
        />
      ))}
    </Box>
  )
}
