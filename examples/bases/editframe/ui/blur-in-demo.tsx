"use client";

import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { useBlurInTransition } from "@/registry/bases/editframe/ui/blur-in/use-blur-in-transition";

export const blurInDemoControls = ["blur", "distance", "direction"] as const;

export interface BlurInDemoProps {
  blur?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const BlurInDemoScene = (p: BlurInDemoProps = {}) => {
  const style = useBlurInTransition(
    [
      { at: 0, state: "hidden" },
      { at: 8, duration: 18, state: "revealed" },
    ],
    {
      blur: p.blur,
      direction: p.direction ?? "up",
      distance: p.distance,
    }
  );
  return (
    <div
      style={{
        alignItems: "center",
        background: "#ffffff",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <BlurIn style={style}>
        <div
          style={{
            alignItems: "center",
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            color: "#171717",
            display: "flex",
            fontSize: 18,
            fontWeight: 500,
            height: 120,
            justifyContent: "center",
            letterSpacing: "-0.01em",
            width: 200,
          }}
        >
          Blur In
        </div>
      </BlurIn>
    </div>
  );
};

export const blurInDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const blur = values.blur as number | undefined;
  const distance = values.distance as number | undefined;
  const direction = values.direction as string | undefined;

  const hookOpts: string[] = [];
  if (direction !== undefined && direction !== "up") {
    hookOpts.push(`direction: "${direction}"`);
  }
  if (blur !== undefined && blur !== 8) {
    hookOpts.push(`blur: ${blur}`);
  }
  if (distance !== undefined && distance !== 12) {
    hookOpts.push(`distance: ${distance}`);
  }
  const optsStr = hookOpts.length ? `, { ${hookOpts.join(", ")} }` : "";

  return `import { BlurIn } from "@/components/framecn/blur-in";
import { useBlurInTransition } from "@/components/framecn/use-blur-in-transition";

export const Scene = () => {
  const style = useBlurInTransition([
    { at: 0, state: "hidden" },
    { at: 8, state: "revealed", duration: 18 },
  ]${optsStr});

  return (
    <BlurIn style={style}>
      <div className="rounded-2xl border px-8 py-6">Blur In</div>
    </BlurIn>
  );
};`;
};
