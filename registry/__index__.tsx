"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { aiGenerateOverlayConfig } from "@/registry/framecn/ai-generate-overlay/config";
import { aiGenerationCanvasConfig } from "@/registry/framecn/ai-generation-canvas/config";
import { animatedBarChartConfig } from "@/registry/framecn/animated-bar-chart/config";
import { animatedLineChartConfig } from "@/registry/framecn/animated-line-chart/config";
import { blurRevealConfig } from "@/registry/framecn/blur-reveal/config";
import { boundingBoxSelectorConfig } from "@/registry/framecn/bounding-box-selector/config";
import { browserFlowConfig } from "@/registry/framecn/browser-flow/config";
import { brushStrokeSimulatorConfig } from "@/registry/framecn/brush-stroke-simulator/config";
import { changelogBiteConfig } from "@/registry/framecn/changelog-bite/config";
import { chatToPreviewLayoutConfig } from "@/registry/framecn/chat-to-preview-layout/config";
import { chromaticAberrationWipeConfig } from "@/registry/framecn/chromatic-aberration-wipe/config";
import { codeAccordionConfig } from "@/registry/framecn/code-accordion/config";
import { codeDiffWipeConfig } from "@/registry/framecn/code-diff-wipe/config";
import { cursorFlowConfig } from "@/registry/framecn/cursor-flow/config";
import { dashboardPopulateConfig } from "@/registry/framecn/dashboard-populate/config";
import { dataFlowPipesConfig } from "@/registry/framecn/data-flow-pipes/config";
import { deviceMockupZoomConfig } from "@/registry/framecn/device-mockup-zoom/config";
import { directionalWipeConfig } from "@/registry/framecn/directional-wipe/config";
import { dragAndDropFlowConfig } from "@/registry/framecn/drag-and-drop-flow/config";
import { dynamicGridConfig } from "@/registry/framecn/dynamic-grid/config";
import { ecosystemConstellationConfig } from "@/registry/framecn/ecosystem-constellation/config";
import { frostedGlassWipeConfig } from "@/registry/framecn/frosted-glass-wipe/config";
import { glassCodeBlockConfig } from "@/registry/framecn/glass-code-block/config";
import { gridPixelateWipeConfig } from "@/registry/framecn/grid-pixelate-wipe/config";
import { heroDeviceAssembleConfig } from "@/registry/framecn/hero-device-assemble/config";
import { imageExpandToFullscreenConfig } from "@/registry/framecn/image-expand-to-fullscreen/config";
import { infiniteBentoPanConfig } from "@/registry/framecn/infinite-bento-pan/config";
import { infiniteMarqueeConfig } from "@/registry/framecn/infinite-marquee/config";
import { inlineHighlightConfig } from "@/registry/framecn/inline-highlight/config";
import { kineticTypeMaskConfig } from "@/registry/framecn/kinetic-type-mask/config";
import { landingCodeShowcaseConfig } from "@/registry/framecn/landing-code-showcase/config";
import { liveCodeCompilationConfig } from "@/registry/framecn/live-code-compilation/config";
import { markerHighlightConfig } from "@/registry/framecn/marker-highlight/config";
import { maskedSlideRevealConfig } from "@/registry/framecn/masked-slide-reveal/config";
import { matrixDecodeConfig } from "@/registry/framecn/matrix-decode/config";
import { meshGradientBgConfig } from "@/registry/framecn/mesh-gradient-bg/config";
import { morphingModalConfig } from "@/registry/framecn/morphing-modal/config";
import { perspectiveMarqueeConfig } from "@/registry/framecn/perspective-marquee/config";
import { pipelineJourneyConfig } from "@/registry/framecn/pipeline-journey/config";
import { pricingTierFocusConfig } from "@/registry/framecn/pricing-tier-focus/config";
import { productLaunchTrailerConfig } from "@/registry/framecn/product-launch-trailer/config";
import { progressStepsConfig } from "@/registry/framecn/progress-steps/config";
import { pulsingIndicatorConfig } from "@/registry/framecn/pulsing-indicator/config";
import { rgbGlitchTextConfig } from "@/registry/framecn/rgb-glitch-text/config";
import { shimmerSweepConfig } from "@/registry/framecn/shimmer-sweep/config";
import { simulatedCursorConfig } from "@/registry/framecn/simulated-cursor/config";
import { slotMachineRollConfig } from "@/registry/framecn/slot-machine-roll/config";
import { spatialPushConfig } from "@/registry/framecn/spatial-push/config";
import { spotlightCardConfig } from "@/registry/framecn/spotlight-card/config";
import { springPopInConfig } from "@/registry/framecn/spring-pop-in/config";
import { staggeredBentoGridConfig } from "@/registry/framecn/staggered-bento-grid/config";
import { staggeredFadeUpConfig } from "@/registry/framecn/staggered-fade-up/config";
import { strikethroughReplaceConfig } from "@/registry/framecn/strikethrough-replace/config";
import { successConfettiConfig } from "@/registry/framecn/success-confetti/config";
import { swipeTransitionWipeConfig } from "@/registry/framecn/swipe-transition-wipe/config";
import { terminalSimulatorConfig } from "@/registry/framecn/terminal-simulator/config";
import { terminalToBrowserDeployConfig } from "@/registry/framecn/terminal-to-browser-deploy/config";
import { textFadeReplaceConfig } from "@/registry/framecn/text-fade-replace/config";
import { toastNotificationConfig } from "@/registry/framecn/toast-notification/config";
import { toolMenuSlideInConfig } from "@/registry/framecn/tool-menu-slide-in/config";
import { trackingInConfig } from "@/registry/framecn/tracking-in/config";
import { typewriterConfig } from "@/registry/framecn/typewriter/config";
import { visualDocsSnippetConfig } from "@/registry/framecn/visual-docs-snippet/config";
import { zoomThroughTransitionConfig } from "@/registry/framecn/zoom-through-transition/config";

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
        await import("@/registry/framecn/ai-generate-overlay");
      return { default: AIGenerateOverlay };
    }),
    config: aiGenerateOverlayConfig,
  },
  "ai-generation-canvas": {
    Component: lazy(async () => {
      const { AIGenerationCanvas } =
        await import("@/registry/framecn/ai-generation-canvas");
      return { default: AIGenerationCanvas };
    }),
    config: aiGenerationCanvasConfig,
  },
  "animated-bar-chart": {
    Component: lazy(async () => {
      const { AnimatedBarChart } =
        await import("@/registry/framecn/animated-bar-chart");
      return { default: AnimatedBarChart };
    }),
    config: animatedBarChartConfig,
  },
  "animated-line-chart": {
    Component: lazy(async () => {
      const { AnimatedLineChart } =
        await import("@/registry/framecn/animated-line-chart");
      return { default: AnimatedLineChart };
    }),
    config: animatedLineChartConfig,
  },
  "blur-reveal": {
    Component: lazy(async () => {
      const { BlurReveal } = await import("@/registry/framecn/blur-reveal");
      return { default: BlurReveal };
    }),
    config: blurRevealConfig,
  },
  "bounding-box-selector": {
    Component: lazy(async () => {
      const { BoundingBoxSelector } =
        await import("@/registry/framecn/bounding-box-selector");
      return { default: BoundingBoxSelector };
    }),
    config: boundingBoxSelectorConfig,
  },
  "browser-flow": {
    Component: lazy(async () => {
      const { BrowserFlow } = await import("@/registry/framecn/browser-flow");
      return { default: BrowserFlow };
    }),
    config: browserFlowConfig,
  },
  "brush-stroke-simulator": {
    Component: lazy(async () => {
      const { BrushStrokeSimulator } =
        await import("@/registry/framecn/brush-stroke-simulator");
      return { default: BrushStrokeSimulator };
    }),
    config: brushStrokeSimulatorConfig,
  },
  "changelog-bite": {
    Component: lazy(async () => {
      const { ChangelogBite } =
        await import("@/registry/framecn/changelog-bite");
      return { default: ChangelogBite };
    }),
    config: changelogBiteConfig,
  },
  "chat-to-preview-layout": {
    Component: lazy(async () => {
      const { ChatToPreviewLayout } =
        await import("@/registry/framecn/chat-to-preview-layout");
      return { default: ChatToPreviewLayout };
    }),
    config: chatToPreviewLayoutConfig,
  },
  "chromatic-aberration-wipe": {
    Component: lazy(async () => {
      const { ChromaticAberrationWipe } =
        await import("@/registry/framecn/chromatic-aberration-wipe");
      return { default: ChromaticAberrationWipe };
    }),
    config: chromaticAberrationWipeConfig,
  },
  "code-accordion": {
    Component: lazy(async () => {
      const { CodeAccordion } =
        await import("@/registry/framecn/code-accordion");
      return { default: CodeAccordion };
    }),
    config: codeAccordionConfig,
  },
  "code-diff-wipe": {
    Component: lazy(async () => {
      const { CodeDiffWipe } =
        await import("@/registry/framecn/code-diff-wipe");
      return { default: CodeDiffWipe };
    }),
    config: codeDiffWipeConfig,
  },
  "cursor-flow": {
    Component: lazy(async () => {
      const { CursorFlow } = await import("@/registry/framecn/cursor-flow");
      return { default: CursorFlow };
    }),
    config: cursorFlowConfig,
  },
  "dashboard-populate": {
    Component: lazy(async () => {
      const { DashboardPopulate } =
        await import("@/registry/framecn/dashboard-populate");
      return { default: DashboardPopulate };
    }),
    config: dashboardPopulateConfig,
  },
  "data-flow-pipes": {
    Component: lazy(async () => {
      const { DataFlowPipes } =
        await import("@/registry/framecn/data-flow-pipes");
      return { default: DataFlowPipes };
    }),
    config: dataFlowPipesConfig,
  },
  "device-mockup-zoom": {
    Component: lazy(async () => {
      const { DeviceMockupZoom } =
        await import("@/registry/framecn/device-mockup-zoom");
      return { default: DeviceMockupZoom };
    }),
    config: deviceMockupZoomConfig,
  },
  "directional-wipe": {
    Component: lazy(async () => {
      const { DirectionalWipe } =
        await import("@/registry/framecn/directional-wipe");
      return { default: DirectionalWipe };
    }),
    config: directionalWipeConfig,
  },
  "drag-and-drop-flow": {
    Component: lazy(async () => {
      const { DragAndDropFlow } =
        await import("@/registry/framecn/drag-and-drop-flow");
      return { default: DragAndDropFlow };
    }),
    config: dragAndDropFlowConfig,
  },
  "dynamic-grid": {
    Component: lazy(async () => {
      const { DynamicGrid } = await import("@/registry/framecn/dynamic-grid");
      return { default: DynamicGrid };
    }),
    config: dynamicGridConfig,
  },
  "ecosystem-constellation": {
    Component: lazy(async () => {
      const { EcosystemConstellation } =
        await import("@/registry/framecn/ecosystem-constellation");
      return { default: EcosystemConstellation };
    }),
    config: ecosystemConstellationConfig,
  },
  "frosted-glass-wipe": {
    Component: lazy(async () => {
      const { FrostedGlassWipe } =
        await import("@/registry/framecn/frosted-glass-wipe");
      return { default: FrostedGlassWipe };
    }),
    config: frostedGlassWipeConfig,
  },
  "glass-code-block": {
    Component: lazy(async () => {
      const { GlassCodeBlock } =
        await import("@/registry/framecn/glass-code-block");
      return { default: GlassCodeBlock };
    }),
    config: glassCodeBlockConfig,
  },
  "grid-pixelate-wipe": {
    Component: lazy(async () => {
      const { GridPixelateWipe } =
        await import("@/registry/framecn/grid-pixelate-wipe");
      return { default: GridPixelateWipe };
    }),
    config: gridPixelateWipeConfig,
  },
  "hero-device-assemble": {
    Component: lazy(async () => {
      const { HeroDeviceAssemble } =
        await import("@/registry/framecn/hero-device-assemble");
      return { default: HeroDeviceAssemble };
    }),
    config: heroDeviceAssembleConfig,
  },
  "image-expand-to-fullscreen": {
    Component: lazy(async () => {
      const { ImageExpandToFullscreen } =
        await import("@/registry/framecn/image-expand-to-fullscreen");
      return { default: ImageExpandToFullscreen };
    }),
    config: imageExpandToFullscreenConfig,
  },
  "infinite-bento-pan": {
    Component: lazy(async () => {
      const { InfiniteBentoPan } =
        await import("@/registry/framecn/infinite-bento-pan");
      return { default: InfiniteBentoPan };
    }),
    config: infiniteBentoPanConfig,
  },
  "infinite-marquee": {
    Component: lazy(async () => {
      const { InfiniteMarquee } =
        await import("@/registry/framecn/infinite-marquee");
      return { default: InfiniteMarquee };
    }),
    config: infiniteMarqueeConfig,
  },
  "inline-highlight": {
    Component: lazy(async () => {
      const { InlineHighlight } =
        await import("@/registry/framecn/inline-highlight");
      return { default: InlineHighlight };
    }),
    config: inlineHighlightConfig,
  },
  "kinetic-type-mask": {
    Component: lazy(async () => {
      const { KineticTypeMask } =
        await import("@/registry/framecn/kinetic-type-mask");
      return { default: KineticTypeMask };
    }),
    config: kineticTypeMaskConfig,
  },
  "landing-code-showcase": {
    Component: lazy(async () => {
      const { LandingCodeShowcase } =
        await import("@/registry/framecn/landing-code-showcase");
      return { default: LandingCodeShowcase };
    }),
    config: landingCodeShowcaseConfig,
  },
  "live-code-compilation": {
    Component: lazy(async () => {
      const { LiveCodeCompilation } =
        await import("@/registry/framecn/live-code-compilation");
      return { default: LiveCodeCompilation };
    }),
    config: liveCodeCompilationConfig,
  },
  "marker-highlight": {
    Component: lazy(async () => {
      const { MarkerHighlight } =
        await import("@/registry/framecn/marker-highlight");
      return { default: MarkerHighlight };
    }),
    config: markerHighlightConfig,
  },
  "masked-slide-reveal": {
    Component: lazy(async () => {
      const { MaskedSlideReveal } =
        await import("@/registry/framecn/masked-slide-reveal");
      return { default: MaskedSlideReveal };
    }),
    config: maskedSlideRevealConfig,
  },
  "matrix-decode": {
    Component: lazy(async () => {
      const { MatrixDecode } = await import("@/registry/framecn/matrix-decode");
      return { default: MatrixDecode };
    }),
    config: matrixDecodeConfig,
  },
  "mesh-gradient-bg": {
    Component: lazy(async () => {
      const { MeshGradientBg } =
        await import("@/registry/framecn/mesh-gradient-bg");
      return { default: MeshGradientBg };
    }),
    config: meshGradientBgConfig,
  },
  "morphing-modal": {
    Component: lazy(async () => {
      const { MorphingModal } =
        await import("@/registry/framecn/morphing-modal");
      return { default: MorphingModal };
    }),
    config: morphingModalConfig,
  },
  "perspective-marquee": {
    Component: lazy(async () => {
      const { PerspectiveMarquee } =
        await import("@/registry/framecn/perspective-marquee");
      return { default: PerspectiveMarquee };
    }),
    config: perspectiveMarqueeConfig,
  },
  "pipeline-journey": {
    Component: lazy(async () => {
      const { PipelineJourney } =
        await import("@/registry/framecn/pipeline-journey");
      return { default: PipelineJourney };
    }),
    config: pipelineJourneyConfig,
  },
  "pricing-tier-focus": {
    Component: lazy(async () => {
      const { PricingTierFocus } =
        await import("@/registry/framecn/pricing-tier-focus");
      return { default: PricingTierFocus };
    }),
    config: pricingTierFocusConfig,
  },
  "product-launch-trailer": {
    Component: lazy(async () => {
      const { ProductLaunchTrailer } =
        await import("@/registry/framecn/product-launch-trailer");
      return { default: ProductLaunchTrailer };
    }),
    config: productLaunchTrailerConfig,
  },
  "progress-steps": {
    Component: lazy(async () => {
      const { ProgressSteps } =
        await import("@/registry/framecn/progress-steps");
      return { default: ProgressSteps };
    }),
    config: progressStepsConfig,
  },
  "pulsing-indicator": {
    Component: lazy(async () => {
      const { PulsingIndicator } =
        await import("@/registry/framecn/pulsing-indicator");
      return { default: PulsingIndicator };
    }),
    config: pulsingIndicatorConfig,
  },
  "rgb-glitch-text": {
    Component: lazy(async () => {
      const { RGBGlitchText } =
        await import("@/registry/framecn/rgb-glitch-text");
      return { default: RGBGlitchText };
    }),
    config: rgbGlitchTextConfig,
  },
  "shimmer-sweep": {
    Component: lazy(async () => {
      const { ShimmerSweep } = await import("@/registry/framecn/shimmer-sweep");
      return { default: ShimmerSweep };
    }),
    config: shimmerSweepConfig,
  },
  "simulated-cursor": {
    Component: lazy(async () => {
      const { SimulatedCursor } =
        await import("@/registry/framecn/simulated-cursor");
      return { default: SimulatedCursor };
    }),
    config: simulatedCursorConfig,
  },
  "slot-machine-roll": {
    Component: lazy(async () => {
      const { SlotMachineRoll } =
        await import("@/registry/framecn/slot-machine-roll");
      return { default: SlotMachineRoll };
    }),
    config: slotMachineRollConfig,
  },
  "spatial-push": {
    Component: lazy(async () => {
      const { SpatialPush } = await import("@/registry/framecn/spatial-push");
      return { default: SpatialPush };
    }),
    config: spatialPushConfig,
  },
  "spotlight-card": {
    Component: lazy(async () => {
      const { SpotlightCard } =
        await import("@/registry/framecn/spotlight-card");
      return { default: SpotlightCard };
    }),
    config: spotlightCardConfig,
  },
  "spring-pop-in": {
    Component: lazy(async () => {
      const { SpringPopIn } = await import("@/registry/framecn/spring-pop-in");
      return { default: SpringPopIn };
    }),
    config: springPopInConfig,
  },
  "staggered-bento-grid": {
    Component: lazy(async () => {
      const { StaggeredBentoGrid } =
        await import("@/registry/framecn/staggered-bento-grid");
      return { default: StaggeredBentoGrid };
    }),
    config: staggeredBentoGridConfig,
  },
  "staggered-fade-up": {
    Component: lazy(async () => {
      const { StaggeredFadeUp } =
        await import("@/registry/framecn/staggered-fade-up");
      return { default: StaggeredFadeUp };
    }),
    config: staggeredFadeUpConfig,
  },
  "strikethrough-replace": {
    Component: lazy(async () => {
      const { StrikethroughReplace } =
        await import("@/registry/framecn/strikethrough-replace");
      return { default: StrikethroughReplace };
    }),
    config: strikethroughReplaceConfig,
  },
  "success-confetti": {
    Component: lazy(async () => {
      const { SuccessConfetti } =
        await import("@/registry/framecn/success-confetti");
      return { default: SuccessConfetti };
    }),
    config: successConfettiConfig,
  },
  "swipe-transition-wipe": {
    Component: lazy(async () => {
      const { SwipeTransitionWipe } =
        await import("@/registry/framecn/swipe-transition-wipe");
      return { default: SwipeTransitionWipe };
    }),
    config: swipeTransitionWipeConfig,
  },
  "terminal-simulator": {
    Component: lazy(async () => {
      const { TerminalSimulator } =
        await import("@/registry/framecn/terminal-simulator");
      return { default: TerminalSimulator };
    }),
    config: terminalSimulatorConfig,
  },
  "terminal-to-browser-deploy": {
    Component: lazy(async () => {
      const { TerminalToBrowserDeploy } =
        await import("@/registry/framecn/terminal-to-browser-deploy");
      return { default: TerminalToBrowserDeploy };
    }),
    config: terminalToBrowserDeployConfig,
  },
  "text-fade-replace": {
    Component: lazy(async () => {
      const { TextFadeReplace } =
        await import("@/registry/framecn/text-fade-replace");
      return { default: TextFadeReplace };
    }),
    config: textFadeReplaceConfig,
  },
  "toast-notification": {
    Component: lazy(async () => {
      const { ToastNotification } =
        await import("@/registry/framecn/toast-notification");
      return { default: ToastNotification };
    }),
    config: toastNotificationConfig,
  },
  "tool-menu-slide-in": {
    Component: lazy(async () => {
      const { ToolMenuSlideIn } =
        await import("@/registry/framecn/tool-menu-slide-in");
      return { default: ToolMenuSlideIn };
    }),
    config: toolMenuSlideInConfig,
  },
  "tracking-in": {
    Component: lazy(async () => {
      const { TrackingIn } = await import("@/registry/framecn/tracking-in");
      return { default: TrackingIn };
    }),
    config: trackingInConfig,
  },
  typewriter: {
    Component: lazy(async () => {
      const { Typewriter } = await import("@/registry/framecn/typewriter");
      return { default: Typewriter };
    }),
    config: typewriterConfig,
  },
  "visual-docs-snippet": {
    Component: lazy(async () => {
      const { VisualDocsSnippet } =
        await import("@/registry/framecn/visual-docs-snippet");
      return { default: VisualDocsSnippet };
    }),
    config: visualDocsSnippetConfig,
  },
  "zoom-through-transition": {
    Component: lazy(async () => {
      const { ZoomThroughTransition } =
        await import("@/registry/framecn/zoom-through-transition");
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
