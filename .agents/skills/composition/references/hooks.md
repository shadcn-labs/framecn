---
description: "React hooks for reading current playback time, pan/zoom transform, and media loading state from within composition components."
---


# Hooks

React hooks for accessing timing information and transforms.

## useTimingInfo

Access timing information for the current element.

**Important**: This hook requires `TimelineRoot` to work correctly in render clones. See [timeline-root.md](references/timeline-root.md).

### Import

```tsx
import { useTimingInfo } from "@editframe/react";
```

### Returns

```tsx
{
  ref: RefObject<HTMLElement>;           // Attach to your component
  ownCurrentTimeMs: number;              // Current time within this element
  durationMs: number;                    // Total duration of element
  percentComplete: number;               // Progress (0-1)
  isActive: boolean;                     // Is currently playing
  startTimeMs: number;                   // Start time in parent
  endTimeMs: number;                     // End time in parent
}
```

### Basic Usage

```tsx
import { Timegroup, useTimingInfo } from "@editframe/react";

const AnimatedScene = () => {
  const { ref, percentComplete, ownCurrentTimeMs } = useTimingInfo();
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="5s" className="absolute w-full h-full">
      <div style={{ opacity: percentComplete }}>
        Fading in... {(ownCurrentTimeMs / 1000).toFixed(2)}s
      </div>
    </Timegroup>
  );
};
```

### Fade In/Out

```tsx
const FadeInOut = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();
  
  // Fade in first half, fade out second half
  const opacity = percentComplete < 0.5 
    ? percentComplete * 2 
    : (1 - percentComplete) * 2;
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="5s" className="absolute w-full h-full">
      <div style={{ opacity }}>
        {children}
      </div>
    </Timegroup>
  );
};
```

### Scale Animation

```tsx
const ScaleIn = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="3s" className="absolute w-full h-full flex items-center justify-center">
      <div style={{ transform: `scale(${percentComplete})` }}>
        {children}
      </div>
    </Timegroup>
  );
};
```

### Progress Bar

```tsx
const SceneWithProgress = () => {
  const { ref, percentComplete, ownCurrentTimeMs, durationMs } = useTimingInfo();
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="10s" className="absolute w-full h-full bg-black flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-4">Scene Content</h1>
      
      <div className="w-96 bg-gray-700 h-2 rounded">
        <div 
          className="bg-blue-500 h-full rounded transition-all"
          style={{ width: `${percentComplete * 100}%` }}
        />
      </div>
      
      <p className="text-white mt-2">
        {(ownCurrentTimeMs / 1000).toFixed(1)}s / {(durationMs / 1000).toFixed(1)}s
      </p>
    </Timegroup>
  );
};
```

### Conditional Rendering

```tsx
const TimedReveal = () => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="10s" className="absolute w-full h-full">
      {ownCurrentTimeMs > 2000 && (
        <Text duration="8s" className="text-white text-4xl">
          Appears after 2 seconds
        </Text>
      )}
      
      {ownCurrentTimeMs > 5000 && (
        <Image src="/assets/logo.png" className="absolute top-8 right-8 w-32" />
      )}
    </Timegroup>
  );
};
```

### Complex Animation

```tsx
const ComplexAnimation = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();
  
  // Different animations per stage
  let transform = '';
  let opacity = 1;
  
  if (percentComplete < 0.25) {
    // Slide in from left
    const progress = percentComplete * 4;
    transform = `translateX(${-100 + progress * 100}%)`;
  } else if (percentComplete < 0.75) {
    // Stay centered
    transform = 'translateX(0)';
  } else {
    // Slide out to right
    const progress = (percentComplete - 0.75) * 4;
    transform = `translateX(${progress * 100}%)`;
    opacity = 1 - progress;
  }
  
  return (
    <Timegroup ref={ref} mode="fixed" duration="8s" className="absolute w-full h-full flex items-center justify-center">
      <div style={{ transform, opacity }}>
        {children}
      </div>
    </Timegroup>
  );
};
```

## usePanZoomTransform

Access pan/zoom transform values for synchronized UI elements.

### Import

```tsx
import { usePanZoomTransform } from "@editframe/react";
```

### Returns

```tsx
{
  x: number;      // Pan X offset
  y: number;      // Pan Y offset
  scale: number;  // Zoom scale
}
```

### Basic Usage

```tsx
import { PanZoom, usePanZoomTransform } from "@editframe/react";

const SyncedOverlay = () => {
  const { x, y, scale } = usePanZoomTransform();
  
  return (
    <div 
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
      }}
    >
      <div className="text-white text-2xl">
        Follows pan/zoom
      </div>
    </div>
  );
};
```

### Display Transform Info

```tsx
const TransformInfo = () => {
  const { x, y, scale } = usePanZoomTransform();
  
  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-sm font-mono">
      <div>X: {x.toFixed(0)}px</div>
      <div>Y: {y.toFixed(0)}px</div>
      <div>Scale: {scale.toFixed(2)}x</div>
    </div>
  );
};
```
