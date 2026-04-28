# Parametric Perfboard PCB Generator App in Svelte

## Project Overview

- **Name:** GridGen
- **Description:** An online tool to generate parametric perfboard PCBs with additional features and export manufacturing ready Gerber files.
- **Stack:** SvelteKit 2.x, Svelte 5, JavaScript, JSON
- **Package manager:** npm 
- **Node version:** 20+

## Commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Run tests (unit) | `npx vitest` |
| Run tests (e2e) | `npx playwright test` |
| Type check | `npm run check` |
| Lint | `npm run lint` |
| Format | `npm run format` |

## Project Structure

```
gridgen/
├── index.html                # HTML entry point, mounts main.js
├── package.json              # NPM Definitions
├── svelte.config.js          # Svelte Config
├── vite.config.js            # Vite Config
├── src/
│   ├── main.js               # Mounting entry point
│   ├── App.svelte            # Svelte Main App
│   ├── app.css               # Main Styling
│   ├── assets/
│   │   └── adapters/         # JSON definitions of SMD adapters
│   ├── components/
│   │   ├── Controls.svelte   # Main Sidebar with controls
│   │   ├── ModuleToolbar.svelte   # Additional Controls on Top Toolbar
│   │   └── Preview.Svelte    # Main PCB Preview rendering container
│   └── lib/                  # JavaScript Functionality
│       ├── adapters.js       # Library and import functions for SMD adapters
│       ├── font.js           # Simple Stroke font for PCB Silkscreen
│       ├── gerber.js         # Main functionality to generate Gerber data
│       ├── gridProfiles.js   # Different profiles depending on set pitch
│       ├── modules.js        # Library and import of modules overlays
│       ├── projectFile.js    # Load and Save project functions
│       └── zip.js            # Library for creating zip archives
├── public/
│       └── assets/           # Images for adapter and module overlays
└── adapter-editor
        └── adapter-editor.html   # Standalone HTML + React editor to generate JSON-files for adapters, imports KiCAD Footprints and PCBs.
```

## Conventions

- Styling: use scoped `<style>` blocks per component. Global styles in `app.css`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|


## Known Issues / Notes
- The adapter-editor.html is a standalone project inside the project. It uses HTML and React and has nothing to do with the svelte app.
- The output of the adapter-editor is strictly connected with the input of the GridGen adapter definition.
