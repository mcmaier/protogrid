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
- [x] Grid pitch: 2.54mm, 2.0mm, 1.27mm
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


## Licenses

**GridGen:** [AGPL-3.0](LICENSE)

**Adapter Editor:** [MIT License](adapter-editor/LICENSE)

**Adapters:**
Some adapters are based on the [KiCad Libraries](https://gitlab.com/kicad/libraries/kicad-footprints),
which are licensed under CC-BY-SA 4.0. Derived adapters are marked with
`"source": "Based on KiCad Libraries"` in their `meta` field.


