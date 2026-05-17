---
description: Create and render your first Editframe video project from a template in under five minutes using the create CLI tool.
---


# Getting Started

Create a project and render your first video in under 2 minutes.

### Step 1: Create a Project

```bash
npm create @editframe -- html -d my-video
cd my-video
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Preview

```bash
npm start
```

This launches a live preview at `http://localhost:4321`. You'll see the starter composition.

### Step 4: Edit the Composition

Open `index.html`. The composition is defined with Editframe elements inside an `ef-timegroup`:

```html
<ef-timegroup mode="sequence" class="w-[1920px] h-[1080px] bg-black">
  <ef-timegroup mode="fixed" duration="5s" class="absolute w-full h-full">
    <ef-text class="text-white text-4xl">Hello, Editframe!</ef-text>
  </ef-timegroup>
</ef-timegroup>
```

Changes appear instantly in the preview.

### Step 5: Render to Video

```bash
npx editframe render -o my-video.mp4
```

The CLI renders your composition frame-by-frame and outputs an MP4 file.

## What's Next

- Add video, audio, images — see the `elements-composition` skill
- Use React components — see the `react-composition` skill
- Explore CLI options — see the `editframe-cli` skill
