"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Input } from "@/registry/bases/editframe/ui/input";
import { useInputTransition } from "@/registry/bases/editframe/ui/input/use-input-transition";
import { Skeleton } from "@/registry/bases/editframe/ui/skeleton";
import { SkeletonBlock } from "@/registry/bases/editframe/ui/skeleton-block";
import { useSkeletonTransition } from "@/registry/bases/editframe/ui/skeleton/use-skeleton-transition";
import { Toast } from "@/registry/bases/editframe/ui/toast";
import { useToastTransition } from "@/registry/bases/editframe/ui/toast/use-toast-transition";

export interface AiPromptFlowProps {
  prompt?: string;
  buttonLabel?: string;
  answerLines?: string[];
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}
const STAGE_W = 1280;
const PROMPT_W = 520;
const PROMPT_LEFT = (STAGE_W - PROMPT_W) / 2;
const PROMPT_TOP = 168;
const PROMPT_H = 92;
const BTN_W = 200;
const BTN_LEFT = (STAGE_W - BTN_W) / 2;
const BTN_TOP = 278;
const BTN_H = 64;
const ANSWER_W = 560;
const ANSWER_LEFT = (STAGE_W - ANSWER_W) / 2;
const ANSWER_TOP = 380;
const DEFAULT_ANSWER = [
  "The thread debates the Q3 roadmap: ship the editor first,",
  "defer billing to Q4, and pull the migration forward so",
  "infra is unblocked before the team scales next quarter.",
];
export const AiPromptFlow = ({
  prompt = "Summarize this thread",
  buttonLabel = "Generate",
  answerLines = DEFAULT_ANSWER,
  toastTitle = "Response ready",
  theme,
}: AiPromptFlowProps) => {
  const resolved = useFramecnTheme(theme);
  const opts = { theme };
  const inputStyle = useInputTransition(
    [
      { at: 0, duration: 1, state: "active" },
      { at: 0, duration: 50, state: "typing" },
    ],
    opts
  );
  const buttonStyle = useButtonTransition(
    [
      { at: 52, duration: 6, state: "hover" },
      { at: 58, duration: 4, state: "press" },
      { at: 62, duration: 4, state: "loading" },
    ],
    opts
  );
  const skeletonStyle = useSkeletonTransition(
    [
      { at: 64, duration: 1, state: "loading" },
      { at: 150, duration: 16, state: "loaded" },
    ],
    {}
  );
  const panelOpacity = buttonStyle.spinnerOpacity;
  const toastStyle = useToastTransition(
    [
      { at: 160, duration: 14, state: "visible" },
      { at: 220, duration: 14, state: "hidden" },
    ],
    {}
  );
  return (
    <div
      style={{
        background: "transparent",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          height: PROMPT_H,
          left: PROMPT_LEFT,
          position: "absolute",
          top: PROMPT_TOP,
          width: PROMPT_W,
        }}
      >
        <Input
          placeholder="Ask anything…"
          value={prompt}
          style={inputStyle}
          theme={theme}
        />
      </div>

      <div
        style={{
          height: BTN_H,
          left: BTN_LEFT,
          position: "absolute",
          top: BTN_TOP,
          width: BTN_W,
        }}
      >
        <Button label={buttonLabel} style={buttonStyle} theme={theme} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          left: ANSWER_LEFT,
          opacity: panelOpacity,
          position: "absolute",
          top: ANSWER_TOP,
          width: ANSWER_W,
        }}
      >
        <Skeleton
          style={skeletonStyle}
          theme={theme}
          placeholder={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                width: ANSWER_W,
              }}
            >
              {answerLines.map((_, i) => (
                <SkeletonBlock
                  key={i}
                  width={i === answerLines.length - 1 ? "70%" : "100%"}
                  height={18}
                  baseColor={resolved.muted}
                />
              ))}
            </div>
          }
        >
          <div
            style={{
              color: resolved.foreground,
              display: "flex",
              flexDirection: "column",
              fontFamily:
                "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 18,
              gap: 8,
              letterSpacing: "-0.01em",
              lineHeight: 1.45,
              width: ANSWER_W,
            }}
          >
            {answerLines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        </Skeleton>
      </div>

      <div style={{ bottom: 32, position: "absolute", right: 32 }}>
        <Toast
          title={toastTitle}
          variant="success"
          style={toastStyle}
          theme={theme}
        />
      </div>
    </div>
  );
};
