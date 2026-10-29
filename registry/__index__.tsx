"use client";

import dynamic from "next/dynamic";

import { SHARED_CONTROLS } from "@/lib/customizer-config";
import type { RegistryComponent, RegistryEntry } from "@/lib/registry-types";
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
import proRegistry from "@/registry/pro/__index__";

const lazy = (loader: () => Promise<{ default: RegistryComponent }>) =>
  dynamic(loader, { ssr: false });

const registry: Record<string, RegistryEntry> = {
  // framecn Pro previews, synced from the private repo by scripts/sync-pro.mjs
  // into the gitignored registry/pro/ (empty without access).
  ...proRegistry,
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
};

// Keep shared controls available for every preview customizer, unless a
// component opts out because it cannot honour them.
for (const entry of Object.values(registry)) {
  if (entry.config && !entry.config.omitSharedControls) {
    entry.config.controls = { ...entry.config.controls, ...SHARED_CONTROLS };
  }
}

export default registry;
