---
description: Add dynamic JavaScript behavior to timegroups with initializer callbacks and per-frame task functions for procedural animation.
---


# Scripting

Add dynamic JavaScript behavior to timegroups.
Add dynamic JavaScript behavior to timegroups using React refs.

## Initializer

Set up behavior that runs once per instance (prime timeline and render clones).

### Basic Usage

```html
<ef-timegroup id="my-scene" mode="fixed" duration="5s">
  <div class="content"></div>
</ef-timegroup>

<script>
  const tg = document.querySelector('#my-scene');
  tg.initializer = (instance) => {
    // Runs once on prime timeline, once on each render clone
    console.log('Initializer running');
  };
</script>
```
Set up behavior that runs once when the element is initialized.

### Basic Usage with Refs

```tsx
import { useRef, useEffect } from "react";
import { Timegroup } from "@editframe/react";

const DynamicScene = () => {
  const timegroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

  tg.initializer = (instance) => {
    // Runs once when element is initialized
    console.log('Initializer running');
  };
  }, []);

  return (
    <Timegroup ref={timegroupRef} mode="fixed" duration="5s">
      <div>Content</div>
    </Timegroup>
  );
};
```

### Constraints

- **Must be synchronous** - No async/await, no Promise return
- **Must complete quickly** - Less than 100ms (error thrown) or less than 10ms (warning logged)
- **Must complete quickly** - &lt;100ms (error thrown) or &lt;10ms (warning logged)
- **Register callbacks only** - Don't do expensive work in initializer

### Timing

- Set before connection: Runs after element connects to DOM
- Set after connection: Runs immediately
- Clones: Automatically copy and run initializer

## Frame Tasks

Register callbacks that execute on each frame during rendering.

### addFrameTask()

```javascript
const tg = document.querySelector('ef-timegroup');
tg.initializer = (instance) => {
  const cleanup = instance.addFrameTask((info) => {
    // Called on each frame
    // info contains: ownCurrentTimeMs, durationMs, percentComplete, etc.
  });

  // cleanup() removes the callback when called
};
```
```tsx
useEffect(() => {
  const tg = timegroupRef.current;
  if (!tg) return;

  tg.initializer = (instance) => {
    const cleanup = instance.addFrameTask((info) => {
      // Called on each frame
      // info contains: ownCurrentTimeMs, durationMs, percentComplete, etc.
    });

    return cleanup;
  };
}, []);
```

### Callback Info

Frame task callbacks receive timing information:

```javascript
instance.addFrameTask((info) => {
  console.log(info.ownCurrentTimeMs);    // Current time in ms
  console.log(info.durationMs);          // Total duration
  console.log(info.percentComplete);     // 0-1 progress
});
```

### Multiple Callbacks

Register multiple frame tasks - they execute in parallel:

```javascript
tg.initializer = (instance) => {
  instance.addFrameTask((info) => {
    // Update text
  });

  instance.addFrameTask((info) => {
    // Update position
  });
};
```
```tsx
useEffect(() => {
  const tg = timegroupRef.current;
  if (!tg) return;

  tg.initializer = (instance) => {
    const cleanup1 = instance.addFrameTask((info) => {
      // Update text
      const text = instance.querySelector('.text');
      if (text) {
        text.textContent = `${info.ownCurrentTimeMs}ms`;
      }
    });

    const cleanup2 = instance.addFrameTask((info) => {
      // Update position
      const box = instance.querySelector('.box');
      if (box) {
        (box as HTMLElement).style.left = `${info.percentComplete * 100}%`;
      }
    });

    // Return combined cleanup
    return () => {
      cleanup1();
      cleanup2();
    };
  };
}, []);
```

### Cleanup Pattern

Use React's useEffect cleanup for proper teardown:

```tsx
useEffect(() => {
  const tg = timegroupRef.current;
  if (!tg) return;

  tg.initializer = (instance) => {
    const cleanup = instance.addFrameTask((info) => {
      // Frame callback logic
    });

    return cleanup;
  };

  // Cleanup on unmount
  return () => {
    if (tg) {
      tg.initializer = undefined;
    }
  };
}, []);
```

## Examples

### Dynamic Text Updates

```html
<ef-timegroup id="counter" mode="fixed" duration="10s">
  <div class="text-4xl text-white counter-text"></div>
</ef-timegroup>

<script>
  const tg = document.querySelector('#counter');
  tg.initializer = (instance) => {
    instance.addFrameTask((info) => {
      const text = instance.querySelector('.counter-text');
      const seconds = (info.ownCurrentTimeMs / 1000).toFixed(2);
      text.textContent = `Time: ${seconds}s`;
    });
  };
</script>
```
```tsx
import { useRef, useEffect } from "react";
import { Timegroup } from "@editframe/react";

const Counter = () => {
  const timegroupRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance) => {
      return instance.addFrameTask((info) => {
        const text = instance.querySelector('.counter-text');
        if (text) {
          const seconds = (info.ownCurrentTimeMs / 1000).toFixed(2);
          text.textContent = `Time: ${seconds}s`;
        }
      });
    };
  }, []);

  return (
    <Timegroup ref={timegroupRef} mode="fixed" duration="10s">
      <div ref={textRef} className="text-4xl text-white counter-text" />
    </Timegroup>
  );
};
```

### Procedural Animation

```html
<ef-timegroup id="animated" mode="fixed" duration="5s">
  <div class="box"></div>
</ef-timegroup>

<script>
  const tg = document.querySelector('#animated');
  tg.initializer = (instance) => {
    instance.addFrameTask((info) => {
      const box = instance.querySelector('.box');
      const progress = info.percentComplete;

      // Move box across screen
      box.style.transform = `translateX(${progress * 500}px)`;

      // Rotate based on time
      const rotation = (info.ownCurrentTimeMs / 10) % 360;
      box.style.transform += ` rotate(${rotation}deg)`;
    });
  };
</script>
```
```tsx
const AnimatedBox = () => {
  const timegroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance) => {
      return instance.addFrameTask((info) => {
        const box = instance.querySelector('.box');
        if (!box) return;

        const progress = info.percentComplete;

        // Move box across screen
        const x = progress * 500;

        // Rotate based on time
        const rotation = (info.ownCurrentTimeMs / 10) % 360;

        (box as HTMLElement).style.transform =
          `translateX(${x}px) rotate(${rotation}deg)`;
      });
    };
  }, []);

  return (
    <Timegroup ref={timegroupRef} mode="fixed" duration="5s" className="relative w-full h-full">
      <div className="box w-24 h-24 bg-red-500" />
    </Timegroup>
  );
};
```

### Data-Driven Content

```html
<ef-timegroup id="data-scene" mode="fixed" duration="8s">
  <div class="data-display"></div>
</ef-timegroup>

<script>
  const data = [
    { time: 0, value: 10 },
    { time: 2000, value: 25 },
    { time: 4000, value: 40 },
    { time: 6000, value: 60 },
  ];

  const tg = document.querySelector('#data-scene');
  tg.initializer = (instance) => {
    instance.addFrameTask((info) => {
      const display = instance.querySelector('.data-display');

      // Find current data point
      const current = data.find((d, i) => {
        const next = data[i + 1];
        return info.ownCurrentTimeMs >= d.time &&
               (!next || info.ownCurrentTimeMs < next.time);
      });

      if (current) {
        display.textContent = `Value: ${current.value}`;
      }
    });
  };
</script>
```
```tsx
interface DataPoint {
  time: number;
  value: number;
}

const DataScene = ({ data }: { data: DataPoint[] }) => {
  const timegroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance) => {
      return instance.addFrameTask((info) => {
        const display = instance.querySelector('.data-display');
        if (!display) return;

        // Find current data point
        const current = data.find((d, i) => {
          const next = data[i + 1];
          return info.ownCurrentTimeMs >= d.time &&
                 (!next || info.ownCurrentTimeMs < next.time);
        });

        if (current) {
          display.textContent = `Value: ${current.value}`;
        }
      });
    };
  }, [data]);

  return (
    <Timegroup ref={timegroupRef} mode="fixed" duration="8s">
      <div className="data-display text-2xl" />
    </Timegroup>
  );
};

// Usage
const data = [
  { time: 0, value: 10 },
  { time: 2000, value: 25 },
  { time: 4000, value: 40 },
  { time: 6000, value: 60 },
];

<DataScene data={data} />
```

### Cleanup Pattern

```javascript
tg.initializer = (instance) => {
  // Set up resources
  const state = { count: 0 };

  const cleanup = instance.addFrameTask((info) => {
    state.count++;
    console.log(`Frame ${state.count}`);
  });

  // Cleanup is automatic when instance is removed
  // But you can manually cleanup if needed:
  // cleanup();
};
```

### Integration with React State

```tsx
const InteractiveScene = () => {
  const timegroupRef = useRef<HTMLElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance) => {
      return instance.addFrameTask((info) => {
        // Update React state (throttle for performance)
        const timeInSeconds = Math.floor(info.ownCurrentTimeMs / 1000);
        setCurrentTime(timeInSeconds);
      });
    };
  }, []);

  return (
    <>
      <div className="text-white mb-4">Current Time: {currentTime}s</div>
      <Timegroup ref={timegroupRef} mode="fixed" duration="10s">
        <div className="content">Scene content</div>
      </Timegroup>
    </>
  );
};
```

## Prime Timeline vs Render CloneConsistent Behavior
The initializer runs on both:

- **Prime timeline**: Interactive preview in browser
- **Render clone**: Headless rendering for video export

Same code runs in both contexts, ensuring consistent behavior.

```javascript
tg.initializer = (instance) => {
  // This code runs identically on prime timeline and render clones
  instance.addFrameTask((info) => {
    // Update content based on time
  });
};
```
The initializer ensures your code runs consistently in both preview and rendering:

```tsx
tg.initializer = (instance) => {
  // This code runs the same way in preview and rendering
  return instance.addFrameTask((info) => {
    // Update content based on time
  });
};
```

**Important**: For React components, you must use `TimelineRoot` to ensure React hooks and state work correctly. See [timeline-root.md](references/timeline-root.md) for details.

## Best Practices

1. **Keep initializer fast** - Register callbacks, don't do heavy work
2. **Use frame tasks for updates** - All time-based logic goes in frame callbacks
3. **Avoid side effects** - Don't modify external state, keep logic contained
4. **Test in both contexts** - Preview in browser AND render to video
5. **Handle missing elements** - Check if elements exist before updating them

```javascript
// Good: Check before updating
instance.addFrameTask((info) => {
  const el = instance.querySelector('.my-element');
  if (el) {
    el.textContent = `Time: ${info.ownCurrentTimeMs}`;
  }
});

// Bad: Assumes element exists
instance.addFrameTask((info) => {
  instance.querySelector('.my-element').textContent = `Time: ${info.ownCurrentTimeMs}`;
});
```
1. **Use refs to access timegroup** - Don't query the DOM directly from React
2. **Set initializer in useEffect** - Ensures element is mounted
3. **Return cleanup functions** - Prevent memory leaks
4. **Keep initializer fast** - Register callbacks, don't do heavy work
5. **Use frame tasks for updates** - All time-based logic goes in frame callbacks
6. **Handle missing elements** - Check if elements exist before updating them
7. **Avoid React state in frame tasks** - Can cause performance issues; use DOM updates instead

```tsx
// Good: Direct DOM updates in frame task
instance.addFrameTask((info) => {
  const el = instance.querySelector('.my-element');
  if (el) {
    el.textContent = `Time: ${info.ownCurrentTimeMs}`;
  }
});

// Avoid: React state updates in frame task (performance issue)
instance.addFrameTask((info) => {
  setTime(info.ownCurrentTimeMs); // Called every frame!
});
```

## TypeScript Types

```tsx
import { useRef, useEffect } from "react";

interface TimegroupElement extends HTMLElement {
  initializer?: (instance: TimegroupElement) => (() => void) | void;
  addFrameTask: (callback: (info: FrameInfo) => void) => () => void;
}

interface FrameInfo {
  ownCurrentTimeMs: number;
  durationMs: number;
  percentComplete: number;
}

const MyScene = () => {
  const timegroupRef = useRef<TimegroupElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance: TimegroupElement) => {
      return instance.addFrameTask((info: FrameInfo) => {
        // Typed callback
      });
    };
  }, []);

  return <Timegroup ref={timegroupRef} mode="fixed" duration="5s" />;
};
```

## See Also

- [timeline-root.md](references/timeline-root.md) - TimelineRoot wrapper (required for React)
- [hooks.md](references/hooks.md) - useTimingInfo and other React hooks
- [timegroup.md](references/timegroup.md) - Timegroup component reference
