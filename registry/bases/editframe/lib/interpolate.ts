export type Extrapolate = "clamp" | "extend" | "identity" | "wrap";

export interface InterpolateOptions {
  extrapolateLeft?: Extrapolate;
  extrapolateRight?: Extrapolate;
  easing?: (t: number) => number;
}

const applyExtrapolate = (
  value: number,
  min: number,
  max: number,
  mode: Extrapolate
): number => {
  if (value < min) {
    if (mode === "identity") {
      return value;
    }
    if (mode === "clamp") {
      return min;
    }
    if (mode === "wrap") {
      const range = max - min;
      return ((((value - min) % range) + range) % range) + min;
    }
  }
  if (value > max) {
    if (mode === "identity") {
      return value;
    }
    if (mode === "clamp") {
      return max;
    }
    if (mode === "wrap") {
      const range = max - min;
      return ((((value - min) % range) + range) % range) + min;
    }
  }
  return value;
};

const findRange = (input: number, inputRange: readonly number[]): number => {
  for (let i = 1; i < inputRange.length - 1; i += 1) {
    if (inputRange[i] >= input) {
      return i - 1;
    }
  }
  return inputRange.length - 2;
};

export const interpolate = (
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options: InterpolateOptions = {}
): number => {
  const {
    extrapolateLeft = "extend",
    extrapolateRight = "extend",
    easing = (t) => t,
  } = options;

  if (inputRange.length !== outputRange.length || inputRange.length < 2) {
    throw new Error(
      "inputRange and outputRange must have the same length (>= 2)"
    );
  }

  const range = findRange(input, inputRange);
  const inputMin = inputRange[range];
  const inputMax = inputRange[range + 1];
  const outputMin = outputRange[range];
  const outputMax = outputRange[range + 1];

  let result = input;
  if (result < inputMin) {
    result = applyExtrapolate(result, inputMin, inputMax, extrapolateLeft);
  }
  if (result > inputMax) {
    result = applyExtrapolate(result, inputMin, inputMax, extrapolateRight);
  }

  if (outputMin === outputMax) {
    return outputMin;
  }

  const progress = (result - inputMin) / (inputMax - inputMin);
  return easing(progress) * (outputMax - outputMin) + outputMin;
};
