"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { Button } from "@/registry/bases/editframe/ui/button";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import {
  Field,
  FieldControl,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/editframe/ui/field";
import { Input } from "@/registry/bases/editframe/ui/input";
import { Toast } from "@/registry/bases/editframe/ui/toast";

const STAGE_W = 1280;
const CARD_W = 420;
const CARD_PAD = 28;
const CARD_TOP = 80;
const CARD_LEFT = (STAGE_W - CARD_W) / 2;

const NAME_Y = 220;
const NAME_X = CARD_LEFT + CARD_PAD + 60;
const EMAIL_Y = NAME_Y + 72;
const EMAIL_X = NAME_X;
const PASS_Y = EMAIL_Y + 72;
const PASS_X = NAME_X;
const SIGNUP_Y = PASS_Y + 80;
const SIGNUP_X = CARD_LEFT + CARD_W - CARD_PAD - 48;

export interface SignupFlowProps {
  title?: string;
  description?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  submitLabel?: string;
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}

export function SignupFlow({
  title = "Create an account",
  description = "Enter your details to get started.",
  nameLabel = "Full name",
  namePlaceholder = "Jane Doe",
  emailLabel = "Email",
  emailPlaceholder = "jane@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "••••••••",
  submitLabel = "Sign up",
  toastTitle = "Account created",
  theme,
}: SignupFlowProps) {
  const resolved = useFramecnTheme(theme);

  const cursorStyle = useCursorPath([
    { at: 0, x: 140, y: 90 },
    { at: 48, click: true, duration: 20, x: NAME_X, y: NAME_Y },
    { at: 90, click: true, duration: 18, x: EMAIL_X, y: EMAIL_Y },
    { at: 120, click: true, duration: 14, x: PASS_X, y: PASS_Y },
    { at: 148, click: true, duration: 16, x: SIGNUP_X, y: SIGNUP_Y },
  ]);

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
          flexDirection: "column",
          gap: 20,
          left: CARD_LEFT,
          padding: CARD_PAD,
          position: "absolute",
          top: CARD_TOP,
          width: CARD_W,
        }}
      >
        <BlurIn display="block" state="revealed">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: resolved.cardForeground,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "28px",
              }}
            >
              {title}
            </span>
            <span
              style={{
                color: resolved.mutedForeground,
                fontSize: 14,
                lineHeight: "20px",
              }}
            >
              {description}
            </span>
          </div>
        </BlurIn>

        <FieldGroup gap={18}>
          <BlurIn display="block" state="revealed">
            <Field>
              <FieldLabel theme={theme}>{nameLabel}</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={namePlaceholder}
                  value={namePlaceholder}
                  state="typing"
                  from="idle"
                  duration="8frames"
                  fullWidth
                  theme={theme}
                />
              </FieldControl>
            </Field>
          </BlurIn>

          <BlurIn display="block" state="revealed">
            <Field>
              <FieldLabel theme={theme}>{emailLabel}</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={emailPlaceholder}
                  value={emailPlaceholder}
                  state="typing"
                  from="idle"
                  duration="10frames"
                  fullWidth
                  theme={theme}
                />
              </FieldControl>
            </Field>
          </BlurIn>

          <BlurIn display="block" state="revealed">
            <Field>
              <FieldLabel theme={theme}>{passwordLabel}</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={passwordPlaceholder}
                  value={passwordPlaceholder}
                  state="typing"
                  from="idle"
                  duration="12frames"
                  fullWidth
                  theme={theme}
                />
              </FieldControl>
            </Field>
          </BlurIn>
        </FieldGroup>

        <BlurIn display="block" state="revealed">
          <Field gap={10}>
            <FieldControl height={44}>
              <Button
                label={submitLabel}
                state="idle"
                from="idle"
                align="end"
                theme={theme}
              />
            </FieldControl>
          </Field>
        </BlurIn>
      </div>

      <div style={{ bottom: 32, position: "absolute", right: 32 }}>
        <Toast
          title={toastTitle}
          variant="success"
          state="hidden"
          from="hidden"
          theme={theme}
        />
      </div>

      <Cursor style={cursorStyle} theme={theme} />
    </div>
  );
}
