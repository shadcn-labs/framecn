"use client";

import type { CSSProperties, ReactNode } from "react";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export interface FieldGroupProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}

export function FieldGroup({ children, gap = 16, style }: FieldGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export interface FieldProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}

export function Field({ children, gap = 6, style }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export interface FieldLabelProps {
  children: ReactNode;
  theme?: Partial<FramecnTheme>;
  style?: CSSProperties;
}

export function FieldLabel({ children, theme, style }: FieldLabelProps) {
  const t = useFramecnTheme(theme, "light");
  return (
    <div
      style={{
        color: t.foreground,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        lineHeight: "18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface FieldDescriptionProps {
  children: ReactNode;
  align?: "start" | "center";
  theme?: Partial<FramecnTheme>;
  style?: CSSProperties;
}

export function FieldDescription({
  children,
  align = "start",
  theme,
  style,
}: FieldDescriptionProps) {
  const t = useFramecnTheme(theme, "light");
  return (
    <div
      style={{
        color: t.mutedForeground,
        fontSize: 12,
        lineHeight: "16px",
        textAlign: align === "center" ? "center" : "left",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface FieldControlProps {
  children: ReactNode;
  height?: number;
  style?: CSSProperties;
}

export function FieldControl({
  children,
  height = 40,
  style,
}: FieldControlProps) {
  return (
    <div style={{ height, position: "relative", ...style }}>{children}</div>
  );
}
