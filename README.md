# MacGizmo GridGen

A parametric perfboard PCB generator by [MacGizmo](https://macgizmo.com).
Configure board dimensions, grid pitch, and power rails — get production-ready
Gerber files for ordering at JLCPCB, PCBWay, Aisler, etc.

## Project Structure

```
├── macgizmo-gridgen/        ← Svelte source code
│   ├── dist/                ← Build output   
│   ├── src/
│   │   ├── App.svelte       ← Main app component
│   │   ├── main.js          ← Entry point
│   │   ├── components/
│   │   │   ├── Controls.svelte   ← Parameter controls
│   │   │   ├── ...
│   │   │   └── Preview.svelte    ← Live SVG preview
│   │   └── lib/
│   │       ├── gerber.js    ← Gerber RS-274X generator
│   │       ├── ...
│   │       └── zip.js       ← ZIP download utility
│   ├── vite.config.js       ← Build config (library mode)
│   └── package.json
└── README.md
```

## Development

### Prerequisites
- Node.js 20+ and npm

### Setup
```bash
cd macgizmo-gridgen
npm install
```

### Dev Server (standalone, without WordPress)
```bash
npm run dev
```
Opens at `http://localhost:5173` with hot reload.

### Production Build
```bash
npm run build
```
Outputs `gridgen.js` and `gridgen.css`
into `/dist`.


## GridGen Features
- [x] Rectangular board, free dimensions
- [x] Grid pitch: 2.54mm, 2.0mm
- [x] Power rails (VCC/GND) on any edge
- [x] Row and column numbering
- [x] Live SVG preview 
- [x] Place and move typical dev module placeholders for size estimation
- [x] Gerber RS-274X export (Edge.Cuts, F.Cu, B.Cu, F.Mask, B.Mask, Silkscreen)
- [x] Excellon drill file
- [x] ZIP download


## Svelte + Vite

This project was built using Svelte + Vite

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

### Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.
