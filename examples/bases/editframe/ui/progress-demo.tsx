"use client";

import { Progress } from "@/registry/bases/editframe/ui/progress";
import { useProgressTransition } from "@/registry/bases/editframe/ui/progress/use-progress-transition";

export const progressDemoControls = ["showLabel"] as const;

export interface ProgressDemoProps {
  showLabel?: boolean;
}

export const ProgressDemoScene = (p: ProgressDemoProps = {}) => {
  // Bar fills from 0 → 62 (arrives at frame 40), stalls for ~60 frames as if
  // waiting on a slow operation, then resumes to 100 (arrives at frame 130).
  const progressStyle = useProgressTransition([
    { at: 0, value: 0 },
    { at: 40, duration: 36, value: 62 },
    { at: 130, duration: 30, value: 100 },
  ]);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <Progress
        style={progressStyle}
        showLabel={p.showLabel ?? true}
        width={320}
      />
    </div>
  );
};

export const progressDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const showLabel = values.showLabel as boolean | undefined;

  const props: string[] = [];
  if (showLabel !== undefined && showLabel !== true) {
    props.push(`showLabel={${showLabel}}`);
  }

  const propsStr = props.length ? ` ${props.join(" ")}` : "";
  return `import { Progress } from "@/components/framecn/progress";
import { useProgressTransition } from "@/components/framecn/use-progress-transition";

export const Scene = () => {
  // Bar fills from 0 → 62 (arrives at frame 40), stalls for ~60 frames as if
  // waiting on a slow operation, then resumes to 100 (arrives at frame 130).
  const progressStyle = useProgressTransition([
    { at: 0,   value: 0  },
    { at: 40,  value: 62,  duration: 36 },
    { at: 130, value: 100, duration: 30 },
  ]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Progress style={progressStyle} width={320}${propsStr} />
    </div>
  );
};`;
};
