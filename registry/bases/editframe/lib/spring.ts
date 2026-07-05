import { interpolate } from "./interpolate";

export interface SpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
}

export interface SpringOptions {
  frame: number;
  fps: number;
  config?: SpringConfig;
  from?: number;
  to?: number;
  delay?: number;
  reverse?: boolean;
  durationInFrames?: number;
}

const DEFAULT_SPRING_CONFIG: Required<SpringConfig> = {
  damping: 10,
  mass: 1,
  overshootClamping: false,
  stiffness: 100,
};

interface SpringAnimation {
  current: number;
  lastTimestamp: number;
  prevPosition: number;
  toValue: number;
  velocity: number;
}

const advanceSpring = (
  animation: SpringAnimation,
  now: number,
  config: Required<SpringConfig>
): SpringAnimation => {
  const { toValue, lastTimestamp, current, velocity } = animation;
  const deltaTime = Math.min(now - lastTimestamp, 64);
  const c = config.damping;
  const m = config.mass;
  const k = config.stiffness;

  const v0 = -velocity;
  const x0 = toValue - current;
  const zeta = c / (2 * Math.sqrt(k * m));
  const omega0 = Math.sqrt(k / m);
  const omega1 = omega0 * Math.sqrt(1 - zeta ** 2);
  const t = deltaTime / 1000;
  const sin1 = Math.sin(omega1 * t);
  const cos1 = Math.cos(omega1 * t);

  const underDampedEnvelope = Math.exp(-zeta * omega0 * t);
  const underDampedFrag1 =
    underDampedEnvelope *
    (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);
  const underDampedPosition = toValue - underDampedFrag1;
  const underDampedVelocity =
    zeta * omega0 * underDampedFrag1 -
    underDampedEnvelope *
      (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1);

  const criticallyDampedEnvelope = Math.exp(-omega0 * t);
  const criticallyDampedPosition =
    toValue - criticallyDampedEnvelope * (x0 + (v0 + omega0 * x0) * t);
  const criticallyDampedVelocity =
    criticallyDampedEnvelope *
    (v0 * (t * omega0 - 1) + t * x0 * omega0 * omega0);

  return {
    current: zeta < 1 ? underDampedPosition : criticallyDampedPosition,
    lastTimestamp: now,
    prevPosition: current,
    toValue,
    velocity: zeta < 1 ? underDampedVelocity : criticallyDampedVelocity,
  };
};

const springCalculation = (
  frame: number,
  fps: number,
  config: SpringConfig
): SpringAnimation => {
  const merged = { ...DEFAULT_SPRING_CONFIG, ...config };
  let animation: SpringAnimation = {
    current: 0,
    lastTimestamp: 0,
    prevPosition: 0,
    toValue: 1,
    velocity: 0,
  };

  const frameClamped = Math.max(0, frame);
  const unevenRest = frameClamped % 1;

  for (let f = 0; f <= Math.floor(frameClamped); f++) {
    const step = f === Math.floor(frameClamped) ? f + unevenRest : f;
    animation = advanceSpring(animation, (step / fps) * 1000, merged);
  }

  return animation;
};

export const spring = ({
  frame: passedFrame,
  fps,
  config = {},
  from = 0,
  to = 1,
  delay = 0,
  reverse = false,
  durationInFrames,
}: SpringOptions): number => {
  const processedFrame = reverse
    ? (durationInFrames ?? passedFrame) - passedFrame
    : passedFrame;
  const frame = processedFrame + (reverse ? delay : -delay);

  if (durationInFrames !== undefined && frame > durationInFrames) {
    return to;
  }

  const result = springCalculation(frame, fps, config);
  const inner = config.overshootClamping
    ? (to >= from
      ? Math.min(result.current, to)
      : Math.max(result.current, to))
    : result.current;

  return from === 0 && to === 1
    ? inner
    : interpolate(inner, [0, 1], [from, to]);
};
