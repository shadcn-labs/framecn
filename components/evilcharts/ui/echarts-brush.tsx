import type { DataZoomComponentOption } from "echarts/components";
import * as echarts from "echarts/core";
import type { FC } from "react";

import { withAlpha } from "@/components/evilcharts/ui/echarts-chart";
import type { ResolvedColors } from "@/components/evilcharts/ui/echarts-chart";

type EChartsInstance = ReturnType<typeof echarts.init>;

// Brush frame, × border alpha (evil-brush uses the full token).
const BRUSH_BORDER_OPACITY = 1;

export { BRUSH_BORDER_OPACITY };

// ─────────────────────────────────────────────────────────────────────────────
// Brush marker — the declarative `<Chart.Brush/>` child. Rendering nothing, its
// PRESENCE turns the brush on (replacing the old showBrush prop) and its props
// carry the brush's height, handle-label formatter, and range callback. Shared
// so every cartesian chart attaches the SAME component to its root.
// ─────────────────────────────────────────────────────────────────────────────

export interface BrushProps {
  // Brush preview strip height in px (default 56).
  height?: number;
  // Formats the range-handle labels.
  formatLabel?: (value: string, index: number) => string;
  // Fires as the range moves.
  onChange?: (range: { startIndex: number; endIndex: number }) => void;
}

/** Declares the zoom brush below the chart. Presence renders it; renders nothing itself. */
export const Brush: FC<BrushProps> = () => null;

// ─────────────────────────────────────────────────────────────────────────────
// Brush overlays — the evil-brush look: a rounded border around the SELECTED
// range, dimmed unselected sides, centered grip-dot handle pills, and range
// label pills below the frame. None of that is a dataZoom capability. They are
// raw zrender elements updated imperatively — routing them through setOption
// re-renders the dataZoom component mid-drag, resetting its drag anchor (the
// handle progressively lags the pointer).
// ─────────────────────────────────────────────────────────────────────────────

export interface BrushRange {
  start: number;
  end: number;
}
export interface BrushGeometry {
  bottom: number;
  height: number;
}

export interface BrushOverlayParams {
  range: BrushRange;
  geom: BrushGeometry;
  size: { width: number; height: number };
  tokens: ResolvedColors["tokens"];
  labels: { start: string; end: string } | null;
  showLabels: boolean;
  hover: { left: boolean; right: boolean };
}

type ZrRect = InstanceType<typeof echarts.graphic.Rect>;
type ZrCircle = InstanceType<typeof echarts.graphic.Circle>;
type ZrText = InstanceType<typeof echarts.graphic.Text>;

export interface BrushOverlayElements {
  dimLeft: ZrRect;
  dimRight: ZrRect;
  frame: ZrRect;
  pillLeft: ZrRect;
  pillRight: ZrRect;
  // 3 left + 3 right.
  grips: ZrCircle[];
  labelStart: ZrText;
  labelEnd: ZrText;
}

export const syncBrushOverlay = (
  chart: EChartsInstance,
  store: { brushOverlay: BrushOverlayElements | null },
  params: BrushOverlayParams | null
) => {
  const zr = chart.getZr();
  if (!zr) {
    return;
  }

  if (!params) {
    if (store.brushOverlay) {
      const { grips, ...rest } = store.brushOverlay;
      for (const el of [...Object.values(rest), ...grips]) {
        zr.remove(el);
      }
      store.brushOverlay = null;
    }
    return;
  }

  if (!store.brushOverlay) {
    const rect = (z: number) =>
      new echarts.graphic.Rect({ shape: {}, silent: true, z });
    const els: BrushOverlayElements = {
      dimLeft: rect(100),
      dimRight: rect(100),
      frame: rect(101),
      grips: Array.from(
        { length: 6 },
        () => new echarts.graphic.Circle({ shape: {}, silent: true, z: 103 })
      ),
      labelEnd: new echarts.graphic.Text({ silent: true, z: 104 }),
      labelStart: new echarts.graphic.Text({ silent: true, z: 104 }),
      pillLeft: rect(102),
      pillRight: rect(102),
    };
    const { grips, ...rest } = els;
    for (const el of [...Object.values(rest), ...grips]) {
      zr.add(el);
    }
    store.brushOverlay = els;
  }

  const els = store.brushOverlay;
  const { range, geom, size, tokens, labels, showLabels, hover } = params;

  const trackLeft = 8;
  const trackRight = Math.max(size.width - 8, trackLeft);
  const trackWidth = trackRight - trackLeft;
  const top = size.height - geom.bottom - geom.height;
  const centerY = top + geom.height / 2;
  const selectionLeft = trackLeft + (trackWidth * range.start) / 100;
  const selectionRight = trackLeft + (trackWidth * range.end) / 100;

  const dimFill = withAlpha(tokens.background, 0.7);
  els.dimLeft.setShape({
    height: geom.height,
    width: Math.max(selectionLeft - trackLeft, 0),
    x: trackLeft,
    y: top,
  });
  els.dimLeft.setStyle({ fill: dimFill });
  els.dimRight.setShape({
    height: geom.height,
    width: Math.max(trackRight - selectionRight, 0),
    x: selectionRight,
    y: top,
  });
  els.dimRight.setStyle({ fill: dimFill });

  els.frame.setShape({
    height: geom.height,
    r: 6,
    width: Math.max(selectionRight - selectionLeft, 0),
    x: selectionLeft,
    y: top,
  });
  els.frame.setStyle({
    fill: "none",
    lineWidth: 1,
    stroke: withAlpha(tokens.border, BRUSH_BORDER_OPACITY),
  });

  // Handle pills: evil-brush's 6×16 grip pill, centered on the selection edge,
  // brightening to foreground on hover/drag.
  const pill = (el: ZrRect, x: number, hovered: boolean) => {
    el.setShape({ height: 16, r: 3, width: 6, x: x - 3, y: centerY - 8 });
    el.setStyle({ fill: hovered ? tokens.foreground : tokens.mutedForeground });
  };
  pill(els.pillLeft, selectionLeft, hover.left);
  pill(els.pillRight, selectionRight, hover.right);

  const gripFill = withAlpha(tokens.background, 0.7);
  for (let i = 0; i < 3; i += 1) {
    const offset = (i - 1) * 4;
    els.grips[i].setShape({ cx: selectionLeft, cy: centerY + offset, r: 1 });
    els.grips[i].setStyle({ fill: gripFill });
    els.grips[i + 3].setShape({
      cx: selectionRight,
      cy: centerY + offset,
      r: 1,
    });
    els.grips[i + 3].setStyle({ fill: gripFill });
  }

  // Range label pills straddle the frame's bottom line — an overlay, so they
  // occupy no layout space; half the pill sits above the line, half below. Each
  // pill grows INWARD from its handle with a small inset, like the Recharts
  // labels, instead of hanging past the frame edge.
  const label = (
    el: ZrText,
    text: string,
    x: number,
    align: "left" | "right"
  ) => {
    el.setStyle({
      align,
      backgroundColor: tokens.foreground,
      borderRadius: 4,
      fill: tokens.background,
      font: "500 9px system-ui, sans-serif",
      padding: [2, 5],
      text,
      verticalAlign: "middle",
      x:
        align === "left"
          ? Math.max(x + 6, trackLeft + 2)
          : Math.min(x - 6, trackRight - 2),
      y: top + geom.height,
    });
    el.attr("invisible", !showLabels || !text);
  };
  label(els.labelStart, labels?.start ?? "", selectionLeft, "left");
  label(els.labelEnd, labels?.end ?? "", selectionRight, "right");
};

// ─────────────────────────────────────────────────────────────────────────────
// dataZoom slider — the transparent drag layer laid over the mini chart. Fully
// chart-agnostic: the visible frame/handles/labels are the graphic overlays
// above; this provides interaction only. Both zoom entries target only the MAIN
// x-axis (index 0), so the mini chart never filters itself. The per-chart
// mini-series (which differ per chart type) are built by the chart, not here.
// ─────────────────────────────────────────────────────────────────────────────

export const buildBrushDataZoom = (params: {
  brushBottom: number;
  brushHeight: number;
  brushRange: BrushRange;
  fillerColor: string;
}): DataZoomComponentOption[] => {
  const { brushBottom, brushHeight, brushRange, fillerColor } = params;

  return [
    {
      backgroundColor: "transparent",
      // The visible frame is the graphic overlay riding the selection —
      // the component's own static border stays hidden.
      borderColor: "transparent",
      bottom: brushBottom,
      brushSelect: false,
      dataBackground: { areaStyle: { opacity: 0 }, lineStyle: { opacity: 0 } },
      emphasis: { handleStyle: { opacity: 0 } },
      // Carry the live range through every rebuild — a notMerge push
      // without start/end would reset the zoom to the full extent.
      end: brushRange.end,
      fillerColor,
      // Interaction only — the visible pills are graphic overlays (see
      // syncBrushOverlay). Kept generous for an easy grab target.
      handleIcon:
        "path://M -3 -5 L -3 5 A 3 3 0 0 0 3 5 L 3 -5 A 3 3 0 0 0 -3 -5 Z",
      handleSize: "35%",
      handleStyle: { opacity: 0 },
      height: brushHeight,
      left: 8,
      moveHandleSize: 0,
      right: 8,
      selectedDataBackground: {
        areaStyle: { opacity: 0 },
        lineStyle: { opacity: 0 },
      },
      show: true,
      // Range labels are overlay pills below the frame (see
      // syncBrushOverlay) — the native detail text renders INSIDE the
      // track, which is not the evil-brush look.
      showDetail: false,
      start: brushRange.start,
      type: "slider",
      xAxisIndex: [0],
    },
    { type: "inside", xAxisIndex: [0] },
  ];
};
