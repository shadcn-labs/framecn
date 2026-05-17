---
description: "Rotary dial input for angle values, supporting mouse and touch circular drag gestures with configurable min, max, and step."
---


# ef-dial

## Attributes

- **value** (number, default: 0) - Current angle value in degrees (0-360)

# Dial

Rotary control for angle input with circular interaction.

## Import

```tsx
import { Dial } from "@editframe/react";
```

## Basic Usage

Display a rotary dial:

```html live
<ef-dial value="45" class="w-48 h-48"></ef-dial>
```

Drag the handle to rotate. Value displays in the center.
```tsx
import { Dial } from "@editframe/react";

export const App = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <Dial
        value={value}
        onChange={(e) => setValue(e.detail.value)}
        className="w-32 h-32"
      />
      <div className="font-mono text-xl">{value.toFixed(1)}°</div>
    </div>
  );
};
```

## Value

Dial value is in degrees (0-360):

```javascript
const dial = document.querySelector('ef-dial');

// Set value
dial.value = 90;

// Get value
console.log(dial.value); // 0-360

// Values are normalized to 0-360
dial.value = 380;  // Becomes 20
dial.value = -30;  // Becomes 330
```
- The dial value is always normalized to 0-360 degrees
- Values wrap around (361° becomes 1°, -1° becomes 359°)
- Precision is limited to 6 significant digits
- Continuous rotation is supported (no stops)

## Events

Listen for value changes:

```javascript
const dial = document.querySelector('ef-dial');

dial.addEventListener('change', (e) => {
  const { value } = e.detail;
  console.log('New angle:', value);
});
```

Events fire during drag operations.
The `onChange` event provides:

```typescript
interface DialChangeDetail {
  value: number; // Dial value in degrees (0-360)
}
```

## Precision

Values are limited to 6 significant digits:

```javascript
dial.value = 45.123456789;
console.log(dial.value); // 45.1235 (6 significant digits)
```

## Snap to Increment

Hold **Shift** while dragging to snap to 15° increments:

```html live
<ef-dial value="0" class="w-48 h-48"></ef-dial>
<p class="text-sm text-gray-600 mt-2">Hold Shift to snap to 15° increments</p>
```

Without Shift: smooth rotation. With Shift: 0°, 15°, 30°, 45°, 60°, etc.

## Sizing

Dial scales to its container:

```html
<!-- Small dial -->
<ef-dial value="45" class="w-24 h-24"></ef-dial>

<!-- Medium dial -->
<ef-dial value="45" class="w-48 h-48"></ef-dial>

<!-- Large dial -->
<ef-dial value="45" class="w-64 h-64"></ef-dial>
```

Default size is 200×200 pixels.
Size controlled via `className` (width and height). Default size is 200x200px. Always square - maintains 1:1 aspect ratio.

## Visual Elements

Dial displays:

### Handle

Blue dot indicating current angle position.

### Center Text

Current angle value in degrees.

### Circle Guide

Dashed circle showing rotation path.

### Tick Marks

Four marks at cardinal directions (0°, 90°, 180°, 270°).

## Usage Examples

### Rotation Control

```html live
<div class="flex gap-8 items-center">
  <ef-dial value="30" class="w-48 h-48" id="rotation-dial"></ef-dial>

  <div class="relative w-32 h-32">
    <div id="rotation-target" class="w-full h-full bg-blue-500 rounded-lg shadow-lg" style="transform: rotate(30deg)">
    </div>
  </div>
</div>

<script>
  const dial = document.getElementById('rotation-dial');
  const target = document.getElementById('rotation-target');

  dial.addEventListener('change', (e) => {
    target.style.transform = `rotate(${e.detail.value}deg)`;
  });
</script>
```
```tsx
import { Dial } from "@editframe/react";

export const RotationControl = () => {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="font-semibold">Rotation:</label>
        <Dial
          value={rotation}
          onChange={(e) => setRotation(e.detail.value)}
          className="w-24 h-24"
        />
        <span className="font-mono">{rotation.toFixed(0)}°</span>
      </div>

      <div
        className="w-32 h-32 bg-blue-500 mx-auto"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
};
```

### Volume Knob

```javascript
const volumeDial = document.querySelector('#volume-dial');
const audioElement = document.querySelector('audio');

volumeDial.addEventListener('change', (e) => {
  // Map 0-360 degrees to 0-1 volume
  audioElement.volume = e.detail.value / 360;
});
```
```tsx
import { Dial } from "@editframe/react";

export const VolumeControl = () => {
  const [angle, setAngle] = useState(270); // 0-360
  const volume = angle / 360; // Convert to 0-1

  return (
    <div className="flex flex-col items-center gap-2">
      <Dial
        value={angle}
        onChange={(e) => setAngle(e.detail.value)}
        className="w-40 h-40"
      />
      <div className="text-center">
        <div className="text-sm text-gray-600">Volume</div>
        <div className="text-2xl font-bold">{Math.round(volume * 100)}%</div>
      </div>
    </div>
  );
};
```

### Hue Selector

```javascript
const hueDial = document.querySelector('#hue-dial');
const colorPreview = document.querySelector('#color-preview');

hueDial.addEventListener('change', (e) => {
  const hue = e.detail.value;
  colorPreview.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
});
```
```tsx
import { Dial } from "@editframe/react";

export const HueSelector = () => {
  const [hue, setHue] = useState(0);

  return (
    <div className="space-y-4">
      <Dial
        value={hue}
        onChange={(e) => setHue(e.detail.value)}
        className="w-48 h-48"
      />

      <div
        className="w-full h-24 rounded"
        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      />

      <div className="text-center font-mono">
        hsl({hue.toFixed(0)}°, 100%, 50%)
      </div>
    </div>
  );
};
```

## Programmatic Animation

Animate the dial value:

```javascript
const dial = document.querySelector('ef-dial');

let angle = 0;
setInterval(() => {
  angle = (angle + 1) % 360;
  dial.value = angle;
}, 16);
```
```tsx
import { Dial } from "@editframe/react";

export const AnimatedDial = () => {
  const [value, setValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = () => {
    setIsAnimating(true);
    let current = 0;

    const interval = setInterval(() => {
      current += 5;
      setValue(current % 360);

      if (current >= 360) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 16);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Dial
        value={value}
        onChange={(e) => setValue(e.detail.value)}
        className="w-40 h-40"
      />

      <button
        onClick={animate}
        disabled={isAnimating}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isAnimating ? "Animating..." : "Spin"}
      </button>
    </div>
  );
};
```

## Interaction

Dial uses pointer capture for smooth dragging:

- **Pointer down**: Capture pointer, start drag
- **Pointer move**: Update angle based on mouse position
- **Pointer up**: Release pointer, end drag

Drag works anywhere in the dial, not just on the handle.

## Angle Calculation

Dial calculates angle from pointer position relative to center:

```javascript
// Internal calculation
const centerX = dialWidth / 2;
const centerY = dialHeight / 2;
const x = pointerX - centerX;
const y = pointerY - centerY;
const angle = Math.atan2(y, x) * 180 / Math.PI;
```

0° is at 3 o'clock, increases clockwise.

## Styling

Dial uses CSS custom properties:

```css
ef-dial {
  /* Circle border color */
  --dial-stroke: #d0d0d0;

  /* Tick mark color */
  --dial-tick: #e0e0e0;

  /* Background color */
  --ef-color-bg-panel: #f5f5f5;

  /* Border color */
  --ef-color-border: #d0d0d0;

  /* Handle border color */
  --ef-color-primary: #2196f3;

  /* Handle background */
  --ef-color-bg-elevated: #fff;

  /* Text color */
  --ef-color-text: #000;
}
```
Use CSS variables to customize appearance:

```css
.dial {
  --ef-color-bg-panel: #ffffff;
  --ef-color-border: #e5e7eb;
  --ef-color-primary: #3b82f6;
  --ef-color-bg-elevated: #f9fafb;
  --ef-color-text: #111827;
}
```

## Accessibility

Dial captures pointer events for smooth interaction. Consider adding keyboard support for accessibility:

```javascript
dial.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    dial.value = (dial.value + 5) % 360;
  } else if (e.key === 'ArrowLeft') {
    dial.value = (dial.value - 5 + 360) % 360;
  }
});
```

## Visual State

Handle shows visual feedback during interaction:

- **Normal**: White background with blue border
- **Dragging**: Blue background (solid)
- **Cursor**: `grab` when idle, `grabbing` when dragging

## Precision Handling

Dial normalizes values to prevent floating point issues:

```javascript
// Values are automatically normalized
dial.value = 359.99999999;
console.log(dial.value); // 0 (wraps around)

dial.value = 45.123456789123;
console.log(dial.value); // 45.1235 (6 sig figs)
```

## Container Sizing

Dial fills its container and adapts to container dimensions:

```css
ef-dial {
  width: 100%;   /* Fill container width */
  height: 100%;  /* Fill container height */
}
```

Dial uses `clientWidth` for sizing calculations, so it responds to container size changes.

## Multiple Dials

```tsx
import { Dial } from "@editframe/react";

export const ColorPicker = () => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(180); // 0-360 maps to 0-100%
  const [lightness, setLightness] = useState(180);

  const sat = (saturation / 360) * 100;
  const light = (lightness / 360) * 100;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Dial
          value={hue}
          onChange={(e) => setHue(e.detail.value)}
          className="w-32 h-32"
        />
        <div className="text-sm">Hue: {hue.toFixed(0)}°</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Dial
          value={saturation}
          onChange={(e) => setSaturation(e.detail.value)}
          className="w-32 h-32"
        />
        <div className="text-sm">Sat: {sat.toFixed(0)}%</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Dial
          value={lightness}
          onChange={(e) => setLightness(e.detail.value)}
          className="w-32 h-32"
        />
        <div className="text-sm">Light: {light.toFixed(0)}%</div>
      </div>

      <div
        className="col-span-3 h-24 rounded"
        style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)` }}
      />
    </div>
  );
};
```

## Angle Input

```tsx
import { Dial } from "@editframe/react";

export const AngleInput = () => {
  const [angle, setAngle] = useState(45);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAngle(value % 360);
  };

  return (
    <div className="flex items-center gap-4">
      <Dial
        value={angle}
        onChange={(e) => setAngle(e.detail.value)}
        className="w-32 h-32"
      />

      <input
        type="number"
        value={angle.toFixed(1)}
        onChange={handleInputChange}
        className="w-24 px-3 py-2 border rounded"
        min="0"
        max="360"
        step="0.1"
      />

      <span>degrees</span>
    </div>
  );
};
```

## Compass

```tsx
import { Dial } from "@editframe/react";

export const Compass = () => {
  const [bearing, setBearing] = useState(0);

  const directions = [
    { angle: 0, label: "N" },
    { angle: 45, label: "NE" },
    { angle: 90, label: "E" },
    { angle: 135, label: "SE" },
    { angle: 180, label: "S" },
    { angle: 225, label: "SW" },
    { angle: 270, label: "W" },
    { angle: 315, label: "NW" }
  ];

  const nearest = directions.reduce((prev, curr) =>
    Math.abs(curr.angle - bearing) < Math.abs(prev.angle - bearing)
      ? curr : prev
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Dial
        value={bearing}
        onChange={(e) => setBearing(e.detail.value)}
        className="w-48 h-48"
      />

      <div className="text-center">
        <div className="text-4xl font-bold">{nearest.label}</div>
        <div className="text-sm text-gray-600">{bearing.toFixed(1)}°</div>
      </div>
    </div>
  );
};
```

## Preset Values

```tsx
import { Dial } from "@editframe/react";

export const PresetDial = () => {
  const [value, setValue] = useState(0);

  const presets = [
    { angle: 0, label: "Off" },
    { angle: 90, label: "Low" },
    { angle: 180, label: "Medium" },
    { angle: 270, label: "High" },
    { angle: 360, label: "Max" }
  ];

  return (
    <div className="space-y-4">
      <Dial
        value={value}
        onChange={(e) => setValue(e.detail.value)}
        className="w-40 h-40 mx-auto"
      />

      <div className="flex gap-2 justify-center">
        {presets.map((preset) => (
          <button
            key={preset.angle}
            onClick={() => setValue(preset.angle)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Sensitivity Control

```tsx
import { Dial } from "@editframe/react";

export const SensitiveControl = () => {
  const [value, setValue] = useState(0);
  const [sensitivity, setSensitivity] = useState(1);

  const handleChange = (e: CustomEvent<DialChangeDetail>) => {
    const delta = e.detail.value - value;
    const adjustedDelta = delta * sensitivity;
    setValue((value + adjustedDelta) % 360);
  };

  return (
    <div className="space-y-4">
      <Dial
        value={value}
        onChange={handleChange}
        className="w-40 h-40"
      />

      <div className="flex items-center gap-2">
        <label>Sensitivity:</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span>{sensitivity.toFixed(1)}x</span>
      </div>
    </div>
  );
};
```

## CSS Customization

Use CSS variables to customize appearance:

```css
.dial {
  --ef-color-bg-panel: #ffffff;
  --ef-color-border: #e5e7eb;
  --ef-color-primary: #3b82f6;
  --ef-color-bg-elevated: #f9fafb;
  --ef-color-text: #111827;
}
```

## Important Notes

- Size controlled via `className` (width and height)
- Default size is 200x200px
- Always square - maintains 1:1 aspect ratio
- Value automatically normalizes to 0-360 range
- Great for rotation, hue, volume, and angle inputs
- Handle positioned at edge shows current value visually
