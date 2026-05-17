---
description: Responsive wrapper that scales its content uniformly to fill available space while preserving the original aspect ratio.
---


# ef-fit-scale

## Attributes

- **paused** (boolean, default: false) - Pause scale calculations (useful during animations)

## Properties

- **contentChild** (HTMLElement | null) - First content element (excludes style, script, display:none)
- **scaleInfo** ({ scale: number, containerWidth: number, containerHeight: number, contentWidth: number, contentHeight: number }) - Current scale calculation result

## Functions

- **computeFitScale(input: ScaleInput): ScaleOutput | null** - Pure function to compute scale and centering for given dimensions
  - Returns: ScaleOutput | null

# FitScale

Responsive container that scales content to fit while preserving aspect ratio.

## Import

```tsx
import { FitScale } from "@editframe/react";
import { computeFitScale, needsFitScale } from "@editframe/react";
```

## Basic Usage

Scale content to fit container:

```html live
<div class="w-full h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-100">
  <ef-fit-scale class="w-full h-full">
    <div class="w-[1920px] h-[1080px] bg-blue-500 text-white flex items-center justify-center text-4xl">
      1920×1080 Content
    </div>
  </ef-fit-scale>
</div>
```

Content scales down to fit the container while maintaining its 16:9 aspect ratio.
```tsx
import { FitScale, Timegroup, Video } from "@editframe/react";

export const App = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <FitScale>
        <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
          <Video src="/assets/video.mp4" className="size-full" />
        </Timegroup>
      </FitScale>
    </div>
  );
};
```

## How It Works

Fit scale automatically:

1. Observes container size
2. Reads content natural dimensions
3. Calculates scale factor to fit
4. Centers content with translate
5. Applies transform to content

## Content Detection

Fit scale finds the first content element, ignoring:

- `<style>` tags
- `<script>` tags
- `<meta>` tags
- Elements with `display: none`
- Elements with `display: contents`

```html
<ef-fit-scale>
  <style>/* Ignored */</style>
  <script>/* Ignored */</script>
  <div><!-- This is the content --></div>
</ef-fit-scale>
```

## Natural Dimensions

For media elements (ef-video, ef-image), fit scale uses natural dimensions:

```html
<ef-fit-scale class="w-full h-[400px]">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4"></ef-video>
</ef-fit-scale>
```

Video scales based on its native resolution, not CSS dimensions.

### getNaturalDimensions Method

Media elements can provide natural dimensions:

```javascript
class MyMediaElement extends HTMLElement {
  getNaturalDimensions() {
    return { width: 1920, height: 1080 };
  }
}
```

Fit scale calls this method if available.

## Responsive Scaling

Fit scale updates automatically when:

- Container resizes
- Content resizes
- Content child changes

```html live
<div class="flex flex-col gap-4">
  <div class="w-full h-[300px] border border-gray-300 rounded overflow-hidden bg-gray-100">
    <ef-fit-scale class="w-full h-full">
      <div class="w-[800px] h-[600px] bg-green-500 text-white flex items-center justify-center text-2xl">
        800×600 (4:3)
      </div>
    </ef-fit-scale>
  </div>

  <div class="w-full h-[300px] border border-gray-300 rounded overflow-hidden bg-gray-100">
    <ef-fit-scale class="w-full h-full">
      <div class="w-[1920px] h-[1080px] bg-blue-500 text-white flex items-center justify-center text-2xl">
        1920×1080 (16:9)
      </div>
    </ef-fit-scale>
  </div>
</div>
```

Different aspect ratios scale correctly.
```tsx
import { FitScale, Preview, Timegroup, Video } from "@editframe/react";

export const ResponsivePreview = () => {
  return (
    <div className="w-full h-screen p-4">
      <FitScale>
        <div className="w-[1920px] h-[1080px] bg-black">
          <Timegroup mode="contain" className="size-full">
            <Video src="/assets/video.mp4" className="size-full object-cover" />
          </Timegroup>
        </div>
      </FitScale>
    </div>
  );
};
```

## With Fixed Aspect Ratio

```tsx
import { FitScale } from "@editframe/react";

export const AspectRatioBox = () => {
  return (
    <div className="w-full h-screen bg-gray-100 p-8">
      <FitScale>
        <div className="w-[1280px] h-[720px] bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="flex items-center justify-center h-full text-white text-4xl">
            16:9 Content
          </div>
        </div>
      </FitScale>
    </div>
  );
};
```

## Multiple Scaled Containers

```tsx
import { FitScale, Timegroup, Video } from "@editframe/react";

export const MultipleScaled = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen">
      {/* Left: 16:9 composition */}
      <div className="bg-gray-900">
        <FitScale>
          <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
            <Video src="/assets/video1.mp4" className="size-full" />
          </Timegroup>
        </FitScale>
      </div>

      {/* Right: 1:1 composition */}
      <div className="bg-gray-900">
        <FitScale>
          <Timegroup mode="contain" className="w-[1080px] h-[1080px]">
            <Video src="/assets/video2.mp4" className="size-full object-cover" />
          </Timegroup>
        </FitScale>
      </div>
    </div>
  );
};
```

## Scale Calculation

Fit scale uses contain logic (like `object-fit: contain`):

```javascript
import { computeFitScale } from '@editframe/elements';

const result = computeFitScale({
  containerWidth: 800,
  containerHeight: 600,
  contentWidth: 1920,
  contentHeight: 1080
});

// result = {
//   scale: 0.4166, // Scale down to fit
//   translateX: 0,  // Centered horizontally
//   translateY: 75  // Centered vertically
// }
```

### Scale Formula

```javascript
const containerRatio = containerWidth / containerHeight;
const contentRatio = contentWidth / contentHeight;

const scale = containerRatio > contentRatio
  ? containerHeight / contentHeight  // Limited by height
  : containerWidth / contentWidth;   // Limited by width
```
```tsx
import { computeFitScale } from "@editframe/react";

export const ManualScaleCalculation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const result = computeFitScale({
        containerWidth: containerRef.current!.clientWidth,
        containerHeight: containerRef.current!.clientHeight,
        contentWidth: 1920,
        contentHeight: 1080
      });

      if (result) {
        setScale(result.scale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen bg-gray-100 p-4">
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        Scale: {scale.toFixed(3)}x
      </div>

      <div
        className="w-[1920px] h-[1080px] bg-blue-500"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
};
```

The `computeFitScale` function uses this algorithm:

1. Calculate container aspect ratio: `containerWidth / containerHeight`
2. Calculate content aspect ratio: `contentWidth / contentHeight`
3. Determine scale based on which dimension is limiting:
   - If container is wider: scale by height
   - If container is taller: scale by width
4. Calculate centering translations to position content in center
5. Return `null` if any dimension is zero or negative

## Centering

Content is centered after scaling:

```javascript
const scaledWidth = contentWidth * scale;
const scaledHeight = contentHeight * scale;
const translateX = (containerWidth - scaledWidth) / 2;
const translateY = (containerHeight - scaledHeight) / 2;
```

## Applied Transform

Fit scale applies transform to content child:

```css
.content {
  width: 1920px;
  height: 1080px;
  transform: translate(0px, 75px) scale(0.4166);
  transform-origin: top left;
}
```

Transform origin is top-left for correct positioning.

## Pause Calculations

Pause scale updates during animations:

```html
<ef-fit-scale paused>
  <!-- Scale calculations paused -->
</ef-fit-scale>
```

```javascript
const fitScale = document.querySelector('ef-fit-scale');

// Pause
fitScale.paused = true;

// Resume
fitScale.paused = false; // Recalculates immediately
```
```tsx
import { FitScale } from "@editframe/react";

export const PausedScale = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPaused}
          onChange={(e) => setIsPaused(e.target.checked)}
          id="pause-scale"
        />
        <label htmlFor="pause-scale">Pause scaling</label>
      </div>

      <div className="w-full h-96 bg-gray-100">
        <FitScale paused={isPaused}>
          <div className="w-[800px] h-[600px] bg-blue-500 text-white flex items-center justify-center text-2xl">
            Resize window to see scaling
          </div>
        </FitScale>
      </div>
    </div>
  );
};
```

## Zero Dimension Warning

Fit scale warns when container has zero dimensions:

```javascript
// Console warning if container is 0×0
// "Container has zero dimensions (0×0). Content will be invisible."
```

Ensure all ancestors have resolved height:

```css
html, body {
  height: 100%;
}
```

## Scale Info

Access current scale calculation:

```javascript
const fitScale = document.querySelector('ef-fit-scale');

console.log(fitScale.scaleInfo);
// {
//   scale: 0.4166,
//   containerWidth: 800,
//   containerHeight: 600,
//   contentWidth: 1920,
//   contentHeight: 1080
// }
```

## Content Child

Access the content element:

```javascript
const fitScale = document.querySelector('ef-fit-scale');
const content = fitScale.contentChild;

console.log(content.tagName); // 'EF-VIDEO'
```

## Observers

Fit scale uses three observers:

1. **Container ResizeObserver**: Tracks container size
2. **Content ResizeObserver**: Tracks content size
3. **MutationObserver**: Tracks child list changes

All observers clean up on disconnect.

## Video Integration

For ef-video elements, fit scale sets explicit canvas dimensions:

```javascript
// Breaks circular dependency
canvas.style.width = `${naturalWidth}px`;
canvas.style.height = `${naturalHeight}px`;
```

This prevents video from collapsing to 0×0 when using `width: auto`.

## Layout Properties

Fit scale applies container styles:

```css
ef-fit-scale {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  overflow: hidden;
  box-sizing: border-box;
  contain: layout paint style;
  position: relative;
}
```

Grid layout simplifies content positioning.

## Performance

Scale calculations use:

- **Fixed precision**: Values rounded to 4 decimal places
- **Change detection**: Only updates when values change
- **RAF deferral**: Initial calculation deferred to allow layout

```javascript
// Internal precision handling
transform: `translate(${translateX.toFixed(4)}px, ${translateY.toFixed(4)}px) scale(${scale.toFixed(4)})`;
```

## Cleanup

Fit scale removes transform when disconnected:

```javascript
// On disconnect
content.style.width = '';
content.style.height = '';
content.style.transform = '';
content.style.transformOrigin = '';
```

Content returns to normal layout.

## Comparison with object-fit

**ef-fit-scale**:
- Works with any element
- JavaScript-based scaling
- Provides scale info
- Can be paused

**CSS object-fit**:
- Only works with replaced elements (img, video)
- CSS-based scaling
- No JavaScript API
- Always active

## Nested Fit Scale

Multiple fit scales can nest:

```html
<ef-fit-scale class="w-full h-full">
  <ef-timegroup class="w-[1920px] h-[1080px]">
    <ef-fit-scale class="w-full h-full">
      <ef-video src="video.mp4"></ef-video>
    </ef-fit-scale>
  </ef-timegroup>
</ef-fit-scale>
```
```tsx
<FitScale>
  <Timegroup className="w-[1920px] h-[1080px]">
    <FitScale>
      <Video src="/assets/video.mp4" />
    </FitScale>
  </Timegroup>
</FitScale>
```

Each fit scale scales its own content independently.

## Editor Canvas

```tsx
import { FitScale, Timegroup, Video, Text } from "@editframe/react";

export const EditorCanvas = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-white text-xl">Video Editor</h1>
      </div>

      {/* Canvas area with fit scaling */}
      <div className="flex-1 p-8">
        <FitScale>
          <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
            <Video
              src="/assets/background.mp4"
              duration="10s"
              className="size-full object-cover"
            />
            <Text
              duration="5s"
              className="absolute top-20 left-20 text-white text-4xl"
            >
              Video Title
            </Text>
          </Timegroup>
        </FitScale>
      </div>
    </div>
  );
};
```

## With Viewport Dimensions

```tsx
import { FitScale } from "@editframe/react";

export const ViewportAware = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 p-4">
      <div className="absolute top-4 right-4 bg-black/50 text-white p-2 text-sm font-mono z-10">
        Viewport: {dimensions.width} x {dimensions.height}
      </div>

      <FitScale>
        <div className="w-[1920px] h-[1080px] bg-gradient-to-br from-purple-600 to-blue-600" />
      </FitScale>
    </div>
  );
};
```

## Check if Element Needs Scaling

```tsx
import { needsFitScale } from "@editframe/react";

export const ConditionalScale = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScale, setShouldScale] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setShouldScale(needsFitScale(contentRef.current));
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="mb-4 p-2 bg-white rounded">
        {shouldScale ? "Content needs scaling" : "Content fits naturally"}
      </div>

      {shouldScale ? (
        <FitScale>
          <div ref={contentRef} className="w-[1920px] h-[1080px] bg-blue-500" />
        </FitScale>
      ) : (
        <div ref={contentRef} className="w-full h-full bg-blue-500" />
      )}
    </div>
  );
};
```

## TypeScript Usage

```tsx
import { FitScale, computeFitScale } from "@editframe/react";
import type { ScaleInput, ScaleOutput } from "@editframe/react";

export const TypedScaleCalculation = () => {
  const calculateScale = (input: ScaleInput): ScaleOutput | null => {
    return computeFitScale(input);
  };

  const result = calculateScale({
    containerWidth: 1024,
    containerHeight: 768,
    contentWidth: 1920,
    contentHeight: 1080
  });

  return (
    <div className="p-4">
      {result && (
        <div className="space-y-2 font-mono text-sm">
          <div>Scale: {result.scale.toFixed(3)}</div>
          <div>Translate X: {result.translateX.toFixed(1)}px</div>
          <div>Translate Y: {result.translateY.toFixed(1)}px</div>
        </div>
      )}
    </div>
  );
};
```

## Behavior

- Automatically observes container and content size changes
- Recalculates scale on resize using ResizeObserver
- Centers content within container
- Maintains content aspect ratio
- Uses CSS transform for scaling (GPU-accelerated)
- Handles nested content elements
- Ignores non-visible elements (display: none, etc.)

## Important Notes

- FitScale is a light DOM component (no shadow DOM)
- Content should have explicit dimensions (width/height)
- Works with any content, not just Editframe elements
- Scale updates automatically on window resize
- Use `paused` attribute to temporarily stop recalculation
- Returns `null` from `computeFitScale` for invalid dimensions
- Uses `contain: layout paint style` for performance
- Content is centered both horizontally and vertically
- FitScale is a light DOM component (no shadow DOM)
- Content should have explicit dimensions (width/height)
- Works with any content, not just Editframe elements
- Scale updates automatically on window resize
- Use `paused` prop to temporarily stop recalculation
- Returns `null` from `computeFitScale` for invalid dimensions
- Uses `contain: layout paint style` for performance
- Content is centered both horizontally and vertically
