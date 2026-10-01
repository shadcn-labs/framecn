"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";

export const caretDemoControls = [
  "height",
  "width",
  "radius",
  "blink",
  "blinkPerSecond",
  "color",
] as const;

export interface CaretDemoProps {
  height?: number;
  width?: number;
  radius?: number;
  blink?: boolean;
  blinkPerSecond?: number;
  color?: string;
}

export const CaretDemoScene = (p: CaretDemoProps = {}) => {
  const theme = useFramecnTheme(undefined, "light");

  return (
    <div
      style={{
        alignItems: "center",
        background: theme.background,
        color: theme.foreground,
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 28,
        inset: 0,
        justifyContent: "center",
        letterSpacing: "-0.01em",
        position: "absolute",
      }}
    >
      <span style={{ alignItems: "center", display: "inline-flex" }}>
        <span>Type something</span>
        <Caret
          blink={p.blink ?? true}
          blinkPerSecond={p.blinkPerSecond ?? 1}
          color={p.color ?? theme.foreground}
          height={p.height ?? 28}
          marginLeft={4}
          radius={p.radius ?? 1}
          width={p.width ?? 3}
        />
      </span>
    </div>
  );
};

export const caretDemoCode = (values: Record<string, unknown> = {}): string => {
  const height = values.height as number | undefined;
  const width = values.width as number | undefined;
  const radius = values.radius as number | undefined;
  const blink = values.blink as boolean | undefined;
  const blinkPerSecond = values.blinkPerSecond as number | undefined;
  const color = values.color as string | undefined;

  const props: string[] = [];
  if (height !== undefined && height !== 28) {
    props.push(`height={${height}}`);
  }
  if (width !== undefined && width !== 3) {
    props.push(`width={${width}}`);
  }
  if (radius !== undefined && radius !== 1) {
    props.push(`radius={${radius}}`);
  }
  if (blink !== undefined && blink !== true) {
    props.push(`blink={${blink}}`);
  }
  if (blinkPerSecond !== undefined && blinkPerSecond !== 1) {
    props.push(`blinkPerSecond={${blinkPerSecond}}`);
  }
  if (color !== undefined && color !== "#1F1E1D") {
    props.push(`color="${color}"`);
  }

  const propsStr = props.length ? ` ${props.join(" ")}` : "";

  return `import { Caret } from "@/components/framecn/caret";

export const Scene = () => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    <span>Type something</span>
    <Caret${propsStr} marginLeft={4} />
  </span>
);`;
};
