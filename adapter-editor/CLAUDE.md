# Adapter Editor for Parametric Perfboard PCB Generator App

## Project Overview

- **Name:** Adapter Editor
- **Description:** An online tool to JSON data for footpints for the GridGen PCB generator
- **Stack:** HTML, React

## Project Structure

```
gridgen/
└── adapter-editor
        └── adapter-editor.html   # Standalone HTML + React editor to generate JSON-files for adapters, imports KiCAD Footprints and PCBs.
```

## Conventions

Keep it simple but functional

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|


## Known Issues / Notes
- The adapter-editor.html is a standalone project inside the project. It uses HTML and React.
- The output of the adapter-editor is strictly connected with the input of the GridGen adapter definition.
