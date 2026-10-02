"use client";

import type { CSSProperties, ReactNode } from "react";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export interface FieldGroupProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}

export const FieldGroup = ({ children, gap = 28, style }: FieldGroupProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
    {children}
  </div>
);

export interface FieldProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}

export const Field = ({ children, gap = 12, style }: FieldProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
    {children}
  </div>
);

export interface FieldLabelProps {
  children: ReactNode;
  theme?: Partial<FramecnTheme>;
  style?: CSSProperties;
}

export const FieldLabel = ({ children, theme, style }: FieldLabelProps) => {
  const t = useFramecnTheme(theme);
  return (
    <div
      style={{
        color: t.foreground,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.375,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface FieldDescriptionProps {
  children: ReactNode;
  align?: "start" | "center";
  theme?: Partial<FramecnTheme>;
  style?: CSSProperties;
}

export const FieldDescription = ({
  children,
  align = "start",
  theme,
  style,
}: FieldDescriptionProps) => {
  const t = useFramecnTheme(theme);
  return (
    <div
      style={{
        color: t.mutedForeground,
        fontSize: 14,
        lineHeight: 1.5,
        textAlign: align === "center" ? "center" : "left",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface FieldControlProps {
  children: ReactNode;
  height?: number;
  style?: CSSProperties;
}

export const FieldControl = ({
  children,
  height = 36,
  style,
}: FieldControlProps) => (
  <div style={{ height, position: "relative", ...style }}>{children}</div>
);
