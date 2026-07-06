"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { useBlurInTransition } from "@/registry/bases/editframe/ui/blur-in/use-blur-in-transition";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/editframe/ui/field";
import { Input } from "@/registry/bases/editframe/ui/input";
import { useInputTransition } from "@/registry/bases/editframe/ui/input/use-input-transition";
import { Toast } from "@/registry/bases/editframe/ui/toast";
import { useToastTransition } from "@/registry/bases/editframe/ui/toast/use-toast-transition";

export interface SignupFlowProps {
  title?: string;
  description?: string;
  fullName?: string;
  email?: string;
  password?: string;
  createLabel?: string;
  googleLabel?: string;
  signinText?: string;
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}
const STAGE_W = 1280;
const CARD_W = 376;
const CARD_TOP = 48;
const CARD_LEFT = (STAGE_W - CARD_W) / 2;
const CENTER_X = STAGE_W / 2;
const NAME_Y = 216;
const EMAIL_Y = 296;
const PASS_Y = 398;
const CONFIRM_Y = 500;
const CREATE_Y = 564;
export const SignupFlow = ({
  title = "Create an account",
  description = "Enter your information below to create your account",
  fullName = "John Doe",
  email = "m@example.com",
  password = "••••••••",
  createLabel = "Create account",
  toastTitle = "Account created",
  theme,
}: SignupFlowProps) => {
  const resolved = useFramecnTheme(theme);
  const opts = { theme };
  const cardEnter = useBlurInTransition(
    [{ at: 0, duration: 18, state: "revealed" }],
    { distance: 0 }
  );
  const enterHeader = useBlurInTransition([
    { at: 18, duration: 16, state: "revealed" },
  ]);
  const enterName = useBlurInTransition([
    { at: 24, duration: 16, state: "revealed" },
  ]);
  const enterEmail = useBlurInTransition([
    { at: 30, duration: 16, state: "revealed" },
  ]);
  const enterPass = useBlurInTransition([
    { at: 36, duration: 16, state: "revealed" },
  ]);
  const enterConfirm = useBlurInTransition([
    { at: 42, duration: 16, state: "revealed" },
  ]);
  const enterButton = useBlurInTransition([
    { at: 48, duration: 16, state: "revealed" },
  ]);
  const DEMO = 48;
  const cursorStyle = useCursorPath([
    { at: 0, x: 160, y: 120 },
    { at: 18 + DEMO, click: true, duration: 18, x: CENTER_X, y: NAME_Y },
    { at: 52 + DEMO, click: true, duration: 30, x: CENTER_X, y: EMAIL_Y },
    { at: 96 + DEMO, click: true, duration: 40, x: CENTER_X, y: PASS_Y },
    { at: 134 + DEMO, click: true, duration: 32, x: CENTER_X, y: CONFIRM_Y },
    { at: 176 + DEMO, click: true, duration: 38, x: CENTER_X, y: CREATE_Y },
  ]);
  const nameStyle = useInputTransition(
    [
      { at: 18 + DEMO, duration: 6, state: "active" },
      { at: 20 + DEMO, duration: 20, state: "typing" },
      { at: 52 + DEMO, duration: 8, state: "blur" },
    ],
    opts
  );
  const emailStyle = useInputTransition(
    [
      { at: 52 + DEMO, duration: 6, state: "active" },
      { at: 54 + DEMO, duration: 28, state: "typing" },
      { at: 96 + DEMO, duration: 8, state: "blur" },
    ],
    opts
  );
  const passStyle = useInputTransition(
    [
      { at: 96 + DEMO, duration: 6, state: "active" },
      { at: 98 + DEMO, duration: 22, state: "typing" },
      { at: 134 + DEMO, duration: 8, state: "blur" },
    ],
    opts
  );
  const confirmStyle = useInputTransition(
    [
      { at: 134 + DEMO, duration: 6, state: "active" },
      { at: 136 + DEMO, duration: 22, state: "typing" },
      { at: 176 + DEMO, duration: 8, state: "blur" },
    ],
    opts
  );
  const buttonStyle = useButtonTransition(
    [
      { at: 176 + DEMO, duration: 8, state: "hover" },
      { at: 186 + DEMO, duration: 6, state: "press" },
      { at: 192 + DEMO, duration: 6, state: "loading" },
      { at: 234 + DEMO, duration: 16, state: "success" },
    ],
    opts
  );
  const toastStyle = useToastTransition(
    [
      { at: 234 + DEMO, duration: 14, state: "visible" },
      { at: 300 + DEMO, duration: 14, state: "hidden" },
    ],
    {}
  );
  return (
    <div
      style={{
        background: "transparent",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: resolved.background,
          border: `1px solid ${resolved.border}`,
          borderRadius: 14,
          boxShadow:
            "0 10px 30px -12px rgba(0,0,0,0.22), 0 2px 8px -3px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
          display: "flex",
          filter: cardEnter.blur > 0 ? `blur(${cardEnter.blur}px)` : "none",
          flexDirection: "column",
          gap: 24,
          height: 580,
          left: CARD_LEFT,
          opacity: cardEnter.opacity,
          padding: 28,
          position: "absolute",
          top: CARD_TOP,
          width: CARD_W,
        }}
      >
        <BlurIn display="block" style={enterHeader}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                color: resolved.cardForeground,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "28px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: resolved.mutedForeground,
                fontSize: 14,
                lineHeight: "20px",
              }}
            >
              {description}
            </div>
          </div>
        </BlurIn>

        <FieldGroup gap={16}>
          <BlurIn display="block" style={enterName}>
            <Field>
              <FieldLabel theme={theme}>Full Name</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={fullName}
                  value={fullName}
                  style={nameStyle}
                  theme={theme}
                />
              </FieldControl>
            </Field>
          </BlurIn>

          <BlurIn display="block" style={enterEmail}>
            <Field>
              <FieldLabel theme={theme}>Email</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={email}
                  value={email}
                  style={emailStyle}
                  theme={theme}
                />
              </FieldControl>
              <FieldDescription theme={theme}>
                We'll use this to contact you.
              </FieldDescription>
            </Field>
          </BlurIn>

          <BlurIn display="block" style={enterPass}>
            <Field>
              <FieldLabel theme={theme}>Password</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={password}
                  value={password}
                  style={passStyle}
                  theme={theme}
                />
              </FieldControl>
              <FieldDescription theme={theme}>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
          </BlurIn>

          <BlurIn display="block" style={enterConfirm}>
            <Field>
              <FieldLabel theme={theme}>Confirm Password</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={password}
                  value={password}
                  style={confirmStyle}
                  theme={theme}
                />
              </FieldControl>
            </Field>
          </BlurIn>
        </FieldGroup>

        <BlurIn display="block" style={enterButton}>
          <Field gap={10}>
            <FieldControl>
              <Button label={createLabel} style={buttonStyle} theme={theme} />
            </FieldControl>
          </Field>
        </BlurIn>
      </div>

      <div style={{ bottom: 32, position: "absolute", right: 32 }}>
        <Toast
          title={toastTitle}
          variant="success"
          style={toastStyle}
          theme={theme}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" theme={theme} />
    </div>
  );
};
