---
description: Integrate React Three Fiber 3D scenes into Editframe compositions with frame-accurate scrubbing and video export support.
---


# React Three Fiber Integration


## Functions

- **renderOffscreen(children: React.ReactNode): void** - Worker-side entry point for offscreen R3F rendering
  - Returns: void


Editframe provides first-class integration with React Three Fiber (R3F) for rendering 3D scenes in video compositions. Import from `@editframe/react/r3f` to access components and utilities for synchronizing Three.js animations with your timeline.
Editframe provides first-class integration with React Three Fiber (R3F) for rendering 3D scenes in video compositions.

## Import

```tsx
import {
  CompositionCanvas,
  OffscreenCompositionCanvas,
  useCompositionTime
} from "@editframe/react/r3f";
```

## CompositionCanvas

Renders a React Three Fiber scene on the main thread with automatic timeline synchronization.
Main-thread R3F canvas that automatically synchronizes with Editframe's timeline.

### Basic Usage

```tsx
import { Timegroup } from "@editframe/react";
import { CompositionCanvas, useCompositionTime } from "@editframe/react/r3f";
import { Box } from "@react-three/drei";

function RotatingBox() {
  const { timeMs } = useCompositionTime();
  const rotation = (timeMs / 1000) * Math.PI * 2; // Full rotation per second

  return (
    <Box rotation={[0, rotation, 0]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

export const Video = () => {
  return (
    <Timegroup mode="fixed" duration="5s" className="w-[1920px] h-[1080px]">
      <CompositionCanvas shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBox />
      </CompositionCanvas>
    </Timegroup>
  );
};
```

### Features

- **Automatic Time Sync:** Integrates with `ef-timegroup`'s `addFrameTask` to synchronize 3D animations with your timeline
- **Deterministic Rendering:** Uses `frameloop="demand"` for frame-by-frame rendering during video export
- **WebGL Sync:** Calls `gl.finish()` after each frame to ensure all GPU commands complete before capture
- **Preserves Drawing Buffer:** Automatically sets `preserveDrawingBuffer: true` for video export

### Timeline Synchronization

`CompositionCanvas` automatically:
- Registers with parent `<Timegroup>` via `addFrameTask`
- Updates 3D scene on every frame
- Provides current time via `useCompositionTime()` hook
- Ensures deterministic frame-by-frame rendering

### useCompositionTime Hook

Access the current composition time inside your R3F scene:

```tsx
function AnimatedSphere() {
  const { timeMs, durationMs } = useCompositionTime();
  const progress = timeMs / durationMs; // 0 to 1
  const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.5;

  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

**Returns:**
- `timeMs` - Current time in milliseconds (relative to this timegroup)
- `durationMs` - Total duration in milliseconds

### Custom WebGL Options

```tsx
<CompositionCanvas
  shadows
  gl={{
    antialias: true,
    alpha: true,
    // preserveDrawingBuffer is automatically added
  }}
  camera={{ position: [0, 0, 5], fov: 75 }}
  scene={{ background: new THREE.Color("#000000") }}
>
  {/* Scene content */}
</CompositionCanvas>
```

**Note:** `preserveDrawingBuffer: true` is automatically set for video export compatibility.

### Styling

The canvas fills its container absolutely:

```tsx
<Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px] bg-black">
  <CompositionCanvas
    containerClassName="rounded-lg"
    containerStyle={{ border: "2px solid white" }}
  >
    {/* Scene */}
  </CompositionCanvas>
</Timegroup>
```

## OffscreenCompositionCanvas

Renders a React Three Fiber scene in a **web worker** using OffscreenCanvas. This keeps the main thread free and enables rendering to continue even when the browser tab is hidden.

### Worker Setup

Create a worker file:

```typescript
// scene-worker.ts
import { renderOffscreen } from "@editframe/react/r3f";
import { useCompositionTime } from "@editframe/react/r3f";
import { Box } from "@react-three/drei";

function Scene() {
  const { timeMs } = useCompositionTime();
  const rotation = (timeMs / 1000) * Math.PI;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box rotation={[0, rotation, 0]}>
        <meshStandardMaterial color="cyan" />
      </Box>
    </>
  );
}

renderOffscreen(<Scene />);
```

### Component Usage

```tsx
import { Timegroup } from "@editframe/react";
import { OffscreenCompositionCanvas } from "@editframe/react/r3f";

const worker = new Worker(
  new URL('./scene-worker.ts', import.meta.url),
  { type: 'module' }
);

export const Video = () => {
  return (
    <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
      <OffscreenCompositionCanvas
        worker={worker}
        canvasProps={{ shadows: true, dpr: [1, 2] }}
        fallback={
          <div className="flex items-center justify-center w-full h-full">
            <p>OffscreenCanvas not supported</p>
          </div>
        }
      />
    </Timegroup>
  );
};
```

### Features

- **Web Worker Rendering:** All R3F rendering happens in a separate thread
- **Background Tab Resilience:** Continues rendering when the browser tab is hidden
- **Zero-Copy Transfer:** Uses ImageBitmap transfer for efficient pixel data
- **Automatic Sync:** Integrates with `addFrameTask` for frame-by-frame rendering
- **Safari Fallback:** Shows fallback content when OffscreenCanvas is unavailable

### Worker Protocol

The worker communicates via structured messages:

**Main → Worker:**
```typescript
{
  type: 'renderFrame',
  timeMs: number,
  durationMs: number,
  requestId: number
}
```

**Worker → Main:**
```typescript
{
  type: 'frameRendered',
  requestId: number,
  bitmap: ImageBitmap  // Transferred, not copied
}
```

### When to Use OffscreenCanvas vs CompositionCanvas

**Use OffscreenCompositionCanvas when:**
- Complex 3D scenes with heavy computation
- Long render times where main thread responsiveness matters
- Need guaranteed rendering in background tabs
- Rendering multiple compositions simultaneously

**Use CompositionCanvas when:**
- Simple 3D scenes
- Browser compatibility is critical (Safari support)
- Debugging (easier to inspect in main thread)
- Using Three.js features incompatible with workers
- Interactive preview with controls

### Browser Support

- **Chrome:** Full support
- **Firefox:** Full support
- **Edge:** Full support
- **Safari:** Not supported (use `fallback` prop)

Use the `fallback` prop to provide alternative content for Safari:

```tsx
<OffscreenCompositionCanvas
  worker={worker}
  fallback={
    <CompositionCanvas>
      <MyScene />
    </CompositionCanvas>
  }
/>
```

## Advanced: CustomComplex Animations

Combine `useCompositionTime` with Three.js for complex animations:

### Particle System

```tsx
import { useRef, useEffect } from "react";
import { useCompositionTime } from "@editframe/react/r3f";
import * as THREE from "three";

function ParticleSystem() {
  const { timeMs, durationMs } = useCompositionTime();
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    const count = 1000;
    const dummy = new THREE.Object3D();
    const progress = timeMs / durationMs;

    for (let i = 0; i < count; i++) {
      const t = progress + (i / count) * 0.1;
      const angle = t * Math.PI * 2;
      const radius = 5 + Math.sin(t * 10) * 2;

      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(t * 5) * 3,
        Math.sin(angle) * radius
      );
      dummy.rotation.set(t * Math.PI, t * Math.PI * 2, 0);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [timeMs, durationMs]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="white" />
    </instancedMesh>
  );
}
```

### Camera Animation

```tsx
import { useThree } from "@react-three/fiber";
import { useCompositionTime } from "@editframe/react/r3f";
import { useEffect } from "react";

function CameraRig() {
  const { camera } = useThree();
  const { timeMs } = useCompositionTime();

  useEffect(() => {
    const t = timeMs / 1000;
    camera.position.x = Math.sin(t) * 5;
    camera.position.z = Math.cos(t) * 5;
    camera.lookAt(0, 0, 0);
  }, [timeMs, camera]);

  return null;
}
```

### Material Animation

```tsx
function AnimatedMaterial() {
  const { timeMs } = useCompositionTime();
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (!materialRef.current) return;
    const hue = (timeMs / 1000) % 1;
    materialRef.current.color.setHSL(hue, 1, 0.5);
  }, [timeMs]);

  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial ref={materialRef} />
    </mesh>
  );
}
```

## Integration with @react-three/drei

Use Drei helpers with Editframe:

```tsx
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { CompositionCanvas, useCompositionTime } from "@editframe/react/r3f";

function Scene() {
  const { timeMs } = useCompositionTime();

  return (
    <>
      <OrbitControls enableZoom={false} />
      <Environment preset="sunset" />
      <ContactShadows opacity={0.5} />

      <Box position={[0, Math.sin(timeMs / 500), 0]} />
    </>
  );
}

export const Video = () => {
  return (
    <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
      <CompositionCanvas>
        <Scene />
      </CompositionCanvas>
    </Timegroup>
  );
};
```

## Rendering to Video

3D scenes render to video just like any other Editframe element:

```tsx
import { Timegroup } from "@editframe/react";
import { CompositionCanvas } from "@editframe/react/r3f";

export const Video = () => {
  return (
    <Timegroup
      mode="fixed"
      duration="10s"
      className="w-[1920px] h-[1080px]"
    >
      <CompositionCanvas>
        {/* Your 3D scene */}
      </CompositionCanvas>
    </Timegroup>
  );
};

// Render with CLI
// npx editframe render ./src/Video.tsx
```

The R3F integration ensures:
1. Each frame renders synchronously at the correct timeline position
2. WebGL finishes all commands before frame capture
3. Deterministic output regardless of playback state
4. Proper integration with Editframe's rendering pipeline

## Browser Support

- **CompositionCanvas:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **OffscreenCompositionCanvas:** Chrome, Firefox, Edge (Safari does not support OffscreenCanvas)

## Performance Tips

1. **Memoize scene components** to avoid unnecessary re-renders:
```tsx
const Scene = React.memo(() => {
  const { timeMs } = useCompositionTime();
  // ...
});
```

2. **Use instancing** for many identical objects:
```tsx
<instancedMesh args={[geometry, material, count]} />
```

3. **Limit geometry complexity** during rendering:
```tsx
<sphereGeometry args={[1, 16, 16]} /> {/* Lower segments */}
```

4. **Disable antialiasing** if not needed:
```tsx
<CompositionCanvas gl={{ antialias: false }}>
```

## Troubleshooting

### Scene appears black
**Problem:** Missing lights or incorrect camera setup.

**Solution:**
```tsx
<CompositionCanvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  {/* Your scene */}
</CompositionCanvas>
```

### Animation stutters during export
**Problem:** Animations using `useFrame` RAF loop.

**Solution:** Use `useCompositionTime()` instead:
```tsx
// Don't use useFrame for time-based animations
useFrame((state) => {
  mesh.rotation.y += 0.01;
});

// Use useCompositionTime
const { timeMs } = useCompositionTime();
mesh.rotation.y = timeMs / 1000;
```

### Worker fails to load
**Problem:** Incorrect worker URL or module type.

**Solution:**
```tsx
// Correct
const worker = new Worker(
  new URL('./worker.ts', import.meta.url),
  { type: 'module' }
);

// Wrong
const worker = new Worker('./worker.ts');
```

## Related

- [timegroup.md](references/timegroup.md) - Timeline container elementcomponent- [render-to-video.md](references/render-to-video.md) - Rendering compositions to video
- [scripting.md](references/scripting.md) - Programmatic element control
