"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Button } from "@/registry/bases/editframe/ui/button";
import { Input } from "@/registry/bases/editframe/ui/input";
import { Skeleton } from "@/registry/bases/editframe/ui/skeleton";
import { SkeletonBlock } from "@/registry/bases/editframe/ui/skeleton-block";
import { Toast } from "@/registry/bases/editframe/ui/toast";

export type AiPromptFlowState =
  | "idle"
  | "typing"
  | "loading"
  | "skeleton"
  | "done";

export type AiPromptFlowVariant = "default" | "compact";

export interface AiPromptFlowProps {
  state?: AiPromptFlowState;
  from?: AiPromptFlowState;
  prompt?: string;
  placeholder?: string;
  variant?: AiPromptFlowVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const FLOW_WIDTH = 480;

const buttonStateFor = (
  state: AiPromptFlowState
): "idle" | "loading" | "success" => {
  if (state === "loading") {
    return "loading";
  }
  if (state === "done") {
    return "success";
  }
  return "idle";
};

const buttonFromFor = (
  from: AiPromptFlowState | undefined
): "idle" | "loading" | undefined => {
  if (from === "loading") {
    return "idle";
  }
  if (from === "done") {
    return "loading";
  }
  return undefined;
};

export interface AiPromptFlowStyle {
  inputOpacity: number;
  buttonOpacity: number;
  skeletonOpacity: number;
  resultOpacity: number;
  toastOpacity: number;
}

export const aiPromptFlowStyle = (
  state: AiPromptFlowState
): AiPromptFlowStyle => {
  switch (state) {
    case "typing": {
      return {
        buttonOpacity: 1,
        inputOpacity: 1,
        resultOpacity: 0,
        skeletonOpacity: 0,
        toastOpacity: 0,
      };
    }
    case "loading": {
      return {
        buttonOpacity: 0,
        inputOpacity: 0.5,
        resultOpacity: 0,
        skeletonOpacity: 0,
        toastOpacity: 0,
      };
    }
    case "skeleton": {
      return {
        buttonOpacity: 0,
        inputOpacity: 0,
        resultOpacity: 0,
        skeletonOpacity: 1,
        toastOpacity: 0,
      };
    }
    case "done": {
      return {
        buttonOpacity: 1,
        inputOpacity: 1,
        resultOpacity: 1,
        skeletonOpacity: 0,
        toastOpacity: 1,
      };
    }
    default: {
      return {
        buttonOpacity: 1,
        inputOpacity: 1,
        resultOpacity: 0,
        skeletonOpacity: 0,
        toastOpacity: 0,
      };
    }
  }
};

export const AiPromptFlow = ({
  state = "idle",
  from,
  prompt = "Write a haiku about coding",
  placeholder = "Type your prompt...",
  variant = "default",
  theme: themeOverride,
  className,
  duration = "12frames",
}: AiPromptFlowProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = aiPromptFlowStyle(state);

  const isCompact = variant === "compact";

  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 16,
        width: isCompact ? 360 : FLOW_WIDTH,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          opacity: v.inputOpacity,
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            state={state === "typing" ? "active" : "idle"}
            from={from === "typing" ? "idle" : undefined}
            placeholder={placeholder}
            value={state === "typing" || state === "loading" ? prompt : ""}
            fullWidth
            theme={themeOverride}
            duration={duration}
          />
        </div>
        <div style={{ opacity: v.buttonOpacity }}>
          <Button
            state={buttonStateFor(state)}
            from={buttonFromFor(from)}
            label={state === "done" ? "Sent" : "Send"}
            theme={themeOverride}
            duration={duration}
          />
        </div>
      </div>

      <div style={{ opacity: v.skeletonOpacity, width: "100%" }}>
        <Skeleton
          state={state === "skeleton" ? "loading" : "loaded"}
          layout="lines"
          theme={themeOverride}
        >
          <div />
        </Skeleton>
      </div>

      <div
        style={{
          background: theme.muted,
          borderRadius: theme.radius,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: v.resultOpacity,
          padding: 16,
          width: "100%",
        }}
      >
        <SkeletonBlock width={280} height={14} baseColor={theme.muted} />
        <SkeletonBlock width={220} height={14} baseColor={theme.muted} />
        <SkeletonBlock width={160} height={14} baseColor={theme.muted} />
      </div>

      <div style={{ opacity: v.toastOpacity }}>
        <Toast
          state={state === "done" ? "visible" : "hidden"}
          from={from === "done" ? "hidden" : undefined}
          title="Response received"
          description="Your AI response has been generated."
          variant="success"
          theme={themeOverride}
          duration={duration}
        />
      </div>
    </div>
  );
};
