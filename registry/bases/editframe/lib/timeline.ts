export const framesFor = (
  d: number | { seconds: number },
  fps: number
): number => (typeof d === "number" ? d : Math.round(d.seconds * fps));

export const revealCount = (
  localFrame: number,
  fps: number,
  len: number,
  cps: number
): number => {
  const over = (len / cps) * fps;
  if (over <= 0) {
    return len;
  }
  return Math.max(0, Math.min(len, Math.floor((localFrame / over) * len)));
};

export const clamp01 = (t: number): number => Math.max(0, Math.min(1, t));

export const revealedText = (full: string, count: number): string => {
  const c = Math.max(0, Math.min(full.length, Math.floor(count)));
  return full.slice(0, c);
};

export interface TypewriterOptions {
  cps?: number;
  speed?: number;
  startFrame?: number;
}

export interface TypewriterState {
  text: string;
  count: number;
  done: boolean;
  typing: boolean;
}

export const useTypewriter = (
  full: string,
  frame: number,
  fps: number,
  options: TypewriterOptions = {}
): TypewriterState => {
  const { cps = 20, speed = 1, startFrame = 0 } = options;
  const local = frame * speed - startFrame;
  const count = local <= 0 ? 0 : revealCount(local, fps, full.length, cps);
  return {
    count,
    done: count >= full.length,
    text: revealedText(full, count),
    typing: count > 0 && count < full.length,
  };
};
