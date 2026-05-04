<h1 align="center">startercn</h1>

<p align="center">
A template for building and publishing your own custom shadcn registry components. Includes documentation, landing page, and everything you need to deploy your component registry.
</p>

<p align="center">
  <img src="https://startercn.vercel.app/og" alt="startercn banner" />
</p>

## Features

- 📦 **Ready-to-use template** - Fork and start building immediately
- 📚 **Documentation site** - Beautiful docs powered by Fumadocs
- 🎨 **Shadcn registry compatible** - Works with `npx shadcn add`
- 🤖 **[Agent ready](https://www.mintlify.com/score/startercn)** - Includes `llms.txt`, `llms-full.txt`, agent skills discovery routes, and API catalog endpoints
- 🔊 **[Web audio feedback](https://audio.raphaelsalaja.com/)** - Built-in sound effects powered by `@web-kits/audio`
- 📳 **[Web haptics](https://haptics.lochie.me/)** - Optional haptic feedback hooks for supported devices via `web-haptics`
- ✨ **[Motion animations](https://motion.dev/)** - `motion`-powered UI polish for copy states, text transitions, and interactive elements
- 🎯 **[Animated icons](https://lucide-animated.com/)** - Reusable animated icons for navigation, sharing, sponsorship, and CTAs
- 🔄 **[View transitions](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)** - Next.js view transitions enabled for smoother navigation between pages
- 🚀 **Deploy ready** - Deploy anywhere

## Built In

- `Next.js 16` with the App Router
- `React 19` and `TypeScript`
- `Tailwind CSS 4`
- `Fumadocs` for documentation
- `shiki` + `rehype-pretty-code` for code blocks
- `sonner` for toasts
- `radix-ui` + `vaul` for accessible primitives
- `@vercel/analytics` for analytics

## Quick Start

1. **Use this template** - Click "Use this template" on GitHub

2. **Install dependencies**:

```bash
pnpm install
```

3. **Replace the placeholder component** at `registry/new-york/your-component.tsx`

4. **Update `registry.json`** with your component details

5. **Build the registry**:

```bash
pnpm registry:build
```

6. **Start development**:

```bash
pnpm dev
```

7. **Deploy** and share your component!

## Usage

Once deployed, users can install your component with:

```bash
npx shadcn@latest add https://your-domain.com/r/your-component.json
```

## Project Structure

```
├── registry/
│   └── new-york/           # Your components go here
│       └── your-component.tsx
├── registry.json           # Component registry manifest
├── content/docs/           # Documentation (MDX)
├── app/                    # Next.js app
└── public/r/               # Built registry files (auto-generated)
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm registry:build` - Rebuild the component registry

## License

[MIT](./LICENSE)
