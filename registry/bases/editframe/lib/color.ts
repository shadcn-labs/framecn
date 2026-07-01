import { clampChroma, converter, formatRgb, interpolate, parse } from "culori";
import type { Oklch, Rgb } from "culori";

const toRgb = converter("rgb");
const toOklch = converter("oklch");

const BLACK: Rgb = { alpha: 1, b: 0, g: 0, mode: "rgb", r: 0 };

export const parseColor = (c: string): Rgb => {
  const s = c.trim();

  if (s.startsWith("var(")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[framecn-ui] parseColor cannot resolve CSS variable "${s}" under Remotion's per-frame render. ` +
          "Animated colors must be concrete oklch/hex/rgb values supplied via the theme. " +
          "Falling back to the JS default."
      );
    }
    return { ...BLACK };
  }

  const rgb = toRgb(parse(s));
  if (!rgb) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[framecn-ui] parseColor could not parse "${s}"; using black.`
      );
    }
    return { ...BLACK };
  }

  return { alpha: rgb.alpha ?? 1, b: rgb.b, g: rgb.g, mode: "rgb", r: rgb.r };
};

export const oklchToRgb = (l: number, c: number, h: number): Rgb => {
  const mapped = clampChroma({ c, h, l, mode: "oklch" }, "oklch", "rgb");
  return toRgb(mapped);
};

export const rgbToOklch = (rgb: Rgb): Oklch => {
  const { l, c, h } = toOklch(rgb);
  return { c, h: Number.isFinite(h) ? h : 0, l, mode: "oklch" };
};
const resolveColorString = (s: string): string => {
  const trimmed = s.trim();
  if (trimmed.startsWith("var(")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[framecn-ui] mixOklch cannot resolve CSS variable "${trimmed}" under Remotion's per-frame render. ` +
          "Animated colors must be concrete oklch/hex/rgb values supplied via the theme. " +
          "Falling back to the JS default."
      );
    }
    return "#000";
  }
  if (!parse(trimmed)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[framecn-ui] mixOklch could not parse "${trimmed}"; using black.`
      );
    }
    return "#000";
  }
  return trimmed;
};

export const mixOklch = (a: string, b: string, t: number): string => {
  const mixed = clampChroma(
    interpolate([resolveColorString(a), resolveColorString(b)], "oklch")(t),
    "oklch",
    "rgb"
  );
  return toCss(toRgb(mixed));
};

export const toCss = (color: Rgb): string => formatRgb(color);
