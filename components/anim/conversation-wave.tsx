"use client"

import type * as React from "react"
import { Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"

type Props = { width?: number; height?: number; colorA?: string; colorB?: string; reduced?: boolean }

export const ConversationWave: React.FC<Props> = ({ width = 240, height = 120, colorA, colorB, reduced }) => {
  const theme = useTheme()
  const a = colorA ?? theme.palette.primary.main // teal-ish
  const b = colorB ?? theme.palette.warning.main // coral-ish

  return (
    <Box sx={{ width, height, position: "relative" }} role="img" aria-label="Analyzing speech patterns">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }} // prevents baseline offset for proper centering
      >
        {/* baseline frame */}
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={height - 2}
          rx="16"
          ry="16"
          fill={theme.palette.background.paper}
          stroke="rgba(0,0,0,0.06)"
        />
        {/* wave 1 */}
        <motion.path
          d={path(width, height, 0)}
          stroke={a}
          strokeWidth={3}
          fill="none"
          opacity={0.9}
          animate={
            reduced
              ? undefined
              : {
                  d: [
                    path(width, height, 0),
                    path(width, height, Math.PI / 2),
                    path(width, height, Math.PI),
                    path(width, height, (3 * Math.PI) / 2),
                    path(width, height, 2 * Math.PI),
                  ],
                }
          }
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "linear" }}
        />
        {/* wave 2 */}
        <motion.path
          d={path(width, height, Math.PI / 2)}
          stroke={b}
          strokeWidth={3.5}
          fill="none"
          opacity={0.85}
          animate={
            reduced
              ? undefined
              : {
                  d: [
                    path(width, height, Math.PI / 2),
                    path(width, height, Math.PI),
                    path(width, height, (3 * Math.PI) / 2),
                    path(width, height, 2 * Math.PI),
                    path(width, height, (5 * Math.PI) / 2),
                  ],
                }
          }
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4.2, ease: "linear" }}
        />
      </svg>
    </Box>
  )
}

function path(w: number, h: number, phase: number) {
  const amp = h * 0.28,
    mid = h * 0.5,
    steps = 28,
    dx = w / steps
  let d = `M 0 ${mid}`
  for (let i = 0; i <= steps; i++) {
    const x = i * dx
    const y = mid + amp * Math.sin((x / w) * 2 * Math.PI + phase)
    d += ` L ${x} ${y}`
  }
  return d
}
