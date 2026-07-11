export const easings = {
  in: (t: number): number => t * t * t,
  inOut: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
  linear: (t: number): number => t,
  out: (t: number): number => 1 - (1 - t) ** 3,
} as const;

export type EasingName = keyof typeof easings;

export const springs = {
  bouncy: { damping: 10, mass: 0.8, stiffness: 180 },
  snappy: { damping: 18, mass: 0.7, stiffness: 220 },
  soft: { damping: 14, mass: 0.9, stiffness: 120 },
} as const;

export type SpringName = keyof typeof springs;
