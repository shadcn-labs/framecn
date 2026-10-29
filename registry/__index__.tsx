"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { RegistryComponent, RegistryEntry } from "@/lib/registry-types";
import { blurOutUpConfig } from "@/registry/bases/editframe/components/blur-out-up/config";
import { blurRevealConfig } from "@/registry/bases/editframe/components/blur-reveal/config";
import { bottomUpLettersConfig } from "@/registry/bases/editframe/components/bottom-up-letters/config";
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
import { chromaticAberrationWipeConfig } from "@/registry/bases/editframe/components/chromatic-aberration-wipe/config";
import { deviceMockupZoomConfig } from "@/registry/bases/editframe/components/device-mockup-zoom/config";
import { directionalWipeConfig } from "@/registry/bases/editframe/components/directional-wipe/config";
import { fadeThroughConfig } from "@/registry/bases/editframe/components/fade-through/config";
import { focusBlurResolveConfig } from "@/registry/bases/editframe/components/focus-blur-resolve/config";
import { frostedGlassWipeConfig } from "@/registry/bases/editframe/components/frosted-glass-wipe/config";
import { gridPixelateWipeConfig } from "@/registry/bases/editframe/components/grid-pixelate-wipe/config";
import { infiniteMarqueeConfig } from "@/registry/bases/editframe/components/infinite-marquee/config";
import { inlineHighlightConfig } from "@/registry/bases/editframe/components/inline-highlight/config";
import { kineticTypeMaskConfig } from "@/registry/bases/editframe/components/kinetic-type-mask/config";
import { lineByLineSlideConfig } from "@/registry/bases/editframe/components/line-by-line-slide/config";
import { markerHighlightConfig } from "@/registry/bases/editframe/components/marker-highlight/config";
import { maskRevealUpConfig } from "@/registry/bases/editframe/components/mask-reveal-up/config";
import { maskedSlideRevealConfig } from "@/registry/bases/editframe/components/masked-slide-reveal/config";
import { matrixDecodeConfig } from "@/registry/bases/editframe/components/matrix-decode/config";
import { microScaleFadeConfig } from "@/registry/bases/editframe/components/micro-scale-fade/config";
import { morphingModalConfig } from "@/registry/bases/editframe/components/morphing-modal/config";
import { nodeRevealConfig } from "@/registry/bases/editframe/components/node-reveal/config";
import { perCharacterRiseConfig } from "@/registry/bases/editframe/components/per-character-rise/config";
import { perWordCrossfadeConfig } from "@/registry/bases/editframe/components/per-word-crossfade/config";
import { perspectiveMarqueeConfig } from "@/registry/bases/editframe/components/perspective-marquee/config";
import { rgbGlitchTextConfig } from "@/registry/bases/editframe/components/rgb-glitch-text/config";
import { scaleDownFadeConfig } from "@/registry/bases/editframe/components/scale-down-fade/config";
import { sharedAxisYConfig } from "@/registry/bases/editframe/components/shared-axis-y/config";
import { sharedAxisZConfig } from "@/registry/bases/editframe/components/shared-axis-z/config";
import { shimmerSweepConfig } from "@/registry/bases/editframe/components/shimmer-sweep/config";
import { shortSlideRightConfig } from "@/registry/bases/editframe/components/short-slide-right/config";
import { slotMachineRollConfig } from "@/registry/bases/editframe/components/slot-machine-roll/config";
import { softBlurInConfig } from "@/registry/bases/editframe/components/soft-blur-in/config";
import { spatialPushConfig } from "@/registry/bases/editframe/components/spatial-push/config";
import { springScaleInConfig } from "@/registry/bases/editframe/components/spring-scale-in/config";
import { staggeredFadeUpConfig } from "@/registry/bases/editframe/components/staggered-fade-up/config";
import { strikethroughReplaceConfig } from "@/registry/bases/editframe/components/strikethrough-replace/config";
import { swipeTransitionWipeConfig } from "@/registry/bases/editframe/components/swipe-transition-wipe/config";
import { textFadeReplaceConfig } from "@/registry/bases/editframe/components/text-fade-replace/config";
import { topDownLettersConfig } from "@/registry/bases/editframe/components/top-down-letters/config";
import { trackingInConfig } from "@/registry/bases/editframe/components/tracking-in/config";
import { typewriterConfig } from "@/registry/bases/editframe/components/typewriter/config";
import { zoomThroughTransitionConfig } from "@/registry/bases/editframe/components/zoom-through-transition/config";
import proRegistry from "@/registry/pro/__index__";

const lazy = (loader: () => Promise<{ default: RegistryComponent }>) =>
  dynamic(loader, { ssr: false });

const registry: Record<string, RegistryEntry> = {
  // framecn Pro previews, synced from the private repo by scripts/sync-pro.mjs
  // into the gitignored registry/pro/ (empty without access).
  ...proRegistry,
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
  "chromatic-aberration-wipe": {
    Component: lazy(async () => {
      const { ChromaticAberrationWipe } =
        await import("@/registry/bases/editframe/components/chromatic-aberration-wipe");
      return { default: ChromaticAberrationWipe };
    }),
    config: chromaticAberrationWipeConfig,
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
  "grid-pixelate-wipe": {
    Component: lazy(async () => {
      const { GridPixelateWipe } =
        await import("@/registry/bases/editframe/components/grid-pixelate-wipe");
      return { default: GridPixelateWipe };
    }),
    config: gridPixelateWipeConfig,
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
  "line-by-line-slide": {
    Component: lazy(async () => {
      const { LineByLineSlide } =
        await import("@/registry/bases/editframe/components/line-by-line-slide");
      return { default: LineByLineSlide };
    }),
    config: lineByLineSlideConfig,
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
  "node-reveal": {
    Component: lazy(async () => {
      const { NodeReveal } =
        await import("@/registry/bases/editframe/components/node-reveal");
      return { default: NodeReveal };
    }),
    config: nodeRevealConfig,
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
  "spring-scale-in": {
    Component: lazy(async () => {
      const { SpringScaleIn } =
        await import("@/registry/bases/editframe/components/spring-scale-in");
      return { default: SpringScaleIn };
    }),
    config: springScaleInConfig,
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
  "swipe-transition-wipe": {
    Component: lazy(async () => {
      const { SwipeTransitionWipe } =
        await import("@/registry/bases/editframe/components/swipe-transition-wipe");
      return { default: SwipeTransitionWipe };
    }),
    config: swipeTransitionWipeConfig,
  },
  "text-fade-replace": {
    Component: lazy(async () => {
      const { TextFadeReplace } =
        await import("@/registry/bases/editframe/components/text-fade-replace");
      return { default: TextFadeReplace };
    }),
    config: textFadeReplaceConfig,
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
};

// Keep shared controls available for every preview customizer, unless a
// component opts out because it cannot honour them.
for (const entry of Object.values(registry)) {
  if (entry.config && !entry.config.omitSharedControls) {
    entry.config.controls = { ...entry.config.controls, ...SHARED_CONTROLS };
  }
}

export default registry;
