# MacGizmo GridGen - Adapter editor

An import helper to generate SMD adapter patterns for the MacGizmo GridGen tool.

## How to use

- Open adapter-editor.hmtl
- Export single footprint from KiCad via Footprint Editor -> Export -> Footprint.
- Open footprint file or paste text content of footprint file in adapter-editor
- Edit name and category
- Set adapter final grid size and base pitch (2.54 mm, 2.0 mm, or 1.27 mm)
- Set offset to adjust SMD footprint positions
- Click on grid to create or delete THT drill pads
- Click on 'Trace' or type 'T' to drag traces between SMD pads and THT drill

When edit is done -> Copy JS-code and paste it into adapters.js


