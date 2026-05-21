"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { aiGenerateOverlayConfig as efAIGenerateOverlayConfig } from "@/registry/bases/editframe/ai-generate-overlay/config";
import { aiGenerationCanvasConfig as efAIGenerationCanvasConfig } from "@/registry/bases/editframe/ai-generation-canvas/config";
import { animatedBarChartConfig as efAnimatedBarChartConfig } from "@/registry/bases/editframe/animated-bar-chart/config";
import { animatedLineChartConfig as efAnimatedLineChartConfig } from "@/registry/bases/editframe/animated-line-chart/config";
import { blurRevealConfig as efBlurRevealConfig } from "@/registry/bases/editframe/blur-reveal/config";
import { boundingBoxSelectorConfig as efBoundingBoxSelectorConfig } from "@/registry/bases/editframe/bounding-box-selector/config";
import { browserFlowConfig as efBrowserFlowConfig } from "@/registry/bases/editframe/browser-flow/config";
import { brushStrokeSimulatorConfig as efBrushStrokeSimulatorConfig } from "@/registry/bases/editframe/brush-stroke-simulator/config";
import { changelogBiteConfig as efChangelogBiteConfig } from "@/registry/bases/editframe/changelog-bite/config";
import { chatToPreviewLayoutConfig as efChatToPreviewLayoutConfig } from "@/registry/bases/editframe/chat-to-preview-layout/config";
import { chromaticAberrationWipeConfig as efChromaticAberrationWipeConfig } from "@/registry/bases/editframe/chromatic-aberration-wipe/config";
import { codeAccordionConfig as efCodeAccordionConfig } from "@/registry/bases/editframe/code-accordion/config";
import { codeDiffWipeConfig as efCodeDiffWipeConfig } from "@/registry/bases/editframe/code-diff-wipe/config";
import { cursorFlowConfig as efCursorFlowConfig } from "@/registry/bases/editframe/cursor-flow/config";
import { dashboardPopulateConfig as efDashboardPopulateConfig } from "@/registry/bases/editframe/dashboard-populate/config";
import { dataFlowPipesConfig as efDataFlowPipesConfig } from "@/registry/bases/editframe/data-flow-pipes/config";
import { deviceMockupZoomConfig as efDeviceMockupZoomConfig } from "@/registry/bases/editframe/device-mockup-zoom/config";
import { directionalWipeConfig as efDirectionalWipeConfig } from "@/registry/bases/editframe/directional-wipe/config";
import { dragAndDropFlowConfig as efDragAndDropFlowConfig } from "@/registry/bases/editframe/drag-and-drop-flow/config";
import { dynamicGridConfig as efDynamicGridConfig } from "@/registry/bases/editframe/dynamic-grid/config";
import { ecosystemConstellationConfig as efEcosystemConstellationConfig } from "@/registry/bases/editframe/ecosystem-constellation/config";
import { frostedGlassWipeConfig as efFrostedGlassWipeConfig } from "@/registry/bases/editframe/frosted-glass-wipe/config";
import { glassCodeBlockConfig as efGlassCodeBlockConfig } from "@/registry/bases/editframe/glass-code-block/config";
import { gridPixelateWipeConfig as efGridPixelateWipeConfig } from "@/registry/bases/editframe/grid-pixelate-wipe/config";
import { heroDeviceAssembleConfig as efHeroDeviceAssembleConfig } from "@/registry/bases/editframe/hero-device-assemble/config";
import { imageExpandToFullscreenConfig as efImageExpandToFullscreenConfig } from "@/registry/bases/editframe/image-expand-to-fullscreen/config";
import { infiniteBentoPanConfig as efInfiniteBentoPanConfig } from "@/registry/bases/editframe/infinite-bento-pan/config";
import { infiniteMarqueeConfig as efInfiniteMarqueeConfig } from "@/registry/bases/editframe/infinite-marquee/config";
import { inlineHighlightConfig as efInlineHighlightConfig } from "@/registry/bases/editframe/inline-highlight/config";
import { kineticTypeMaskConfig as efKineticTypeMaskConfig } from "@/registry/bases/editframe/kinetic-type-mask/config";
import { landingCodeShowcaseConfig as efLandingCodeShowcaseConfig } from "@/registry/bases/editframe/landing-code-showcase/config";
import { liveCodeCompilationConfig as efLiveCodeCompilationConfig } from "@/registry/bases/editframe/live-code-compilation/config";
import { markerHighlightConfig as efMarkerHighlightConfig } from "@/registry/bases/editframe/marker-highlight/config";
import { maskedSlideRevealConfig as efMaskedSlideRevealConfig } from "@/registry/bases/editframe/masked-slide-reveal/config";
import { matrixDecodeConfig as efMatrixDecodeConfig } from "@/registry/bases/editframe/matrix-decode/config";
import { meshGradientBgConfig as efMeshGradientBgConfig } from "@/registry/bases/editframe/mesh-gradient-bg/config";
import { morphingModalConfig as efMorphingModalConfig } from "@/registry/bases/editframe/morphing-modal/config";
import { perspectiveMarqueeConfig as efPerspectiveMarqueeConfig } from "@/registry/bases/editframe/perspective-marquee/config";
import { pipelineJourneyConfig as efPipelineJourneyConfig } from "@/registry/bases/editframe/pipeline-journey/config";
import { pricingTierFocusConfig as efPricingTierFocusConfig } from "@/registry/bases/editframe/pricing-tier-focus/config";
import { productLaunchTrailerConfig as efProductLaunchTrailerConfig } from "@/registry/bases/editframe/product-launch-trailer/config";
import { progressStepsConfig as efProgressStepsConfig } from "@/registry/bases/editframe/progress-steps/config";
import { pulsingIndicatorConfig as efPulsingIndicatorConfig } from "@/registry/bases/editframe/pulsing-indicator/config";
import { rgbGlitchTextConfig as efRGBGlitchTextConfig } from "@/registry/bases/editframe/rgb-glitch-text/config";
import { shimmerSweepConfig as efShimmerSweepConfig } from "@/registry/bases/editframe/shimmer-sweep/config";
import { simulatedCursorConfig as efSimulatedCursorConfig } from "@/registry/bases/editframe/simulated-cursor/config";
import { slotMachineRollConfig as efSlotMachineRollConfig } from "@/registry/bases/editframe/slot-machine-roll/config";
import { spatialPushConfig as efSpatialPushConfig } from "@/registry/bases/editframe/spatial-push/config";
import { spotlightCardConfig as efSpotlightCardConfig } from "@/registry/bases/editframe/spotlight-card/config";
import { springPopInConfig as efSpringPopInConfig } from "@/registry/bases/editframe/spring-pop-in/config";
import { staggeredBentoGridConfig as efStaggeredBentoGridConfig } from "@/registry/bases/editframe/staggered-bento-grid/config";
import { staggeredFadeUpConfig as efStaggeredFadeUpConfig } from "@/registry/bases/editframe/staggered-fade-up/config";
import { strikethroughReplaceConfig as efStrikethroughReplaceConfig } from "@/registry/bases/editframe/strikethrough-replace/config";
import { successConfettiConfig as efSuccessConfettiConfig } from "@/registry/bases/editframe/success-confetti/config";
import { swipeTransitionWipeConfig as efSwipeTransitionWipeConfig } from "@/registry/bases/editframe/swipe-transition-wipe/config";
import { terminalSimulatorConfig as efTerminalSimulatorConfig } from "@/registry/bases/editframe/terminal-simulator/config";
import { terminalToBrowserDeployConfig as efTerminalToBrowserDeployConfig } from "@/registry/bases/editframe/terminal-to-browser-deploy/config";
import { textFadeReplaceConfig as efTextFadeReplaceConfig } from "@/registry/bases/editframe/text-fade-replace/config";
import { toastNotificationConfig as efToastNotificationConfig } from "@/registry/bases/editframe/toast-notification/config";
import { toolMenuSlideInConfig as efToolMenuSlideInConfig } from "@/registry/bases/editframe/tool-menu-slide-in/config";
import { trackingInConfig as efTrackingInConfig } from "@/registry/bases/editframe/tracking-in/config";
import { typewriterConfig as efTypewriterConfig } from "@/registry/bases/editframe/typewriter/config";
import { visualDocsSnippetConfig as efVisualDocsSnippetConfig } from "@/registry/bases/editframe/visual-docs-snippet/config";
import { volumetricRaysConfig as efVolumetricRaysConfig } from "@/registry/bases/editframe/volumetric-rays/config";
import { zoomThroughTransitionConfig as efZoomThroughTransitionConfig } from "@/registry/bases/editframe/zoom-through-transition/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

export interface RegistryEntry {
  Component: AnyComponent;
  config: ComponentConfig;
}

export interface HyperframesEntry {
  htmlPath: string;
}

export interface BaseRegistry {
  editframe: Record<string, RegistryEntry>;
  hyperframes: Record<string, HyperframesEntry>;
}

const lazy = (loader: () => Promise<{ default: AnyComponent }>) =>
  dynamic(loader, { ssr: false });

const editframeRegistry: Record<string, RegistryEntry> = {
  "ai-generate-overlay": {
    Component: lazy(async () => {
      const { AIGenerateOverlay } =
        await import("@/registry/bases/editframe/ai-generate-overlay");
      return { default: AIGenerateOverlay };
    }),
    config: efAIGenerateOverlayConfig,
  },
  "ai-generation-canvas": {
    Component: lazy(async () => {
      const { AIGenerationCanvas } =
        await import("@/registry/bases/editframe/ai-generation-canvas");
      return { default: AIGenerationCanvas };
    }),
    config: efAIGenerationCanvasConfig,
  },
  "animated-bar-chart": {
    Component: lazy(async () => {
      const { AnimatedBarChart } =
        await import("@/registry/bases/editframe/animated-bar-chart");
      return { default: AnimatedBarChart };
    }),
    config: efAnimatedBarChartConfig,
  },
  "animated-line-chart": {
    Component: lazy(async () => {
      const { AnimatedLineChart } =
        await import("@/registry/bases/editframe/animated-line-chart");
      return { default: AnimatedLineChart };
    }),
    config: efAnimatedLineChartConfig,
  },
  "blur-reveal": {
    Component: lazy(async () => {
      const { BlurReveal } =
        await import("@/registry/bases/editframe/blur-reveal");
      return { default: BlurReveal };
    }),
    config: efBlurRevealConfig,
  },
  "bounding-box-selector": {
    Component: lazy(async () => {
      const { BoundingBoxSelector } =
        await import("@/registry/bases/editframe/bounding-box-selector");
      return { default: BoundingBoxSelector };
    }),
    config: efBoundingBoxSelectorConfig,
  },
  "browser-flow": {
    Component: lazy(async () => {
      const { BrowserFlow } =
        await import("@/registry/bases/editframe/browser-flow");
      return { default: BrowserFlow };
    }),
    config: efBrowserFlowConfig,
  },
  "brush-stroke-simulator": {
    Component: lazy(async () => {
      const { BrushStrokeSimulator } =
        await import("@/registry/bases/editframe/brush-stroke-simulator");
      return { default: BrushStrokeSimulator };
    }),
    config: efBrushStrokeSimulatorConfig,
  },
  "changelog-bite": {
    Component: lazy(async () => {
      const { ChangelogBite } =
        await import("@/registry/bases/editframe/changelog-bite");
      return { default: ChangelogBite };
    }),
    config: efChangelogBiteConfig,
  },
  "chat-to-preview-layout": {
    Component: lazy(async () => {
      const { ChatToPreviewLayout } =
        await import("@/registry/bases/editframe/chat-to-preview-layout");
      return { default: ChatToPreviewLayout };
    }),
    config: efChatToPreviewLayoutConfig,
  },
  "chromatic-aberration-wipe": {
    Component: lazy(async () => {
      const { ChromaticAberrationWipe } =
        await import("@/registry/bases/editframe/chromatic-aberration-wipe");
      return { default: ChromaticAberrationWipe };
    }),
    config: efChromaticAberrationWipeConfig,
  },
  "code-accordion": {
    Component: lazy(async () => {
      const { CodeAccordion } =
        await import("@/registry/bases/editframe/code-accordion");
      return { default: CodeAccordion };
    }),
    config: efCodeAccordionConfig,
  },
  "code-diff-wipe": {
    Component: lazy(async () => {
      const { CodeDiffWipe } =
        await import("@/registry/bases/editframe/code-diff-wipe");
      return { default: CodeDiffWipe };
    }),
    config: efCodeDiffWipeConfig,
  },
  "cursor-flow": {
    Component: lazy(async () => {
      const { CursorFlow } =
        await import("@/registry/bases/editframe/cursor-flow");
      return { default: CursorFlow };
    }),
    config: efCursorFlowConfig,
  },
  "dashboard-populate": {
    Component: lazy(async () => {
      const { DashboardPopulate } =
        await import("@/registry/bases/editframe/dashboard-populate");
      return { default: DashboardPopulate };
    }),
    config: efDashboardPopulateConfig,
  },
  "data-flow-pipes": {
    Component: lazy(async () => {
      const { DataFlowPipes } =
        await import("@/registry/bases/editframe/data-flow-pipes");
      return { default: DataFlowPipes };
    }),
    config: efDataFlowPipesConfig,
  },
  "device-mockup-zoom": {
    Component: lazy(async () => {
      const { DeviceMockupZoom } =
        await import("@/registry/bases/editframe/device-mockup-zoom");
      return { default: DeviceMockupZoom };
    }),
    config: efDeviceMockupZoomConfig,
  },
  "directional-wipe": {
    Component: lazy(async () => {
      const { DirectionalWipe } =
        await import("@/registry/bases/editframe/directional-wipe");
      return { default: DirectionalWipe };
    }),
    config: efDirectionalWipeConfig,
  },
  "drag-and-drop-flow": {
    Component: lazy(async () => {
      const { DragAndDropFlow } =
        await import("@/registry/bases/editframe/drag-and-drop-flow");
      return { default: DragAndDropFlow };
    }),
    config: efDragAndDropFlowConfig,
  },
  "dynamic-grid": {
    Component: lazy(async () => {
      const { DynamicGrid } =
        await import("@/registry/bases/editframe/dynamic-grid");
      return { default: DynamicGrid };
    }),
    config: efDynamicGridConfig,
  },
  "ecosystem-constellation": {
    Component: lazy(async () => {
      const { EcosystemConstellation } =
        await import("@/registry/bases/editframe/ecosystem-constellation");
      return { default: EcosystemConstellation };
    }),
    config: efEcosystemConstellationConfig,
  },
  "frosted-glass-wipe": {
    Component: lazy(async () => {
      const { FrostedGlassWipe } =
        await import("@/registry/bases/editframe/frosted-glass-wipe");
      return { default: FrostedGlassWipe };
    }),
    config: efFrostedGlassWipeConfig,
  },
  "glass-code-block": {
    Component: lazy(async () => {
      const { GlassCodeBlock } =
        await import("@/registry/bases/editframe/glass-code-block");
      return { default: GlassCodeBlock };
    }),
    config: efGlassCodeBlockConfig,
  },
  "grid-pixelate-wipe": {
    Component: lazy(async () => {
      const { GridPixelateWipe } =
        await import("@/registry/bases/editframe/grid-pixelate-wipe");
      return { default: GridPixelateWipe };
    }),
    config: efGridPixelateWipeConfig,
  },
  "hero-device-assemble": {
    Component: lazy(async () => {
      const { HeroDeviceAssemble } =
        await import("@/registry/bases/editframe/hero-device-assemble");
      return { default: HeroDeviceAssemble };
    }),
    config: efHeroDeviceAssembleConfig,
  },
  "image-expand-to-fullscreen": {
    Component: lazy(async () => {
      const { ImageExpandToFullscreen } =
        await import("@/registry/bases/editframe/image-expand-to-fullscreen");
      return { default: ImageExpandToFullscreen };
    }),
    config: efImageExpandToFullscreenConfig,
  },
  "infinite-bento-pan": {
    Component: lazy(async () => {
      const { InfiniteBentoPan } =
        await import("@/registry/bases/editframe/infinite-bento-pan");
      return { default: InfiniteBentoPan };
    }),
    config: efInfiniteBentoPanConfig,
  },
  "infinite-marquee": {
    Component: lazy(async () => {
      const { InfiniteMarquee } =
        await import("@/registry/bases/editframe/infinite-marquee");
      return { default: InfiniteMarquee };
    }),
    config: efInfiniteMarqueeConfig,
  },
  "inline-highlight": {
    Component: lazy(async () => {
      const { InlineHighlight } =
        await import("@/registry/bases/editframe/inline-highlight");
      return { default: InlineHighlight };
    }),
    config: efInlineHighlightConfig,
  },
  "kinetic-type-mask": {
    Component: lazy(async () => {
      const { KineticTypeMask } =
        await import("@/registry/bases/editframe/kinetic-type-mask");
      return { default: KineticTypeMask };
    }),
    config: efKineticTypeMaskConfig,
  },
  "landing-code-showcase": {
    Component: lazy(async () => {
      const { LandingCodeShowcase } =
        await import("@/registry/bases/editframe/landing-code-showcase");
      return { default: LandingCodeShowcase };
    }),
    config: efLandingCodeShowcaseConfig,
  },
  "live-code-compilation": {
    Component: lazy(async () => {
      const { LiveCodeCompilation } =
        await import("@/registry/bases/editframe/live-code-compilation");
      return { default: LiveCodeCompilation };
    }),
    config: efLiveCodeCompilationConfig,
  },
  "marker-highlight": {
    Component: lazy(async () => {
      const { MarkerHighlight } =
        await import("@/registry/bases/editframe/marker-highlight");
      return { default: MarkerHighlight };
    }),
    config: efMarkerHighlightConfig,
  },
  "masked-slide-reveal": {
    Component: lazy(async () => {
      const { MaskedSlideReveal } =
        await import("@/registry/bases/editframe/masked-slide-reveal");
      return { default: MaskedSlideReveal };
    }),
    config: efMaskedSlideRevealConfig,
  },
  "matrix-decode": {
    Component: lazy(async () => {
      const { MatrixDecode } =
        await import("@/registry/bases/editframe/matrix-decode");
      return { default: MatrixDecode };
    }),
    config: efMatrixDecodeConfig,
  },
  "mesh-gradient-bg": {
    Component: lazy(async () => {
      const { MeshGradientBg } =
        await import("@/registry/bases/editframe/mesh-gradient-bg");
      return { default: MeshGradientBg };
    }),
    config: efMeshGradientBgConfig,
  },
  "morphing-modal": {
    Component: lazy(async () => {
      const { MorphingModal } =
        await import("@/registry/bases/editframe/morphing-modal");
      return { default: MorphingModal };
    }),
    config: efMorphingModalConfig,
  },
  "perspective-marquee": {
    Component: lazy(async () => {
      const { PerspectiveMarquee } =
        await import("@/registry/bases/editframe/perspective-marquee");
      return { default: PerspectiveMarquee };
    }),
    config: efPerspectiveMarqueeConfig,
  },
  "pipeline-journey": {
    Component: lazy(async () => {
      const { PipelineJourney } =
        await import("@/registry/bases/editframe/pipeline-journey");
      return { default: PipelineJourney };
    }),
    config: efPipelineJourneyConfig,
  },
  "pricing-tier-focus": {
    Component: lazy(async () => {
      const { PricingTierFocus } =
        await import("@/registry/bases/editframe/pricing-tier-focus");
      return { default: PricingTierFocus };
    }),
    config: efPricingTierFocusConfig,
  },
  "product-launch-trailer": {
    Component: lazy(async () => {
      const { ProductLaunchTrailer } =
        await import("@/registry/bases/editframe/product-launch-trailer");
      return { default: ProductLaunchTrailer };
    }),
    config: efProductLaunchTrailerConfig,
  },
  "progress-steps": {
    Component: lazy(async () => {
      const { ProgressSteps } =
        await import("@/registry/bases/editframe/progress-steps");
      return { default: ProgressSteps };
    }),
    config: efProgressStepsConfig,
  },
  "pulsing-indicator": {
    Component: lazy(async () => {
      const { PulsingIndicator } =
        await import("@/registry/bases/editframe/pulsing-indicator");
      return { default: PulsingIndicator };
    }),
    config: efPulsingIndicatorConfig,
  },
  "rgb-glitch-text": {
    Component: lazy(async () => {
      const { RGBGlitchText } =
        await import("@/registry/bases/editframe/rgb-glitch-text");
      return { default: RGBGlitchText };
    }),
    config: efRGBGlitchTextConfig,
  },
  "shimmer-sweep": {
    Component: lazy(async () => {
      const { ShimmerSweep } =
        await import("@/registry/bases/editframe/shimmer-sweep");
      return { default: ShimmerSweep };
    }),
    config: efShimmerSweepConfig,
  },
  "simulated-cursor": {
    Component: lazy(async () => {
      const { SimulatedCursor } =
        await import("@/registry/bases/editframe/simulated-cursor");
      return { default: SimulatedCursor };
    }),
    config: efSimulatedCursorConfig,
  },
  "slot-machine-roll": {
    Component: lazy(async () => {
      const { SlotMachineRoll } =
        await import("@/registry/bases/editframe/slot-machine-roll");
      return { default: SlotMachineRoll };
    }),
    config: efSlotMachineRollConfig,
  },
  "spatial-push": {
    Component: lazy(async () => {
      const { SpatialPush } =
        await import("@/registry/bases/editframe/spatial-push");
      return { default: SpatialPush };
    }),
    config: efSpatialPushConfig,
  },
  "spotlight-card": {
    Component: lazy(async () => {
      const { SpotlightCard } =
        await import("@/registry/bases/editframe/spotlight-card");
      return { default: SpotlightCard };
    }),
    config: efSpotlightCardConfig,
  },
  "spring-pop-in": {
    Component: lazy(async () => {
      const { SpringPopIn } =
        await import("@/registry/bases/editframe/spring-pop-in");
      return { default: SpringPopIn };
    }),
    config: efSpringPopInConfig,
  },
  "staggered-bento-grid": {
    Component: lazy(async () => {
      const { StaggeredBentoGrid } =
        await import("@/registry/bases/editframe/staggered-bento-grid");
      return { default: StaggeredBentoGrid };
    }),
    config: efStaggeredBentoGridConfig,
  },
  "staggered-fade-up": {
    Component: lazy(async () => {
      const { StaggeredFadeUp } =
        await import("@/registry/bases/editframe/staggered-fade-up");
      return { default: StaggeredFadeUp };
    }),
    config: efStaggeredFadeUpConfig,
  },
  "strikethrough-replace": {
    Component: lazy(async () => {
      const { StrikethroughReplace } =
        await import("@/registry/bases/editframe/strikethrough-replace");
      return { default: StrikethroughReplace };
    }),
    config: efStrikethroughReplaceConfig,
  },
  "success-confetti": {
    Component: lazy(async () => {
      const { SuccessConfetti } =
        await import("@/registry/bases/editframe/success-confetti");
      return { default: SuccessConfetti };
    }),
    config: efSuccessConfettiConfig,
  },
  "swipe-transition-wipe": {
    Component: lazy(async () => {
      const { SwipeTransitionWipe } =
        await import("@/registry/bases/editframe/swipe-transition-wipe");
      return { default: SwipeTransitionWipe };
    }),
    config: efSwipeTransitionWipeConfig,
  },
  "terminal-simulator": {
    Component: lazy(async () => {
      const { TerminalSimulator } =
        await import("@/registry/bases/editframe/terminal-simulator");
      return { default: TerminalSimulator };
    }),
    config: efTerminalSimulatorConfig,
  },
  "terminal-to-browser-deploy": {
    Component: lazy(async () => {
      const { TerminalToBrowserDeploy } =
        await import("@/registry/bases/editframe/terminal-to-browser-deploy");
      return { default: TerminalToBrowserDeploy };
    }),
    config: efTerminalToBrowserDeployConfig,
  },
  "text-fade-replace": {
    Component: lazy(async () => {
      const { TextFadeReplace } =
        await import("@/registry/bases/editframe/text-fade-replace");
      return { default: TextFadeReplace };
    }),
    config: efTextFadeReplaceConfig,
  },
  "toast-notification": {
    Component: lazy(async () => {
      const { ToastNotification } =
        await import("@/registry/bases/editframe/toast-notification");
      return { default: ToastNotification };
    }),
    config: efToastNotificationConfig,
  },
  "tool-menu-slide-in": {
    Component: lazy(async () => {
      const { ToolMenuSlideIn } =
        await import("@/registry/bases/editframe/tool-menu-slide-in");
      return { default: ToolMenuSlideIn };
    }),
    config: efToolMenuSlideInConfig,
  },
  "tracking-in": {
    Component: lazy(async () => {
      const { TrackingIn } =
        await import("@/registry/bases/editframe/tracking-in");
      return { default: TrackingIn };
    }),
    config: efTrackingInConfig,
  },
  typewriter: {
    Component: lazy(async () => {
      const { Typewriter } =
        await import("@/registry/bases/editframe/typewriter");
      return { default: Typewriter };
    }),
    config: efTypewriterConfig,
  },
  "visual-docs-snippet": {
    Component: lazy(async () => {
      const { VisualDocsSnippet } =
        await import("@/registry/bases/editframe/visual-docs-snippet");
      return { default: VisualDocsSnippet };
    }),
    config: efVisualDocsSnippetConfig,
  },
  "volumetric-rays": {
    Component: lazy(async () => {
      const { VolumetricRays } =
        await import("@/registry/bases/editframe/volumetric-rays");
      return { default: VolumetricRays };
    }),
    config: efVolumetricRaysConfig,
  },
  "zoom-through-transition": {
    Component: lazy(async () => {
      const { ZoomThroughTransition } =
        await import("@/registry/bases/editframe/zoom-through-transition");
      return { default: ZoomThroughTransition };
    }),
    config: efZoomThroughTransitionConfig,
  },
};

const hyperframesRegistry: Record<string, HyperframesEntry> = {
  "ai-generate-overlay": {
    htmlPath: "/hyperframes/ai-generate-overlay/index.html",
  },
  "ai-generation-canvas": {
    htmlPath: "/hyperframes/ai-generation-canvas/index.html",
  },
  "animated-bar-chart": {
    htmlPath: "/hyperframes/animated-bar-chart/index.html",
  },
  "animated-line-chart": {
    htmlPath: "/hyperframes/animated-line-chart/index.html",
  },
  "blur-reveal": {
    htmlPath: "/hyperframes/blur-reveal/index.html",
  },
  "bounding-box-selector": {
    htmlPath: "/hyperframes/bounding-box-selector/index.html",
  },
  "browser-flow": {
    htmlPath: "/hyperframes/browser-flow/index.html",
  },
  "brush-stroke-simulator": {
    htmlPath: "/hyperframes/brush-stroke-simulator/index.html",
  },
  "changelog-bite": {
    htmlPath: "/hyperframes/changelog-bite/index.html",
  },
  "chat-to-preview-layout": {
    htmlPath: "/hyperframes/chat-to-preview-layout/index.html",
  },
  "chromatic-aberration-wipe": {
    htmlPath: "/hyperframes/chromatic-aberration-wipe/index.html",
  },
  "code-accordion": {
    htmlPath: "/hyperframes/code-accordion/index.html",
  },
  "cursor-flow": {
    htmlPath: "/hyperframes/cursor-flow/index.html",
  },
  "dashboard-populate": {
    htmlPath: "/hyperframes/dashboard-populate/index.html",
  },
  "data-flow-pipes": {
    htmlPath: "/hyperframes/data-flow-pipes/index.html",
  },
  "device-mockup-zoom": {
    htmlPath: "/hyperframes/device-mockup-zoom/index.html",
  },
  "directional-wipe": {
    htmlPath: "/hyperframes/directional-wipe/index.html",
  },
  "drag-and-drop-flow": {
    htmlPath: "/hyperframes/drag-and-drop-flow/index.html",
  },
  "dynamic-grid": {
    htmlPath: "/hyperframes/dynamic-grid/index.html",
  },
  "ecosystem-constellation": {
    htmlPath: "/hyperframes/ecosystem-constellation/index.html",
  },
  "frosted-glass-wipe": {
    htmlPath: "/hyperframes/frosted-glass-wipe/index.html",
  },
  "glass-code-block": {
    htmlPath: "/hyperframes/glass-code-block/index.html",
  },
  "hero-device-assemble": {
    htmlPath: "/hyperframes/hero-device-assemble/index.html",
  },
  "image-expand-to-fullscreen": {
    htmlPath: "/hyperframes/image-expand-to-fullscreen/index.html",
  },
  "infinite-bento-pan": {
    htmlPath: "/hyperframes/infinite-bento-pan/index.html",
  },
  "infinite-marquee": {
    htmlPath: "/hyperframes/infinite-marquee/index.html",
  },
  "inline-highlight": {
    htmlPath: "/hyperframes/inline-highlight/index.html",
  },
  "kinetic-type-mask": {
    htmlPath: "/hyperframes/kinetic-type-mask/index.html",
  },
  "landing-code-showcase": {
    htmlPath: "/hyperframes/landing-code-showcase/index.html",
  },
  "live-code-compilation": {
    htmlPath: "/hyperframes/live-code-compilation/index.html",
  },
  "marker-highlight": {
    htmlPath: "/hyperframes/marker-highlight/index.html",
  },
  "masked-slide-reveal": {
    htmlPath: "/hyperframes/masked-slide-reveal/index.html",
  },
  "matrix-decode": {
    htmlPath: "/hyperframes/matrix-decode/index.html",
  },
  "mesh-gradient-bg": {
    htmlPath: "/hyperframes/mesh-gradient-bg/index.html",
  },
  "morphing-modal": {
    htmlPath: "/hyperframes/morphing-modal/index.html",
  },
  "perspective-marquee": {
    htmlPath: "/hyperframes/perspective-marquee/index.html",
  },
  "pipeline-journey": {
    htmlPath: "/hyperframes/pipeline-journey/index.html",
  },
  "pricing-tier-focus": {
    htmlPath: "/hyperframes/pricing-tier-focus/index.html",
  },
  "product-launch-trailer": {
    htmlPath: "/hyperframes/product-launch-trailer/index.html",
  },
  "progress-steps": {
    htmlPath: "/hyperframes/progress-steps/index.html",
  },
  "pulsing-indicator": {
    htmlPath: "/hyperframes/pulsing-indicator/index.html",
  },
  "rgb-glitch-text": {
    htmlPath: "/hyperframes/rgb-glitch-text/index.html",
  },
  "simulated-cursor": {
    htmlPath: "/hyperframes/simulated-cursor/index.html",
  },
  "slot-machine-roll": {
    htmlPath: "/hyperframes/slot-machine-roll/index.html",
  },
  "spatial-push": {
    htmlPath: "/hyperframes/spatial-push/index.html",
  },
  "spotlight-card": {
    htmlPath: "/hyperframes/spotlight-card/index.html",
  },
  "spring-pop-in": {
    htmlPath: "/hyperframes/spring-pop-in/index.html",
  },
  "staggered-bento-grid": {
    htmlPath: "/hyperframes/staggered-bento-grid/index.html",
  },
  "staggered-fade-up": {
    htmlPath: "/hyperframes/staggered-fade-up/index.html",
  },
  "strikethrough-replace": {
    htmlPath: "/hyperframes/strikethrough-replace/index.html",
  },
  "success-confetti": {
    htmlPath: "/hyperframes/success-confetti/index.html",
  },
  "swipe-transition-wipe": {
    htmlPath: "/hyperframes/swipe-transition-wipe/index.html",
  },
  "terminal-simulator": {
    htmlPath: "/hyperframes/terminal-simulator/index.html",
  },
  "terminal-to-browser-deploy": {
    htmlPath: "/hyperframes/terminal-to-browser-deploy/index.html",
  },
  "text-fade-replace": {
    htmlPath: "/hyperframes/text-fade-replace/index.html",
  },
  "toast-notification": {
    htmlPath: "/hyperframes/toast-notification/index.html",
  },
  "tool-menu-slide-in": {
    htmlPath: "/hyperframes/tool-menu-slide-in/index.html",
  },
  "tracking-in": {
    htmlPath: "/hyperframes/tracking-in/index.html",
  },
  typewriter: {
    htmlPath: "/hyperframes/typewriter/index.html",
  },
  "visual-docs-snippet": {
    htmlPath: "/hyperframes/visual-docs-snippet/index.html",
  },
  "volumetric-rays": {
    htmlPath: "/hyperframes/volumetric-rays/index.html",
  },
  "zoom-through-transition": {
    htmlPath: "/hyperframes/zoom-through-transition/index.html",
  },
};

// Append the shared controls (e.g. `speed`) to every component config so
// every animation in the customizer exposes the same baseline knobs.
for (const { config } of Object.values(editframeRegistry)) {
  config.controls = { ...config.controls, ...SHARED_CONTROLS };
}

const registry: BaseRegistry = {
  editframe: editframeRegistry,
  hyperframes: hyperframesRegistry,
};

export default registry;
