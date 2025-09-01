"use client"

import type * as React from "react"
import { motion } from "framer-motion"

type Variant = "orbit" | "wave" | "hand"

export interface TeachingHeroProps {
  variant?: Variant
  size?: number
  reduceMotion?: boolean
  word?: string
}

export const TeachingHero: React.FC<TeachingHeroProps> = ({
  variant = "orbit",
  size = 160,
  reduceMotion = false,
  word = "",
}) => {
  const fg = "#ff6a00"
  const sub = "#6a5acd"
  const acc = "#00a2ff"
  const stroke = "#eae9f2"

  return (
    <div
      className="mx-auto relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(120px 120px at 50% 45%, #fff 0%, #f8f7ff 40%, #f3f1ff 100%)",
        boxShadow: "0 8px 30px rgba(65, 60, 136, 0.12)",
      }}
    >
      {variant === "orbit" && <Orbit size={size} fg={fg} sub={sub} acc={acc} stroke={stroke} still={reduceMotion} />}
      {variant === "wave" && <Wave size={size} fg={fg} sub={sub} stroke={stroke} still={reduceMotion} />}
      {variant === "hand" && <HandPulse size={size} fg={fg} sub={sub} stroke={stroke} still={reduceMotion} />}
    </div>
  )
}

const Orbit: React.FC<{ size: number; fg: string; sub: string; acc: string; stroke: string; still?: boolean }> = ({
  size,
  fg,
  sub,
  acc,
  stroke,
  still,
}) => {
  const core = size * 0.34
  const ring = size * 0.42

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Analyzing communication context"
    >
      <circle cx={size / 2} cy={size / 2} r={ring} stroke={stroke} strokeDasharray="4 8" strokeWidth="2" fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={ring * 0.78}
        stroke={stroke}
        strokeDasharray="2 10"
        strokeWidth="2"
        fill="none"
        animate={still ? undefined : { rotate: 360 }}
        style={{ originX: "50%", originY: "50%" }}
        transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 10 }}
      />
      <motion.polygon
        points={hexPoints(size / 2, size / 2, core / 2)}
        fill={fg}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        animate={still ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.2, ease: "easeInOut" }}
      />
      {[fg, sub, acc].map((c, i) => (
        <motion.circle
          key={i}
          r={6}
          fill={c}
          cx={size / 2 + ring * Math.cos((i * 2 * Math.PI) / 3)}
          cy={size / 2 + ring * Math.sin((i * 2 * Math.PI) / 3)}
          animate={still ? undefined : { rotate: 360 }}
          style={{ originX: size / 2, originY: size / 2 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 8 + i * 1.5 }}
        />
      ))}
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={core * 0.9} fill="url(#g)" />
    </svg>
  )
}

const Wave: React.FC<{ size: number; fg: string; sub: string; stroke: string; still?: boolean }> = ({
  size,
  fg,
  sub,
  stroke,
  still,
}) => {
  const w = size,
    h = size
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Analyzing communication context">
      <rect x={0} y={0} width={w} height={h} fill="none" />
      <motion.path
        d={sinePath(w, h, 0)}
        fill="none"
        stroke={sub}
        strokeWidth={3}
        animate={
          still
            ? undefined
            : {
                d: [
                  sinePath(w, h, 0),
                  sinePath(w, h, Math.PI / 2),
                  sinePath(w, h, Math.PI),
                  sinePath(w, h, (3 * Math.PI) / 2),
                  sinePath(w, h, 2 * Math.PI),
                ],
              }
        }
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "linear" }}
      />
      <motion.path
        d={sinePath(w, h, Math.PI / 2)}
        fill="none"
        stroke={fg}
        strokeWidth={4}
        animate={
          still
            ? undefined
            : {
                d: [
                  sinePath(w, h, Math.PI / 2),
                  sinePath(w, h, Math.PI),
                  sinePath(w, h, (3 * Math.PI) / 2),
                  sinePath(w, h, 2 * Math.PI),
                  sinePath(w, h, (5 * Math.PI) / 2),
                ],
              }
        }
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4.2, ease: "linear" }}
      />
      <motion.circle
        r={6}
        fill={fg}
        cx={w * 0.2}
        cy={h * 0.5}
        animate={still ? undefined : { x: [0, w * 0.6], scale: [1, 1.25, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8, ease: "easeInOut" }}
      />
      <rect x={8} y={8} width={w - 16} height={h - 16} rx={18} ry={18} stroke={stroke} strokeWidth={2} fill="none" />
    </svg>
  )
}

const HandPulse: React.FC<{ size: number; fg: string; sub: string; stroke: string; still?: boolean }> = ({
  size,
  fg,
  sub,
  stroke,
  still,
}) => {
  const w = size,
    h = size
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Analyzing communication context">
      <motion.path
        d={handGlyph(w, h)}
        fill={fg}
        opacity={0.9}
        animate={still ? undefined : { scale: [1, 1.05, 1] }}
        transform={`translate(${w * 0.08}, ${h * 0.08})`}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.1, ease: "easeInOut" }}
      />
      <motion.circle
        cx={w * 0.7}
        cy={h * 0.35}
        r={10}
        fill={sub}
        animate={still ? undefined : { scale: [1, 1.2, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6, ease: "easeInOut", delay: 0.2 }}
      />
      <rect x={10} y={10} width={w - 20} height={h - 20} rx={20} ry={20} stroke={stroke} strokeWidth={2} fill="none" />
    </svg>
  )
}

function hexPoints(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(" ")
  return pts
}

function sinePath(w: number, h: number, phase: number) {
  const amp = h * 0.18
  const mid = h * 0.5
  const steps = 24
  const dx = w / steps
  let d = `M 0 ${mid}`
  for (let i = 0; i <= steps; i++) {
    const x = i * dx
    const y = mid + amp * Math.sin((x / w) * 2 * Math.PI + phase)
    d += ` L ${x} ${y}`
  }
  return d
}

function handGlyph(w: number, h: number) {
  const x = 0,
    y = 0,
    ww = w * 0.84,
    hh = h * 0.84
  return `
    M ${x + ww * 0.35} ${y + hh * 0.2}
    c ${ww * 0.06} ${-hh * 0.06}, ${ww * 0.14} ${-hh * 0.04}, ${ww * 0.16} ${hh * 0.06}
    v ${hh * 0.26}
    c 0 ${hh * 0.08}, ${ww * 0.12} ${hh * 0.08}, ${ww * 0.12} 0
    v ${-hh * 0.3}
    c ${ww * 0.02} ${-hh * 0.12}, ${ww * 0.14} ${-hh * 0.08}, ${ww * 0.14} ${hh * 0.06}
    v ${hh * 0.3}
    c 0 ${hh * 0.08}, ${ww * 0.12} ${hh * 0.08}, ${ww * 0.12} 0
    v ${-hh * 0.26}
    c ${ww * 0.02} ${-hh * 0.12}, ${ww * 0.14} ${-hh * 0.08}, ${ww * 0.14} ${hh * 0.06}
    v ${hh * 0.22}
    c 0 ${hh * 0.1}, ${-ww * 0.02} ${hh * 0.18}, ${-ww * 0.08} ${hh * 0.24}
    c ${-ww * 0.14} ${hh * 0.14}, ${-ww * 0.42} ${hh * 0.16}, ${-ww * 0.56} 0
    c ${-ww * 0.06} ${-hh * 0.06}, ${-ww * 0.08} ${-hh * 0.14}, ${-ww * 0.08} ${-hh * 0.22}
    z
  `
}
