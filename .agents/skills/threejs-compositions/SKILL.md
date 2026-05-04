---
name: threejs-compositions
description: Integrate Three.js 3D scenes into Editframe compositions via addFrameTask. Scenes are pure functions of time, fully scrubable, and renderable to MP4. Use when creating 3D animations, WebGL content in compositions, or integrating Three.js with Editframe's timeline system.
---

# Three.js in Editframe Compositions

Drive Three.js scenes from Editframe's timeline via `addFrameTask`. The scene is a pure function of composition time — no internal clock — making it fully scrubable, seekable, and renderable to video.

## Architecture

```
EFTimegroup.addFrameTask(({ ownCurrentTimeMs, durationMs }) => {
  scene.update(ownCurrentTimeMs, durationMs);
})
```

The Three.js renderer targets a `<canvas>` inside the timegroup. The composition provides timing; the canvas provides visuals.

## Scene Module Pattern

Create a standalone module that exports a factory function:

```typescript
// my-scene.ts
import * as THREE from "three";

export function createMyScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,  // REQUIRED for renderToVideo
  });

  // ... scene setup ...

  function update(timeMs: number, durationMs: number) {
    // Position everything deterministically based on timeMs
    // NO Math.random() for positions (breaks scrubbing)
    // NO internal clocks or requestAnimationFrame
    renderer.render(scene, camera);
    renderer.getContext().finish();  // REQUIRED for renderToVideo
  }

  function resize(w: number, h: number) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function dispose() { /* clean up GPU resources */ }

  return { update, resize, dispose };
}
```

### Critical Requirements

1. **`preserveDrawingBuffer: true`** — Without this, the canvas buffer is cleared after presenting. Frame capture reads empty pixels.

2. **`gl.finish()` after render** — Forces all GL operations to complete before the frame is captured. Without this, the capture may read stale content.

3. **Pure function of time** — `update(timeMs)` must produce the same result for the same input. Use deterministic math (not `Math.random()` for positions). Particle systems should derive positions from `timeMs`, not accumulated state.

4. **No internal animation loop** — No `requestAnimationFrame`. The composition's `addFrameTask` drives all updates.

## Integration with React Components

### Prime Instance (live playback)

Set up the scene directly in a `useEffect`, after the dynamic import resolves:

```tsx
useEffect(() => {
  if (!isClient) return;
  const container = containerRef.current;
  if (!container) return;

  let scene = null;
  const setup = async () => {
    const { createMyScene } = await import("./my-scene");
    const canvas = container.querySelector("canvas");
    const tg = container.querySelector("ef-timegroup");
    if (!canvas || !tg) return;

    scene = createMyScene(canvas);
    const { width, height } = container.getBoundingClientRect();
    scene.resize(width, height);

    tg.addFrameTask(({ ownCurrentTimeMs, durationMs }) => {
      scene.update(ownCurrentTimeMs, durationMs);
    });
  };
  setup();
  return () => scene?.dispose();
}, [isClient]);
```

### Render Clones (for renderToVideo)

`renderToVideo` creates a DOM clone. React `useEffect` doesn't run on clones. Use the timegroup's `initializer` property:

```tsx
// Inside the setup function, AFTER creating the prime scene:
tg.initializer = (instance) => {
  if (instance === tg) return; // skip prime, already set up

  let cloneScene = null;
  instance.addFrameTask(({ ownCurrentTimeMs, durationMs }) => {
    if (!cloneScene) {
      // Lazy creation (initializer must be <100ms)
      const cvs = instance.querySelector("canvas");
      if (!cvs) return;
      cloneScene = createMyScene(cvs);
      const rect = cvs.getBoundingClientRect();
      cloneScene.resize(rect.width || cvs.clientWidth || 800,
                        rect.height || cvs.clientHeight || 500);
    }
    cloneScene.update(ownCurrentTimeMs, durationMs);
  });
};
```

**Key points**:
- The initializer runs on both prime and clones. Skip the prime with `instance === tg`.
- Create the scene lazily inside the frame task (not in the initializer body) to stay under the 100ms initializer time limit.
- The clone's canvas is offscreen; `getBoundingClientRect()` may return 0. Fall back to `clientWidth` or hardcoded defaults.

## JSX Structure

```tsx
<Preview id={rootId} loop>
  <Timegroup mode="fixed" duration="14s"
    className="relative w-full overflow-hidden"
    style={{ aspectRatio: "16/10", background: "#1e2233" }}>
    <canvas style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%", display: "block",
    }} />
    {/* HTML overlays on top of the canvas */}
    <div style={{ position: "absolute", ... }}>Text labels</div>
  </Timegroup>
</Preview>
```

## Lighting & Materials for Visibility

Dark 3D scenes are the #1 problem. Objects that look fine in preview disappear in rendered output.

### Minimum viable lighting

```typescript
scene.add(new THREE.AmbientLight(0xd0d8f0, 0.9));       // strong ambient
const key = new THREE.DirectionalLight(0xffffff, 1.8);   // key light with shadows
const spot = new THREE.SpotLight(0xffffff, 2.0, 25);     // specular catch
scene.add(new THREE.PointLight(0x82b1ff, 0.9, 25));      // rim/accent
```

### Material recommendations

Use `MeshPhysicalMaterial` with clearcoat for visible specular highlights:

```typescript
new THREE.MeshPhysicalMaterial({
  color: 0x448aff,
  roughness: 0.12,      // low = shiny
  metalness: 0.15,
  clearcoat: 1.0,        // glossy lacquer layer
  clearcoatRoughness: 0.15,
  emissive: new THREE.Color(0x448aff),
  emissiveIntensity: 0.1, // self-illumination for dark scenes
  transparent: true,
  opacity: 0,             // start hidden, fade in
});
```

`MeshStandardMaterial` is too dark in most scenes. Physical + clearcoat catches specular highlights that make objects readable.

### Tone mapping

```typescript
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6–1.8;  // push bright
```

## Sizing Rules

Objects need to be **much larger than expected** for rendered video:

- Minimum object size: 5% of frame width to be visible
- Progress bars: height >= 3% of frame height
- Particles: `size >= 0.08` (not 0.035)
- Floor grid: adds spatial grounding, use `GridHelper` at 20-25% opacity

## Shadow-Opacity Sync

Transparent objects still cast full shadows. Toggle `castShadow` based on opacity:

```typescript
function setOpacity(mesh, opacity) {
  mesh.material.opacity = opacity;
  mesh.castShadow = opacity > 0.1;  // no shadow when nearly invisible
}
```

## Camera Choreography

Camera position is the primary attention tool. Keyframe camera poses and interpolate:

```typescript
const CAM_CLOSE = new THREE.Vector3(0, 0.8, 2.8);  // hero shot, fills frame
const CAM_WIDE  = new THREE.Vector3(0, 3.8, 10);    // reveals full scene
const CAM_WIN   = new THREE.Vector3(2, 3, 8);        // orbits toward payoff

// In update():
const pullBack = easeInOut(progress(timeMs, startMs, endMs));
lerpV3(camPos, CAM_CLOSE, CAM_WIDE, pullBack);
```

**Rules**:
- Start close (subject fills frame), pull back to reveal
- Pull back BEFORE adding new elements (so they don't appear off-screen)
- Orbit toward the "winner" in comparison scenes
- Snap zoom (200-300ms sine pulse on camPos.z) for emphasis on key metrics

## Environment

Dark backgrounds need a sense of place, not a void:

```typescript
const BG = 0x1e2233;
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 16, 35);  // objects fade into background at distance

// Floor with grid
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 35),
  new THREE.MeshStandardMaterial({ color: 0x2a2e42, roughness: 0.75, metalness: 0.1 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.7;
floor.receiveShadow = true;

const grid = new THREE.GridHelper(30, 30, 0x3a3f58, 0x3a3f58);
grid.position.y = -0.69;
grid.material.transparent = true;
grid.material.opacity = 0.25;
```

## Common Pitfalls

1. **Scene too dark** — Push ambient to 0.9, key to 1.8, exposure to 1.6+. Check by rendering, not by preview.

2. **Render clone shows only first frame** — Either `ownCurrentTimeMs` isn't advancing (check `_setLocalTimeMs` in seekForRender) or the initializer isn't registering the frame task on the clone.

3. **Render output is blank** — Missing `preserveDrawingBuffer: true` or `gl.finish()`.

4. **Shadows visible before objects fade in** — Toggle `castShadow` with opacity (threshold 0.1).

5. **Particles invisible in render** — Size too small. Use `size >= 0.08`. Additive blending can disappear against bright backgrounds.

6. **renderToVideo returns undefined** — `streaming` defaults to true, which uses File System Access API and returns undefined. Set `streaming: false` when you need the buffer returned to your code.

7. **Initializer exceeds 100ms** — Scene creation is too heavy for the initializer. Create the scene lazily inside the frame task callback instead.

## Dependencies

```bash
# Install in telecine (via Docker scripts)
telecine/scripts/npm install three
telecine/scripts/npm install --save-dev @types/three
```

Dynamic import in the component avoids SSR issues:
```typescript
const { createMyScene } = await import("./my-scene");
```

## React Three Fiber (R3F)

For component-based 3D scenes with better developer experience, see [r3f.md](r3f.md). R3F wraps Three.js in React components with hooks, declarative scene construction, and drei helpers. Use the vanilla approach (this file) for render clones; use R3F for the live interactive version.
