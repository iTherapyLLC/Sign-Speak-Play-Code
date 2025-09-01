export const motionSystem = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    smooth: 400,
    slow: 600,
  },
  easing: {
    enter: "cubic-bezier(0.32, 0, 0.67, 0)",
    exit: "cubic-bezier(0.33, 1, 0.68, 1)",
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  },
  spring: {
    responsive: { type: "spring", damping: 25, stiffness: 300 },
    gentle: { type: "spring", damping: 30, stiffness: 200 },
    bouncy: { type: "spring", damping: 20, stiffness: 350 },
  },
} as const
