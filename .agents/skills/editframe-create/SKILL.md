---
name: editframe-create
description: "Scaffold new Editframe video projects from templates. Generates project structure, installs dependencies, and sets up composition tooling to start immediately."
license: MIT
metadata:
  author: editframe
  version: "1.0"
---


# Create Editframe Project

## Quick Start

```bash
npm create @editframe
```

Follow the prompts to pick a template and project name. Or skip prompts:

```bash
npm create @editframe -- html -d my-project -y
cd my-project
npm start
```

This opens a live preview. Edit `index.html` to build your composition, then render to video:

```bash
npx editframe render -o output.mp4
```

## Templates

- `html` — Minimal HTML/CSS/JS starter
- `react` — Minimal React/TypeScript starter
- `simple-demo` — HTML demo with sample assets and animations
- `react-demo` — React demo with card animations
- `card-poetry` — HTML card animation demo with audio
- `animejs` — AnimeJS integration demo

## Getting Started

- [references/getting-started.md](references/getting-started.md) — Zero to rendered video

## Reference

- [references/templates.md](references/templates.md) — Template details and project structure
- [references/agent-skills.md](references/agent-skills.md) — AI agent skills installation

## Next Steps

After creating a project, learn to build compositions:

- **HTML/Web Components**: See the `elements-composition` skill
- **React**: See the `react-composition` skill
- **CLI tools**: See the `editframe-cli` skill for rendering, previewing, and more
