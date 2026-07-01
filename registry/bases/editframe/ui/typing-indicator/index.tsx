"use client";

export interface TypingIndicatorProps {
  dotCount?: number;
  color?: string;
  size?: number;
  gap?: number;
  amplitude?: number;
  speed?: number;
  cyclesPerSecond?: number;
  className?: string;
}

export interface TypingDotOptions {
  fps: number;
  dotCount: number;
  amplitude: number;
  speed: number;
  cyclesPerSecond: number;
}

export const typingDotOffset = (
  frame: number,
  index: number,
  opts: TypingDotOptions
): { translateY: number; opacity: number } => {
  const cps = opts.cyclesPerSecond <= 0 ? 1 : opts.cyclesPerSecond;
  const periodFrames = opts.fps / cps;
  const stagger = opts.dotCount > 0 ? periodFrames / (opts.dotCount * 2) : 0;
  const phase =
    ((frame * opts.speed - index * stagger) / periodFrames) * Math.PI * 2;
  const wave = (Math.sin(phase) + 1) / 2;
  return {
    opacity: 0.45 + 0.55 * wave,
    translateY: -opts.amplitude * wave,
  };
};

export function TypingIndicator({
  dotCount = 3,
  color = "currentColor",
  size = 8,
  gap = 5,
  amplitude = 5,
  speed = 1,
  cyclesPerSecond = 1.1,
  className,
}: TypingIndicatorProps) {
  const cycleDuration = `${1 / (cyclesPerSecond * speed)}s`;

  return (
    <>
      <style>{`@keyframes editframe-typing-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.45; }
  50% { transform: translateY(-5px); opacity: 1; }
}`}</style>
      <div
        className={className}
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap,
          height: size + amplitude * 2,
        }}
      >
        {Array.from({ length: dotCount }, (_, i) => {
          const staggerDelay = `${(i / dotCount) * (1 / (cyclesPerSecond * speed))}s`;
          return (
            <span
              key={i}
              style={{
                animation: `editframe-typing-bounce ${cycleDuration} ease-in-out ${staggerDelay} infinite`,
                background: color,
                borderRadius: "50%",
                display: "inline-block",
                height: size,
                width: size,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
