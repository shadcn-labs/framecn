"use client";

import { LineChart } from "echarts/charts";
import type { LineSeriesOption } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import type {
  DataZoomComponentOption,
  GridComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { motion, useReducedMotion } from "motion/react";
import {
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, FC, ReactElement, ReactNode } from "react";

import {
  Brush,
  buildBrushDataZoom,
  syncBrushOverlay,
} from "@/components/evilcharts/ui/echarts-brush";
import type {
  BrushGeometry,
  BrushOverlayElements,
  BrushProps,
  BrushRange,
} from "@/components/evilcharts/ui/echarts-brush";
import {
  DEFAULT_ECHARTS_RENDERER,
  buildChartCss,
  flattenColor,
  getColorsCount,
  resolveColors,
  seriesPaint,
  withAlpha,
} from "@/components/evilcharts/ui/echarts-chart";
import type {
  ChartConfig,
  EChartsRenderer,
  ResolvedColors,
} from "@/components/evilcharts/ui/echarts-chart";
import {
  dotItemStyle,
  dotStyle,
  sampleGradient,
} from "@/components/evilcharts/ui/echarts-dot";
import type {
  DotItemStyleOption,
  DotStyle,
  DotVariant,
} from "@/components/evilcharts/ui/echarts-dot";
import { LegendOverlay } from "@/components/evilcharts/ui/echarts-legend";
import type { LegendVariant } from "@/components/evilcharts/ui/echarts-legend";
import {
  tooltipBaseOption,
  tooltipIndicatorHtml,
  tooltipRow,
  tooltipShell,
} from "@/components/evilcharts/ui/echarts-tooltip";
import type {
  TooltipPosition,
  TooltipRoundness,
  TooltipVariant,
} from "@/components/evilcharts/ui/echarts-tooltip";

// Re-export the shared types that were previously declared inline here, so
// existing consumers/examples keep importing them from the chart module.
export type {
  ChartConfig,
  EChartsRenderer,
} from "@/components/evilcharts/ui/echarts-chart";
export type { DotVariant } from "@/components/evilcharts/ui/echarts-dot";
export type { LegendVariant } from "@/components/evilcharts/ui/echarts-legend";
export type {
  TooltipPosition,
  TooltipRoundness,
  TooltipVariant,
} from "@/components/evilcharts/ui/echarts-tooltip";

// Modular registration keeps the bundle lean — only the pieces this chart needs.
// `DataZoomComponent` bundles both the slider (brush footer) and inside (wheel/drag)
// zoom. The brush's frame/handles/labels are raw zrender elements, not the
// graphic component — see syncBrushOverlay. No GraphicComponent is registered.
echarts.use([LineChart, GridComponent, TooltipComponent, DataZoomComponent]);

type EChartsInstance = ReturnType<typeof echarts.init>;

// The exact option surface this chart uses — line series, grid, tooltip, and
// dataZoom, plus the axis options they pull in as dependencies. Narrower than
// echarts' full EChartsOption, so a misspelled key fails the compile instead of
// silently reaching setOption.
type EChartsOption = ComposeOption<
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | DataZoomComponentOption
>;

// Single-entry views of the composed option's array-or-single fields — the
// modular entry points don't export the axis option types directly.
type ArrayItem<T> = T extends readonly (infer U)[] ? U : T;
type XAxisOption = ArrayItem<NonNullable<EChartsOption["xAxis"]>>;
type YAxisOption = ArrayItem<NonNullable<EChartsOption["yAxis"]>>;

// DotItemStyleOption now lives in @/registry/ui/echarts-dot and is imported at
// the top of this file.

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// default series stroke — <Line strokeWidth> overrides it
const STROKE_WIDTH = 0.8;
// shimmer loop, in milliseconds
const LOADING_ANIMATION_DURATION = 2000;
// intro draw-in length, in milliseconds
const REVEAL_DURATION = 1000;
// NOTE: the intro draw-in runs ECharts' RAW default entrance animation. Custom
// easing was tried and abandoned in the area twin — ECharts hardcodes the
// line-entrance clip to linear and ignores animationEasing at every level.
const LOADING_DEFAULT_POINTS = 14;
// Buffer line: the last segment renders as this dash while the rest stays solid,
// echoing the Recharts twin's 4px dash / 3px gap forecast tail.
const BUFFER_DASH: [number, number] = [4, 3];

// <Line glowing> glow. Canvas has no SVG blur filter over a whole shape, so the
// glow is built from SILENT, stacked copies of the line laid UNDER the real one.
//
// The layers are all the SAME NARROW WIDTH on purpose. A wide translucent stroke
// has a HARD edge, so widening each copy (the obvious approach) paints concentric
// contour rings, not a glow — no number of layers hides it, because every layer
// contributes another visible boundary. Here each copy stays hidden beneath the
// real line and the visible halo comes entirely from its canvas `shadowBlur`,
// which is a true gaussian: edgeless by construction, and summing several at
// different radii stays perfectly smooth.
//
// The trade: a canvas shadow is a single flat color, so the halo is cast in the
// gradient's mid tone (`sampleGradient(slots, 0.5)`) rather than tracking the
// stroke's color along its length. The stroke copies themselves still carry the
// real gradient, so the bright core reads correctly; only the soft bloom is one
// hue. Smooth beats hue-accurate here. `symbolPad` grows the glow disc under each
// visible dot so haloed markers bloom too.
const GLOW_LAYERS: {
  width: number;
  opacity: number;
  blur: number;
  symbolPad: number;
}[] = [
  { blur: 5, opacity: 0.9, symbolPad: 2, width: 2 },
  { blur: 12, opacity: 0.6, symbolPad: 6, width: 2 },
  { blur: 24, opacity: 0.38, symbolPad: 11, width: 2 },
  { blur: 42, opacity: 0.22, symbolPad: 16, width: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Theme knobs — every neutral line in the chart draws from these. Base colors
// come from the consumer's CSS tokens (resolved from the live DOM), so only the
// opacity factors live here. Factors MULTIPLY the token's own alpha — a border
// token that is already 10%-white stays subtle. Tune here, not in the builder.
// ─────────────────────────────────────────────────────────────────────────────
// Recharts draws its grid at border/50, but SVG dashes render pixel-crisp while
// canvas at 2× DPR spreads a 1px line across device pixels — roughly halving
// perceived intensity. Using the border token's full alpha lands both engines at
// the same apparent brightness.
// dashed y-axis split lines, × border alpha
const GRID_LINE_OPACITY = 1;
// tooltip cursor line, × border alpha
const AXIS_POINTER_OPACITY = 1;
// The skeleton is CLIPPED to a small sweeping window — only the stroke section
// inside it exists, everything outside is fully transparent, like a clip-path
// sliding across the chart.
// outline inside the window, × foreground alpha
const LOADING_STROKE_OPACITY = 0.5;
// window half-width, fraction of chart width
const LOADING_SHIMMER_BAND = 0.2;
// eased edge softening of the clip window
const LOADING_SHIMMER_FEATHER = 0.2;
// mini-chart series stroke (evil-brush "line" variant)
const BRUSH_STROKE_OPACITY = 0.5;
// selected-range wash — evil-brush draws none
const BRUSH_FILLER_OPACITY = 0;

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type StrokeVariant = "solid" | "dashed" | "animated-dashed";
export type LineAnimationType =
  | "none"
  | "left-to-right"
  | "right-to-left"
  | "center-out"
  | "edges-in";
export type CurveType =
  | "linear"
  | "smooth"
  | "bump"
  | "monotone"
  | "monotoneX"
  | "monotoneY"
  | "natural"
  | "step";
// DotVariant, TooltipVariant, TooltipRoundness, LegendVariant, and ChartConfig
// now live in the shared @/registry/ui/echarts/* modules and are imported +
// re-exported at the top of this file.

export interface EChartsLineChartProps<TData extends Record<string, unknown>> {
  // rows rendered by the chart
  data: TData[];
  // series colors + labels
  config: ChartConfig;
  // rendering engine — defaults to canvas
  renderer?: EChartsRenderer;
  // x category key — falls back to the <XAxis> dataKey / first free column
  xDataKey?: keyof TData & string;
  // extra classes for the chart container
  className?: string;
  // default curve interpolation each <Line> inherits
  curveType?: CurveType;
  // master switch for the intro draw-in — false renders instantly
  animation?: boolean;
  // default intro reveal (first <Line> overrides)
  animationType?: LineAnimationType;
  // hovering a series dims the others, like a temporary selection
  enableHoverHighlight?: boolean;
  // hovering colors each line up to the pointer's x and mutes the rest
  enableHoverReveal?: boolean;
  // series selected on first render
  defaultSelectedDataKey?: string | null;
  // fires when the selected series changes
  onSelectionChange?: (key: string | null) => void;
  // shows the animated loading skeleton
  isLoading?: boolean;
  // number of points in the loading skeleton
  loadingPoints?: number;
  // escape hatch merged over the built ECharts option
  chartOptions?: Record<string, unknown>;
  // declarative config — <Line>, <XAxis>, <Grid>, <Tooltip>, <Legend>, <Brush>, …
  children?: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Composible parts — DECLARATIVE CONFIG. Every part renders `null`; the root
// walks `children` by reference (child.type === Line, …) to collect its props.
// Presence semantics mirror the Recharts twin: omit a child and that part does
// not render. These are never mounted into the tree — they only carry props.
// ─────────────────────────────────────────────────────────────────────────────

export interface LineProps {
  // series key — must exist on the data + config
  dataKey: string;
  // stroke style for this line
  strokeVariant?: StrokeVariant;
  // stroke thickness in pixels for this line
  strokeWidth?: number;
  // curve interpolation — falls back to the root curveType
  curveType?: CurveType;
  // intro reveal — first line drives the wrapper wipe
  animationType?: LineAnimationType;
  // join segments across null/missing values
  connectNulls?: boolean;
  // lets this line be selected by clicking it
  isClickable?: boolean;
  // applies a soft outer glow to this line
  glowing?: boolean;
  // renders this line's last segment as a dashed buffer
  enableBufferLine?: boolean;
  // optional <Dot> and <ActiveDot> config
  children?: ReactNode;
}

/**
 * A single line series. Declares its own stroke/curve/glow/clickability and,
 * optionally, resting/active point markers via composed <Dot> / <ActiveDot>.
 * Renders nothing — the root reads these props to build the ECharts series.
 */
const Line: FC<LineProps> = () => null;

export interface DotProps {
  // visual style of the point marker
  variant?: DotVariant;
}

/** Declares the resting point marker for the enclosing <Line>. Renders nothing. */
const Dot: FC<DotProps> = () => null;

/** Declares the hovered/active point marker for the enclosing <Line>. Renders nothing. */
const ActiveDot: FC<DotProps> = () => null;

export interface XAxisProps {
  // x category key — overrides the root xDataKey
  dataKey?: string;
  // Category-axis values are always stringified, so the formatter sees a string —
  // letting examples share `(value) => value.substring(0, 3)` with the Recharts twin.
  // formats x tick labels
  tickFormatter?: (value: string, index: number) => string;
  // axis title, centered below the tick labels
  label?: string;
  // hides the tick dots beside this axis's labels
  hideDots?: boolean;
}

/** Presence shows the x-axis category labels. Renders nothing. */
const XAxis: FC<XAxisProps> = () => null;

export interface YAxisProps {
  // reserved for parity with the Recharts twin
  dataKey?: string;
  // formats y tick labels
  tickFormatter?: (value: number, index: number) => string;
  // axis title, rotated alongside the tick labels
  label?: string;
  // hides the tick dots beside this axis's labels
  hideDots?: boolean;
}

/** Presence shows the y value axis. Renders nothing. */
const YAxis: FC<YAxisProps> = () => null;

/** Presence shows the dashed horizontal split lines. Renders nothing. */
const Grid: FC = () => null;

export interface TooltipProps {
  // visual style of the tooltip surface
  variant?: TooltipVariant;
  // border-radius of the tooltip
  roundness?: TooltipRoundness;
  // whether the vertical cursor line follows the pointer
  cursor?: boolean;
  // "variable" follows both axes (default); "fixed" pins the tooltip near the top and tracks the pointer's X
  position?: TooltipPosition;
}

/** Presence enables the hover tooltip. Renders nothing. */
const Tooltip: FC<TooltipProps> = () => null;

export interface LegendProps {
  // visual style of the legend indicators
  variant?: LegendVariant;
  // horizontal placement
  align?: "left" | "center" | "right";
  // vertical placement
  verticalAlign?: "top" | "middle" | "bottom";
  // lets each entry toggle selection of its series
  isClickable?: boolean;
}

/** Presence enables the HTML legend overlay. Renders nothing. */
const Legend: FC<LegendProps> = () => null;

// ─────────────────────────────────────────────────────────────────────────────
// Children collection — walk the declarative config into plain objects the
// option builder consumes. <Dot> / <ActiveDot> are read from each <Line>'s own
// children; a missing dot child means that marker does not render.
// ─────────────────────────────────────────────────────────────────────────────

interface LineSeriesConfig {
  dataKey: string;
  strokeVariant: StrokeVariant;
  strokeWidth: number;
  curveType?: CurveType;
  animationType?: LineAnimationType;
  connectNulls: boolean;
  isClickable: boolean;
  glowing: boolean;
  enableBufferLine: boolean;
  // "none" when no <Dot> child is present
  dotVariant: DotVariant;
  // "none" when no <ActiveDot> child is present
  activeDotVariant: DotVariant;
}

interface XAxisSlot {
  present: boolean;
  dataKey?: string;
  tickFormatter?: (value: string, index: number) => string;
  label?: string;
  hideDots: boolean;
}
interface YAxisSlot {
  present: boolean;
  dataKey?: string;
  tickFormatter?: (value: number, index: number) => string;
  label?: string;
  hideDots: boolean;
}
interface TooltipSlot {
  present: boolean;
  variant: TooltipVariant;
  roundness: TooltipRoundness;
  cursor: boolean;
  position: TooltipPosition;
}
interface LegendSlot {
  present: boolean;
  variant: LegendVariant;
  align: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  isClickable: boolean;
}
interface BrushSlot {
  // a <Brush> child was passed — replaces the old showBrush prop
  present: boolean;
  height?: number;
  formatLabel?: (value: string, index: number) => string;
  onChange?: (range: { startIndex: number; endIndex: number }) => void;
}

interface CollectedConfig {
  lines: LineSeriesConfig[];
  xAxis: XAxisSlot;
  yAxis: YAxisSlot;
  showGrid: boolean;
  tooltip: TooltipSlot;
  legend: LegendSlot;
  brush: BrushSlot;
}

// Walk slot collections in authored order without rendering their components.
// Fragments are transparent; other elements keep their own children scoped to
// that slot (in particular, Dot and ActiveDot belong to their enclosing Line).
const forEachChartElement = (
  children: ReactNode,
  visit: (child: ReactElement) => void
): void => {
  if (isValidElement<{ children?: ReactNode }>(children)) {
    if (children.type === Fragment) {
      forEachChartElement(children.props.children, visit);
    } else {
      visit(children);
    }
    return;
  }
  if (typeof children !== "object" || children === null) {
    return;
  }
  if (Symbol.iterator in children) {
    for (const child of children as Iterable<ReactNode>) {
      forEachChartElement(child, visit);
    }
    return;
  }
  // Portals are valid React children, but do not declare chart slots.
  if (
    "$$typeof" in children &&
    children.$$typeof === Symbol.for("react.portal")
  ) {
    return;
  }
  throw new Error(
    `Objects are not valid as a React child (found: object with keys {${Object.keys(children).join(", ")}}). If you meant to render a collection of children, use an array instead.`
  );
};

const collectLineConfig = (props: LineProps): LineSeriesConfig => {
  let dotVariant: DotVariant = "none";
  let activeDotVariant: DotVariant = "none";
  forEachChartElement(props.children, (dotChild) => {
    if (dotChild.type === Dot) {
      dotVariant = (dotChild.props as DotProps).variant ?? "default";
    } else if (dotChild.type === ActiveDot) {
      activeDotVariant = (dotChild.props as DotProps).variant ?? "default";
    }
  });
  return {
    activeDotVariant,
    animationType: props.animationType,
    connectNulls: props.connectNulls ?? false,
    curveType: props.curveType,
    dataKey: props.dataKey,
    dotVariant,
    enableBufferLine: props.enableBufferLine ?? false,
    glowing: props.glowing ?? false,
    isClickable: props.isClickable ?? false,
    // The Recharts twin defaults a <Line> to a solid stroke (its <Area>
    // defaults to dashed — a divergence intentionally preserved here).
    strokeVariant: props.strokeVariant ?? "solid",
    strokeWidth: props.strokeWidth ?? STROKE_WIDTH,
  };
};

const collectConfig = (children: ReactNode): CollectedConfig => {
  const lines: LineSeriesConfig[] = [];
  let xAxis: XAxisSlot = { hideDots: false, present: false };
  let yAxis: YAxisSlot = { hideDots: false, present: false };
  let showGrid = false;
  let tooltip: TooltipSlot = {
    cursor: true,
    position: "variable",
    present: false,
    roundness: "lg",
    variant: "default",
  };
  let legend: LegendSlot = {
    align: "right",
    isClickable: false,
    present: false,
    variant: "rounded-square",
    verticalAlign: "top",
  };
  let brush: BrushSlot = { present: false };

  forEachChartElement(children, (child) => {
    const { type } = child;

    if (type === Line) {
      lines.push(collectLineConfig(child.props as LineProps));
    } else if (type === XAxis) {
      const props = child.props as XAxisProps;
      xAxis = {
        dataKey: props.dataKey,
        hideDots: props.hideDots ?? false,
        label: props.label,
        present: true,
        tickFormatter: props.tickFormatter,
      };
    } else if (type === YAxis) {
      const props = child.props as YAxisProps;
      yAxis = {
        dataKey: props.dataKey,
        hideDots: props.hideDots ?? false,
        label: props.label,
        present: true,
        tickFormatter: props.tickFormatter,
      };
    } else if (type === Grid) {
      showGrid = true;
    } else if (type === Tooltip) {
      const props = child.props as TooltipProps;
      tooltip = {
        cursor: props.cursor ?? true,
        position: props.position ?? "variable",
        present: true,
        roundness: props.roundness ?? "lg",
        variant: props.variant ?? "default",
      };
    } else if (type === Legend) {
      const props = child.props as LegendProps;
      legend = {
        align: props.align ?? "right",
        isClickable: props.isClickable ?? false,
        present: true,
        variant: props.variant ?? "rounded-square",
        verticalAlign: props.verticalAlign ?? "top",
      };
    } else if (type === Brush) {
      const props = child.props as BrushProps;
      brush = {
        formatLabel: props.formatLabel,
        height: props.height,
        onChange: props.onChange,
        present: true,
      };
    }
  });

  return { brush, legend, lines, showGrid, tooltip, xAxis, yAxis };
};

// Color plumbing (ChartConfig, getColorsCount, distributeColors, buildChartCss,
// normalizeColor, withAlpha, ResolvedColors, resolveColors, seriesPaint) now
// lives in @/registry/ui/echarts-chart and is imported at the top of this file.
// Dot helpers (DotVariant, DotItemStyleOption, DotStyle, DOT_SIZES, dotItemStyle,
// dotStyle, sampleGradient) live in @/registry/ui/echarts-dot.

// Builds the stacked glow overlay series for one <Line glowing> (see
// GLOW_LAYERS). Each copy is silent, tooltip-less, and z-ordered beneath the real
// line, so the widening low-alpha gradient strokes read as a soft colored blur
// that tracks the series' gradient exactly like the stroke does. When the line
// shows resting dots, each copy also draws an oversized faint symbol — coloured
// per-datum via sampleGradient — so the markers bloom too. `selectionDim` fades
// the whole glow with its parent when another series is selected; the
// emphasis/blur styles let it focus/dim WITH its parent under
// enableHoverHighlight (the root dispatch-links these ids — see companionIdsByKey).
const buildGlowSeries = (params: {
  key: string;
  paint: string | echarts.graphic.LinearGradient;
  slots: string[];
  values: (number | null)[];
  curve: { smooth: boolean; step: "middle" | false };
  connectNulls: boolean;
  z: number;
  selectionDim: number;
  dotSize: number;
}): LineSeriesOption[] => {
  const {
    key,
    paint,
    slots,
    values,
    curve,
    connectNulls,
    z,
    selectionDim,
    dotSize,
  } = params;
  const multiColor = slots.length > 1;
  const base = slots[0] ?? "rgba(120, 120, 120, 1)";
  const showDots = dotSize > 0;

  return GLOW_LAYERS.map((layer, i): LineSeriesOption => {
    const glowOpacity = layer.opacity * selectionDim;
    const blurOpacity = glowOpacity * 0.3;
    // Per-datum halo colours so a gradient glow tints each dot at its own
    // x-position, matching sampleGradient on the real dots.
    const glowData: LinePoint[] =
      !multiColor || !showDots
        ? values
        : values.map((value, idx): LinePoint => {
            if (value === null) {
              return null;
            }
            const t = values.length > 1 ? idx / (values.length - 1) : 0;
            const color = sampleGradient(slots, t);
            return {
              emphasis: { itemStyle: { color, opacity: glowOpacity } },
              itemStyle: { color, opacity: glowOpacity },
              value,
            };
          });

    return {
      blur: {
        itemStyle: { opacity: blurOpacity },
        lineStyle: { opacity: blurOpacity },
      },
      connectNulls,
      data: glowData,
      // Focus/dim WITH the parent line: on the parent's hover the root highlights
      // these ids (emphasis → normal glow); when another series is hovered the
      // parent's focus:"series" blurs these to a fainter still.
      emphasis: {
        focus: "none",
        itemStyle: { opacity: glowOpacity },
        lineStyle: { opacity: glowOpacity },
        scale: false,
      },
      id: `__glow-${i}-${key}`,
      itemStyle: multiColor
        ? { opacity: glowOpacity }
        : { color: base, opacity: glowOpacity },
      lineStyle: {
        cap: "round",
        color: paint,
        join: "round",
        opacity: glowOpacity,
        // Feathers this layer's edge so the stack reads as one smooth falloff
        // rather than concentric bands (see GLOW_LAYERS).
        shadowBlur: layer.blur,
        // Full-alpha shadow color: the element's own `opacity` above already
        // scales its shadow, so pre-dimming here squares the alpha and washes
        // the halo out.
        shadowColor: sampleGradient(slots, 0.5),
        width: layer.width,
      },
      showSymbol: showDots,
      silent: true,
      smooth: curve.smooth,
      step: curve.step,
      symbol: "circle",
      symbolSize: showDots ? dotSize + layer.symbolPad : 0,
      tooltip: { show: false },
      type: "line",
      z,
    };
  });
};

// Brush overlays (BrushRange, BrushGeometry, BrushOverlayElements,
// BrushOverlayParams, syncBrushOverlay) live in @/registry/ui/echarts-brush
// and are imported at the top of this file.

// ─────────────────────────────────────────────────────────────────────────────
// Curve mapping — linear → straight, step → step:"middle", everything else → smooth.
// ─────────────────────────────────────────────────────────────────────────────

interface LineCurve {
  smooth: boolean;
  step: "middle" | false;
}

const curveConfig = (curveType: CurveType): LineCurve => {
  // Recharts "step" is d3's curveStep: the transition happens at the MIDPOINT
  // between points, so each dot sits centered on its plateau.
  if (curveType === "step") {
    return { smooth: false, step: "middle" };
  }
  if (curveType === "linear") {
    return { smooth: false, step: false };
  }
  return { smooth: true, step: false };
};

// ─────────────────────────────────────────────────────────────────────────────
// Selection opacities — dims a series only when another one is selected. Lines
// have no fill, so only the stroke and dots carry an opacity here.
// ─────────────────────────────────────────────────────────────────────────────

interface SelectionOpacity {
  dot: number;
  stroke: number;
}

const getOpacity = (selected: string | null, key: string): SelectionOpacity => {
  if (selected === null || selected === key) {
    return { dot: 1, stroke: 1 };
  }
  return { dot: 0.3, stroke: 0.3 };
};

// ─────────────────────────────────────────────────────────────────────────────
// Loading skeleton helpers
// ─────────────────────────────────────────────────────────────────────────────

// Skeleton data as a smooth random walk in a comfortable band — reads like a
// resting chart instead of raw noise spikes.
const getLoadingData = (points: number): number[] => {
  const rows: number[] = [];
  let value = 30 + Math.random() * 20;
  for (let i = 0; i < points; i += 1) {
    value = Math.min(58, Math.max(16, value + (Math.random() - 0.5) * 16));
    rows.push(Math.round(value));
  }
  return rows;
};

// Gradient stops forming a hard clip window around `center`: full `peak` alpha
// inside, zero outside, with a small feather so the edge isn't aliased.
// `center` may run outside [0, 1] so the window fully enters and exits the frame.
const shimmerWindowStops = (center: number, color: string, peak: number) => {
  const half = LOADING_SHIMMER_BAND;
  const feather = LOADING_SHIMMER_FEATHER;

  const alphaAt = (x: number) => {
    const dist = Math.abs(x - center);
    if (dist <= half - feather) {
      return peak;
    }
    if (dist >= half) {
      return 0;
    }
    // Sine-eased falloff — a linear ramp still reads as a hard cut.
    return (
      peak * Math.sin(((1 - (dist - (half - feather)) / feather) * Math.PI) / 2)
    );
  };

  const offsets = [
    0,
    center - half,
    center - half + feather,
    center,
    center + half - feather,
    center + half,
    1,
  ]
    .filter((x) => x >= 0 && x <= 1)
    .toSorted((a, b) => a - b);

  const stops: { offset: number; color: string }[] = [];
  for (const offset of offsets) {
    const previousStop = stops.at(-1);
    if (previousStop === undefined || offset - previousStop.offset > 1e-4) {
      stops.push({ color: withAlpha(color, alphaAt(offset)), offset });
    }
  }
  return stops;
};

// Tooltip HTML primitives (roundnessClass, tooltipVariantClass,
// tooltipIndicatorHtml, tooltipRow, tooltipShell) live in
// @/registry/ui/echarts-tooltip; indicatorBackground lives in
// @/registry/ui/echarts-chart. Both are imported at the top of this file.

// The `__buffer-` prefix marks the dashed forecast overlay of a buffer line; it
// carries the SAME key's value, so the tooltip recovers the key from it (see
// createTooltipFormatter). Every other `__`-prefixed series (mini chart, loading
// skeleton, hover-reveal base) is truly internal and never surfaces.
const BUFFER_PREFIX = "__buffer-";
// The `__reveal-` prefix marks the muted base layer of a hover-reveal line — see
// buildLineSeries. Internal, so the tooltip drops it like the mini/loading rows.
const REVEAL_PREFIX = "__reveal-";

// Legend overlay (legendFillStyle, legendOutlineStyle, LegendIndicator,
// LegendOverlay) lives in @/registry/ui/echarts-legend and is imported at the
// top of this file.

// ─────────────────────────────────────────────────────────────────────────────
// Option builders — pure functions from a snapshot context to ECharts option
// fragments. The component reads its refs and renderer size ONCE per build into
// this context; nothing below touches React state or the chart instance, so
// each fragment can be reasoned about (and tested) in isolation.
// ─────────────────────────────────────────────────────────────────────────────

interface OptionBuildContext {
  data: Record<string, unknown>[];
  config: ChartConfig;
  lines: LineSeriesConfig[];
  curveType: CurveType;
  selectedDataKey: string | null;
  hasSelection: boolean;
  showGrid: boolean;
  xAxisSlot: XAxisSlot;
  yAxisSlot: YAxisSlot;
  tooltipSlot: TooltipSlot;
  legendSlot: LegendSlot;
  isLoading: boolean;
  loadingData: () => number[];
  showBrush: boolean;
  brushHeight: number;
  enableHoverHighlight: boolean;
  // hover colors each line up to the pointer, mutes the rest
  enableHoverReveal: boolean;
  // pointer's x-index while revealing (null = idle → chart looks normal)
  revealIndex: number | null;
  // buildLineSeries writes each line's full per-datum points here for the hover handler
  revealSink: Record<string, unknown[]>;
  resolved: ResolvedColors;
  // anchored reveal stroke gradients span the plot in absolute pixels
  rendererSize: { width: number; height: number };
  categories: string[];
  // zoom window carried through rebuilds
  brushRange: BrushRange;
  // read per tooltip render — hover never repushes the option
  getHoveredKey: () => string | null;
}

// Grid insets plus the footer band reserved for the brush. ECharts 6 contains
// axis labels automatically (the legacy `containLabel` flag now only triggers a
// deprecation warning).
const buildChartLayout = ({
  legendSlot,
  xAxisSlot,
  showBrush,
  brushHeight,
}: OptionBuildContext): {
  grid: GridComponentOption;
  brushBottom: number;
} => {
  const legendTop = legendSlot.present && legendSlot.verticalAlign === "top";
  const legendBottom =
    legendSlot.present && legendSlot.verticalAlign === "bottom";
  // Clearance covers the x-axis labels plus the same breathing room the
  // Recharts twin leaves between them and the brush. An x-axis TITLE renders
  // below the labels (nameGap), so it needs its own band above the brush frame.
  const brushGap = showBrush
    ? brushHeight + 30 + (xAxisSlot.label ? 22 : 0)
    : 0;

  return {
    brushBottom: legendBottom ? 34 : 6,
    grid: {
      bottom: 8 + brushGap + (legendBottom ? 34 : 0),
      left: 8,
      right: 8,
      top: legendTop ? 42 : 16,
    },
  };
};

const buildMainAxes = (
  ctx: OptionBuildContext
): {
  xAxis: XAxisOption;
  yAxis: YAxisOption;
} => {
  const { xAxisSlot, yAxisSlot, showGrid, isLoading, categories, loadingData } =
    ctx;
  const { tokens } = ctx.resolved;

  const axisLabelColor = tokens.mutedForeground;
  const splitLineColor = withAlpha(tokens.border, GRID_LINE_OPACITY);
  // Gridline gray as an opaque color — see flattenColor.
  const tickDotColor = flattenColor(splitLineColor, tokens.background);

  const xTickFormatter = xAxisSlot.tickFormatter;
  const yTickFormatter = yAxisSlot.tickFormatter;

  const xAxis: XAxisOption = {
    axisLabel: {
      color: axisLabelColor,
      fontSize: 10,
      formatter: xTickFormatter
        ? (value: string, index: number) => xTickFormatter(value, index)
        : undefined,
      margin: 8,
      show: !isLoading && xAxisSlot.present,
    },
    axisLine: { show: false },
    // Tick DOTS: a near-zero-length tick whose round caps form a true circle,
    // in the gridline gray (flattened opaque so the caps don't stack).
    axisTick: {
      // Category ticks default to the BOUNDARY between categories, which on a
      // boundaryGap axis drops the dot in the gap instead of under its label. A
      // no-op here (boundaryGap is false) — set for parity with the bar/composed
      // charts. The y-axis is always type:"value", which has no such option.
      alignWithLabel: true,
      length: 0.5,
      lineStyle: { cap: "round", color: tickDotColor, width: 3 },
      show: !isLoading && xAxisSlot.present && !xAxisSlot.hideDots,
    },
    boundaryGap: false,
    data: isLoading ? loadingData().map((_, i) => i) : categories,
    // Axis title — same size/color as the tick labels, pushed clear of them.
    name: isLoading ? undefined : xAxisSlot.label,
    nameGap: 30,
    nameLocation: "middle",
    nameTextStyle: { color: axisLabelColor, fontSize: 10 },
    show: true,
    splitLine: { show: false },
    type: "category",
  };

  // An ECharts axis with `show: false` hides its splitLines too, but Recharts'
  // <CartesianGrid> draws with or without a visible <YAxis>. Keep the axis on
  // whenever <Grid/> is present and gate the LABELS on <YAxis/> instead.
  const yAxis: YAxisOption = {
    axisLabel: {
      // Hidden while loading — skeleton values are meaningless, and the
      // Recharts YAxis unmounts during loading too.
      color: axisLabelColor,
      fontSize: 10,
      formatter: yTickFormatter
        ? (value: number, index: number) => yTickFormatter(value, index)
        : undefined,
      margin: 8,
      show: yAxisSlot.present && !isLoading,
    },
    axisLine: { show: false },
    // Same tick dots as the x-axis, beside each value label. No alignWithLabel
    // here: ECharts types it on the CATEGORY axis only, and a value axis already
    // puts its ticks on the labels.
    axisTick: {
      length: 0.5,
      lineStyle: { cap: "round", color: tickDotColor, width: 3 },
      show: yAxisSlot.present && !isLoading && !yAxisSlot.hideDots,
    },
    // Axis title — rendered rotated alongside the tick labels, same styling.
    name: isLoading ? undefined : yAxisSlot.label,
    nameGap: 38,
    nameLocation: "middle",
    nameTextStyle: { color: axisLabelColor, fontSize: 10 },
    show: yAxisSlot.present || showGrid,
    splitLine: {
      // Hidden while loading — the skeleton floats on a clean canvas.
      lineStyle: {
        color: splitLineColor,
        type: [3, 3] as [number, number],
        width: 1,
      },
      show: showGrid && !isLoading,
    },
    type: "value",
  };

  return { xAxis, yAxis };
};

const tooltipSeriesKey = (param: {
  seriesId?: string;
  seriesName?: string;
}): string => {
  const rawId = String(param.seriesId ?? "");
  if (rawId.startsWith(BUFFER_PREFIX)) {
    return rawId.slice(BUFFER_PREFIX.length);
  }
  if (rawId.startsWith("__")) {
    return "";
  }
  return param.seriesId ?? param.seriesName ?? "";
};

// Tooltip HTML builder, closed over the build context. `trigger: "axis"` hands
// the formatter every series' value at the hovered x; buffer overlays and the
// mini/loading series are folded out here (see BUFFER_PREFIX).
const createTooltipFormatter = (ctx: OptionBuildContext) => {
  const { config, selectedDataKey, tooltipSlot, getHoveredKey } = ctx;

  return (params: unknown): string => {
    const rows = Array.isArray(params) ? params : [params];
    if (!rows.length) {
      return "";
    }

    const first = rows[0] as { axisValue?: string | number; name?: string };
    // Label shows the RAW axis value — matches ChartTooltipContent (no tick formatter).
    const axisValue = first.axisValue ?? first.name ?? "";
    const label = String(axisValue);

    // Dedupe by effective key: a buffer line contributes both its solid part
    // (id=key) and its dashed overlay (id=`__buffer-{key}`) at the shared
    // second-to-last point. Keep the first non-null value seen per key so the
    // final point (only the overlay has data there) still shows its number.
    const seen = new Set<string>();
    const body = rows
      .map((param) => {
        const p = param as {
          seriesId?: string;
          seriesName?: string;
          value?: number | string | null;
        };
        // Map the dashed buffer overlay back onto its series; drop every other
        // internal series (mini chart, loading skeleton).
        const key = tooltipSeriesKey(p);
        if (!key) {
          return "";
        }
        // A null value means this series does not reach the hovered x (a buffer
        // line's solid part stops before the last point) — skip it, and let the
        // overlay row for the same key stand in.
        if (p.value === null || p.value === undefined) {
          return "";
        }
        if (seen.has(key)) {
          return "";
        }
        seen.add(key);

        const item = config[key];
        const colorsCount = item ? getColorsCount(item) : 1;
        const labelText =
          typeof item?.label === "string" ? item.label : (p.seriesName ?? key);
        const hovered = getHoveredKey();
        const dimmed =
          (selectedDataKey !== null && selectedDataKey !== key) ||
          (hovered !== null && hovered !== key)
            ? " opacity-30"
            : "";
        const value =
          typeof p.value === "number"
            ? p.value.toLocaleString()
            : String(p.value ?? "");

        return tooltipRow({
          dimmed,
          indicatorHtml: tooltipIndicatorHtml(key, colorsCount),
          labelText,
          valueText: value,
        });
      })
      .join("");

    return tooltipShell({
      body,
      label,
      roundness: tooltipSlot.roundness,
      variant: tooltipSlot.variant,
    });
  };
};

const buildTooltipOption = (
  ctx: OptionBuildContext
): TooltipComponentOption => {
  const { tooltipSlot, isLoading } = ctx;
  const { tokens } = ctx.resolved;

  return {
    ...tooltipBaseOption({
      axisPointerColor: withAlpha(tokens.border, AXIS_POINTER_OPACITY),
      cursor: tooltipSlot.cursor,
      position: tooltipSlot.position,
      present: tooltipSlot.present && !isLoading,
      strokeWidth: STROKE_WIDTH,
      tokens,
    }),
    formatter: createTooltipFormatter(ctx),
  };
};

// ── Brush — the evil-brush "line" look, canvas-style: a real mini chart of the
// full data (strokes only, no fill, like EvilBrush variant="line") in a second
// grid, with a transparent slider dataZoom laid over it. Both zoom entries target
// only the MAIN x-axis, so the mini chart never filters itself. Only called when
// `showBrush` is set.
// Copy a value list with everything AFTER `idx` nulled — the hover-reveal cut:
// the colored real line keeps its data up to the cursor and drops the rest, so
// (with connectNulls false) its stroke stops dead at the pointer.
const sliceToNull = <T,>(vals: readonly T[], idx: number): (T | null)[] =>
  vals.map((v, i) => (i > idx ? null : v));

// Copy a value list with everything BEFORE `idx` nulled — the reveal's gray tail.
// The muted base keeps only the region from the cursor onward, so it never sits
// under the colored part; both include `idx` so they meet at the pointer.
// Generic so it preserves per-datum point objects (multi-color dot itemStyle).
const sliceFrom = <T,>(vals: readonly T[], idx: number): (T | null)[] =>
  vals.map((v, i) => (i < idx ? null : v));

const lineValue = (
  row: Record<string, unknown>,
  key: string
): number | null => {
  const value = row[key];
  return value === null || value === undefined ? null : Number(value) || 0;
};

const buildBrushOption = (
  ctx: OptionBuildContext,
  brushBottom: number
): {
  miniGrid: GridComponentOption;
  miniXAxis: XAxisOption;
  miniYAxis: YAxisOption;
  miniSeries: LineSeriesOption[];
  dataZoom: DataZoomComponentOption[];
} => {
  const { data, lines, curveType, selectedDataKey, brushHeight, categories } =
    ctx;
  const { tokens } = ctx.resolved;

  const miniGrid: GridComponentOption = {
    bottom: brushBottom,
    height: brushHeight,
    left: 8,
    // No visible axes here — opt out of label containment so the mini chart
    // spans the full brush frame.
    outerBoundsMode: "none",
    right: 8,
  };

  const miniXAxis: XAxisOption = {
    axisPointer: { show: false },
    boundaryGap: false,
    data: categories,
    gridIndex: 1,
    show: false,
    type: "category",
  };

  const miniYAxis: YAxisOption = { gridIndex: 1, show: false, type: "value" };

  const miniSeries: LineSeriesOption[] = lines.map((line) => {
    const key = line.dataKey;
    const base =
      (ctx.resolved.series[key] ?? [])[0] ?? "rgba(120, 120, 120, 1)";
    const curve = curveConfig(line.curveType ?? curveType);

    // The mini chart mirrors the click selection: unselected series recede
    // by the same ratio as the main plot.
    const strokeDim = getOpacity(selectedDataKey, key).stroke;

    return {
      connectNulls: line.connectNulls,
      data: data.map((row) => lineValue(row, key)),
      emphasis: { disabled: true },
      id: `__mini-${key}`,
      lineStyle: {
        color: base,
        opacity: BRUSH_STROKE_OPACITY * strokeDim,
        width: 1,
      },
      showSymbol: false,
      silent: true,
      smooth: curve.smooth,
      step: curve.step,
      tooltip: { show: false },
      type: "line",
      xAxisIndex: 1,
      yAxisIndex: 1,
      z: 0,
    };
  });

  const dataZoom = buildBrushDataZoom({
    brushBottom,
    brushHeight,
    brushRange: ctx.brushRange,
    fillerColor: withAlpha(tokens.foreground, BRUSH_FILLER_OPACITY),
  });

  return { dataZoom, miniGrid, miniSeries, miniXAxis, miniYAxis };
};

// Loading skeleton — ONE gray wave regardless of declared lines (Recharts
// parity: its skeleton is a single stroke-only LoadingLine), swept by the
// shimmer rAF. No fill: a <Line> has no area, so the skeleton is stroke-only too.
const buildLoadingOption = (
  ctx: OptionBuildContext,
  frame: { grid: GridComponentOption; xAxis: XAxisOption; yAxis: YAxisOption }
): EChartsOption => {
  const { tokens } = ctx.resolved;
  const curve = curveConfig(ctx.curveType);

  return {
    animation: false,
    grid: frame.grid,
    series: [
      {
        data: ctx.loadingData(),
        id: "__loading",
        // Invisible until the first shimmer tick positions the clip window.
        lineStyle: { color: withAlpha(tokens.foreground, 0), width: 1 },
        showSymbol: false,
        silent: true,
        smooth: curve.smooth,
        step: curve.step,
        type: "line",
        z: 1,
      },
    ],
    tooltip: { show: false },
    xAxis: frame.xAxis,
    yAxis: frame.yAxis,
  };
};

// The plotted values for a line, optionally decorated per-datum. Multi-color
// lines tint each symbol with the gradient's color at its own x-position (like
// the Recharts dots); single-color lines return the raw numbers. `null` entries
// pass through untouched — they carve the gap a buffer line's two parts leave.
type LinePoint =
  | number
  | null
  | {
      value: number | null;
      itemStyle: DotItemStyleOption;
      emphasis: { itemStyle: DotItemStyleOption };
    };

const lineDotItemStyle = (
  multiColor: boolean,
  opacity: number,
  restingDot: DotStyle,
  activeDot: DotStyle,
  restingVisible: boolean
): DotItemStyleOption => {
  if (multiColor) {
    return { opacity };
  }
  return {
    ...(restingVisible ? restingDot.itemStyle : activeDot.itemStyle),
    opacity,
  };
};

interface MainLineSeriesParams {
  activeDot: DotStyle;
  ctx: OptionBuildContext;
  curve: LineCurve;
  line: LineSeriesConfig;
  mainDash: "solid" | [number, number];
  multiColor: boolean;
  opacity: SelectionOpacity;
  points: LinePoint[];
  restingDot: DotStyle;
  strokePaint: string | echarts.graphic.LinearGradient;
  z: number;
}

const buildMainLineSeries = ({
  activeDot,
  ctx,
  curve,
  line,
  mainDash,
  multiColor,
  opacity,
  points,
  restingDot,
  strokePaint,
  z,
}: MainLineSeriesParams): LineSeriesOption => {
  const { config, enableHoverHighlight, enableHoverReveal, hasSelection } = ctx;
  const key = line.dataKey;
  const restingVisible = line.dotVariant !== "none";
  const dotOpacity = opacity.dot;
  return {
    // Blur styling mirrors the click-selection dim (stroke 0.3 / dot 0.3);
    // inert unless a series is focused via enableHoverHighlight.
    blur: {
      itemStyle: { opacity: 0.3 },
      lineStyle: { opacity: 0.3 },
    },
    connectNulls: line.connectNulls,
    cursor: line.isClickable ? "pointer" : "default",
    data: points,
    emphasis: {
      // focus "series" blurs every other series in this grid while one is
      // hovered — the hover twin of the click selection (opt-in via
      // enableHoverHighlight). Suppressed entirely while a series is
      // click-selected: the selection dim owns the canvas, so hover
      // highlighting stops until the selection clears (the option rebuilds on
      // selection change, making this a build-time conditional). Reveal owns the
      // hover visual, so native focus-blur stands down when it is on (they must
      // not blend). Otherwise the active dot is the only emphasis.
      focus:
        enableHoverHighlight && !enableHoverReveal && !hasSelection
          ? "series"
          : "none",
      scale: restingVisible ? activeDot.size / Math.max(restingDot.size, 1) : 1,
      ...(multiColor
        ? {}
        : { itemStyle: { ...activeDot.itemStyle, opacity: 1 } }),
    },
    id: key,
    itemStyle: lineDotItemStyle(
      multiColor,
      dotOpacity,
      restingDot,
      activeDot,
      restingVisible
    ),
    lineStyle: {
      // Anchored plot-wide gradient while revealing a multi-color line (see
      // strokePaint), the normal series paint otherwise.
      color: strokePaint,
      dashOffset: 0,
      opacity: opacity.stroke,
      type: mainDash,
      width: line.strokeWidth,
    },
    name: typeof config[key]?.label === "string" ? config[key]?.label : key,
    showSymbol: restingVisible,
    smooth: curve.smooth,
    step: curve.step,
    symbol: "circle",
    symbolSize: restingVisible ? restingDot.size : activeDot.size,
    // By default ECharts only fires mouse events on the symbols — this makes
    // the line itself clickable too, like the Recharts <Line>.
    // (`true` covers both; the deprecated `triggerLineEvent` did the same.)
    triggerEvent: line.isClickable,
    type: "line",
    z,
  };
};

const mainLineValues = (
  values: (number | null)[],
  buffer: boolean,
  revealIndex: number | null,
  reveal: boolean
): (number | null)[] => {
  if (buffer) {
    return values.map((value, index) =>
      index === values.length - 1 ? null : value
    );
  }
  if (reveal && revealIndex !== null) {
    return sliceToNull(values, revealIndex);
  }
  return values;
};

const seriesZIndex = (selectedDataKey: string | null, key: string): number => {
  if (selectedDataKey === key) {
    return 3;
  }
  return selectedDataKey === null ? 2 : 1;
};

const buildLineSeries = (ctx: OptionBuildContext): LineSeriesOption[] => {
  const {
    data,
    lines,
    curveType,
    selectedDataKey,
    enableHoverReveal,
    revealIndex,
    revealSink,
    resolved,
    rendererSize,
  } = ctx;
  const { background } = resolved.tokens;

  return lines.flatMap((line): LineSeriesOption[] => {
    const key = line.dataKey;
    const slots = resolved.series[key] ?? ["rgba(120, 120, 120, 1)"];
    const paint = seriesPaint(slots);
    const opacity = getOpacity(selectedDataKey, key);
    const curve = curveConfig(line.curveType ?? curveType);
    const multiColor = slots.length > 1;

    const restingDot = dotStyle(line.dotVariant, paint, background);
    const activeDot = dotStyle(line.activeDotVariant, paint, background);
    const restingVisible = line.dotVariant !== "none";
    const dotOpacity = opacity.dot;

    const values = data.map((row) => lineValue(row, key));
    const n = values.length;
    // Hover-reveal is a root-level mode and owns the whole line rendering, so it
    // takes precedence over a per-line buffer tail (and the glow overlay) when
    // both are set.
    const reveal = enableHoverReveal;
    const buffer = !reveal && line.enableBufferLine && n >= 2;
    const revealActive = reveal && revealIndex !== null;

    // The dash pattern for the MAIN line. A buffer line keeps its body solid and
    // dashes only the tail overlay, so its main part is always solid regardless
    // of strokeVariant (matches the Recharts twin, which suppresses the base
    // dasharray while the buffer shape manages its own).
    const mainDash: "solid" | [number, number] =
      buffer || line.strokeVariant === "solid" ? "solid" : [3, 3];

    // The reveal truncates the line to the cursor, which would COMPRESS a
    // bbox-relative stroke gradient into the shorter span — misaligning it from
    // the index-sampled dots. Anchor the stroke to the plot in absolute pixels so
    // every x keeps its own color even when the line stops short.
    const strokePaint =
      reveal && multiColor
        ? new echarts.graphic.LinearGradient(
            8,
            0,
            Math.max(rendererSize.width - 8, 9),
            0,
            slots.map((color, i) => ({
              color,
              offset: i / (slots.length - 1),
            })),
            true
          )
        : paint;

    // Turn a value list into ECharts data — attaching per-datum symbol colors
    // for multi-color lines, and passing `null` gaps through so a buffer line's
    // two parts each draw only their own segment.
    const toPoints = (vals: (number | null)[]): LinePoint[] =>
      multiColor
        ? vals.map((value, i): LinePoint => {
            if (value === null) {
              return null;
            }
            const t = vals.length > 1 ? i / (vals.length - 1) : 0;
            const pointColor = sampleGradient(slots, t);
            return {
              emphasis: {
                itemStyle: {
                  ...dotItemStyle(
                    line.activeDotVariant === "none"
                      ? "default"
                      : line.activeDotVariant,
                    pointColor,
                    background
                  ),
                  opacity: 1,
                },
              },
              itemStyle: {
                ...dotItemStyle(
                  restingVisible ? line.dotVariant : line.activeDotVariant,
                  pointColor,
                  background
                ),
                opacity: dotOpacity,
              },
              value,
            };
          })
        : vals;

    // Snapshot the FULL per-datum points (with the multi-color dot itemStyle) so
    // the reveal hover handler can slice them without losing each dot's sampled
    // gradient color — plain values would fall back to the default palette.
    if (reveal) {
      revealSink[key] = toPoints(values);
    }

    // Buffer line: the solid MAIN part drops the last point (its final segment
    // becomes the dashed overlay). Reveal instead TRUNCATES the real series at the
    // cursor's x-index (points beyond it null'd), so its line stops there and the
    // muted base layer shows through past it. When idle (revealIndex null) the
    // real series carries its full data — the chart looks completely normal.
    const mainValues = mainLineValues(values, buffer, revealIndex, reveal);

    const z = seriesZIndex(selectedDataKey, key);

    // Glow overlays sit UNDER the real line (built first, same z; equal-z series
    // paint in array order). They follow the FULL solid path so the halo stays
    // continuous even beneath a dashed or buffer tail. Suppressed under reveal:
    // a full-length colored halo would bleed past the cursor and defeat the mute.
    const glowSeries =
      line.glowing && !reveal
        ? buildGlowSeries({
            connectNulls: line.connectNulls,
            curve,
            dotSize: restingVisible ? restingDot.size : 0,
            key,
            paint,
            selectionDim: opacity.stroke,
            slots,
            values,
            z,
          })
        : [];

    const mainSeries: LineSeriesOption = buildMainLineSeries({
      activeDot,
      ctx,
      curve,
      line,
      mainDash,
      multiColor,
      opacity,
      points: toPoints(mainValues),
      restingDot,
      strokePaint,
      z,
    });

    // Hover-reveal: a muted gray BASE line of the FULL series sits one z below the
    // real one. It is invisible while idle (opacity 0 → the chart looks normal)
    // and fades in only while hovering, so the region PAST the cursor — where the
    // truncated real line has stopped — shows as neutral gray. Lines have no fill,
    // so the base is a line only (no areaStyle) and needs no stack mirror.
    if (reveal) {
      const muted = resolved.tokens.mutedForeground;
      const revealBase: LineSeriesOption = {
        blur: { lineStyle: { opacity: revealActive ? 0.3 : 0 } },
        connectNulls: false,
        // Only the region FROM the cursor onward (null before it), so the gray
        // never sits under the colored part — the two meet exactly at the pointer
        // and their colors can't mix.
        data: revealActive ? sliceFrom(values, revealIndex as number) : values,
        emphasis: { disabled: true },
        id: `${REVEAL_PREFIX}${key}`,
        // Neutral gray, SAME dash pattern as the colored line, no fill.
        lineStyle: {
          color: muted,
          opacity: revealActive ? 0.3 : 0,
          type: mainDash,
          width: line.strokeWidth,
        },
        showSymbol: false,
        silent: true,
        smooth: curve.smooth,
        step: curve.step,
        symbol: "circle",
        tooltip: { show: false },
        type: "line",
        z: z - 1,
      };
      return [revealBase, mainSeries];
    }

    if (!buffer) {
      return [...glowSeries, mainSeries];
    }

    // Dashed forecast overlay — draws ONLY the last segment. Silent, so it never
    // intercepts clicks/hover; it still feeds the axis tooltip (silent series
    // are aggregated by axis), which is why the last point keeps its number.
    const bufferValues: (number | null)[] = values.map((v, i) =>
      i >= n - 2 ? v : null
    );
    const bufferSeries: LineSeriesOption = {
      blur: { itemStyle: { opacity: 0.3 }, lineStyle: { opacity: 0.3 } },
      connectNulls: true,
      data: toPoints(bufferValues),
      // The dashed tail is a separate silent series, so focus:"series" on its
      // parent would blur it apart from the line it belongs to. The root
      // dispatch-links this id (see companionIdsByKey) so it focuses WITH its
      // parent; these styles give it the parent's look while focused and the
      // click-selection dim while another series is hovered.
      emphasis: {
        focus: "none",
        itemStyle: { opacity: dotOpacity },
        lineStyle: { opacity: opacity.stroke },
        scale: false,
      },
      id: `${BUFFER_PREFIX}${key}`,
      itemStyle: lineDotItemStyle(
        multiColor,
        dotOpacity,
        restingDot,
        activeDot,
        restingVisible
      ),
      lineStyle: {
        color: paint,
        opacity: opacity.stroke,
        type: BUFFER_DASH,
        width: line.strokeWidth,
      },
      showSymbol: restingVisible,
      silent: true,
      smooth: curve.smooth,
      step: curve.step,
      symbol: "circle",
      symbolSize: restingVisible ? restingDot.size : activeDot.size,
      type: "line",
      z,
    };

    return [...glowSeries, mainSeries, bufferSeries];
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Live imperative state — everything the ECharts event handlers, rAF loops, and
// theme/resize repushes read or write OUTSIDE the React render cycle, grouped in
// one ref-stable object so the whole imperative surface is visible at a glance.
// None of it is render output, which is exactly why it is not React state.
// ─────────────────────────────────────────────────────────────────────────────

interface LiveState {
  renderer: EChartsRenderer | null;
  // colors read off the live DOM — feeds builds and rAF loops
  resolved: ResolvedColors | null;
  // tooltip's view of hover — the legend's twin lives in React state
  hoveredKey: string | null;
  // the intro draw-in already played on this chart instance
  hasRevealed: boolean;
  // performance.now() timestamp when the entrance settles
  revealEndsAt: number;
  // skeleton data, lazily rolled and re-rolled per shimmer sweep
  loadingRows: number[] | null;
  // x labels of the last build, for the brush label pills
  categories: string[];
  // row count, for the datazoom index math
  dataLength: number;
  // live zoom window — carried through every rebuild
  brushRange: BrushRange;
  // brush footer layout of the last build
  brushGeom: BrushGeometry | null;
  // zrender elements, owned by syncBrushOverlay
  brushOverlay: BrushOverlayElements | null;
  brushHover: { inside: boolean; left: boolean; right: boolean };
  // seriesIndex → clickable key for the last build, `undefined` for internal
  // series. A line-body click (triggerEvent) reports only a seriesIndex, and
  // buffer lines add a second (`__buffer-`) series per key — so the index no
  // longer equals the key's position in seriesKeys and must be mapped explicitly.
  seriesKeyByIndex: (string | undefined)[];
  // key → its silent companion series ids (glow overlays + buffer tail) in the
  // main grid. Under enableHoverHighlight the root highlights/downplays these
  // together with the hovered parent, so focus:"series" can't strand a line's own
  // glow or forecast tail apart from it.
  companionIdsByKey: Map<string, string[]>;
  // hover-reveal pointer x-index (null = idle); read by builds and the reveal hover handler
  revealIndex: number | null;
  // per-line FULL per-datum points (with dot itemStyle), sliced to the cursor on hover without a rebuild
  revealValues: Record<string, unknown[]>;
  // Latest callbacks/flags for the imperative ECharts event handlers.
  handlers: {
    onBrushChange?: (range: { startIndex: number; endIndex: number }) => void;
    onSelectionChange?: (key: string | null) => void;
    clickableKeys: Set<string>;
    selectedDataKey: string | null;
    brushFormatLabel?: (value: string, index: number) => string;
    seriesKeys: string[];
    enableHoverHighlight: boolean;
    enableHoverReveal: boolean;
  };
  // Update-style re-push for paths that bypass React entirely (theme flips,
  // resizes) — set by the sync effect.
  repush?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const rendererDimensions = (
  chart: EChartsInstance | null,
  mount: HTMLDivElement | null
): OptionBuildContext["rendererSize"] => ({
  height: chart?.getHeight() ?? mount?.clientHeight ?? 0,
  width: chart?.getWidth() ?? mount?.clientWidth ?? 0,
});

const buildCompanionIds = (
  lines: LineSeriesConfig[],
  dataLength: number,
  enableHoverReveal: boolean
): Map<string, string[]> => {
  const companionIdsByKey = new Map<string, string[]>();
  for (const line of lines) {
    const ids: string[] = [];
    if (line.glowing) {
      for (let i = 0; i < GLOW_LAYERS.length; i += 1) {
        ids.push(`__glow-${i}-${line.dataKey}`);
      }
    }
    if (line.enableBufferLine && dataLength >= 2) {
      ids.push(`${BUFFER_PREFIX}${line.dataKey}`);
    }
    if (enableHoverReveal) {
      ids.push(`${REVEAL_PREFIX}${line.dataKey}`);
    }
    if (ids.length) {
      companionIdsByKey.set(line.dataKey, ids);
    }
  }
  return companionIdsByKey;
};

const legendVerticalStyle = (
  verticalAlign: LegendSlot["verticalAlign"],
  showBrush: boolean,
  brushHeight: number
): CSSProperties => {
  if (verticalAlign === "top") {
    return { top: 12 };
  }
  if (verticalAlign === "bottom") {
    return { bottom: showBrush ? brushHeight + 16 : 12 };
  }
  return { top: "50%", transform: "translateY(-50%)" };
};

/**
 * Apache ECharts port of the EvilCharts line chart, exposing a compound-as-config
 * API so its JSX reads identically to the Recharts twin. The root owns the data,
 * config, selection state, loading skeleton, intro reveal, and optional zoom
 * brush; every visual part — `<Line>`, `<XAxis>`, `<YAxis>`, `<Grid>`,
 * `<Tooltip>`, `<Legend>` — is composed as a declarative child that renders
 * nothing. The root walks those children by reference and drives a single
 * imperative ECharts instance. Fully self-contained: its only dependencies are
 * `react`, `echarts`, and `motion`.
 */
export const EChartsLineChart = <TData extends Record<string, unknown>>({
  data,
  config,
  renderer = DEFAULT_ECHARTS_RENDERER,
  xDataKey,
  className,
  curveType = "linear",
  animation = true,
  animationType = "left-to-right",
  enableHoverHighlight = false,
  enableHoverReveal = false,
  defaultSelectedDataKey = null,
  onSelectionChange,
  isLoading = false,
  loadingPoints = LOADING_DEFAULT_POINTS,
  chartOptions,
  children,
}: EChartsLineChartProps<TData>) => {
  const rawId = useId();
  const chartId = `chart-${rawId.replaceAll(":", "")}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const echartsRef = useRef<EChartsInstance | null>(null);

  // The single imperative surface (see LiveState). `resolved` lives here rather
  // than in state: as state it forced an extra render pass and an effect whose
  // only job was to trigger the option push — the "chain of computations"
  // react.dev/learn/you-might-not-need-an-effect warns about. The object
  // identity is stable for the component's lifetime.
  const live = useRef<LiveState>({
    brushGeom: null,
    brushHover: { inside: false, left: false, right: false },
    brushOverlay: null,
    brushRange: { end: 100, start: 0 },
    categories: [],
    companionIdsByKey: new Map(),
    dataLength: 0,
    handlers: {
      // set per-render from the <Brush> child's formatLabel
      brushFormatLabel: undefined,
      clickableKeys: new Set<string>(),
      enableHoverHighlight,
      enableHoverReveal,
      // set per-render from the <Brush> child's onChange
      onBrushChange: undefined,
      onSelectionChange,
      selectedDataKey: defaultSelectedDataKey,
      seriesKeys: [],
    },
    hasRevealed: false,
    hoveredKey: null,
    loadingRows: null,
    renderer: null,
    resolved: null,
    revealEndsAt: 0,
    revealIndex: null,
    revealValues: {},
    seriesKeyByIndex: [],
  });

  // Skeleton rows roll lazily on first use — an impure useRef initializer would
  // re-roll Math.random() on every render.
  const loadingData = useCallback(() => {
    const state = live.current;
    if (state.loadingRows === null) {
      state.loadingRows = getLoadingData(loadingPoints);
    }
    return state.loadingRows;
  }, [loadingPoints]);
  const shouldReduceMotion = useReducedMotion();

  const [selectedDataKey, setSelectedDataKey] = useState<string | null>(
    defaultSelectedDataKey
  );

  // Hover-highlight mirrors into the legend (React state) and tooltip
  // (live.hoveredKey — its formatter runs on every hover, and pushing an option
  // to sync it would reset ECharts' native blur state mid-hover).
  const [hoveredDataKey, setHoveredDataKey] = useState<string | null>(null);

  // ── Declarative config, collected from children by reference ─────────────────
  const collected = useMemo(() => collectConfig(children), [children]);
  const {
    lines,
    xAxis: xAxisSlot,
    yAxis: yAxisSlot,
    showGrid,
    tooltip: tooltipSlot,
    legend: legendSlot,
    brush: brushSlot,
  } = collected;
  // Brush is a <Brush> child now (not props): presence turns it on, its props
  // carry height/formatLabel/onChange.
  const showBrush = brushSlot.present;
  const brushHeight = brushSlot.height ?? 56;

  const seriesKeys = useMemo(() => lines.map((line) => line.dataKey), [lines]);

  // x category key: <XAxis dataKey> → root xDataKey → first data column no <Line> claims.
  const xCategoryKey = useMemo(() => {
    if (xAxisSlot.dataKey) {
      return xAxisSlot.dataKey;
    }
    if (xDataKey) {
      return xDataKey as string;
    }
    const [firstRow] = data;
    if (firstRow) {
      const claimed = new Set(seriesKeys);
      const found = Object.keys(firstRow).find((key) => !claimed.has(key));
      if (found) {
        return found;
      }
    }
    return "";
  }, [xAxisSlot.dataKey, xDataKey, data, seriesKeys]);

  // The intro draw-in follows the first line's setting, falling back to the root default.
  const effectiveAnimation = lines[0]?.animationType ?? animationType;

  const css = useMemo(() => buildChartCss(chartId, config), [chartId, config]);

  const hasSelection = selectedDataKey !== null;

  // Which series may be clicked to toggle selection (consulted by the click handler).
  const clickableKeys = useMemo(
    () =>
      new Set(
        lines.filter((line) => line.isClickable).map((line) => line.dataKey)
      ),
    [lines]
  );

  // Event callbacks read only the latest committed props, never an abandoned render.
  useEffect(() => {
    live.current.handlers = {
      brushFormatLabel: brushSlot.formatLabel,
      clickableKeys,
      enableHoverHighlight,
      enableHoverReveal,
      onBrushChange: brushSlot.onChange,
      onSelectionChange,
      selectedDataKey,
      seriesKeys,
    };
    live.current.dataLength = data.length;
  }, [
    brushSlot.formatLabel,
    brushSlot.onChange,
    clickableKeys,
    data.length,
    enableHoverHighlight,
    enableHoverReveal,
    onSelectionChange,
    selectedDataKey,
    seriesKeys,
  ]);

  const toggleSelection = useCallback(
    (key: string) => {
      // A new click selection takes over the canvas dim, so any live hover
      // highlight is torn down at this moment — the mouseover guard then keeps it
      // from re-arming while the selection stands. Hover is only ever active
      // while NO selection exists (see that guard), so a hovered key here always
      // means this click is establishing a selection.
      if (live.current.hoveredKey !== null) {
        const chart = echartsRef.current;
        const companions = chart
          ? live.current.companionIdsByKey.get(live.current.hoveredKey)
          : undefined;
        if (chart && companions) {
          for (const seriesId of companions) {
            chart.dispatchAction({ seriesId, type: "downplay" });
          }
        }
        live.current.hoveredKey = null;
        setHoveredDataKey(null);
      }
      const next = live.current.handlers.selectedDataKey === key ? null : key;
      live.current.handlers.selectedDataKey = next;
      setSelectedDataKey(next);
      live.current.handlers.onSelectionChange?.(next);
    },
    [live]
  );

  // Reposition the brush overlays from the live refs — safe to call from drag
  // events, hover tracking, and pushes alike, since it never touches setOption.
  const syncBrushOverlayNow = useCallback(() => {
    const chart = echartsRef.current;
    if (!chart) {
      return;
    }

    const geom = live.current.brushGeom;
    const tokens = live.current.resolved?.tokens;
    if (!geom || !tokens) {
      syncBrushOverlay(chart, live.current, null);
      return;
    }

    const range = live.current.brushRange;
    const { categories } = live.current;
    const format = live.current.handlers.brushFormatLabel;
    const lastIndex = Math.max(categories.length - 1, 0);
    const startIndex = Math.round((range.start / 100) * lastIndex);
    const endIndex = Math.round((range.end / 100) * lastIndex);
    const labels =
      format && categories.length
        ? {
            end: format(categories[endIndex] ?? "", endIndex),
            start: format(categories[startIndex] ?? "", startIndex),
          }
        : null;

    syncBrushOverlay(chart, live.current, {
      geom,
      hover: live.current.brushHover,
      labels,
      range,
      showLabels: live.current.brushHover.inside,
      size: { height: chart.getHeight(), width: chart.getWidth() },
      tokens,
    });
  }, [live]);

  // ── Option builder ─────────────────────────────────────────────────────────
  // Thin orchestrator over the pure builders above: snapshot the imperative
  // surface (refs, renderer size) into an OptionBuildContext, then assemble.
  const buildOption = useCallback((): EChartsOption => {
    const { resolved } = live.current;
    if (!resolved) {
      return {};
    }

    const categories = data.map((row) => String(row[xCategoryKey]));
    live.current.categories = categories;

    // buildLineSeries fills this with each line's full per-datum points (with the
    // multi-color dot itemStyle) so the reveal hover handler slices real data.
    const revealSink: Record<string, unknown[]> = {};

    const ctx: OptionBuildContext = {
      brushHeight,
      brushRange: live.current.brushRange,
      categories,
      config,
      curveType,
      data,
      enableHoverHighlight,
      enableHoverReveal,
      getHoveredKey: () => live.current.hoveredKey,
      hasSelection,
      isLoading,
      legendSlot,
      lines,
      loadingData,
      rendererSize: rendererDimensions(echartsRef.current, mountRef.current),
      resolved,
      revealIndex: live.current.revealIndex,
      revealSink,
      selectedDataKey,
      showBrush,
      showGrid,
      tooltipSlot,
      xAxisSlot,
      yAxisSlot,
    };

    const { grid, brushBottom } = buildChartLayout(ctx);
    live.current.brushGeom = showBrush
      ? { bottom: brushBottom, height: brushHeight }
      : null;

    const { xAxis, yAxis } = buildMainAxes(ctx);

    if (isLoading) {
      return buildLoadingOption(ctx, { grid, xAxis, yAxis });
    }

    const brush = showBrush ? buildBrushOption(ctx, brushBottom) : null;

    const series = [...buildLineSeries(ctx), ...(brush?.miniSeries ?? [])];
    // buildLineSeries has now filled revealSink with each line's full per-datum
    // points — hand them to the hover handler for slicing.
    if (enableHoverReveal) {
      live.current.revealValues = revealSink;
    }
    // Record the exact series order so a line-body click (which reports only a
    // seriesIndex) can recover its key — buffer/reveal/mini/loading series break
    // the "index === key position" shortcut, so map each index to its id here.
    live.current.seriesKeyByIndex = series.map((s) => {
      const id = String(s.id ?? "");
      return id && !id.startsWith("__") ? id : undefined;
    });
    // Map each key to its silent companion series ids (glow overlays, buffer tail,
    // hover-reveal base), mirroring exactly what buildLineSeries emits — the hover
    // handlers highlight/downplay these together with the parent so focus:"series"
    // never strands a line's own glow or forecast tail apart from it.
    live.current.companionIdsByKey = buildCompanionIds(
      lines,
      data.length,
      enableHoverReveal
    );

    return {
      animation: false,
      dataZoom: brush?.dataZoom,
      grid: brush ? [grid, brush.miniGrid] : grid,
      series,
      tooltip: buildTooltipOption(ctx),
      xAxis: brush ? [xAxis, brush.miniXAxis] : xAxis,
      yAxis: brush ? [yAxis, brush.miniYAxis] : yAxis,
    };
  }, [
    live,
    data,
    config,
    lines,
    xCategoryKey,
    curveType,
    selectedDataKey,
    hasSelection,
    showGrid,
    xAxisSlot,
    yAxisSlot,
    tooltipSlot,
    legendSlot,
    isLoading,
    loadingData,
    showBrush,
    brushHeight,
    enableHoverHighlight,
    enableHoverReveal,
  ]);

  // ── Init + resize + theme observer (per renderer instance) ──────────────────
  useEffect(() => {
    const state = live.current;
    const mount = mountRef.current;
    const container = containerRef.current;
    if (!mount || !container) {
      return;
    }

    // Pointer state belongs to the renderer instance. A renderer switch disposes
    // that surface without emitting mouseout/globalout, so do not carry a hover,
    // reveal slice, or brush-hover treatment into the replacement instance.
    // Keep brushRange: the selected zoom window should survive the switch.
    live.current.hoveredKey = null;
    live.current.revealIndex = null;
    live.current.brushHover = { inside: false, left: false, right: false };
    setHoveredDataKey(null);

    const chart = echarts.init(mount, null, { renderer });
    echartsRef.current = chart;
    live.current.renderer = renderer;

    const resizeObserver = new ResizeObserver(() => {
      // Observers always fire once right after observe(). Repushing on that
      // no-op fire would land one frame into the intro and stomp the line's
      // reveal clip — only react when the renderer size actually changed.
      if (
        mount.clientWidth === chart.getWidth() &&
        mount.clientHeight === chart.getHeight()
      ) {
        return;
      }
      chart.resize();
      live.current.repush?.();
    });
    resizeObserver.observe(mount);

    // Light/dark flips change no React state — re-resolve and push directly.
    const themeObserver = new MutationObserver(() => {
      live.current.repush?.();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    chart.on("click", (params) => {
      const { clickableKeys: clickable } = live.current.handlers;
      const p = params as { seriesId?: string; seriesIndex?: number };
      // Symbol clicks carry seriesId; line clicks (triggerEvent) only carry
      // seriesIndex — recover the key from the last build's index map, which
      // accounts for the extra `__buffer-`/`__mini-` series interleaved between
      // the main ones (a raw seriesKeys lookup would land on the wrong key).
      const id =
        p.seriesId ??
        (typeof p.seriesIndex === "number"
          ? live.current.seriesKeyByIndex[p.seriesIndex]
          : undefined);
      if (typeof id === "string" && clickable.has(id)) {
        toggleSelection(id);
      }
    });

    // Hover-highlight bookkeeping — the canvas blur is ECharts-native
    // (emphasis.focus:"series" + blur), but the HTML legend and tooltip need to
    // know which series is hovered, and the silent glow/buffer overlays must be
    // focus-linked to their parent (they are separate series, so focus:"series"
    // would otherwise blur a line's own glow or forecast tail).
    chart.on("mouseover", (params) => {
      const { enableHoverHighlight: hoverOn, enableHoverReveal: revealOn } =
        live.current.handlers;
      // Reveal owns the hover visual, so native highlight stands down while it is on.
      if (!hoverOn || revealOn) {
        return;
      }
      // While a series is click-selected, hover highlighting is disabled — the
      // selection dim owns the canvas, so never arm hover emphasis/blur (or the
      // legend/tooltip hover dimming) until the selection clears.
      if (live.current.handlers.selectedDataKey !== null) {
        return;
      }
      const p = params as {
        seriesId?: string;
        seriesIndex?: number;
        componentType?: string;
      };
      if (p.componentType !== "series") {
        return;
      }
      const id =
        p.seriesId ??
        (typeof p.seriesIndex === "number"
          ? live.current.seriesKeyByIndex[p.seriesIndex]
          : undefined);
      if (typeof id !== "string" || id.startsWith("__")) {
        return;
      }
      live.current.hoveredKey = id;
      setHoveredDataKey(id);
      const companions = live.current.companionIdsByKey.get(id);
      if (companions) {
        for (const seriesId of companions) {
          chart.dispatchAction({ seriesId, type: "highlight" });
        }
      }
    });
    chart.on("mouseout", () => {
      const prev = live.current.hoveredKey;
      if (prev === null) {
        return;
      }
      live.current.hoveredKey = null;
      setHoveredDataKey(null);
      const companions = live.current.companionIdsByKey.get(prev);
      if (companions) {
        for (const seriesId of companions) {
          chart.dispatchAction({ seriesId, type: "downplay" });
        }
      }
    });

    // Hover-reveal: color each line up to the pointer's x-index, mute the rest.
    // Purely TARGETED series updates (real series data + muted base opacity) — we
    // NEVER rebuild the whole option on mousemove, which would replay transitions
    // and fight the tooltip's axis pointer.
    const zrReveal = chart.getZr();
    const pushReveal = (idx: number | null) => {
      const keys = live.current.handlers.seriesKeys;
      const on = idx !== null;
      chart.setOption(
        {
          series: keys.flatMap((key) => [
            {
              data: on
                ? sliceToNull(live.current.revealValues[key] ?? [], idx)
                : (live.current.revealValues[key] ?? []),
              id: key,
            },
            {
              // Gray tail keeps only the region from the cursor onward.
              data: on
                ? sliceFrom(live.current.revealValues[key] ?? [], idx)
                : (live.current.revealValues[key] ?? []),
              id: `${REVEAL_PREFIX}${key}`,
              lineStyle: { opacity: on ? 0.3 : 0 },
            },
          ]),
        },
        // NOT lazy: the highlight dispatched just below re-draws the active dot
        // the setOption wipes, so the option must be committed first — a queued
        // (lazy) update would land after the dispatch and erase the dot again.
        { silent: true }
      );
      // The per-frame setOption above cancels the axis tooltip's transient hover
      // symbol, so the <ActiveDot> never lands at the cursor. Re-assert it:
      // highlighting a real series at the cursor index draws its emphasis symbol
      // (the active dot) even with showSymbol:false; downplay clears it on exit.
      for (const key of keys) {
        chart.dispatchAction(
          on
            ? { dataIndex: idx as number, seriesId: key, type: "highlight" }
            : { seriesId: key, type: "downplay" }
        );
      }
    };
    const clearReveal = () => {
      if (live.current.revealIndex === null) {
        return;
      }
      live.current.revealIndex = null;
      pushReveal(null);
    };
    const applyReveal = (event: { offsetX?: number; offsetY?: number }) => {
      const len = live.current.dataLength;
      if (len < 1) {
        return;
      }
      const x = event.offsetX ?? -1;
      const y = event.offsetY ?? -1;
      if (!chart.containPixel({ gridIndex: 0 }, [x, y])) {
        clearReveal();
        return;
      }
      const [raw] = chart.convertFromPixel({ gridIndex: 0 }, [x, y]);
      const idx = Math.max(0, Math.min(len - 1, Math.round(raw)));
      if (idx === live.current.revealIndex) {
        return;
      }
      live.current.revealIndex = idx;
      pushReveal(idx);
    };
    const onZrRevealMove = (event: { offsetX?: number; offsetY?: number }) => {
      if (!live.current.handlers.enableHoverReveal) {
        return;
      }
      applyReveal(event);
    };
    const onZrRevealOut = () => {
      if (live.current.handlers.enableHoverReveal) {
        clearReveal();
      }
    };
    zrReveal.on("mousemove", onZrRevealMove);
    zrReveal.on("globalout", onZrRevealOut);

    chart.on("datazoom", () => {
      const option = chart.getOption() as {
        dataZoom?: { start?: number; end?: number }[];
      };
      const zoom = option.dataZoom?.[0];
      if (!zoom) {
        return;
      }

      // Ride the selection — pure zrender updates, so the drag stays 1:1.
      live.current.brushRange = {
        end: zoom.end ?? 100,
        start: zoom.start ?? 0,
      };
      syncBrushOverlayNow();

      const { onBrushChange: onChange } = live.current.handlers;
      if (!onChange) {
        return;
      }
      const len = live.current.dataLength;
      const startIndex = Math.round(((zoom.start ?? 0) / 100) * (len - 1));
      const endIndex = Math.round(((zoom.end ?? 100) / 100) * (len - 1));
      onChange({ endIndex, startIndex });
    });

    // Hover tracking for the overlay: labels show while the pointer is over the
    // brush, and each pill brightens when the pointer is near its edge.
    const zr = chart.getZr();
    const applyHover = (next: {
      inside: boolean;
      left: boolean;
      right: boolean;
    }) => {
      const prev = live.current.brushHover;
      if (
        prev.inside === next.inside &&
        prev.left === next.left &&
        prev.right === next.right
      ) {
        return;
      }
      live.current.brushHover = next;
      syncBrushOverlayNow();
    };
    const onZrMove = (event: { offsetX?: number; offsetY?: number }) => {
      const geom = live.current.brushGeom;
      if (!geom) {
        return;
      }
      const x = event.offsetX ?? -1;
      const y = event.offsetY ?? -1;
      const top = chart.getHeight() - geom.bottom - geom.height;
      const inside = y >= top - 4 && y <= top + geom.height + 4;
      const trackLeft = 8;
      const trackWidth = Math.max(chart.getWidth() - 16, 1);
      const { start, end } = live.current.brushRange;
      const selectionLeft = trackLeft + (trackWidth * start) / 100;
      const selectionRight = trackLeft + (trackWidth * end) / 100;
      applyHover({
        inside,
        left: inside && Math.abs(x - selectionLeft) <= 8,
        right: inside && Math.abs(x - selectionRight) <= 8,
      });
    };
    const onZrOut = () =>
      applyHover({ inside: false, left: false, right: false });
    zr.on("mousemove", onZrMove);
    zr.on("globalout", onZrOut);

    return () => {
      zrReveal.off("mousemove", onZrRevealMove);
      zrReveal.off("globalout", onZrRevealOut);
      zr.off("mousemove", onZrMove);
      zr.off("globalout", onZrOut);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      chart.dispose();
      echartsRef.current = null;
      state.renderer = null;
      // The overlay elements died with the zrender instance.
      state.brushOverlay = null;
      // The reveal guard belongs to the chart instance it guarded. Without this
      // reset, StrictMode's dev-only mount→unmount→remount plays the entrance on
      // the throwaway instance and the surviving one renders without it.
      state.hasRevealed = false;
    };
  }, [live, renderer, syncBrushOverlayNow, toggleSelection]);

  // ── Sync ECharts with props/theme/selection — resolve, build, push ────────────
  useEffect(() => {
    const chart = echartsRef.current;
    const container = containerRef.current;
    if (!chart || !container || live.current.renderer !== renderer) {
      return;
    }

    // Colors come from the <style> committed just before this effect ran — read
    // them here, right before the push, rather than round-tripping through state.
    live.current.resolved = resolveColors(container, config, seriesKeys);

    const push = (withEntrance: boolean) => {
      const option = buildOption();
      const merged = chartOptions ? { ...option, ...chartOptions } : option;
      Object.assign(merged, {
        animation: withEntrance,
        animationDuration: REVEAL_DURATION,
        animationDurationUpdate: 0,
      });
      // chartOptions is an untyped escape hatch — the spread erases the option's
      // shape, so re-assert it. The only cast in the file.
      chart.setOption(merged as EChartsOption, { notMerge: true });
      // Overlays live outside the option — reposition them after every push.
      syncBrushOverlayNow();
    };

    // Intro reveal — ECharts' native progressive draw, enabled only for the first
    // real render: the line traces in, dots pop up as its front passes. Every
    // later push (selection, theme, zoom) applies instantly, since notMerge would
    // otherwise replay the entrance on each of them. A loading cycle re-arms it:
    // the Recharts twin unmounts its <Line>s while loading and replays the intro
    // on remount, so data → loading → data draws in again here too.
    if (isLoading) {
      live.current.hasRevealed = false;
    }
    const shouldReveal = !live.current.hasRevealed && !isLoading;
    if (shouldReveal) {
      live.current.hasRevealed = true;
    }
    const revealEnabled =
      animation &&
      shouldReveal &&
      effectiveAnimation !== "none" &&
      !shouldReduceMotion;
    if (revealEnabled) {
      live.current.revealEndsAt = performance.now() + REVEAL_DURATION;
    }
    push(revealEnabled);

    // Theme flips and resizes re-enter here without touching React: re-read the
    // tokens (the .dark class changed, or the renderer resized) and push an
    // update-style option.
    live.current.repush = () => {
      live.current.resolved = resolveColors(container, config, seriesKeys);
      push(false);
    };
  }, [
    renderer,
    live,
    buildOption,
    chartOptions,
    isLoading,
    animation,
    effectiveAnimation,
    shouldReduceMotion,
    config,
    seriesKeys,
    syncBrushOverlayNow,
  ]);

  // ── Animated dashed stroke — rAF sweeps the dash offset while unselected ─────
  useEffect(() => {
    const chart = echartsRef.current;
    if (!chart || isLoading || live.current.renderer !== renderer) {
      return;
    }
    const animatedKeys = lines
      // A buffer line's body is solid (only its tail dashes), so the sweep skips it.
      .filter(
        (line) =>
          line.strokeVariant === "animated-dashed" && !line.enableBufferLine
      )
      .map((line) => line.dataKey);
    if (animatedKeys.length === 0 || hasSelection) {
      return;
    }

    let raf = 0;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    const begin = () => {
      const loopStart = performance.now();
      const tick = (now: number) => {
        // 0 → -6 per second
        const offset = -(((now - loopStart) / 1000) % 1) * 6;
        chart.setOption(
          {
            series: animatedKeys.map((id) => ({
              id,
              lineStyle: { dashOffset: offset },
            })),
          },
          { lazyUpdate: true, silent: true }
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Per-frame setOption churn fights the intro draw-in (each update pass
    // recomputes the reveal clip, crawling it to a standstill) — hold the dash
    // sweep until the entrance has finished.
    const delay = Math.max(0, live.current.revealEndsAt - performance.now());
    if (delay > 0) {
      delayTimer = setTimeout(begin, delay + 50);
    } else {
      begin();
    }

    return () => {
      if (delayTimer !== undefined) {
        clearTimeout(delayTimer);
      }
      cancelAnimationFrame(raf);
    };
  }, [renderer, live, lines, hasSelection, isLoading]);

  // ── Loading shimmer — rAF sweeps a bright band, regenerating data off-screen ─
  useEffect(() => {
    const chart = echartsRef.current;
    if (!chart || !isLoading || live.current.renderer !== renderer) {
      return;
    }

    let raf = 0;
    let lastPhase = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const phase =
        ((((now - start) / LOADING_ANIMATION_DURATION) % 1) + 1) % 1;
      // Wrapped past 1 → the band is off-screen; swap in fresh random data.
      if (phase < lastPhase) {
        live.current.loadingRows = getLoadingData(loadingPoints);
      }
      lastPhase = phase;

      // Read tokens per frame, so a theme flip mid-loading retints the shimmer.
      const foreground =
        live.current.resolved?.tokens.foreground ?? "rgba(120, 120, 120, 1)";
      // Sweep the clip window from fully off-screen left to fully off-screen
      // right, leaned 45°. The gradient uses ABSOLUTE pixel coordinates so the
      // window lands at the same place along the stroke regardless of the wave's
      // bounding box.
      const w = chart.getWidth();
      const h = chart.getHeight();
      if (!w || !h) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // Farthest plot corner projected onto the 45° axis — keeps the sweep
      // tight instead of dawdling off-plot at the end of each loop.
      const maxT = (w + h) / (2 * w);
      const center =
        phase * (maxT + 2 * LOADING_SHIMMER_BAND) - LOADING_SHIMMER_BAND;
      const clip = (peak: number) =>
        new echarts.graphic.LinearGradient(
          0,
          0,
          w,
          w,
          shimmerWindowStops(center, foreground, peak),
          true
        );
      chart.setOption(
        {
          series: [
            {
              data: loadingData(),
              id: "__loading",
              lineStyle: { color: clip(LOADING_STROKE_OPACITY), width: 1 },
            },
          ],
        },
        { lazyUpdate: true, silent: true }
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [renderer, live, isLoading, loadingPoints, loadingData]);

  // ── Legend overlay position ──────────────────────────────────────────────────
  // Insets match the Recharts legend's breathing room inside the plot frame.
  const legendStyle: CSSProperties = {
    left: 16,
    pointerEvents: "auto",
    position: "absolute",
    right: 16,
    ...legendVerticalStyle(legendSlot.verticalAlign, showBrush, brushHeight),
  };

  return (
    <div
      ref={containerRef}
      data-chart={chartId}
      className={`relative flex flex-col text-xs ${className ?? ""}`}
    >
      <style>{css}</style>

      <div className="relative min-h-0 w-full flex-1">
        <div ref={mountRef} className="h-full min-h-0 w-full" />
      </div>

      {legendSlot.present && !isLoading && (
        <LegendOverlay
          seriesKeys={seriesKeys}
          config={config}
          variant={legendSlot.variant}
          align={legendSlot.align}
          verticalAlign={legendSlot.verticalAlign}
          selectedKey={selectedDataKey}
          hoveredKey={hoveredDataKey}
          isClickable={legendSlot.isClickable}
          onToggle={toggleSelection}
          style={legendStyle}
        />
      )}

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-primary bg-background flex items-center justify-center gap-2 rounded-md border px-2 py-0.5 text-sm"
          >
            <div className="border-border border-t-primary h-3 w-3 animate-spin rounded-full border" />
            <span>Loading</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Compound API: every part hangs off the root as a static member, so a consumer
// writes <EChartsLineChart.Line/>, <EChartsLineChart.Tooltip/>, … from a single
// import — no colliding named marker exports when several charts share one file.
EChartsLineChart.Line = Line;
EChartsLineChart.Dot = Dot;
EChartsLineChart.ActiveDot = ActiveDot;
EChartsLineChart.XAxis = XAxis;
EChartsLineChart.YAxis = YAxis;
EChartsLineChart.Grid = Grid;
EChartsLineChart.Tooltip = Tooltip;
EChartsLineChart.Legend = Legend;
EChartsLineChart.Brush = Brush;
