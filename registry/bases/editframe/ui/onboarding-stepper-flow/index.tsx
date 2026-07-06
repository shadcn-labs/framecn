"use client";

import { clamp01 } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Input } from "@/registry/bases/editframe/ui/input";
import { useInputTransition } from "@/registry/bases/editframe/ui/input/use-input-transition";
import { Radio } from "@/registry/bases/editframe/ui/radio";
import { useRadioTransition } from "@/registry/bases/editframe/ui/radio/use-radio-transition";
import { Stepper } from "@/registry/bases/editframe/ui/stepper";
import { useStepperTransition } from "@/registry/bases/editframe/ui/stepper/use-stepper-transition";
import { Switch } from "@/registry/bases/editframe/ui/switch";
import { useSwitchTransition } from "@/registry/bases/editframe/ui/switch/use-switch-transition";

const DEFAULT_STEPS = ["Account", "Plan", "Settings"];
const DEFAULT_PLANS = ["Free", "Pro", "Team"];
const CONTENT_TOP = 300;
const CONTENT_HEIGHT = 220;
const NAV_TOP = 540;
export interface OnboardingStepperFlowProps {
  steps?: string[];
  name?: string;
  plans?: string[];
  nextLabel?: string;
  finishLabel?: string;
  theme?: Partial<FramecnTheme>;
}

export const OnboardingStepperFlow = ({
  steps = DEFAULT_STEPS,
  name = "jane@acme.com",
  plans = DEFAULT_PLANS,
  nextLabel = "Next",
  finishLabel = "Finish",
  theme,
}: OnboardingStepperFlowProps) => {
  const opts = { theme };
  const stepperStyle = useStepperTransition([
    { at: 0, index: 0 },
    { at: 64, duration: 20, index: 1 },
    { at: 104, duration: 20, index: 2 },
  ]);
  const nameStyle = useInputTransition(
    [
      { at: 2, duration: 8, state: "active" },
      { at: 10, duration: 45, state: "typing" },
    ],
    opts
  );
  const planStyle = useRadioTransition(
    [{ at: 90, duration: 14, state: "checked" }],
    opts
  );
  const settingsStyle = useSwitchTransition(
    [{ at: 130, duration: 14, state: "checked" }],
    opts
  );
  const navStyle = useButtonTransition(
    [
      { at: 60, duration: 6, state: "press" },
      { at: 64, duration: 6, state: "idle" },
      { at: 100, duration: 6, state: "press" },
      { at: 104, duration: 6, state: "idle" },
      { at: 150, duration: 6, state: "press" },
      { at: 156, duration: 14, state: "success" },
    ],
    opts
  );
  const { position } = stepperStyle;
  const panelOpacity = (i: number) => clamp01(1 - Math.abs(position - i));
  const navLabel = position >= steps.length - 1 ? finishLabel : nextLabel;
  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      <div
        style={{
          height: 100,
          left: 0,
          position: "absolute",
          right: 0,
          top: 96,
        }}
      >
        <Stepper style={stepperStyle} steps={steps} theme={theme} />
      </div>

      <div
        style={{
          height: CONTENT_HEIGHT,
          left: 0,
          position: "absolute",
          right: 0,
          top: CONTENT_TOP,
        }}
      >
        <div
          style={{ inset: 0, opacity: panelOpacity(0), position: "absolute" }}
        >
          <Input
            style={nameStyle}
            placeholder={name}
            value={name}
            theme={theme}
          />
        </div>

        <div
          style={{ inset: 0, opacity: panelOpacity(1), position: "absolute" }}
        >
          <Radio style={planStyle} label={plans[1] ?? "Pro"} theme={theme} />
        </div>

        <div
          style={{ inset: 0, opacity: panelOpacity(2), position: "absolute" }}
        >
          <Switch
            style={settingsStyle}
            label="Email notifications"
            theme={theme}
          />
        </div>
      </div>

      <div
        style={{
          height: 64,
          left: 0,
          position: "absolute",
          right: 0,
          top: NAV_TOP,
        }}
      >
        <Button label={navLabel} style={navStyle} theme={theme} />
      </div>
    </div>
  );
};
