export type Mode = "light" | "dark";

export const resolved = <T>(mode: Mode, light: T, dark: T): T =>
  mode === "dark" ? dark : light;

export const THEME = {
  background: { dark: "#09090b", light: "white" },
  border: {
    dark: "rgba(255,255,255,0.08)",
    light: "rgba(0,0,0,0.06)",
  },
  muted: { dark: "#a1a1aa", light: "#71717a" },
  shadow: {
    dark: "0 10px 30px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)",
    light: "0 10px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
  },
  subtle: { dark: "#18181b", light: "#fafafa" },
  text: { dark: "#fafafa", light: "#171717" },
};
