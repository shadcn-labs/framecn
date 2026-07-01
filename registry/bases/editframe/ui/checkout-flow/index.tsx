"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { Button } from "@/registry/bases/editframe/ui/button";
import { Checkbox } from "@/registry/bases/editframe/ui/checkbox";
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
import { ToggleGroup } from "@/registry/bases/editframe/ui/toggle-group";
import type { ToggleGroupItem } from "@/registry/bases/editframe/ui/toggle-group";

const DEFAULT_PLANS: ToggleGroupItem[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const STAGE_W = 1280;
const CARD_W = 420;
const CARD_PAD = 28;
const CARD_TOP = 96;
const CARD_LEFT = (STAGE_W - CARD_W) / 2;
const CENTER_X = STAGE_W / 2;
const CONTENT_LEFT = CARD_LEFT + CARD_PAD;
const CONTENT_RIGHT = CARD_LEFT + CARD_W - CARD_PAD;

const TOGGLE_Y = 222;
const YEARLY_X = CONTENT_LEFT + 4 + 88 + 44;
const CARD_X = CENTER_X;
const CARD_Y = 312;
const TERMS_X = CONTENT_LEFT + 12;
const TERMS_Y = 376;
const PAY_X = CONTENT_RIGHT - 48;
const PAY_Y = 442;

export interface CheckoutFlowProps {
  title?: string;
  description?: string;
  plans?: ToggleGroupItem[];
  cardLabel?: string;
  cardPlaceholder?: string;
  termsLabel?: string;
  payLabel?: string;
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}

export const CheckoutFlow = ({
  title = "Upgrade your plan",
  description = "Complete your purchase to unlock every feature.",
  plans = DEFAULT_PLANS,
  cardLabel = "Card number",
  cardPlaceholder = "4242 4242 4242 4242",
  termsLabel = "I accept the terms and conditions",
  payLabel = "Pay $49",
  toastTitle = "Payment successful",
  theme,
}: CheckoutFlowProps) => {
  const resolved = useFramecnTheme(theme);

  const cursorStyle = useCursorPath([
    { at: 0, x: 140, y: 90 },
    { at: 64, click: true, duration: 22, x: YEARLY_X, y: TOGGLE_Y },
    { at: 96, click: true, duration: 24, x: CARD_X, y: CARD_Y },
    { at: 150, click: true, duration: 30, x: TERMS_X, y: TERMS_Y },
    { at: 180, click: true, duration: 26, x: PAY_X, y: PAY_Y },
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
          gap: 24,
          height: 420,
          left: CARD_LEFT,
          padding: 28,
          position: "absolute",
          top: CARD_TOP,
          width: CARD_W,
        }}
      >
        <BlurIn display="block" state="revealed">
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

        <BlurIn display="block" state="revealed">
          <FieldControl height={44}>
            <ToggleGroup state={1} items={plans} theme={theme} />
          </FieldControl>
        </BlurIn>

        <FieldGroup gap={24}>
          <BlurIn display="block" state="revealed">
            <Field>
              <FieldLabel theme={theme}>{cardLabel}</FieldLabel>
              <FieldControl>
                <Input
                  placeholder={cardPlaceholder}
                  value={cardPlaceholder}
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
            <FieldControl>
              <Checkbox
                label={termsLabel}
                state="checked"
                from="unchecked"
                duration="10frames"
                theme={theme}
              />
            </FieldControl>
          </BlurIn>
        </FieldGroup>

        <BlurIn display="block" state="revealed">
          <Field gap={10}>
            <FieldControl height={44}>
              <Button
                label={payLabel}
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

      <Cursor style={cursorStyle} variant="pointer" theme={theme} />
    </div>
  );
};
