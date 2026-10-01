"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import { TypingIndicator } from "@/registry/bases/editframe/ui/typing-indicator";

export const typingIndicatorDemoControls = [
  "dotCount",
  "size",
  "amplitude",
] as const;

export interface TypingIndicatorDemoProps {
  dotCount?: number;
  size?: number;
  amplitude?: number;
}

export const TypingIndicatorDemoScene = (p: TypingIndicatorDemoProps = {}) => {
  const theme = useFramecnTheme(undefined, "light");

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: theme.muted,
          borderRadius: 18,
          color: theme.mutedForeground,
          display: "inline-flex",
          padding: "18px 22px",
        }}
      >
        <TypingIndicator
          dotCount={p.dotCount ?? 3}
          size={p.size ?? 8}
          amplitude={p.amplitude ?? 5}
        />
      </div>
    </div>
  );
};

export const typingIndicatorDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const dotCount = (values.dotCount as number | undefined) ?? 3;
  const size = (values.size as number | undefined) ?? 8;
  const amplitude = (values.amplitude as number | undefined) ?? 5;

  const props: string[] = [];
  if (dotCount !== 3) {
    props.push(`      dotCount={${dotCount}}`);
  }
  if (size !== 8) {
    props.push(`      size={${size}}`);
  }
  if (amplitude !== 5) {
    props.push(`      amplitude={${amplitude}}`);
  }
  const body = props.length > 0 ? `\n${props.join("\n")}\n    ` : " ";

  return `import { TypingIndicator } from "@/components/framecn/typing-indicator";

export const Scene = () => (
  <div
    style={{
      display: "inline-flex",
      padding: "18px 22px",
      background: "var(--muted)",
      borderRadius: 18,
    }}
  >
    <TypingIndicator${body}/>
  </div>
);`;
};
