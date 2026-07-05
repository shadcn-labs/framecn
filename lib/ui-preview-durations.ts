import { chatFlowDuration } from "@/registry/bases/editframe/ui/chat-flow";
import { imessageChatFlowDuration } from "@/registry/bases/editframe/ui/imessage-chat-flow";
import { telegramChatFlowDuration } from "@/registry/bases/editframe/ui/telegram-chat-flow";

/** Default docs preview length when no component-specific duration is set (3s @ 30fps). */
export const DEFAULT_UI_PREVIEW_DURATION_FRAMES = 90;

/**
 * Preview timeline lengths aligned with remocn-ui example scenes — each value
 * is the last meaningful frame plus a short settle before loop.
 */
const UI_PREVIEW_DURATION_FRAMES: Record<string, number> = {
  accordion: 100,
  "alert-dialog": 120,
  "blur-in": 40,
  button: 132,
  caret: 120,
  checkbox: 100,
  combobox: 120,
  "command-menu": 130,
  "command-menu-item": 120,
  "context-menu": 135,
  cursor: 140,
  dialog: 120,
  drawer: 120,
  "dropdown-menu": 120,
  "dropdown-menu-item": 90,
  field: 90,
  input: 120,
  "message-bubble": 90,
  popover: 130,
  progress: 160,
  radio: 100,
  resizable: 205,
  select: 120,
  "select-item": 90,
  sheet: 120,
  skeleton: 220,
  "skeleton-block": 90,
  slider: 120,
  spinner: 90,
  stepper: 150,
  switch: 100,
  tabs: 120,
  toast: 170,
  "toggle-group": 115,
  tooltip: 120,
  "typing-indicator": 90,
  // Blocks — end of last transition + settle
  "ai-prompt-flow": 234,
  "checkout-flow": 300,
  "onboarding-stepper-flow": 170,
  "settings-toggle-flow": 312,
  "signup-flow": 362,
};

export const getPreviewDurationInFrames = (name: string): number => {
  const fixed = UI_PREVIEW_DURATION_FRAMES[name];
  if (fixed !== undefined) {
    return fixed;
  }

  switch (name) {
    case "chat-flow": {
      return chatFlowDuration();
    }
    case "imessage-chat-flow": {
      return imessageChatFlowDuration();
    }
    case "telegram-chat-flow": {
      return telegramChatFlowDuration();
    }
    default: {
      return DEFAULT_UI_PREVIEW_DURATION_FRAMES;
    }
  }
};
