# React Three Fiber in Editframe Compositions

Use `@react-three/fiber` (R3F) for component-based 3D scenes inside Editframe compositions. R3F wraps Three.js in React components, enabling declarative scene construction, hooks-based animation, and clean separation of concerns.

The core challenge: R3F manages its own render loop, but Editframe compositions need frame-accurate time control via `addFrameTask`. This guide shows how to bridge the two systems.

## Dependencies

```bash
telecine/scripts/npm install three @react-three/fiber @react-three/drei
telecine/scripts/npm install --save-dev @types/three
```

`@react-three/drei` provides common helpers (lights, controls, text, etc.) but is optional.

## Architecture: Controlled Render Loop

R3F's `<Canvas>` runs its own `requestAnimationFrame` loop. For Editframe integration, we disable the internal loop and drive renders from `addFrameTask`:

```tsx
<Canvas frameloop="never" gl={{ preserveDrawingBuffer: true }}>
  <SceneContent timeMs={currentTimeMs} />
</Canvas>
```

- `frameloop="never"` — stops R3F's internal animation loop
- `preserveDrawingBuffer: true` — required for `renderToVideo` frame capture
- `timeMs` prop — passed from the Editframe frame task, drives all animation

## Basic Pattern

```tsx
import { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Timegroup, Preview, Scrubber, TogglePlay } from "@editframe/react";

function MyScene({ timeMs }: { timeMs: number }) {
  const { gl, scene, camera } = useThree();

  // Advance the scene based on composition time
  useEffect(() => {
    // Position objects based on timeMs (pure function of time)
    // ...
    gl.render(scene, camera);
    gl.getContext().finish(); // required for renderToVideo
  }, [timeMs, gl, scene, camera]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 8, 5]} intensity={1.8} castShadow />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#448aff" clearcoat={1} />
      </mesh>
    </>
  );
}

function My3DComposition() {
  const [timeMs, setTimeMs] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tg = containerRef.current?.querySelector("ef-timegroup");
    if (!tg) return;
    (tg as any).addFrameTask?.((info: { ownCurrentTimeMs: number }) => {
      setTimeMs(info.ownCurrentTimeMs);
    });
  }, []);

  return (
    <div ref={containerRef}>
      <Preview id="my-3d" loop>
        <Timegroup mode="fixed" duration="10s" style={{ position: "relative", aspectRatio: "16/10" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Canvas frameloop="never" gl={{ preserveDrawingBuffer: true }}>
              <MyScene timeMs={timeMs} />
            </Canvas>
          </div>
        </Timegroup>
      </Preview>
    </div>
  );
}
```

## Manual Render Trigger

With `frameloop="never"`, R3F doesn't render automatically. You must trigger renders explicitly. The cleanest approach is via `useFrame` with `invalidate`:

```tsx
import { useFrame, useThree } from "@react-three/fiber";

function AnimatedScene({ timeMs }: { timeMs: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();

  // When timeMs changes, update and invalidate
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = timeMs * 0.001;
    }
    invalidate(); // tells R3F to render one frame
  }, [timeMs, invalidate]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshPhysicalMaterial color="#448aff" />
    </mesh>
  );
}
```

Alternatively, use `frameloop="demand"` which renders only when `invalidate()` is called. This is more efficient than `"never"` + manual `gl.render()`.

## Scene Components (Declarative)

The power of R3F: complex scenes are just React components:

```tsx
function TimelineSegment({ index, position, opacity }: {
  index: number;
  position: [number, number, number];
  opacity: number;
}) {
  return (
    <group position={position}>
      {/* Container backdrop */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.1, 0.4, 0.35]} />
        <meshStandardMaterial color="#3d4158" transparent opacity={opacity * 0.6} />
      </mesh>

      {/* Video track */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.1, 0.16, 0.35]} />
        <meshPhysicalMaterial
          color="#448aff" clearcoat={1} clearcoatRoughness={0.15}
          transparent opacity={opacity}
          emissive="#448aff" emissiveIntensity={0.1}
        />
      </mesh>

      {/* Audio track (shorter, offset) */}
      <mesh position={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.10, 0.35]} />
        <meshPhysicalMaterial
          color="#1de9b6" clearcoat={1}
          transparent opacity={opacity}
        />
      </mesh>
    </group>
  );
}

function ParallelFragmentsScene({ timeMs }: { timeMs: number }) {
  const segments = useMemo(() => computeSegmentPositions(timeMs), [timeMs]);

  return (
    <>
      <Lighting />
      <Floor />
      {segments.map((seg, i) => (
        <TimelineSegment key={i} index={i} {...seg} />
      ))}
    </>
  );
}
```

## Render Clone Support (for renderToVideo)

R3F components run in React's tree. When `renderToVideo` clones the timegroup DOM, React components inside the clone won't mount (no React hydration on clones).

**Solution**: Use the `initializer` pattern from the vanilla Three.js skill. The initializer for clones should set up a vanilla Three.js scene, NOT R3F components. R3F is for the live/interactive version; clones use the vanilla scene module.

```tsx
// Live: R3F component (nice dev experience, hot reload)
// Render clone: vanilla Three.js scene (works without React)

tg.initializer = (instance) => {
  if (instance === tg) return; // prime uses R3F

  // Clone uses vanilla scene (same visual output, different implementation)
  let scene = null;
  instance.addFrameTask(({ ownCurrentTimeMs, durationMs }) => {
    if (!scene) {
      const cvs = instance.querySelector("canvas");
      if (!cvs) return;
      scene = createVanillaScene(cvs); // from your scene module
      scene.resize(cvs.clientWidth || 800, cvs.clientHeight || 500);
    }
    scene.update(ownCurrentTimeMs, durationMs);
  });
};
```

This dual approach gives you:
- **R3F for development**: Component architecture, hot reload, React DevTools, drei helpers
- **Vanilla for rendering**: Works in DOM clones, no React dependency, reliable frame capture

## Drei Helpers

`@react-three/drei` provides useful abstractions:

```tsx
import { Text, Environment, ContactShadows, Float } from "@react-three/drei";

function EnhancedScene() {
  return (
    <>
      {/* 3D text (uses troika-three-text under the hood) */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#82b1ff"
        anchorX="center"
        anchorY="middle"
      >
        4× faster
      </Text>

      {/* Environment lighting from HDR */}
      <Environment preset="studio" />

      {/* Contact shadows (soft, ground-plane shadows) */}
      <ContactShadows position={[0, -0.7, 0]} opacity={0.4} blur={2} />

      {/* Floating animation */}
      <Float speed={2} rotationIntensity={0.5}>
        <mesh><boxGeometry /><meshPhysicalMaterial /></mesh>
      </Float>
    </>
  );
}
```

## Canvas Configuration

```tsx
<Canvas
  frameloop="demand"          // render only on invalidate()
  shadows                      // enable shadow maps
  dpr={[1, 2]}                // responsive pixel ratio
  gl={{
    preserveDrawingBuffer: true,   // for renderToVideo
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.8,
  }}
  camera={{
    fov: 50,
    position: [0, 0.8, 2.8],
    near: 0.1,
    far: 100,
  }}
>
```

## Performance Notes

- `frameloop="demand"` + `invalidate()` is more efficient than `"never"` + manual render
- Use `useMemo` for geometry/material creation (avoid recreating every frame)
- R3F's reconciler batches React updates — prop changes don't cause immediate re-renders
- For complex scenes with many animated objects, consider `useFrame` over `useEffect` for time-sensitive updates
- The `<Canvas>` component creates its own React root — state doesn't cross the boundary without props or context

## Full-Canvas CompositionCanvas in FitScale

`CompositionCanvas` uses `react-use-measure` which calls `getBoundingClientRect()`. Inside a `FitScale`, this returns the **visual (post-transform) size** rather than the composition's CSS layout size. For a 1920×1080 composition scaled to a 798×448 display, the R3F canvas will be sized at 798×448 and positioned at the container's top-left — resulting in 3D content in the top-left quadrant of the composition.

**Fix**: add a CSS class with `!important` overrides to force the canvas to fill its container:

```css
.cl-canvas-full canvas {
  width: 100% !important;
  height: 100% !important;
}
```

Then pass `containerClassName="cl-canvas-full"` to `CompositionCanvas`. The canvas is CSS-stretched to fill the container visually. Since the composition and display both use 16:9, there is no distortion.

This fix applies **only to full-canvas Three.js scenes**. Canvas regions intentionally sized smaller than the composition (e.g. a 130px-tall codename region) should not use this class.

## When to Use R3F vs Vanilla Three.js

| Consideration | R3F | Vanilla |
|---|---|---|
| Development speed | Faster (components, hooks, drei) | Slower (imperative) |
| Hot reload | Yes | Manual |
| Render clones | Needs vanilla fallback | Works natively |
| Bundle size | Larger (@react-three/fiber + drei) | Smaller (just three) |
| Scene complexity | Scales better (component tree) | Gets messy at scale |
| Animation control | useFrame + invalidate | Direct update() calls |

**Recommendation**: Use R3F for interactive compositions and development. Keep a vanilla scene module as the render fallback. Both should produce identical visual output from the same time input.
