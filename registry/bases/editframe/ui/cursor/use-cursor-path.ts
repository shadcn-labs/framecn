"use client";

import { clamp01, easings } from "@/lib/framecn-ui";
import type { EasingName } from "@/lib/framecn-ui";
import type { CursorStyle } from "@/registry/bases/editframe/ui/cursor";

export interface CursorWaypoint {
  at: number;
  x: number;
  y: number;
  duration?: number;
  click?: boolean;
  press?: boolean;
  easing?: EasingName;
}

export const DEFAULT_DURATION = 24;

export const CLICK_FRAMES = 16;

export const PRESS_FRAMES = 8;

export interface CursorPathOptions {
  speed?: number;
  defaultDuration?: number;
}
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const ripplePhase = (
  framesSinceClick: number
): {
  rippleOpacity: number;
  rippleScale: number;
} => {
  if (framesSinceClick < 0 || framesSinceClick >= CLICK_FRAMES) {
    return { rippleOpacity: 0, rippleScale: 0 };
  }
  const p = clamp01(framesSinceClick / CLICK_FRAMES);
  return {
    rippleOpacity: 0.5 * (1 - p),
    rippleScale: 2.5 * easings.out(p),
  };
};

export const clickPress = (framesSinceClick: number): number => {
  if (framesSinceClick < 0 || framesSinceClick >= PRESS_FRAMES) {
    return 1;
  }
  const half = PRESS_FRAMES / 2;
  const p =
    framesSinceClick < half
      ? framesSinceClick / half
      : 1 - (framesSinceClick - half) / half;
  return 1 - clamp01(p);
};

export const useCursorPath = (
  waypoints: CursorWaypoint[],
  frame: number = 0,
  opts: CursorPathOptions = {}
): CursorStyle => {
  const { speed = 1 } = opts;
  const raw = frame * speed;
  return cursorPathAt(waypoints, raw, opts);
};

export const cursorPathAt = (
  waypoints: CursorWaypoint[],
  raw: number,
  opts: CursorPathOptions = {}
): CursorStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;

  if (waypoints.length === 0) {
    return { pressScale: 1, rippleOpacity: 0, rippleScale: 0, scale: 1, x: 0, y: 0 };
  }

  const first = waypoints[0];

  if (raw <= first.at) {
    return {
      pressScale: 1,
      rippleOpacity: 0,
      rippleScale: 0,
      scale: 1,
      x: first.x,
      y: first.y,
    };
  }

  let toIndex = waypoints.length - 1;
  for (let i = 1; i < waypoints.length; i++) {
    if (waypoints[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastWp = waypoints.at(-1);
  if (!lastWp) {
    return {
      pressScale: 1,
      rippleOpacity: 0,
      rippleScale: 1,
      scale: 1,
      x: 0,
      y: 0,
    };
  }

  const pastLast = raw >= lastWp.at;
  const to = pastLast ? lastWp : waypoints[toIndex];
  const from = pastLast ? lastWp : waypoints[toIndex - 1];

  if (!to || !from) {
    return {
      pressScale: 1,
      rippleOpacity: 0,
      rippleScale: 1,
      scale: 1,
      x: 0,
      y: 0,
    };
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "inOut"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  const x = lerp(from.x, to.x, t);
  const y = lerp(from.y, to.y, t);

  let lastClickAt = -Infinity;
  for (const wp of waypoints) {
    if (wp.click && wp.at <= raw && wp.at > lastClickAt) {
      lastClickAt = wp.at;
    }
  }
  const sinceClick = lastClickAt === -Infinity ? -1 : raw - lastClickAt;
  const ripple = ripplePhase(sinceClick);
  const clickDip = clickPress(sinceClick);

  const holdWp = pastLast ? lastWp : from;
  const heldPress = holdWp?.press ? 0 : 1;

  const pressScale = Math.min(clickDip, heldPress);

  return {
    pressScale,
    rippleOpacity: ripple.rippleOpacity,
    rippleScale: ripple.rippleScale,
    scale: 1,
    x,
    y,
  };
};
