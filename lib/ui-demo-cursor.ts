import { H, W } from "@/lib/customizer-config";

export { H, W };

/** Composition center — matches `left: 50%; top: 50%` centered content. */
export const centerX = W / 2;
export const centerY = H / 2;

export const parkTopLeft = { x: 80, y: 60 } as const;

export const atCenter = (dx = 0, dy = 0) => ({
  x: centerX + dx,
  y: centerY + dy,
});

/** Pointer tip over a flex-centered button. */
export const centeredButtonTarget = atCenter();

/** Slider thumb x at a 0–100 value for a centered track. */
export const sliderThumbAt = (value: number, trackWidth: number) => ({
  x: centerX - trackWidth / 2 + (value / 100) * trackWidth,
  y: centerY,
});

/** Toggle-group segment center for default geometry (pad 4, width 88). */
export const toggleSegmentCenter = (
  index: number,
  segmentWidth = 88,
  pad = 4,
  segmentCount = 2
) => {
  const trackWidth = pad * 2 + segmentWidth * segmentCount;
  const trackLeft = centerX - trackWidth / 2;
  return {
    x: trackLeft + pad + segmentWidth * index + segmentWidth / 2,
    y: centerY,
  };
};

/** Resizable divider handle for a centered panel. */
export const resizableHandleAt = (ratio: number, panelWidth = 440) => ({
  x: centerX - panelWidth / 2 + panelWidth * ratio,
  y: centerY,
});

/** Context-menu click point offset from the centered card. */
export const contextMenuTargets = (offsetX = 20, offsetY = 25) => {
  const click = atCenter(offsetX, offsetY);
  return {
    click,
    leave: { x: click.x + 180, y: click.y + 80 },
    row1: { x: click.x + 70, y: click.y + 60 },
  };
};
