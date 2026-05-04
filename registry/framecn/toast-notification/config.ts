import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const toastNotificationConfig: ComponentConfig = {
  componentName: "ToastNotification",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#fafafa", label: "Background", type: "color" },
    cardColor: { default: "white", label: "Card color", type: "color" },
    message: {
      default: "Your changes are live at remocn.dev",
      label: "Message",
      type: "text",
    },
    mutedColor: { default: "#71717a", label: "Muted text", type: "color" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    textColor: { default: "#171717", label: "Text color", type: "color" },
    title: {
      default: "Deployment successful",
      label: "Title",
      type: "text",
    },
    variant: {
      default: "success",
      label: "Variant",
      options: [
        { label: "Success", value: "success" },
        { label: "Error", value: "error" },
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
      ],
      type: "select",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/toast-notification",
};
