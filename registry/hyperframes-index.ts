export interface HyperframesEntry {
  name: string;
  src: string;
  title: string;
  description: string;
  category: string;
}

const hyperframesRegistry: Record<string, HyperframesEntry> = {
  "ai-generate-overlay": {
    category: "overlays",
    description: "AI generation progress overlay with animated elements",
    name: "ai-generate-overlay",
    src: "/hyperframes/ai-generate-overlay/index.html",
    title: "AI Generate Overlay",
  },
  "ai-generation-canvas": {
    category: "media",
    description: "Canvas showing AI image generation process",
    name: "ai-generation-canvas",
    src: "/hyperframes/ai-generation-canvas/index.html",
    title: "AI Generation Canvas",
  },
  "animated-bar-chart": {
    category: "charts",
    description: "Animated bar chart with configurable data",
    name: "animated-bar-chart",
    src: "/hyperframes/animated-bar-chart/index.html",
    title: "Animated Bar Chart",
  },
  "animated-line-chart": {
    category: "charts",
    description: "Animated line chart with drawing effect",
    name: "animated-line-chart",
    src: "/hyperframes/animated-line-chart/index.html",
    title: "Animated Line Chart",
  },
  "blur-reveal": {
    category: "transitions",
    description: "Content revealed through progressive blur-to-sharp",
    name: "blur-reveal",
    src: "/hyperframes/blur-reveal/index.html",
    title: "Blur Reveal",
  },
  "bounding-box-selector": {
    category: "ui",
    description: "Interactive bounding box selection overlay",
    name: "bounding-box-selector",
    src: "/hyperframes/bounding-box-selector/index.html",
    title: "Bounding Box Selector",
  },
  "browser-flow": {
    category: "marketing",
    description: "Browser window flow/navigation animation",
    name: "browser-flow",
    src: "/hyperframes/browser-flow/index.html",
    title: "Browser Flow",
  },
  "brush-stroke-simulator": {
    category: "overlays",
    description: "Simulated brush stroke drawing effect",
    name: "brush-stroke-simulator",
    src: "/hyperframes/brush-stroke-simulator/index.html",
    title: "Brush Stroke Simulator",
  },
  "changelog-bite": {
    category: "ui",
    description: "Changelog entry with animated reveal of changes",
    name: "changelog-bite",
    src: "/hyperframes/changelog-bite/index.html",
    title: "Changelog Bite",
  },
  "chat-to-preview-layout": {
    category: "layouts",
    description: "Chat UI that transitions to a preview layout",
    name: "chat-to-preview-layout",
    src: "/hyperframes/chat-to-preview-layout/index.html",
    title: "Chat to Preview Layout",
  },
  "chromatic-aberration-wipe": {
    category: "transitions",
    description: "Wipe transition with RGB channel split",
    name: "chromatic-aberration-wipe",
    src: "/hyperframes/chromatic-aberration-wipe/index.html",
    title: "Chromatic Aberration Wipe",
  },
  "code-accordion": {
    category: "code",
    description: "Expandable code snippet accordion",
    name: "code-accordion",
    src: "/hyperframes/code-accordion/index.html",
    title: "Code Accordion",
  },
  "cursor-flow": {
    category: "cursor",
    description: "Flowing cursor trail animation",
    name: "cursor-flow",
    src: "/hyperframes/cursor-flow/index.html",
    title: "Cursor Flow",
  },
  "dashboard-populate": {
    category: "charts",
    description: "Dashboard UI that populates with animated data widgets",
    name: "dashboard-populate",
    src: "/hyperframes/dashboard-populate/index.html",
    title: "Dashboard Populate",
  },
  "data-flow-pipes": {
    category: "charts",
    description: "Animated data flow visualization with connecting pipes",
    name: "data-flow-pipes",
    src: "/hyperframes/data-flow-pipes/index.html",
    title: "Data Flow Pipes",
  },
  "device-mockup-zoom": {
    category: "media",
    description: "Device mockup with zoom into screen content",
    name: "device-mockup-zoom",
    src: "/hyperframes/device-mockup-zoom/index.html",
    title: "Device Mockup Zoom",
  },
  "directional-wipe": {
    category: "transitions",
    description: "Directional wipe transition with customizable angle",
    name: "directional-wipe",
    src: "/hyperframes/directional-wipe/index.html",
    title: "Directional Wipe",
  },
  "drag-and-drop-flow": {
    category: "cursor",
    description: "Drag and drop interaction flow visualization",
    name: "drag-and-drop-flow",
    src: "/hyperframes/drag-and-drop-flow/index.html",
    title: "Drag and Drop Flow",
  },
  "dynamic-grid": {
    category: "layouts",
    description: "Responsive grid with animated cell sizing",
    name: "dynamic-grid",
    src: "/hyperframes/dynamic-grid/index.html",
    title: "Dynamic Grid",
  },
  "ecosystem-constellation": {
    category: "marketing",
    description: "Ecosystem/partner constellation visualization",
    name: "ecosystem-constellation",
    src: "/hyperframes/ecosystem-constellation/index.html",
    title: "Ecosystem Constellation",
  },
  "frosted-glass-wipe": {
    category: "transitions",
    description: "Wipe transition with frosted glass blur effect",
    name: "frosted-glass-wipe",
    src: "/hyperframes/frosted-glass-wipe/index.html",
    title: "Frosted Glass Wipe",
  },
  "glass-code-block": {
    category: "code",
    description: "Frosted glass styled code block",
    name: "glass-code-block",
    src: "/hyperframes/glass-code-block/index.html",
    title: "Glass Code Block",
  },
  "hero-device-assemble": {
    category: "marketing",
    description: "Hero section with device mockup assembly animation",
    name: "hero-device-assemble",
    src: "/hyperframes/hero-device-assemble/index.html",
    title: "Hero Device Assemble",
  },
  "image-expand-to-fullscreen": {
    category: "transitions",
    description: "Image expands from thumbnail to fill the screen",
    name: "image-expand-to-fullscreen",
    src: "/hyperframes/image-expand-to-fullscreen/index.html",
    title: "Image Expand to Fullscreen",
  },
  "infinite-bento-pan": {
    category: "layouts",
    description: "Infinite panning bento-style grid layout",
    name: "infinite-bento-pan",
    src: "/hyperframes/infinite-bento-pan/index.html",
    title: "Infinite Bento Pan",
  },
  "infinite-marquee": {
    category: "marketing",
    description: "Infinite scrolling marquee text/images",
    name: "infinite-marquee",
    src: "/hyperframes/infinite-marquee/index.html",
    title: "Infinite Marquee",
  },
  "inline-highlight": {
    category: "text",
    description: "Inline text highlighting with animated marker effect",
    name: "inline-highlight",
    src: "/hyperframes/inline-highlight/index.html",
    title: "Inline Highlight",
  },
  "kinetic-type-mask": {
    category: "text",
    description: "Kinetic typography with mask-based reveal animations",
    name: "kinetic-type-mask",
    src: "/hyperframes/kinetic-type-mask/index.html",
    title: "Kinetic Type Mask",
  },
  "landing-code-showcase": {
    category: "marketing",
    description: "Landing page section showcasing code examples",
    name: "landing-code-showcase",
    src: "/hyperframes/landing-code-showcase/index.html",
    title: "Landing Code Showcase",
  },
  "live-code-compilation": {
    category: "code",
    description: "Live code compilation/build progress visualization",
    name: "live-code-compilation",
    src: "/hyperframes/live-code-compilation/index.html",
    title: "Live Code Compilation",
  },
  "marker-highlight": {
    category: "text",
    description: "Hand-drawn style marker highlight animation on text",
    name: "marker-highlight",
    src: "/hyperframes/marker-highlight/index.html",
    title: "Marker Highlight",
  },
  "masked-slide-reveal": {
    category: "transitions",
    description: "Content revealed through a sliding mask/clip path",
    name: "masked-slide-reveal",
    src: "/hyperframes/masked-slide-reveal/index.html",
    title: "Masked Slide Reveal",
  },
  "matrix-decode": {
    category: "text",
    description: "Matrix-style character decode/scramble text effect",
    name: "matrix-decode",
    src: "/hyperframes/matrix-decode/index.html",
    title: "Matrix Decode",
  },
  "mesh-gradient-bg": {
    category: "overlays",
    description: "Animated mesh gradient background",
    name: "mesh-gradient-bg",
    src: "/hyperframes/mesh-gradient-bg/index.html",
    title: "Mesh Gradient BG",
  },
  "morphing-modal": {
    category: "ui",
    description: "Modal that morphs shape/size from a trigger element",
    name: "morphing-modal",
    src: "/hyperframes/morphing-modal/index.html",
    title: "Morphing Modal",
  },
  "perspective-marquee": {
    category: "marketing",
    description: "Marquee with 3D perspective transform",
    name: "perspective-marquee",
    src: "/hyperframes/perspective-marquee/index.html",
    title: "Perspective Marquee",
  },
  "pipeline-journey": {
    category: "marketing",
    description: "Pipeline/CI-CD journey visualization",
    name: "pipeline-journey",
    src: "/hyperframes/pipeline-journey/index.html",
    title: "Pipeline Journey",
  },
  "pricing-tier-focus": {
    category: "marketing",
    description: "Pricing tier comparison with focus animation",
    name: "pricing-tier-focus",
    src: "/hyperframes/pricing-tier-focus/index.html",
    title: "Pricing Tier Focus",
  },
  "product-launch-trailer": {
    category: "marketing",
    description: "Product launch trailer with animated scenes",
    name: "product-launch-trailer",
    src: "/hyperframes/product-launch-trailer/index.html",
    title: "Product Launch Trailer",
  },
  "progress-steps": {
    category: "ui",
    description: "Animated multi-step progress indicator",
    name: "progress-steps",
    src: "/hyperframes/progress-steps/index.html",
    title: "Progress Steps",
  },
  "pulsing-indicator": {
    category: "ui",
    description: "Pulsing dot/badge indicator with configurable rhythm",
    name: "pulsing-indicator",
    src: "/hyperframes/pulsing-indicator/index.html",
    title: "Pulsing Indicator",
  },
  "rgb-glitch-text": {
    category: "text",
    description: "RGB channel glitch effect on text",
    name: "rgb-glitch-text",
    src: "/hyperframes/rgb-glitch-text/index.html",
    title: "RGB Glitch Text",
  },
  "simulated-cursor": {
    category: "cursor",
    description: "Simulated mouse cursor movement",
    name: "simulated-cursor",
    src: "/hyperframes/simulated-cursor/index.html",
    title: "Simulated Cursor",
  },
  "slot-machine-roll": {
    category: "marketing",
    description: "Slot machine style number/text rolling animation",
    name: "slot-machine-roll",
    src: "/hyperframes/slot-machine-roll/index.html",
    title: "Slot Machine Roll",
  },
  "spatial-push": {
    category: "transitions",
    description: "3D spatial push transition with depth perspective",
    name: "spatial-push",
    src: "/hyperframes/spatial-push/index.html",
    title: "Spatial Push",
  },
  "spotlight-card": {
    category: "media",
    description: "Card with spotlight/glow effect following cursor",
    name: "spotlight-card",
    src: "/hyperframes/spotlight-card/index.html",
    title: "Spotlight Card",
  },
  "spring-pop-in": {
    category: "ui",
    description: "Spring-physics based pop-in animation for elements",
    name: "spring-pop-in",
    src: "/hyperframes/spring-pop-in/index.html",
    title: "Spring Pop In",
  },
  "staggered-bento-grid": {
    category: "layouts",
    description: "Bento grid with staggered reveal animations",
    name: "staggered-bento-grid",
    src: "/hyperframes/staggered-bento-grid/index.html",
    title: "Staggered Bento Grid",
  },
  "staggered-fade-up": {
    category: "layouts",
    description: "Staggered fade-up animation for list/grid items",
    name: "staggered-fade-up",
    src: "/hyperframes/staggered-fade-up/index.html",
    title: "Staggered Fade Up",
  },
  "strikethrough-replace": {
    category: "text",
    description: "Strikethrough animation that replaces old text with new",
    name: "strikethrough-replace",
    src: "/hyperframes/strikethrough-replace/index.html",
    title: "Strikethrough Replace",
  },
  "success-confetti": {
    category: "overlays",
    description: "Confetti celebration animation",
    name: "success-confetti",
    src: "/hyperframes/success-confetti/index.html",
    title: "Success Confetti",
  },
  "swipe-transition-wipe": {
    category: "transitions",
    description: "Swipe-style wipe mimicking touch gesture",
    name: "swipe-transition-wipe",
    src: "/hyperframes/swipe-transition-wipe/index.html",
    title: "Swipe Transition Wipe",
  },
  "terminal-simulator": {
    category: "code",
    description: "Simulated terminal with typed commands and output",
    name: "terminal-simulator",
    src: "/hyperframes/terminal-simulator/index.html",
    title: "Terminal Simulator",
  },
  "terminal-to-browser-deploy": {
    category: "marketing",
    description: "Terminal deploy command transitioning to browser result",
    name: "terminal-to-browser-deploy",
    src: "/hyperframes/terminal-to-browser-deploy/index.html",
    title: "Terminal to Browser Deploy",
  },
  "text-fade-replace": {
    category: "text",
    description: "Smooth fade-out/fade-in text replacement",
    name: "text-fade-replace",
    src: "/hyperframes/text-fade-replace/index.html",
    title: "Text Fade Replace",
  },
  "toast-notification": {
    category: "ui",
    description: "Animated toast notification with dismiss",
    name: "toast-notification",
    src: "/hyperframes/toast-notification/index.html",
    title: "Toast Notification",
  },
  "tool-menu-slide-in": {
    category: "ui",
    description: "Slide-in tool menu panel",
    name: "tool-menu-slide-in",
    src: "/hyperframes/tool-menu-slide-in/index.html",
    title: "Tool Menu Slide In",
  },
  "tracking-in": {
    category: "text",
    description: "Letter-spacing animation that tracks text in",
    name: "tracking-in",
    src: "/hyperframes/tracking-in/index.html",
    title: "Tracking In",
  },
  typewriter: {
    category: "text",
    description: "Classic typewriter character-by-character reveal",
    name: "typewriter",
    src: "/hyperframes/typewriter/index.html",
    title: "Typewriter",
  },
  "visual-docs-snippet": {
    category: "code",
    description: "Visual documentation snippet with highlighted code",
    name: "visual-docs-snippet",
    src: "/hyperframes/visual-docs-snippet/index.html",
    title: "Visual Docs Snippet",
  },
  "volumetric-rays": {
    category: "overlays",
    description: "Volumetric light rays/god rays overlay",
    name: "volumetric-rays",
    src: "/hyperframes/volumetric-rays/index.html",
    title: "Volumetric Rays",
  },
  "zoom-through-transition": {
    category: "transitions",
    description: "Zoom-in/out transition that passes through content",
    name: "zoom-through-transition",
    src: "/hyperframes/zoom-through-transition/index.html",
    title: "Zoom Through Transition",
  },
};

export default hyperframesRegistry;

export function getHyperframesEntry(
  name: string
): HyperframesEntry | undefined {
  return hyperframesRegistry[name];
}

export function getAllHyperframesEntries(): HyperframesEntry[] {
  return Object.values(hyperframesRegistry);
}

export function getHyperframesByCategory(category: string): HyperframesEntry[] {
  return Object.values(hyperframesRegistry).filter(
    (entry) => entry.category === category
  );
}

export function getHyperframesCategories(): string[] {
  const categories = new Set<string>();
  for (const entry of Object.values(hyperframesRegistry)) {
    categories.add(entry.category);
  }
  return [...categories].toSorted();
}
