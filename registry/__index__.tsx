"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { aiGenerateOverlayConfig } from "@/registry/bases/editframe/ai-generate-overlay/config";
import { aiGenerationCanvasConfig } from "@/registry/bases/editframe/ai-generation-canvas/config";
import { animatedBarChartConfig } from "@/registry/bases/editframe/animated-bar-chart/config";
import { animatedLineChartConfig } from "@/registry/bases/editframe/animated-line-chart/config";
import { blurRevealConfig } from "@/registry/bases/editframe/blur-reveal/config";
import { boundingBoxSelectorConfig } from "@/registry/bases/editframe/bounding-box-selector/config";
import { browserFlowConfig } from "@/registry/bases/editframe/browser-flow/config";
import { brushStrokeSimulatorConfig } from "@/registry/bases/editframe/brush-stroke-simulator/config";
import { changelogBiteConfig } from "@/registry/bases/editframe/changelog-bite/config";
import { chatToPreviewLayoutConfig } from "@/registry/bases/editframe/chat-to-preview-layout/config";
import { chromaticAberrationWipeConfig } from "@/registry/bases/editframe/chromatic-aberration-wipe/config";
import { codeAccordionConfig } from "@/registry/bases/editframe/code-accordion/config";
import { codeDiffWipeConfig } from "@/registry/bases/editframe/code-diff-wipe/config";
import { cursorFlowConfig } from "@/registry/bases/editframe/cursor-flow/config";
import { dashboardPopulateConfig } from "@/registry/bases/editframe/dashboard-populate/config";
import { dataFlowPipesConfig } from "@/registry/bases/editframe/data-flow-pipes/config";
import { deviceMockupZoomConfig } from "@/registry/bases/editframe/device-mockup-zoom/config";
import { directionalWipeConfig } from "@/registry/bases/editframe/directional-wipe/config";
import { dragAndDropFlowConfig } from "@/registry/bases/editframe/drag-and-drop-flow/config";
import { dynamicGridConfig } from "@/registry/bases/editframe/dynamic-grid/config";
import { ecosystemConstellationConfig } from "@/registry/bases/editframe/ecosystem-constellation/config";
import { frostedGlassWipeConfig } from "@/registry/bases/editframe/frosted-glass-wipe/config";
import { glassCodeBlockConfig } from "@/registry/bases/editframe/glass-code-block/config";
import { gridPixelateWipeConfig } from "@/registry/bases/editframe/grid-pixelate-wipe/config";
import { heroDeviceAssembleConfig } from "@/registry/bases/editframe/hero-device-assemble/config";
import { imageExpandToFullscreenConfig } from "@/registry/bases/editframe/image-expand-to-fullscreen/config";
import { infiniteBentoPanConfig } from "@/registry/bases/editframe/infinite-bento-pan/config";
import { infiniteMarqueeConfig } from "@/registry/bases/editframe/infinite-marquee/config";
import { inlineHighlightConfig } from "@/registry/bases/editframe/inline-highlight/config";
import { kineticTypeMaskConfig } from "@/registry/bases/editframe/kinetic-type-mask/config";
import { landingCodeShowcaseConfig } from "@/registry/bases/editframe/landing-code-showcase/config";
import { liveCodeCompilationConfig } from "@/registry/bases/editframe/live-code-compilation/config";
import { markerHighlightConfig } from "@/registry/bases/editframe/marker-highlight/config";
import { maskedSlideRevealConfig } from "@/registry/bases/editframe/masked-slide-reveal/config";
import { matrixDecodeConfig } from "@/registry/bases/editframe/matrix-decode/config";
import { meshGradientBgConfig } from "@/registry/bases/editframe/mesh-gradient-bg/config";
import { morphingModalConfig } from "@/registry/bases/editframe/morphing-modal/config";
import { perspectiveMarqueeConfig } from "@/registry/bases/editframe/perspective-marquee/config";
import { pipelineJourneyConfig } from "@/registry/bases/editframe/pipeline-journey/config";
import { pricingTierFocusConfig } from "@/registry/bases/editframe/pricing-tier-focus/config";
import { productLaunchTrailerConfig } from "@/registry/bases/editframe/product-launch-trailer/config";
import { progressStepsConfig } from "@/registry/bases/editframe/progress-steps/config";
import { pulsingIndicatorConfig } from "@/registry/bases/editframe/pulsing-indicator/config";
import { rgbGlitchTextConfig } from "@/registry/bases/editframe/rgb-glitch-text/config";
import { shimmerSweepConfig } from "@/registry/bases/editframe/shimmer-sweep/config";
import { simulatedCursorConfig } from "@/registry/bases/editframe/simulated-cursor/config";
import { slotMachineRollConfig } from "@/registry/bases/editframe/slot-machine-roll/config";
import { spatialPushConfig } from "@/registry/bases/editframe/spatial-push/config";
import { spotlightCardConfig } from "@/registry/bases/editframe/spotlight-card/config";
import { springPopInConfig } from "@/registry/bases/editframe/spring-pop-in/config";
import { staggeredBentoGridConfig } from "@/registry/bases/editframe/staggered-bento-grid/config";
import { staggeredFadeUpConfig } from "@/registry/bases/editframe/staggered-fade-up/config";
import { strikethroughReplaceConfig } from "@/registry/bases/editframe/strikethrough-replace/config";
import { successConfettiConfig } from "@/registry/bases/editframe/success-confetti/config";
import { swipeTransitionWipeConfig } from "@/registry/bases/editframe/swipe-transition-wipe/config";
import { terminalSimulatorConfig } from "@/registry/bases/editframe/terminal-simulator/config";
import { terminalToBrowserDeployConfig } from "@/registry/bases/editframe/terminal-to-browser-deploy/config";
import { textFadeReplaceConfig } from "@/registry/bases/editframe/text-fade-replace/config";
import { toastNotificationConfig } from "@/registry/bases/editframe/toast-notification/config";
import { toolMenuSlideInConfig } from "@/registry/bases/editframe/tool-menu-slide-in/config";
import { trackingInConfig } from "@/registry/bases/editframe/tracking-in/config";
import { typewriterConfig } from "@/registry/bases/editframe/typewriter/config";
import { visualDocsSnippetConfig } from "@/registry/bases/editframe/visual-docs-snippet/config";
import { zoomThroughTransitionConfig } from "@/registry/bases/editframe/zoom-through-transition/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

export interface RegistryEntry {
  Component: AnyComponent;
  config: ComponentConfig;
}

const lazy = (loader: () => Promise<{ default: AnyComponent }>) =>
  dynamic(loader, { ssr: false });

const registry: Record<string, RegistryEntry> = {
  "ai-generate-overlay": {
    Component: lazy(async () => {
      const { AIGenerateOverlay } =
        await import("@/registry/bases/editframe/ai-generate-overlay");
      return { default: AIGenerateOverlay };
    }),
    config: aiGenerateOverlayConfig,
  },
  "ai-generation-canvas": {
    Component: lazy(async () => {
      const { AIGenerationCanvas } =
        await import("@/registry/bases/editframe/ai-generation-canvas");
      return { default: AIGenerationCanvas };
    }),
    config: aiGenerationCanvasConfig,
  },
  "animated-bar-chart": {
    Component: lazy(async () => {
      const { AnimatedBarChart } =
        await import("@/registry/bases/editframe/animated-bar-chart");
      return { default: AnimatedBarChart };
    }),
    config: animatedBarChartConfig,
  },
  "animated-line-chart": {
    Component: lazy(async () => {
      const { AnimatedLineChart } =
        await import("@/registry/bases/editframe/animated-line-chart");
      return { default: AnimatedLineChart };
    }),
    config: animatedLineChartConfig,
  },
  "blur-reveal": {
    Component: lazy(async () => {
      const { BlurReveal } =
        await import("@/registry/bases/editframe/blur-reveal");
      return { default: BlurReveal };
    }),
    config: blurRevealConfig,
  },
  "bounding-box-selector": {
    Component: lazy(async () => {
      const { BoundingBoxSelector } =
        await import("@/registry/bases/editframe/bounding-box-selector");
      return { default: BoundingBoxSelector };
    }),
    config: boundingBoxSelectorConfig,
  },
  "browser-flow": {
    Component: lazy(async () => {
      const { BrowserFlow } =
        await import("@/registry/bases/editframe/browser-flow");
      return { default: BrowserFlow };
    }),
    config: browserFlowConfig,
  },
  "brush-stroke-simulator": {
    Component: lazy(async () => {
      const { BrushStrokeSimulator } =
        await import("@/registry/bases/editframe/brush-stroke-simulator");
      return { default: BrushStrokeSimulator };
    }),
    config: brushStrokeSimulatorConfig,
  },
  "changelog-bite": {
    Component: lazy(async () => {
      const { ChangelogBite } =
        await import("@/registry/bases/editframe/changelog-bite");
      return { default: ChangelogBite };
    }),
    config: changelogBiteConfig,
  },
  "chat-to-preview-layout": {
    Component: lazy(async () => {
      const { ChatToPreviewLayout } =
        await import("@/registry/bases/editframe/chat-to-preview-layout");
      return { default: ChatToPreviewLayout };
    }),
    config: chatToPreviewLayoutConfig,
  },
  "chromatic-aberration-wipe": {
    Component: lazy(async () => {
      const { ChromaticAberrationWipe } =
        await import("@/registry/bases/editframe/chromatic-aberration-wipe");
      return { default: ChromaticAberrationWipe };
    }),
    config: chromaticAberrationWipeConfig,
  },
  "code-accordion": {
    Component: lazy(async () => {
      const { CodeAccordion } =
        await import("@/registry/bases/editframe/code-accordion");
      return { default: CodeAccordion };
    }),
    config: codeAccordionConfig,
  },
  "code-diff-wipe": {
    Component: lazy(async () => {
      const { CodeDiffWipe } =
        await import("@/registry/bases/editframe/code-diff-wipe");
      return { default: CodeDiffWipe };
    }),
    config: codeDiffWipeConfig,
  },
  "cursor-flow": {
    Component: lazy(async () => {
      const { CursorFlow } =
        await import("@/registry/bases/editframe/cursor-flow");
      return { default: CursorFlow };
    }),
    config: cursorFlowConfig,
  },
  "dashboard-populate": {
    Component: lazy(async () => {
      const { DashboardPopulate } =
        await import("@/registry/bases/editframe/dashboard-populate");
      return { default: DashboardPopulate };
    }),
    config: dashboardPopulateConfig,
  },
  "data-flow-pipes": {
    Component: lazy(async () => {
      const { DataFlowPipes } =
        await import("@/registry/bases/editframe/data-flow-pipes");
      return { default: DataFlowPipes };
    }),
    config: dataFlowPipesConfig,
  },
  "device-mockup-zoom": {
    Component: lazy(async () => {
      const { DeviceMockupZoom } =
        await import("@/registry/bases/editframe/device-mockup-zoom");
      return { default: DeviceMockupZoom };
    }),
    config: deviceMockupZoomConfig,
  },
  "directional-wipe": {
    Component: lazy(async () => {
      const { DirectionalWipe } =
        await import("@/registry/bases/editframe/directional-wipe");
      return { default: DirectionalWipe };
    }),
    config: directionalWipeConfig,
  },
  "drag-and-drop-flow": {
    Component: lazy(async () => {
      const { DragAndDropFlow } =
        await import("@/registry/bases/editframe/drag-and-drop-flow");
      return { default: DragAndDropFlow };
    }),
    config: dragAndDropFlowConfig,
  },
  "dynamic-grid": {
    Component: lazy(async () => {
      const { DynamicGrid } =
        await import("@/registry/bases/editframe/dynamic-grid");
      return { default: DynamicGrid };
    }),
    config: dynamicGridConfig,
  },
  "ecosystem-constellation": {
    Component: lazy(async () => {
      const { EcosystemConstellation } =
        await import("@/registry/bases/editframe/ecosystem-constellation");
      return { default: EcosystemConstellation };
    }),
    config: ecosystemConstellationConfig,
  },
  "frosted-glass-wipe": {
    Component: lazy(async () => {
      const { FrostedGlassWipe } =
        await import("@/registry/bases/editframe/frosted-glass-wipe");
      return { default: FrostedGlassWipe };
    }),
    config: frostedGlassWipeConfig,
  },
  "glass-code-block": {
    Component: lazy(async () => {
      const { GlassCodeBlock } =
        await import("@/registry/bases/editframe/glass-code-block");
      return { default: GlassCodeBlock };
    }),
    config: glassCodeBlockConfig,
  },
  "grid-pixelate-wipe": {
    Component: lazy(async () => {
      const { GridPixelateWipe } =
        await import("@/registry/bases/editframe/grid-pixelate-wipe");
      return { default: GridPixelateWipe };
    }),
    config: gridPixelateWipeConfig,
  },
  "hero-device-assemble": {
    Component: lazy(async () => {
      const { HeroDeviceAssemble } =
        await import("@/registry/bases/editframe/hero-device-assemble");
      return { default: HeroDeviceAssemble };
    }),
    config: heroDeviceAssembleConfig,
  },
  "image-expand-to-fullscreen": {
    Component: lazy(async () => {
      const { ImageExpandToFullscreen } =
        await import("@/registry/bases/editframe/image-expand-to-fullscreen");
      return { default: ImageExpandToFullscreen };
    }),
    config: imageExpandToFullscreenConfig,
  },
  "infinite-bento-pan": {
    Component: lazy(async () => {
      const { InfiniteBentoPan } =
        await import("@/registry/bases/editframe/infinite-bento-pan");
      return { default: InfiniteBentoPan };
    }),
    config: infiniteBentoPanConfig,
  },
  "infinite-marquee": {
    Component: lazy(async () => {
      const { InfiniteMarquee } =
        await import("@/registry/bases/editframe/infinite-marquee");
      return { default: InfiniteMarquee };
    }),
    config: infiniteMarqueeConfig,
  },
  "inline-highlight": {
    Component: lazy(async () => {
      const { InlineHighlight } =
        await import("@/registry/bases/editframe/inline-highlight");
      return { default: InlineHighlight };
    }),
    config: inlineHighlightConfig,
  },
  "kinetic-type-mask": {
    Component: lazy(async () => {
      const { KineticTypeMask } =
        await import("@/registry/bases/editframe/kinetic-type-mask");
      return { default: KineticTypeMask };
    }),
    config: kineticTypeMaskConfig,
  },
  "landing-code-showcase": {
    Component: lazy(async () => {
      const { LandingCodeShowcase } =
        await import("@/registry/bases/editframe/landing-code-showcase");
      return { default: LandingCodeShowcase };
    }),
    config: landingCodeShowcaseConfig,
  },
  "live-code-compilation": {
    Component: lazy(async () => {
      const { LiveCodeCompilation } =
        await import("@/registry/bases/editframe/live-code-compilation");
      return { default: LiveCodeCompilation };
    }),
    config: liveCodeCompilationConfig,
  },
  "marker-highlight": {
    Component: lazy(async () => {
      const { MarkerHighlight } =
        await import("@/registry/bases/editframe/marker-highlight");
      return { default: MarkerHighlight };
    }),
    config: markerHighlightConfig,
  },
  "masked-slide-reveal": {
    Component: lazy(async () => {
      const { MaskedSlideReveal } =
        await import("@/registry/bases/editframe/masked-slide-reveal");
      return { default: MaskedSlideReveal };
    }),
    config: maskedSlideRevealConfig,
  },
  "matrix-decode": {
    Component: lazy(async () => {
      const { MatrixDecode } =
        await import("@/registry/bases/editframe/matrix-decode");
      return { default: MatrixDecode };
    }),
    config: matrixDecodeConfig,
  },
  "mesh-gradient-bg": {
    Component: lazy(async () => {
      const { MeshGradientBg } =
        await import("@/registry/bases/editframe/mesh-gradient-bg");
      return { default: MeshGradientBg };
    }),
    config: meshGradientBgConfig,
  },
  "morphing-modal": {
    Component: lazy(async () => {
      const { MorphingModal } =
        await import("@/registry/bases/editframe/morphing-modal");
      return { default: MorphingModal };
    }),
    config: morphingModalConfig,
  },
  "perspective-marquee": {
    Component: lazy(async () => {
      const { PerspectiveMarquee } =
        await import("@/registry/bases/editframe/perspective-marquee");
      return { default: PerspectiveMarquee };
    }),
    config: perspectiveMarqueeConfig,
  },
  "pipeline-journey": {
    Component: lazy(async () => {
      const { PipelineJourney } =
        await import("@/registry/bases/editframe/pipeline-journey");
      return { default: PipelineJourney };
    }),
    config: pipelineJourneyConfig,
  },
  "pricing-tier-focus": {
    Component: lazy(async () => {
      const { PricingTierFocus } =
        await import("@/registry/bases/editframe/pricing-tier-focus");
      return { default: PricingTierFocus };
    }),
    config: pricingTierFocusConfig,
  },
  "product-launch-trailer": {
    Component: lazy(async () => {
      const { ProductLaunchTrailer } =
        await import("@/registry/bases/editframe/product-launch-trailer");
      return { default: ProductLaunchTrailer };
    }),
    config: productLaunchTrailerConfig,
  },
  "progress-steps": {
    Component: lazy(async () => {
      const { ProgressSteps } =
        await import("@/registry/bases/editframe/progress-steps");
      return { default: ProgressSteps };
    }),
    config: progressStepsConfig,
  },
  "pulsing-indicator": {
    Component: lazy(async () => {
      const { PulsingIndicator } =
        await import("@/registry/bases/editframe/pulsing-indicator");
      return { default: PulsingIndicator };
    }),
    config: pulsingIndicatorConfig,
  },
  "rgb-glitch-text": {
    Component: lazy(async () => {
      const { RGBGlitchText } =
        await import("@/registry/bases/editframe/rgb-glitch-text");
      return { default: RGBGlitchText };
    }),
    config: rgbGlitchTextConfig,
  },
  "shimmer-sweep": {
    Component: lazy(async () => {
      const { ShimmerSweep } =
        await import("@/registry/bases/editframe/shimmer-sweep");
      return { default: ShimmerSweep };
    }),
    config: shimmerSweepConfig,
  },
  "simulated-cursor": {
    Component: lazy(async () => {
      const { SimulatedCursor } =
        await import("@/registry/bases/editframe/simulated-cursor");
      return { default: SimulatedCursor };
    }),
    config: simulatedCursorConfig,
  },
  "slot-machine-roll": {
    Component: lazy(async () => {
      const { SlotMachineRoll } =
        await import("@/registry/bases/editframe/slot-machine-roll");
      return { default: SlotMachineRoll };
    }),
    config: slotMachineRollConfig,
  },
  "spatial-push": {
    Component: lazy(async () => {
      const { SpatialPush } =
        await import("@/registry/bases/editframe/spatial-push");
      return { default: SpatialPush };
    }),
    config: spatialPushConfig,
  },
  "spotlight-card": {
    Component: lazy(async () => {
      const { SpotlightCard } =
        await import("@/registry/bases/editframe/spotlight-card");
      return { default: SpotlightCard };
    }),
    config: spotlightCardConfig,
  },
  "spring-pop-in": {
    Component: lazy(async () => {
      const { SpringPopIn } =
        await import("@/registry/bases/editframe/spring-pop-in");
      return { default: SpringPopIn };
    }),
    config: springPopInConfig,
  },
  "staggered-bento-grid": {
    Component: lazy(async () => {
      const { StaggeredBentoGrid } =
        await import("@/registry/bases/editframe/staggered-bento-grid");
      return { default: StaggeredBentoGrid };
    }),
    config: staggeredBentoGridConfig,
  },
  "staggered-fade-up": {
    Component: lazy(async () => {
      const { StaggeredFadeUp } =
        await import("@/registry/bases/editframe/staggered-fade-up");
      return { default: StaggeredFadeUp };
    }),
    config: staggeredFadeUpConfig,
  },
  "strikethrough-replace": {
    Component: lazy(async () => {
      const { StrikethroughReplace } =
        await import("@/registry/bases/editframe/strikethrough-replace");
      return { default: StrikethroughReplace };
    }),
    config: strikethroughReplaceConfig,
  },
  "success-confetti": {
    Component: lazy(async () => {
      const { SuccessConfetti } =
        await import("@/registry/bases/editframe/success-confetti");
      return { default: SuccessConfetti };
    }),
    config: successConfettiConfig,
  },
  "swipe-transition-wipe": {
    Component: lazy(async () => {
      const { SwipeTransitionWipe } =
        await import("@/registry/bases/editframe/swipe-transition-wipe");
      return { default: SwipeTransitionWipe };
    }),
    config: swipeTransitionWipeConfig,
  },
  "terminal-simulator": {
    Component: lazy(async () => {
      const { TerminalSimulator } =
        await import("@/registry/bases/editframe/terminal-simulator");
      return { default: TerminalSimulator };
    }),
    config: terminalSimulatorConfig,
  },
  "terminal-to-browser-deploy": {
    Component: lazy(async () => {
      const { TerminalToBrowserDeploy } =
        await import("@/registry/bases/editframe/terminal-to-browser-deploy");
      return { default: TerminalToBrowserDeploy };
    }),
    config: terminalToBrowserDeployConfig,
  },
  "text-fade-replace": {
    Component: lazy(async () => {
      const { TextFadeReplace } =
        await import("@/registry/bases/editframe/text-fade-replace");
      return { default: TextFadeReplace };
    }),
    config: textFadeReplaceConfig,
  },
  "toast-notification": {
    Component: lazy(async () => {
      const { ToastNotification } =
        await import("@/registry/bases/editframe/toast-notification");
      return { default: ToastNotification };
    }),
    config: toastNotificationConfig,
  },
  "tool-menu-slide-in": {
    Component: lazy(async () => {
      const { ToolMenuSlideIn } =
        await import("@/registry/bases/editframe/tool-menu-slide-in");
      return { default: ToolMenuSlideIn };
    }),
    config: toolMenuSlideInConfig,
  },
  "tracking-in": {
    Component: lazy(async () => {
      const { TrackingIn } =
        await import("@/registry/bases/editframe/tracking-in");
      return { default: TrackingIn };
    }),
    config: trackingInConfig,
  },
  typewriter: {
    Component: lazy(async () => {
      const { Typewriter } =
        await import("@/registry/bases/editframe/typewriter");
      return { default: Typewriter };
    }),
    config: typewriterConfig,
  },
  "visual-docs-snippet": {
    Component: lazy(async () => {
      const { VisualDocsSnippet } =
        await import("@/registry/bases/editframe/visual-docs-snippet");
      return { default: VisualDocsSnippet };
    }),
    config: visualDocsSnippetConfig,
  },
  "zoom-through-transition": {
    Component: lazy(async () => {
      const { ZoomThroughTransition } =
        await import("@/registry/bases/editframe/zoom-through-transition");
      return { default: ZoomThroughTransition };
    }),
    config: zoomThroughTransitionConfig,
  },
};

// Append the shared controls (e.g. `speed`) to every component config so
// every animation in the customizer exposes the same baseline knobs.
for (const { config } of Object.values(registry)) {
  config.controls = { ...config.controls, ...SHARED_CONTROLS };
}

export default registry;
