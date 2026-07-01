"use client";

export interface SpinnerProps {
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

export const Spinner = ({
  color = "currentColor",
  size = 16,
  speed = 1,
  className,
}: SpinnerProps) => {
  const duration = `${1 / speed}s`;

  return (
    <>
      <style>{`
        @keyframes spinner-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: `spinner-rotate ${duration} linear infinite` }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="40 14"
          opacity="0.3"
        />
      </svg>
    </>
  );
};
