"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { aiGenerateOverlayConfig } from "@/registry/bases/editframe/components/ai-generate-overlay/config";
import { aiGenerationCanvasConfig } from "@/registry/bases/editframe/components/ai-generation-canvas/config";
import { animatedBarChartConfig } from "@/registry/bases/editframe/components/animated-bar-chart/config";
import { animatedLineChartConfig } from "@/registry/bases/editframe/components/animated-line-chart/config";
import { backdropConfig } from "@/registry/bases/editframe/components/backdrop/config";
import { blurOutUpConfig } from "@/registry/bases/editframe/components/blur-out-up/config";
import { blurRevealConfig } from "@/registry/bases/editframe/components/blur-reveal/config";
import { bottomUpLettersConfig } from "@/registry/bases/editframe/components/bottom-up-letters/config";
import { boundingBoxSelectorConfig } from "@/registry/bases/editframe/components/bounding-box-selector/config";
import { browserFlowConfig } from "@/registry/bases/editframe/components/browser-flow/config";
import { captionClipWipeConfig } from "@/registry/bases/editframe/components/caption-clip-wipe/config";
import { captionEditorialEmphasisConfig } from "@/registry/bases/editframe/components/caption-editorial-emphasis/config";
import { captionEmojiPopConfig } from "@/registry/bases/editframe/components/caption-emoji-pop/config";
import { captionGlitchRgbConfig } from "@/registry/bases/editframe/components/caption-glitch-rgb/config";
import { captionGradientFillConfig } from "@/registry/bases/editframe/components/caption-gradient-fill/config";
import { captionHighlightConfig } from "@/registry/bases/editframe/components/caption-highlight/config";
import { captionKineticSlamConfig } from "@/registry/bases/editframe/components/caption-kinetic-slam/config";
import { captionMatrixDecodeConfig } from "@/registry/bases/editframe/components/caption-matrix-decode/config";
import { captionNeonAccentConfig } from "@/registry/bases/editframe/components/caption-neon-accent/config";
import { captionNeonGlowConfig } from "@/registry/bases/editframe/components/caption-neon-glow/config";
import { captionParallaxLayersConfig } from "@/registry/bases/editframe/components/caption-parallax-layers/config";
import { captionParticleBurstConfig } from "@/registry/bases/editframe/components/caption-particle-burst/config";
import { captionPillKaraokeConfig } from "@/registry/bases/editframe/components/caption-pill-karaoke/config";
import { captionTextureConfig } from "@/registry/bases/editframe/components/caption-texture/config";
import { captionWeightShiftConfig } from "@/registry/bases/editframe/components/caption-weight-shift/config";
import { chatToPreviewLayoutConfig } from "@/registry/bases/editframe/components/chat-to-preview-layout/config";
import { chromaticAberrationWipeConfig } from "@/registry/bases/editframe/components/chromatic-aberration-wipe/config";
import { codeAccordionConfig } from "@/registry/bases/editframe/components/code-accordion/config";
import { codeDiffWipeConfig } from "@/registry/bases/editframe/components/code-diff-wipe/config";
import { confettiConfig } from "@/registry/bases/editframe/components/confetti/config";
import { cursorFlowConfig } from "@/registry/bases/editframe/components/cursor-flow/config";
import { dashboardPopulateConfig } from "@/registry/bases/editframe/components/dashboard-populate/config";
import { dataFlowPipesConfig } from "@/registry/bases/editframe/components/data-flow-pipes/config";
import { deviceMockupZoomConfig } from "@/registry/bases/editframe/components/device-mockup-zoom/config";
import { directionalWipeConfig } from "@/registry/bases/editframe/components/directional-wipe/config";
import { dragAndDropFlowConfig } from "@/registry/bases/editframe/components/drag-and-drop-flow/config";
import { dynamicGridConfig } from "@/registry/bases/editframe/components/dynamic-grid/config";
import { ecosystemConstellationConfig } from "@/registry/bases/editframe/components/ecosystem-constellation/config";
import { fadeThroughConfig } from "@/registry/bases/editframe/components/fade-through/config";
import { focusBlurResolveConfig } from "@/registry/bases/editframe/components/focus-blur-resolve/config";
import { frostedGlassWipeConfig } from "@/registry/bases/editframe/components/frosted-glass-wipe/config";
import { glassCodeBlockConfig } from "@/registry/bases/editframe/components/glass-code-block/config";
import { gridPixelateWipeConfig } from "@/registry/bases/editframe/components/grid-pixelate-wipe/config";
import { heroDeviceAssembleConfig } from "@/registry/bases/editframe/components/hero-device-assemble/config";
import { imageExpandToFullscreenConfig } from "@/registry/bases/editframe/components/image-expand-to-fullscreen/config";
import { infiniteBentoPanConfig } from "@/registry/bases/editframe/components/infinite-bento-pan/config";
import { infiniteMarqueeConfig } from "@/registry/bases/editframe/components/infinite-marquee/config";
import { inlineHighlightConfig } from "@/registry/bases/editframe/components/inline-highlight/config";
import { kineticTypeMaskConfig } from "@/registry/bases/editframe/components/kinetic-type-mask/config";
import { landingCodeShowcaseConfig } from "@/registry/bases/editframe/components/landing-code-showcase/config";
import { lineByLineSlideConfig } from "@/registry/bases/editframe/components/line-by-line-slide/config";
import { liveCodeCompilationConfig } from "@/registry/bases/editframe/components/live-code-compilation/config";
import { logoEnterConfig } from "@/registry/bases/editframe/components/logo-enter/config";
import { markerHighlightConfig } from "@/registry/bases/editframe/components/marker-highlight/config";
import { maskRevealUpConfig } from "@/registry/bases/editframe/components/mask-reveal-up/config";
import { maskedSlideRevealConfig } from "@/registry/bases/editframe/components/masked-slide-reveal/config";
import { matrixDecodeConfig } from "@/registry/bases/editframe/components/matrix-decode/config";
import { meshGradientBgConfig } from "@/registry/bases/editframe/components/mesh-gradient-bg/config";
import { microScaleFadeConfig } from "@/registry/bases/editframe/components/micro-scale-fade/config";
import { morphingModalConfig } from "@/registry/bases/editframe/components/morphing-modal/config";
import { perCharacterRiseConfig } from "@/registry/bases/editframe/components/per-character-rise/config";
import { perWordCrossfadeConfig } from "@/registry/bases/editframe/components/per-word-crossfade/config";
import { perspectiveMarqueeConfig } from "@/registry/bases/editframe/components/perspective-marquee/config";
import { pipelineJourneyConfig } from "@/registry/bases/editframe/components/pipeline-journey/config";
import { pricingTierFocusConfig } from "@/registry/bases/editframe/components/pricing-tier-focus/config";
import { productLaunchTrailerConfig } from "@/registry/bases/editframe/components/product-launch-trailer/config";
import { progressStepsConfig } from "@/registry/bases/editframe/components/progress-steps/config";
import { pulsingIndicatorConfig } from "@/registry/bases/editframe/components/pulsing-indicator/config";
import { rgbGlitchTextConfig } from "@/registry/bases/editframe/components/rgb-glitch-text/config";
import { scaleDownFadeConfig } from "@/registry/bases/editframe/components/scale-down-fade/config";
import { sharedAxisYConfig } from "@/registry/bases/editframe/components/shared-axis-y/config";
import { sharedAxisZConfig } from "@/registry/bases/editframe/components/shared-axis-z/config";
import { shimmerSweepConfig } from "@/registry/bases/editframe/components/shimmer-sweep/config";
import { shortSlideRightConfig } from "@/registry/bases/editframe/components/short-slide-right/config";
import { simulatedCursorConfig } from "@/registry/bases/editframe/components/simulated-cursor/config";
import { slotMachineRollConfig } from "@/registry/bases/editframe/components/slot-machine-roll/config";
import { softBlurInConfig } from "@/registry/bases/editframe/components/soft-blur-in/config";
import { spatialPushConfig } from "@/registry/bases/editframe/components/spatial-push/config";
import { spotlightCardConfig } from "@/registry/bases/editframe/components/spotlight-card/config";
import { springPopInConfig } from "@/registry/bases/editframe/components/spring-pop-in/config";
import { springScaleInConfig } from "@/registry/bases/editframe/components/spring-scale-in/config";
import { staggeredBentoGridConfig } from "@/registry/bases/editframe/components/staggered-bento-grid/config";
import { staggeredFadeUpConfig } from "@/registry/bases/editframe/components/staggered-fade-up/config";
import { strikethroughReplaceConfig } from "@/registry/bases/editframe/components/strikethrough-replace/config";
import { successConfettiConfig } from "@/registry/bases/editframe/components/success-confetti/config";
import { swipeTransitionWipeConfig } from "@/registry/bases/editframe/components/swipe-transition-wipe/config";
import { terminalSimulatorConfig } from "@/registry/bases/editframe/components/terminal-simulator/config";
import { terminalToBrowserDeployConfig } from "@/registry/bases/editframe/components/terminal-to-browser-deploy/config";
import { textFadeReplaceConfig } from "@/registry/bases/editframe/components/text-fade-replace/config";
import { toastNotificationConfig } from "@/registry/bases/editframe/components/toast-notification/config";
import { topDownLettersConfig } from "@/registry/bases/editframe/components/top-down-letters/config";
import { trackingInConfig } from "@/registry/bases/editframe/components/tracking-in/config";
import { typewriterConfig } from "@/registry/bases/editframe/components/typewriter/config";
import { zoomThroughTransitionConfig } from "@/registry/bases/editframe/components/zoom-through-transition/config";
import { Accordion } from "@/registry/bases/editframe/ui/accordion";
import { AiPromptFlow } from "@/registry/bases/editframe/ui/ai-prompt-flow";
import { AlertDialog } from "@/registry/bases/editframe/ui/alert-dialog";
import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { Button } from "@/registry/bases/editframe/ui/button";
import { Caret } from "@/registry/bases/editframe/ui/caret";
import { ChatFlow } from "@/registry/bases/editframe/ui/chat-flow";
import { Checkbox } from "@/registry/bases/editframe/ui/checkbox";
import { CheckoutFlow } from "@/registry/bases/editframe/ui/checkout-flow";
import { Combobox } from "@/registry/bases/editframe/ui/combobox";
import { CommandMenu } from "@/registry/bases/editframe/ui/command-menu";
import { CommandMenuItem } from "@/registry/bases/editframe/ui/command-menu-item";
import { ContextMenu } from "@/registry/bases/editframe/ui/context-menu";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { Dialog } from "@/registry/bases/editframe/ui/dialog";
import { Drawer } from "@/registry/bases/editframe/ui/drawer";
import { DropdownMenu } from "@/registry/bases/editframe/ui/dropdown-menu";
import { DropdownMenuItem } from "@/registry/bases/editframe/ui/dropdown-menu-item";
import { Field } from "@/registry/bases/editframe/ui/field";
import { ImessageChatFlow } from "@/registry/bases/editframe/ui/imessage-chat-flow";
import { Input } from "@/registry/bases/editframe/ui/input";
import { MessageBubble } from "@/registry/bases/editframe/ui/message-bubble";
import { OnboardingStepperFlow } from "@/registry/bases/editframe/ui/onboarding-stepper-flow";
import { Popover } from "@/registry/bases/editframe/ui/popover";
import { Progress } from "@/registry/bases/editframe/ui/progress";
import { Radio } from "@/registry/bases/editframe/ui/radio";
import { Resizable } from "@/registry/bases/editframe/ui/resizable";
import { Select } from "@/registry/bases/editframe/ui/select";
import { SelectItem } from "@/registry/bases/editframe/ui/select-item";
import { SettingsToggleFlow } from "@/registry/bases/editframe/ui/settings-toggle-flow";
import { Sheet } from "@/registry/bases/editframe/ui/sheet";
import { SignupFlow } from "@/registry/bases/editframe/ui/signup-flow";
import { Skeleton } from "@/registry/bases/editframe/ui/skeleton";
import { SkeletonBlock } from "@/registry/bases/editframe/ui/skeleton-block";
import { Slider } from "@/registry/bases/editframe/ui/slider";
import { Spinner } from "@/registry/bases/editframe/ui/spinner";
import { Stepper } from "@/registry/bases/editframe/ui/stepper";
import { Switch } from "@/registry/bases/editframe/ui/switch";
import { Tabs } from "@/registry/bases/editframe/ui/tabs";
import { TelegramChatFlow } from "@/registry/bases/editframe/ui/telegram-chat-flow";
import { Toast } from "@/registry/bases/editframe/ui/toast";
import { ToggleGroup } from "@/registry/bases/editframe/ui/toggle-group";
import { Tooltip } from "@/registry/bases/editframe/ui/tooltip";
import { TypingIndicator } from "@/registry/bases/editframe/ui/typing-indicator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

export interface RegistryEntry {
  Component: AnyComponent;
  config?: ComponentConfig;
}

const lazy = (loader: () => Promise<{ default: AnyComponent }>) =>
  dynamic(loader, { ssr: false });

const registry: Record<string, RegistryEntry> = {
  "ai-generate-overlay": {
    Component: lazy(async () => {
      const { AIGenerateOverlay } =
        await import("@/registry/bases/editframe/components/ai-generate-overlay");
      return { default: AIGenerateOverlay };
    }),
    config: aiGenerateOverlayConfig,
  },
  "ai-generation-canvas": {
    Component: lazy(async () => {
      const { AIGenerationCanvas } =
        await import("@/registry/bases/editframe/components/ai-generation-canvas");
      return { default: AIGenerationCanvas };
    }),
    config: aiGenerationCanvasConfig,
  },
  "animated-bar-chart": {
    Component: lazy(async () => {
      const { AnimatedBarChart } =
        await import("@/registry/bases/editframe/components/animated-bar-chart");
      return { default: AnimatedBarChart };
    }),
    config: animatedBarChartConfig,
  },
  "animated-line-chart": {
    Component: lazy(async () => {
      const { AnimatedLineChart } =
        await import("@/registry/bases/editframe/components/animated-line-chart");
      return { default: AnimatedLineChart };
    }),
    config: animatedLineChartConfig,
  },
  backdrop: {
    Component: lazy(async () => {
      const { Backdrop } =
        await import("@/registry/bases/editframe/components/backdrop");
      return { default: Backdrop };
    }),
    config: backdropConfig,
  },
  "blur-out-up": {
    Component: lazy(async () => {
      const { BlurOutUp } =
        await import("@/registry/bases/editframe/components/blur-out-up");
      return { default: BlurOutUp };
    }),
    config: blurOutUpConfig,
  },
  "blur-reveal": {
    Component: lazy(async () => {
      const { BlurReveal } =
        await import("@/registry/bases/editframe/components/blur-reveal");
      return { default: BlurReveal };
    }),
    config: blurRevealConfig,
  },
  "bottom-up-letters": {
    Component: lazy(async () => {
      const { BottomUpLetters } =
        await import("@/registry/bases/editframe/components/bottom-up-letters");
      return { default: BottomUpLetters };
    }),
    config: bottomUpLettersConfig,
  },
  "bounding-box-selector": {
    Component: lazy(async () => {
      const { BoundingBoxSelector } =
        await import("@/registry/bases/editframe/components/bounding-box-selector");
      return { default: BoundingBoxSelector };
    }),
    config: boundingBoxSelectorConfig,
  },
  "browser-flow": {
    Component: lazy(async () => {
      const { BrowserFlow } =
        await import("@/registry/bases/editframe/components/browser-flow");
      return { default: BrowserFlow };
    }),
    config: browserFlowConfig,
  },
  "caption-clip-wipe": {
    Component: lazy(async () => {
      const { CaptionClipWipe } =
        await import("@/registry/bases/editframe/components/caption-clip-wipe");
      return { default: CaptionClipWipe };
    }),
    config: captionClipWipeConfig,
  },
  "caption-editorial-emphasis": {
    Component: lazy(async () => {
      const { CaptionEditorialEmphasis } =
        await import("@/registry/bases/editframe/components/caption-editorial-emphasis");
      return { default: CaptionEditorialEmphasis };
    }),
    config: captionEditorialEmphasisConfig,
  },
  "caption-emoji-pop": {
    Component: lazy(async () => {
      const { CaptionEmojiPop } =
        await import("@/registry/bases/editframe/components/caption-emoji-pop");
      return { default: CaptionEmojiPop };
    }),
    config: captionEmojiPopConfig,
  },
  "caption-glitch-rgb": {
    Component: lazy(async () => {
      const { CaptionGlitchRgb } =
        await import("@/registry/bases/editframe/components/caption-glitch-rgb");
      return { default: CaptionGlitchRgb };
    }),
    config: captionGlitchRgbConfig,
  },
  "caption-gradient-fill": {
    Component: lazy(async () => {
      const { CaptionGradientFill } =
        await import("@/registry/bases/editframe/components/caption-gradient-fill");
      return { default: CaptionGradientFill };
    }),
    config: captionGradientFillConfig,
  },
  "caption-highlight": {
    Component: lazy(async () => {
      const { CaptionHighlight } =
        await import("@/registry/bases/editframe/components/caption-highlight");
      return { default: CaptionHighlight };
    }),
    config: captionHighlightConfig,
  },
  "caption-kinetic-slam": {
    Component: lazy(async () => {
      const { CaptionKineticSlam } =
        await import("@/registry/bases/editframe/components/caption-kinetic-slam");
      return { default: CaptionKineticSlam };
    }),
    config: captionKineticSlamConfig,
  },
  "caption-matrix-decode": {
    Component: lazy(async () => {
      const { CaptionMatrixDecode } =
        await import("@/registry/bases/editframe/components/caption-matrix-decode");
      return { default: CaptionMatrixDecode };
    }),
    config: captionMatrixDecodeConfig,
  },
  "caption-neon-accent": {
    Component: lazy(async () => {
      const { CaptionNeonAccent } =
        await import("@/registry/bases/editframe/components/caption-neon-accent");
      return { default: CaptionNeonAccent };
    }),
    config: captionNeonAccentConfig,
  },
  "caption-neon-glow": {
    Component: lazy(async () => {
      const { CaptionNeonGlow } =
        await import("@/registry/bases/editframe/components/caption-neon-glow");
      return { default: CaptionNeonGlow };
    }),
    config: captionNeonGlowConfig,
  },
  "caption-parallax-layers": {
    Component: lazy(async () => {
      const { CaptionParallaxLayers } =
        await import("@/registry/bases/editframe/components/caption-parallax-layers");
      return { default: CaptionParallaxLayers };
    }),
    config: captionParallaxLayersConfig,
  },
  "caption-particle-burst": {
    Component: lazy(async () => {
      const { CaptionParticleBurst } =
        await import("@/registry/bases/editframe/components/caption-particle-burst");
      return { default: CaptionParticleBurst };
    }),
    config: captionParticleBurstConfig,
  },
  "caption-pill-karaoke": {
    Component: lazy(async () => {
      const { CaptionPillKaraoke } =
        await import("@/registry/bases/editframe/components/caption-pill-karaoke");
      return { default: CaptionPillKaraoke };
    }),
    config: captionPillKaraokeConfig,
  },
  "caption-texture": {
    Component: lazy(async () => {
      const { CaptionTexture } =
        await import("@/registry/bases/editframe/components/caption-texture");
      return { default: CaptionTexture };
    }),
    config: captionTextureConfig,
  },
  "caption-weight-shift": {
    Component: lazy(async () => {
      const { CaptionWeightShift } =
        await import("@/registry/bases/editframe/components/caption-weight-shift");
      return { default: CaptionWeightShift };
    }),
    config: captionWeightShiftConfig,
  },
  "chat-to-preview-layout": {
    Component: lazy(async () => {
      const { ChatToPreviewLayout } =
        await import("@/registry/bases/editframe/components/chat-to-preview-layout");
      return { default: ChatToPreviewLayout };
    }),
    config: chatToPreviewLayoutConfig,
  },
  "chromatic-aberration-wipe": {
    Component: lazy(async () => {
      const { ChromaticAberrationWipe } =
        await import("@/registry/bases/editframe/components/chromatic-aberration-wipe");
      return { default: ChromaticAberrationWipe };
    }),
    config: chromaticAberrationWipeConfig,
  },
  "code-accordion": {
    Component: lazy(async () => {
      const { CodeAccordion } =
        await import("@/registry/bases/editframe/components/code-accordion");
      return { default: CodeAccordion };
    }),
    config: codeAccordionConfig,
  },
  "code-diff-wipe": {
    Component: lazy(async () => {
      const { CodeDiffWipe } =
        await import("@/registry/bases/editframe/components/code-diff-wipe");
      return { default: CodeDiffWipe };
    }),
    config: codeDiffWipeConfig,
  },
  confetti: {
    Component: lazy(async () => {
      const { Confetti } =
        await import("@/registry/bases/editframe/components/confetti");
      return { default: Confetti };
    }),
    config: confettiConfig,
  },
  "cursor-flow": {
    Component: lazy(async () => {
      const { CursorFlow } =
        await import("@/registry/bases/editframe/components/cursor-flow");
      return { default: CursorFlow };
    }),
    config: cursorFlowConfig,
  },
  "dashboard-populate": {
    Component: lazy(async () => {
      const { DashboardPopulate } =
        await import("@/registry/bases/editframe/components/dashboard-populate");
      return { default: DashboardPopulate };
    }),
    config: dashboardPopulateConfig,
  },
  "data-flow-pipes": {
    Component: lazy(async () => {
      const { DataFlowPipes } =
        await import("@/registry/bases/editframe/components/data-flow-pipes");
      return { default: DataFlowPipes };
    }),
    config: dataFlowPipesConfig,
  },
  "device-mockup-zoom": {
    Component: lazy(async () => {
      const { DeviceMockupZoom } =
        await import("@/registry/bases/editframe/components/device-mockup-zoom");
      return { default: DeviceMockupZoom };
    }),
    config: deviceMockupZoomConfig,
  },
  "directional-wipe": {
    Component: lazy(async () => {
      const { DirectionalWipe } =
        await import("@/registry/bases/editframe/components/directional-wipe");
      return { default: DirectionalWipe };
    }),
    config: directionalWipeConfig,
  },
  "drag-and-drop-flow": {
    Component: lazy(async () => {
      const { DragAndDropFlow } =
        await import("@/registry/bases/editframe/components/drag-and-drop-flow");
      return { default: DragAndDropFlow };
    }),
    config: dragAndDropFlowConfig,
  },
  "dynamic-grid": {
    Component: lazy(async () => {
      const { DynamicGrid } =
        await import("@/registry/bases/editframe/components/dynamic-grid");
      return { default: DynamicGrid };
    }),
    config: dynamicGridConfig,
  },
  "ecosystem-constellation": {
    Component: lazy(async () => {
      const { EcosystemConstellation } =
        await import("@/registry/bases/editframe/components/ecosystem-constellation");
      return { default: EcosystemConstellation };
    }),
    config: ecosystemConstellationConfig,
  },
  "fade-through": {
    Component: lazy(async () => {
      const { FadeThrough } =
        await import("@/registry/bases/editframe/components/fade-through");
      return { default: FadeThrough };
    }),
    config: fadeThroughConfig,
  },
  "focus-blur-resolve": {
    Component: lazy(async () => {
      const { FocusBlurResolve } =
        await import("@/registry/bases/editframe/components/focus-blur-resolve");
      return { default: FocusBlurResolve };
    }),
    config: focusBlurResolveConfig,
  },
  "frosted-glass-wipe": {
    Component: lazy(async () => {
      const { FrostedGlassWipe } =
        await import("@/registry/bases/editframe/components/frosted-glass-wipe");
      return { default: FrostedGlassWipe };
    }),
    config: frostedGlassWipeConfig,
  },
  "glass-code-block": {
    Component: lazy(async () => {
      const { GlassCodeBlock } =
        await import("@/registry/bases/editframe/components/glass-code-block");
      return { default: GlassCodeBlock };
    }),
    config: glassCodeBlockConfig,
  },
  "grid-pixelate-wipe": {
    Component: lazy(async () => {
      const { GridPixelateWipe } =
        await import("@/registry/bases/editframe/components/grid-pixelate-wipe");
      return { default: GridPixelateWipe };
    }),
    config: gridPixelateWipeConfig,
  },
  "hero-device-assemble": {
    Component: lazy(async () => {
      const { HeroDeviceAssemble } =
        await import("@/registry/bases/editframe/components/hero-device-assemble");
      return { default: HeroDeviceAssemble };
    }),
    config: heroDeviceAssembleConfig,
  },
  "image-expand-to-fullscreen": {
    Component: lazy(async () => {
      const { ImageExpandToFullscreen } =
        await import("@/registry/bases/editframe/components/image-expand-to-fullscreen");
      return { default: ImageExpandToFullscreen };
    }),
    config: imageExpandToFullscreenConfig,
  },
  "infinite-bento-pan": {
    Component: lazy(async () => {
      const { InfiniteBentoPan } =
        await import("@/registry/bases/editframe/components/infinite-bento-pan");
      return { default: InfiniteBentoPan };
    }),
    config: infiniteBentoPanConfig,
  },
  "infinite-marquee": {
    Component: lazy(async () => {
      const { InfiniteMarquee } =
        await import("@/registry/bases/editframe/components/infinite-marquee");
      return { default: InfiniteMarquee };
    }),
    config: infiniteMarqueeConfig,
  },
  "inline-highlight": {
    Component: lazy(async () => {
      const { InlineHighlight } =
        await import("@/registry/bases/editframe/components/inline-highlight");
      return { default: InlineHighlight };
    }),
    config: inlineHighlightConfig,
  },
  "kinetic-type-mask": {
    Component: lazy(async () => {
      const { KineticTypeMask } =
        await import("@/registry/bases/editframe/components/kinetic-type-mask");
      return { default: KineticTypeMask };
    }),
    config: kineticTypeMaskConfig,
  },
  "landing-code-showcase": {
    Component: lazy(async () => {
      const { LandingCodeShowcase } =
        await import("@/registry/bases/editframe/components/landing-code-showcase");
      return { default: LandingCodeShowcase };
    }),
    config: landingCodeShowcaseConfig,
  },
  "line-by-line-slide": {
    Component: lazy(async () => {
      const { LineByLineSlide } =
        await import("@/registry/bases/editframe/components/line-by-line-slide");
      return { default: LineByLineSlide };
    }),
    config: lineByLineSlideConfig,
  },
  "live-code-compilation": {
    Component: lazy(async () => {
      const { LiveCodeCompilation } =
        await import("@/registry/bases/editframe/components/live-code-compilation");
      return { default: LiveCodeCompilation };
    }),
    config: liveCodeCompilationConfig,
  },
  "logo-enter": {
    Component: lazy(async () => {
      const { LogoEnter } =
        await import("@/registry/bases/editframe/components/logo-enter");
      return { default: LogoEnter };
    }),
    config: logoEnterConfig,
  },
  "marker-highlight": {
    Component: lazy(async () => {
      const { MarkerHighlight } =
        await import("@/registry/bases/editframe/components/marker-highlight");
      return { default: MarkerHighlight };
    }),
    config: markerHighlightConfig,
  },
  "mask-reveal-up": {
    Component: lazy(async () => {
      const { MaskRevealUp } =
        await import("@/registry/bases/editframe/components/mask-reveal-up");
      return { default: MaskRevealUp };
    }),
    config: maskRevealUpConfig,
  },
  "masked-slide-reveal": {
    Component: lazy(async () => {
      const { MaskedSlideReveal } =
        await import("@/registry/bases/editframe/components/masked-slide-reveal");
      return { default: MaskedSlideReveal };
    }),
    config: maskedSlideRevealConfig,
  },
  "matrix-decode": {
    Component: lazy(async () => {
      const { MatrixDecode } =
        await import("@/registry/bases/editframe/components/matrix-decode");
      return { default: MatrixDecode };
    }),
    config: matrixDecodeConfig,
  },
  "mesh-gradient-bg": {
    Component: lazy(async () => {
      const { MeshGradientBg } =
        await import("@/registry/bases/editframe/components/mesh-gradient-bg");
      return { default: MeshGradientBg };
    }),
    config: meshGradientBgConfig,
  },
  "micro-scale-fade": {
    Component: lazy(async () => {
      const { MicroScaleFade } =
        await import("@/registry/bases/editframe/components/micro-scale-fade");
      return { default: MicroScaleFade };
    }),
    config: microScaleFadeConfig,
  },
  "morphing-modal": {
    Component: lazy(async () => {
      const { MorphingModal } =
        await import("@/registry/bases/editframe/components/morphing-modal");
      return { default: MorphingModal };
    }),
    config: morphingModalConfig,
  },
  "per-character-rise": {
    Component: lazy(async () => {
      const { PerCharacterRise } =
        await import("@/registry/bases/editframe/components/per-character-rise");
      return { default: PerCharacterRise };
    }),
    config: perCharacterRiseConfig,
  },
  "per-word-crossfade": {
    Component: lazy(async () => {
      const { PerWordCrossfade } =
        await import("@/registry/bases/editframe/components/per-word-crossfade");
      return { default: PerWordCrossfade };
    }),
    config: perWordCrossfadeConfig,
  },
  "perspective-marquee": {
    Component: lazy(async () => {
      const { PerspectiveMarquee } =
        await import("@/registry/bases/editframe/components/perspective-marquee");
      return { default: PerspectiveMarquee };
    }),
    config: perspectiveMarqueeConfig,
  },
  "pipeline-journey": {
    Component: lazy(async () => {
      const { PipelineJourney } =
        await import("@/registry/bases/editframe/components/pipeline-journey");
      return { default: PipelineJourney };
    }),
    config: pipelineJourneyConfig,
  },
  "pricing-tier-focus": {
    Component: lazy(async () => {
      const { PricingTierFocus } =
        await import("@/registry/bases/editframe/components/pricing-tier-focus");
      return { default: PricingTierFocus };
    }),
    config: pricingTierFocusConfig,
  },
  "product-launch-trailer": {
    Component: lazy(async () => {
      const { ProductLaunchTrailer } =
        await import("@/registry/bases/editframe/components/product-launch-trailer");
      return { default: ProductLaunchTrailer };
    }),
    config: productLaunchTrailerConfig,
  },
  "progress-steps": {
    Component: lazy(async () => {
      const { ProgressSteps } =
        await import("@/registry/bases/editframe/components/progress-steps");
      return { default: ProgressSteps };
    }),
    config: progressStepsConfig,
  },
  "pulsing-indicator": {
    Component: lazy(async () => {
      const { PulsingIndicator } =
        await import("@/registry/bases/editframe/components/pulsing-indicator");
      return { default: PulsingIndicator };
    }),
    config: pulsingIndicatorConfig,
  },
  "rgb-glitch-text": {
    Component: lazy(async () => {
      const { RGBGlitchText } =
        await import("@/registry/bases/editframe/components/rgb-glitch-text");
      return { default: RGBGlitchText };
    }),
    config: rgbGlitchTextConfig,
  },
  "scale-down-fade": {
    Component: lazy(async () => {
      const { ScaleDownFade } =
        await import("@/registry/bases/editframe/components/scale-down-fade");
      return { default: ScaleDownFade };
    }),
    config: scaleDownFadeConfig,
  },
  "shared-axis-y": {
    Component: lazy(async () => {
      const { SharedAxisY } =
        await import("@/registry/bases/editframe/components/shared-axis-y");
      return { default: SharedAxisY };
    }),
    config: sharedAxisYConfig,
  },
  "shared-axis-z": {
    Component: lazy(async () => {
      const { SharedAxisZ } =
        await import("@/registry/bases/editframe/components/shared-axis-z");
      return { default: SharedAxisZ };
    }),
    config: sharedAxisZConfig,
  },
  "shimmer-sweep": {
    Component: lazy(async () => {
      const { ShimmerSweep } =
        await import("@/registry/bases/editframe/components/shimmer-sweep");
      return { default: ShimmerSweep };
    }),
    config: shimmerSweepConfig,
  },
  "short-slide-right": {
    Component: lazy(async () => {
      const { ShortSlideRight } =
        await import("@/registry/bases/editframe/components/short-slide-right");
      return { default: ShortSlideRight };
    }),
    config: shortSlideRightConfig,
  },
  "simulated-cursor": {
    Component: lazy(async () => {
      const { SimulatedCursor } =
        await import("@/registry/bases/editframe/components/simulated-cursor");
      return { default: SimulatedCursor };
    }),
    config: simulatedCursorConfig,
  },
  "slot-machine-roll": {
    Component: lazy(async () => {
      const { SlotMachineRoll } =
        await import("@/registry/bases/editframe/components/slot-machine-roll");
      return { default: SlotMachineRoll };
    }),
    config: slotMachineRollConfig,
  },
  "soft-blur-in": {
    Component: lazy(async () => {
      const { SoftBlurIn } =
        await import("@/registry/bases/editframe/components/soft-blur-in");
      return { default: SoftBlurIn };
    }),
    config: softBlurInConfig,
  },
  "spatial-push": {
    Component: lazy(async () => {
      const { SpatialPush } =
        await import("@/registry/bases/editframe/components/spatial-push");
      return { default: SpatialPush };
    }),
    config: spatialPushConfig,
  },
  "spotlight-card": {
    Component: lazy(async () => {
      const { SpotlightCard } =
        await import("@/registry/bases/editframe/components/spotlight-card");
      return { default: SpotlightCard };
    }),
    config: spotlightCardConfig,
  },
  "spring-pop-in": {
    Component: lazy(async () => {
      const { SpringPopIn } =
        await import("@/registry/bases/editframe/components/spring-pop-in");
      return { default: SpringPopIn };
    }),
    config: springPopInConfig,
  },
  "spring-scale-in": {
    Component: lazy(async () => {
      const { SpringScaleIn } =
        await import("@/registry/bases/editframe/components/spring-scale-in");
      return { default: SpringScaleIn };
    }),
    config: springScaleInConfig,
  },
  "staggered-bento-grid": {
    Component: lazy(async () => {
      const { StaggeredBentoGrid } =
        await import("@/registry/bases/editframe/components/staggered-bento-grid");
      return { default: StaggeredBentoGrid };
    }),
    config: staggeredBentoGridConfig,
  },
  "staggered-fade-up": {
    Component: lazy(async () => {
      const { StaggeredFadeUp } =
        await import("@/registry/bases/editframe/components/staggered-fade-up");
      return { default: StaggeredFadeUp };
    }),
    config: staggeredFadeUpConfig,
  },
  "strikethrough-replace": {
    Component: lazy(async () => {
      const { StrikethroughReplace } =
        await import("@/registry/bases/editframe/components/strikethrough-replace");
      return { default: StrikethroughReplace };
    }),
    config: strikethroughReplaceConfig,
  },

  "success-confetti": {
    Component: lazy(async () => {
      const { SuccessConfetti } =
        await import("@/registry/bases/editframe/components/success-confetti");
      return { default: SuccessConfetti };
    }),
    config: successConfettiConfig,
  },
  "swipe-transition-wipe": {
    Component: lazy(async () => {
      const { SwipeTransitionWipe } =
        await import("@/registry/bases/editframe/components/swipe-transition-wipe");
      return { default: SwipeTransitionWipe };
    }),
    config: swipeTransitionWipeConfig,
  },
  "terminal-simulator": {
    Component: lazy(async () => {
      const { TerminalSimulator } =
        await import("@/registry/bases/editframe/components/terminal-simulator");
      return { default: TerminalSimulator };
    }),
    config: terminalSimulatorConfig,
  },
  "terminal-to-browser-deploy": {
    Component: lazy(async () => {
      const { TerminalToBrowserDeploy } =
        await import("@/registry/bases/editframe/components/terminal-to-browser-deploy");
      return { default: TerminalToBrowserDeploy };
    }),
    config: terminalToBrowserDeployConfig,
  },
  "text-fade-replace": {
    Component: lazy(async () => {
      const { TextFadeReplace } =
        await import("@/registry/bases/editframe/components/text-fade-replace");
      return { default: TextFadeReplace };
    }),
    config: textFadeReplaceConfig,
  },
  "toast-notification": {
    Component: lazy(async () => {
      const { ToastNotification } =
        await import("@/registry/bases/editframe/components/toast-notification");
      return { default: ToastNotification };
    }),
    config: toastNotificationConfig,
  },
  "top-down-letters": {
    Component: lazy(async () => {
      const { TopDownLetters } =
        await import("@/registry/bases/editframe/components/top-down-letters");
      return { default: TopDownLetters };
    }),
    config: topDownLettersConfig,
  },

  "tracking-in": {
    Component: lazy(async () => {
      const { TrackingIn } =
        await import("@/registry/bases/editframe/components/tracking-in");
      return { default: TrackingIn };
    }),
    config: trackingInConfig,
  },

  typewriter: {
    Component: lazy(async () => {
      const { Typewriter } =
        await import("@/registry/bases/editframe/components/typewriter");
      return { default: Typewriter };
    }),
    config: typewriterConfig,
  },
  "zoom-through-transition": {
    Component: lazy(async () => {
      const { ZoomThroughTransition } =
        await import("@/registry/bases/editframe/components/zoom-through-transition");
      return { default: ZoomThroughTransition };
    }),
    config: zoomThroughTransitionConfig,
  },
,
  "accordion": {
    Component: Accordion,
  },
  "ai-prompt-flow": {
    Component: AiPromptFlow,
  },
  "alert-dialog": {
    Component: AlertDialog,
  },
  "blur-in": {
    Component: BlurIn,
  },
  "button": {
    Component: Button,
  },
  "caret": {
    Component: Caret,
  },
  "chat-flow": {
    Component: ChatFlow,
  },
  "checkbox": {
    Component: Checkbox,
  },
  "checkout-flow": {
    Component: CheckoutFlow,
  },
  "combobox": {
    Component: Combobox,
  },
  "command-menu": {
    Component: CommandMenu,
  },
  "command-menu-item": {
    Component: CommandMenuItem,
  },
  "context-menu": {
    Component: ContextMenu,
  },
  "cursor": {
    Component: Cursor,
  },
  "dialog": {
    Component: Dialog,
  },
  "drawer": {
    Component: Drawer,
  },
  "dropdown-menu": {
    Component: DropdownMenu,
  },
  "dropdown-menu-item": {
    Component: DropdownMenuItem,
  },
  "field": {
    Component: Field,
  },
  "imessage-chat-flow": {
    Component: ImessageChatFlow,
  },
  "input": {
    Component: Input,
  },
  "message-bubble": {
    Component: MessageBubble,
  },
  "onboarding-stepper-flow": {
    Component: OnboardingStepperFlow,
  },
  "popover": {
    Component: Popover,
  },
  "progress": {
    Component: Progress,
  },
  "radio": {
    Component: Radio,
  },
  "resizable": {
    Component: Resizable,
  },
  "select": {
    Component: Select,
  },
  "select-item": {
    Component: SelectItem,
  },
  "settings-toggle-flow": {
    Component: SettingsToggleFlow,
  },
  "sheet": {
    Component: Sheet,
  },
  "signup-flow": {
    Component: SignupFlow,
  },
  "skeleton": {
    Component: Skeleton,
  },
  "skeleton-block": {
    Component: SkeletonBlock,
  },
  "slider": {
    Component: Slider,
  },
  "spinner": {
    Component: Spinner,
  },
  "stepper": {
    Component: Stepper,
  },
  "switch": {
    Component: Switch,
  },
  "tabs": {
    Component: Tabs,
  },
  "telegram-chat-flow": {
    Component: TelegramChatFlow,
  },
  "toast": {
    Component: Toast,
  },
  "toggle-group": {
    Component: ToggleGroup,
  },
  "tooltip": {
    Component: Tooltip,
  },
  "typing-indicator": {
    Component: TypingIndicator,
  }
};

// Append the shared controls (e.g. `speed`) to every component config so
// every animation in the customizer exposes the same baseline knobs.
for (const entry of Object.values(registry)) {
  if (entry.config) {
    entry.config.controls = { ...entry.config.controls, ...SHARED_CONTROLS };
  }
}

export default registry;
