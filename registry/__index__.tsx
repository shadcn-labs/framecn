import type React from "react";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { AIGenerateOverlay } from "@/registry/framecn/ai-generate-overlay";
import { aiGenerateOverlayConfig } from "@/registry/framecn/ai-generate-overlay/config";
import { AIGenerationCanvas } from "@/registry/framecn/ai-generation-canvas";
import { aiGenerationCanvasConfig } from "@/registry/framecn/ai-generation-canvas/config";
import { AnimatedBarChart } from "@/registry/framecn/animated-bar-chart";
import { animatedBarChartConfig } from "@/registry/framecn/animated-bar-chart/config";
import { AnimatedLineChart } from "@/registry/framecn/animated-line-chart";
import { animatedLineChartConfig } from "@/registry/framecn/animated-line-chart/config";
import { BlurReveal } from "@/registry/framecn/blur-reveal";
import { blurRevealConfig } from "@/registry/framecn/blur-reveal/config";
import { BoundingBoxSelector } from "@/registry/framecn/bounding-box-selector";
import { boundingBoxSelectorConfig } from "@/registry/framecn/bounding-box-selector/config";
import { BrowserFlow } from "@/registry/framecn/browser-flow";
import { browserFlowConfig } from "@/registry/framecn/browser-flow/config";
import { BrushStrokeSimulator } from "@/registry/framecn/brush-stroke-simulator";
import { brushStrokeSimulatorConfig } from "@/registry/framecn/brush-stroke-simulator/config";
import { ChangelogBite } from "@/registry/framecn/changelog-bite";
import { changelogBiteConfig } from "@/registry/framecn/changelog-bite/config";
import { ChatToPreviewLayout } from "@/registry/framecn/chat-to-preview-layout";
import { chatToPreviewLayoutConfig } from "@/registry/framecn/chat-to-preview-layout/config";
import { ChromaticAberrationWipe } from "@/registry/framecn/chromatic-aberration-wipe";
import { chromaticAberrationWipeConfig } from "@/registry/framecn/chromatic-aberration-wipe/config";
import { CodeAccordion } from "@/registry/framecn/code-accordion";
import { codeAccordionConfig } from "@/registry/framecn/code-accordion/config";
import { CodeDiffWipe } from "@/registry/framecn/code-diff-wipe";
import { codeDiffWipeConfig } from "@/registry/framecn/code-diff-wipe/config";
import { CursorFlow } from "@/registry/framecn/cursor-flow";
import { cursorFlowConfig } from "@/registry/framecn/cursor-flow/config";
import { DashboardPopulate } from "@/registry/framecn/dashboard-populate";
import { dashboardPopulateConfig } from "@/registry/framecn/dashboard-populate/config";
import { DataFlowPipes } from "@/registry/framecn/data-flow-pipes";
import { dataFlowPipesConfig } from "@/registry/framecn/data-flow-pipes/config";
import { DeviceMockupZoom } from "@/registry/framecn/device-mockup-zoom";
import { deviceMockupZoomConfig } from "@/registry/framecn/device-mockup-zoom/config";
import { DirectionalWipe } from "@/registry/framecn/directional-wipe";
import { directionalWipeConfig } from "@/registry/framecn/directional-wipe/config";
import { DragAndDropFlow } from "@/registry/framecn/drag-and-drop-flow";
import { dragAndDropFlowConfig } from "@/registry/framecn/drag-and-drop-flow/config";
import { DynamicGrid } from "@/registry/framecn/dynamic-grid";
import { dynamicGridConfig } from "@/registry/framecn/dynamic-grid/config";
import { EcosystemConstellation } from "@/registry/framecn/ecosystem-constellation";
import { ecosystemConstellationConfig } from "@/registry/framecn/ecosystem-constellation/config";
import { FrostedGlassWipe } from "@/registry/framecn/frosted-glass-wipe";
import { frostedGlassWipeConfig } from "@/registry/framecn/frosted-glass-wipe/config";
import { GlassCodeBlock } from "@/registry/framecn/glass-code-block";
import { glassCodeBlockConfig } from "@/registry/framecn/glass-code-block/config";
import { GridPixelateWipe } from "@/registry/framecn/grid-pixelate-wipe";
import { gridPixelateWipeConfig } from "@/registry/framecn/grid-pixelate-wipe/config";
import { HeroDeviceAssemble } from "@/registry/framecn/hero-device-assemble";
import { heroDeviceAssembleConfig } from "@/registry/framecn/hero-device-assemble/config";
import { ImageExpandToFullscreen } from "@/registry/framecn/image-expand-to-fullscreen";
import { imageExpandToFullscreenConfig } from "@/registry/framecn/image-expand-to-fullscreen/config";
import { InfiniteBentoPan } from "@/registry/framecn/infinite-bento-pan";
import { infiniteBentoPanConfig } from "@/registry/framecn/infinite-bento-pan/config";
import { InfiniteMarquee } from "@/registry/framecn/infinite-marquee";
import { infiniteMarqueeConfig } from "@/registry/framecn/infinite-marquee/config";
import { InlineHighlight } from "@/registry/framecn/inline-highlight";
import { inlineHighlightConfig } from "@/registry/framecn/inline-highlight/config";
import { KineticTypeMask } from "@/registry/framecn/kinetic-type-mask";
import { kineticTypeMaskConfig } from "@/registry/framecn/kinetic-type-mask/config";
import { LandingCodeShowcase } from "@/registry/framecn/landing-code-showcase";
import { landingCodeShowcaseConfig } from "@/registry/framecn/landing-code-showcase/config";
import { LiveCodeCompilation } from "@/registry/framecn/live-code-compilation";
import { liveCodeCompilationConfig } from "@/registry/framecn/live-code-compilation/config";
import { MarkerHighlight } from "@/registry/framecn/marker-highlight";
import { markerHighlightConfig } from "@/registry/framecn/marker-highlight/config";
import { MaskedSlideReveal } from "@/registry/framecn/masked-slide-reveal";
import { maskedSlideRevealConfig } from "@/registry/framecn/masked-slide-reveal/config";
import { MatrixDecode } from "@/registry/framecn/matrix-decode";
import { matrixDecodeConfig } from "@/registry/framecn/matrix-decode/config";
import { MeshGradientBg } from "@/registry/framecn/mesh-gradient-bg";
import { meshGradientBgConfig } from "@/registry/framecn/mesh-gradient-bg/config";
import { MorphingModal } from "@/registry/framecn/morphing-modal";
import { morphingModalConfig } from "@/registry/framecn/morphing-modal/config";
import { PerspectiveMarquee } from "@/registry/framecn/perspective-marquee";
import { perspectiveMarqueeConfig } from "@/registry/framecn/perspective-marquee/config";
import { PipelineJourney } from "@/registry/framecn/pipeline-journey";
import { pipelineJourneyConfig } from "@/registry/framecn/pipeline-journey/config";
import { PricingTierFocus } from "@/registry/framecn/pricing-tier-focus";
import { pricingTierFocusConfig } from "@/registry/framecn/pricing-tier-focus/config";
import { ProductLaunchTrailer } from "@/registry/framecn/product-launch-trailer";
import { productLaunchTrailerConfig } from "@/registry/framecn/product-launch-trailer/config";
import { ProgressSteps } from "@/registry/framecn/progress-steps";
import { progressStepsConfig } from "@/registry/framecn/progress-steps/config";
import { PulsingIndicator } from "@/registry/framecn/pulsing-indicator";
import { pulsingIndicatorConfig } from "@/registry/framecn/pulsing-indicator/config";
import { RGBGlitchText } from "@/registry/framecn/rgb-glitch-text";
import { rgbGlitchTextConfig } from "@/registry/framecn/rgb-glitch-text/config";
import { ShimmerSweep } from "@/registry/framecn/shimmer-sweep";
import { shimmerSweepConfig } from "@/registry/framecn/shimmer-sweep/config";
import { SimulatedCursor } from "@/registry/framecn/simulated-cursor";
import { simulatedCursorConfig } from "@/registry/framecn/simulated-cursor/config";
import { SlotMachineRoll } from "@/registry/framecn/slot-machine-roll";
import { slotMachineRollConfig } from "@/registry/framecn/slot-machine-roll/config";
import { SpatialPush } from "@/registry/framecn/spatial-push";
import { spatialPushConfig } from "@/registry/framecn/spatial-push/config";
import { SpotlightCard } from "@/registry/framecn/spotlight-card";
import { spotlightCardConfig } from "@/registry/framecn/spotlight-card/config";
import { SpringPopIn } from "@/registry/framecn/spring-pop-in";
import { springPopInConfig } from "@/registry/framecn/spring-pop-in/config";
import { StaggeredBentoGrid } from "@/registry/framecn/staggered-bento-grid";
import { staggeredBentoGridConfig } from "@/registry/framecn/staggered-bento-grid/config";
import { StaggeredFadeUp } from "@/registry/framecn/staggered-fade-up";
import { staggeredFadeUpConfig } from "@/registry/framecn/staggered-fade-up/config";
import { StrikethroughReplace } from "@/registry/framecn/strikethrough-replace";
import { strikethroughReplaceConfig } from "@/registry/framecn/strikethrough-replace/config";
import { SuccessConfetti } from "@/registry/framecn/success-confetti";
import { successConfettiConfig } from "@/registry/framecn/success-confetti/config";
import { SwipeTransitionWipe } from "@/registry/framecn/swipe-transition-wipe";
import { swipeTransitionWipeConfig } from "@/registry/framecn/swipe-transition-wipe/config";
import { TerminalSimulator } from "@/registry/framecn/terminal-simulator";
import { terminalSimulatorConfig } from "@/registry/framecn/terminal-simulator/config";
import { TerminalToBrowserDeploy } from "@/registry/framecn/terminal-to-browser-deploy";
import { terminalToBrowserDeployConfig } from "@/registry/framecn/terminal-to-browser-deploy/config";
import { TextFadeReplace } from "@/registry/framecn/text-fade-replace";
import { textFadeReplaceConfig } from "@/registry/framecn/text-fade-replace/config";
import { ToastNotification } from "@/registry/framecn/toast-notification";
import { toastNotificationConfig } from "@/registry/framecn/toast-notification/config";
import { ToolMenuSlideIn } from "@/registry/framecn/tool-menu-slide-in";
import { toolMenuSlideInConfig } from "@/registry/framecn/tool-menu-slide-in/config";
import { TrackingIn } from "@/registry/framecn/tracking-in";
import { trackingInConfig } from "@/registry/framecn/tracking-in/config";
import { Typewriter } from "@/registry/framecn/typewriter";
import { typewriterConfig } from "@/registry/framecn/typewriter/config";
import { VisualDocsSnippet } from "@/registry/framecn/visual-docs-snippet";
import { visualDocsSnippetConfig } from "@/registry/framecn/visual-docs-snippet/config";
import { ZoomThroughTransition } from "@/registry/framecn/zoom-through-transition";
import { zoomThroughTransitionConfig } from "@/registry/framecn/zoom-through-transition/config";

export interface RegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  config: ComponentConfig;
}

const registry: Record<string, RegistryEntry> = {
  "ai-generate-overlay": {
    Component: AIGenerateOverlay,
    config: aiGenerateOverlayConfig,
  },
  "ai-generation-canvas": {
    Component: AIGenerationCanvas,
    config: aiGenerationCanvasConfig,
  },
  "animated-bar-chart": {
    Component: AnimatedBarChart,
    config: animatedBarChartConfig,
  },
  "animated-line-chart": {
    Component: AnimatedLineChart,
    config: animatedLineChartConfig,
  },
  "blur-reveal": { Component: BlurReveal, config: blurRevealConfig },
  "bounding-box-selector": {
    Component: BoundingBoxSelector,
    config: boundingBoxSelectorConfig,
  },
  "browser-flow": { Component: BrowserFlow, config: browserFlowConfig },
  "brush-stroke-simulator": {
    Component: BrushStrokeSimulator,
    config: brushStrokeSimulatorConfig,
  },
  "changelog-bite": {
    Component: ChangelogBite,
    config: changelogBiteConfig,
  },
  "chat-to-preview-layout": {
    Component: ChatToPreviewLayout,
    config: chatToPreviewLayoutConfig,
  },
  "chromatic-aberration-wipe": {
    Component: ChromaticAberrationWipe,
    config: chromaticAberrationWipeConfig,
  },
  "code-accordion": { Component: CodeAccordion, config: codeAccordionConfig },
  "code-diff-wipe": { Component: CodeDiffWipe, config: codeDiffWipeConfig },
  "cursor-flow": { Component: CursorFlow, config: cursorFlowConfig },
  "dashboard-populate": {
    Component: DashboardPopulate,
    config: dashboardPopulateConfig,
  },
  "data-flow-pipes": { Component: DataFlowPipes, config: dataFlowPipesConfig },
  "device-mockup-zoom": {
    Component: DeviceMockupZoom,
    config: deviceMockupZoomConfig,
  },
  "directional-wipe": {
    Component: DirectionalWipe,
    config: directionalWipeConfig,
  },
  "drag-and-drop-flow": {
    Component: DragAndDropFlow,
    config: dragAndDropFlowConfig,
  },
  "dynamic-grid": { Component: DynamicGrid, config: dynamicGridConfig },
  "ecosystem-constellation": {
    Component: EcosystemConstellation,
    config: ecosystemConstellationConfig,
  },
  "frosted-glass-wipe": {
    Component: FrostedGlassWipe,
    config: frostedGlassWipeConfig,
  },
  "glass-code-block": {
    Component: GlassCodeBlock,
    config: glassCodeBlockConfig,
  },
  "grid-pixelate-wipe": {
    Component: GridPixelateWipe,
    config: gridPixelateWipeConfig,
  },
  "hero-device-assemble": {
    Component: HeroDeviceAssemble,
    config: heroDeviceAssembleConfig,
  },
  "image-expand-to-fullscreen": {
    Component: ImageExpandToFullscreen,
    config: imageExpandToFullscreenConfig,
  },
  "infinite-bento-pan": {
    Component: InfiniteBentoPan,
    config: infiniteBentoPanConfig,
  },
  "infinite-marquee": {
    Component: InfiniteMarquee,
    config: infiniteMarqueeConfig,
  },
  "inline-highlight": {
    Component: InlineHighlight,
    config: inlineHighlightConfig,
  },
  "kinetic-type-mask": {
    Component: KineticTypeMask,
    config: kineticTypeMaskConfig,
  },
  "landing-code-showcase": {
    Component: LandingCodeShowcase,
    config: landingCodeShowcaseConfig,
  },
  "live-code-compilation": {
    Component: LiveCodeCompilation,
    config: liveCodeCompilationConfig,
  },
  "marker-highlight": {
    Component: MarkerHighlight,
    config: markerHighlightConfig,
  },
  "masked-slide-reveal": {
    Component: MaskedSlideReveal,
    config: maskedSlideRevealConfig,
  },
  "matrix-decode": { Component: MatrixDecode, config: matrixDecodeConfig },
  "mesh-gradient-bg": {
    Component: MeshGradientBg,
    config: meshGradientBgConfig,
  },
  "morphing-modal": { Component: MorphingModal, config: morphingModalConfig },
  "perspective-marquee": {
    Component: PerspectiveMarquee,
    config: perspectiveMarqueeConfig,
  },
  "pipeline-journey": {
    Component: PipelineJourney,
    config: pipelineJourneyConfig,
  },
  "pricing-tier-focus": {
    Component: PricingTierFocus,
    config: pricingTierFocusConfig,
  },
  "product-launch-trailer": {
    Component: ProductLaunchTrailer,
    config: productLaunchTrailerConfig,
  },
  "progress-steps": { Component: ProgressSteps, config: progressStepsConfig },
  "pulsing-indicator": {
    Component: PulsingIndicator,
    config: pulsingIndicatorConfig,
  },
  "rgb-glitch-text": { Component: RGBGlitchText, config: rgbGlitchTextConfig },
  "shimmer-sweep": { Component: ShimmerSweep, config: shimmerSweepConfig },
  "simulated-cursor": {
    Component: SimulatedCursor,
    config: simulatedCursorConfig,
  },
  "slot-machine-roll": {
    Component: SlotMachineRoll,
    config: slotMachineRollConfig,
  },
  "spatial-push": { Component: SpatialPush, config: spatialPushConfig },
  "spotlight-card": { Component: SpotlightCard, config: spotlightCardConfig },
  "spring-pop-in": { Component: SpringPopIn, config: springPopInConfig },
  "staggered-bento-grid": {
    Component: StaggeredBentoGrid,
    config: staggeredBentoGridConfig,
  },
  "staggered-fade-up": {
    Component: StaggeredFadeUp,
    config: staggeredFadeUpConfig,
  },
  "strikethrough-replace": {
    Component: StrikethroughReplace,
    config: strikethroughReplaceConfig,
  },
  "success-confetti": {
    Component: SuccessConfetti,
    config: successConfettiConfig,
  },
  "swipe-transition-wipe": {
    Component: SwipeTransitionWipe,
    config: swipeTransitionWipeConfig,
  },
  "terminal-simulator": {
    Component: TerminalSimulator,
    config: terminalSimulatorConfig,
  },
  "terminal-to-browser-deploy": {
    Component: TerminalToBrowserDeploy,
    config: terminalToBrowserDeployConfig,
  },
  "text-fade-replace": {
    Component: TextFadeReplace,
    config: textFadeReplaceConfig,
  },
  "toast-notification": {
    Component: ToastNotification,
    config: toastNotificationConfig,
  },
  "tool-menu-slide-in": {
    Component: ToolMenuSlideIn,
    config: toolMenuSlideInConfig,
  },
  "tracking-in": { Component: TrackingIn, config: trackingInConfig },
  typewriter: { Component: Typewriter, config: typewriterConfig },
  "visual-docs-snippet": {
    Component: VisualDocsSnippet,
    config: visualDocsSnippetConfig,
  },
  "zoom-through-transition": {
    Component: ZoomThroughTransition,
    config: zoomThroughTransitionConfig,
  },
};

// Append the shared controls (e.g. `speed`) to every component config so
// every animation in the customizer exposes the same baseline knobs.
for (const { config } of Object.values(registry)) {
  config.controls = { ...config.controls, ...SHARED_CONTROLS };
}

export default registry;
