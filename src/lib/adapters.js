/**
 * SMD Adapter Library for MacGizmo GridGen.
 *
 * Unlike module overlays (visual only), adapters generate real Gerber features:
 * SMD pads, traces, mask openings, and silkscreen outlines.
 *
 * Each adapter defines:
 *   - id, name, category, pitch, color: metadata
 *   - throughPins: array of { col, row, label } – grid positions replacing normal pads
 *   - features: Gerber primitives relative to origin (col 0, row 0 position)
 *     - copper[]: pads and traces on copper layer
 *     - mask[]: solder mask openings
 *     - silk[]: silkscreen outlines
 *   - outline: { width, height } in mm for preview rendering
 *   - outlineOffset: optional { x, y } mm offset
 *   - widthPins, heightPins: reserved grid rectangle (all inner pads suppressed)
 *
 * Coordinate system:
 *   Origin (0,0) = grid position (col 0, row 0) of the adapter.
 *   All coordinates in mm, relative to origin.
 *   Y increases upward (Gerber convention).
 *
 * Feature types:
 *   { type: 'pad', x, y, w, h }          – rectangular SMD pad
 *   { type: 'circle', x, y, d }          – circular feature
 *   { type: 'trace', x1, y1, x2, y2, w } – copper trace
 *   { type: 'poly', points: [{x,y}...] } – silkscreen polyline
 *
 * Layout principle:
 *   SMD footprint centered within reserved grid rectangle.
 *   Interface TH pads on outer edges. Fanout traces connect
 *   SMD pads to TH pads via multi-segment routes (stub → diagonal → horizontal).
 *   Inner grid positions blocked to prevent overlap with SMD features.
 *
 * Package reference data:
 *   SOT-23:  body 2.9×1.3mm, pitch 0.95mm, pad 1.0×0.6mm
 *   SC-70:   body 2.0×1.25mm, pitch 0.65mm, pad 0.8×0.5mm
 *   SOIC:    body 3.9mm wide, pitch 1.27mm, pad 1.5×0.6mm
 *   SOIC-W:  body 7.5mm wide, pitch 1.27mm, pad 1.5×0.6mm
 *   TSSOP:   body 4.4mm wide, pitch 0.65mm, pad 1.1×0.4mm
 *   MSOP:    body 3.0mm wide, pitch 0.65mm, pad 1.0×0.4mm
 */

export const ADAPTER_LIBRARY = [

  // ═══════════════════════════════════════════════════════════════════
  // SMD 0805/0603  (2-pad passive, 1×3 grid)
  // Grid: 1×3  |  TH pins: (0,0) (0,2)
  // For resistors, capacitors, etc.  Center pad (0,1) is free.
  //
  //  TH(1) ── SMD pad ─┐
  //           0805/0603  │ body
  //  TH(2) ── SMD pad ─┘
  //
  // 0805 pad: 1.0 × 1.2mm, center-to-center 1.8mm
  // 0603 pad: 0.8 × 0.9mm, center-to-center 1.6mm
  // Using 0805 dimensions (fits 0603 too, just less pad overlap)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'smd2-3',
    name: 'SMD 0603/0805 (1×3)',
    category: 'Passive',
    pitch: 2.54,
    color: '#c08060',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 2, label: '2' },
    ],

    features: {
      copper: [
        // SMD pads (1.0 × 1.2mm) centered at x=0, spaced 1.8mm apart
        // Centered vertically in 1×3 grid (center = y=2.54)
        { type: 'pad', x: 0, y: 1.64, w: 1.2, h: 1.0 },   // Pad 1
        { type: 'pad', x: 0, y: 3.44, w: 1.2, h: 1.0 },   // Pad 2

        // Traces: direct vertical to TH pads
        // Pad 1 → TH (0,0) at y=0
        { type: 'trace', x1: 0, y1: 1.64, x2: 0, y2: 0, w: 0.3 },
        // Pad 2 → TH (0,2) at y=5.08
        { type: 'trace', x1: 0, y1: 3.44, x2: 0, y2: 5.08, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 0, y: 1.64, w: 1.3, h: 1.1 },
        { type: 'pad', x: 0, y: 3.44, w: 1.3, h: 1.1 },
      ],
      silk: [
        // Body outline
        { type: 'poly', points: [
          { x: -0.8, y: 1.84 }, { x: 0.8, y: 1.84 },
          { x: 0.8, y: 3.24 }, { x: -0.8, y: 3.24 },
          { x: -0.8, y: 1.84 },
        ]},
      ],
    },
    outline: { width: 2.0, height: 6.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 1,
    heightPins: 3,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SMD 0805/0603  (2-pad passive, 1×4 grid)
  // Grid: 1×4  |  TH pins: (0,0) (0,3)
  // More space between component and TH pads; 2 free pads in center.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'smd2-4',
    name: 'SMD 0603/0805 (1×4)',
    category: 'Passive',
    pitch: 2.54,
    color: '#c08060',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 3, label: '2' },
    ],

    features: {
      copper: [
        // SMD pads centered in 1×4 grid (center = y=3.81)
        { type: 'pad', x: 0, y: 2.91, w: 1.2, h: 1.0 },   // Pad 1
        { type: 'pad', x: 0, y: 4.71, w: 1.2, h: 1.0 },   // Pad 2

        // Traces: direct vertical to TH pads
        // Pad 1 → TH (0,0) at y=0
        { type: 'trace', x1: 0, y1: 2.91, x2: 0, y2: 0, w: 0.3 },
        // Pad 2 → TH (0,3) at y=7.62
        { type: 'trace', x1: 0, y1: 4.71, x2: 0, y2: 7.62, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 0, y: 2.91, w: 1.3, h: 1.1 },
        { type: 'pad', x: 0, y: 4.71, w: 1.3, h: 1.1 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: -0.8, y: 3.11 }, { x: 0.8, y: 3.11 },
          { x: 0.8, y: 4.51 }, { x: -0.8, y: 4.51 },
          { x: -0.8, y: 3.11 },
        ]},
      ],
    },
    outline: { width: 2.0, height: 9.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 1,
    heightPins: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOT-23-3  (3 pins, 0.95mm pitch)
  // Grid: 3×2  |  TH pins: (0,0) (0,1) (2,0)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'sot23-3',
    name: 'SOT-23-3',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 2, row: 0, label: '3' },
    ],

    features: {
      copper: [
        // SMD pads (1.0 × 0.6 mm)
        { type: 'pad', x: 1.84, y: 0.795, w: 1.0, h: 0.6 },   // Pin 1
        { type: 'pad', x: 1.84, y: 1.745, w: 1.0, h: 0.6 },   // Pin 2
        { type: 'pad', x: 3.24, y: 1.27, w: 1.0, h: 0.6 },    // Pin 3

        // Fanout traces (0.3mm width)
        // Pin 1 → TH (0,0)
        { type: 'trace', x1: 1.84, y1: 0.795, x2: 1.5, y2: 0.795, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 0.795, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 → TH (0,1)
        { type: 'trace', x1: 1.84, y1: 1.745, x2: 1.5, y2: 1.745, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.745, x2: 0, y2: 2.54, w: 0.3 },
        // Pin 3 → TH (2,0)
        { type: 'trace', x1: 3.24, y1: 1.27, x2: 3.54, y2: 1.27, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.27, x2: 5.08, y2: 0.0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.84, y: 0.795, w: 1.1, h: 0.7 },
        { type: 'pad', x: 1.84, y: 1.745, w: 1.1, h: 0.7 },
        { type: 'pad', x: 3.24, y: 1.27, w: 1.1, h: 0.7 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.09, y: 0.32 }, { x: 3.99, y: 0.32 },
          { x: 3.99, y: 2.22 }, { x: 1.09, y: 2.22 },
          { x: 1.09, y: 0.32 },
        ]},
        { type: 'circle', x: 1.34, y: 2.42, d: 0.2 },
      ],
    },
    outline: { width: 6.5, height: 4.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 2,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SC-70-3  (3 pins, 0.65mm pitch)
  // Grid: 3×2  |  TH pins: (0,0) (0,1) (2,0)
  // Smaller body than SOT-23, tighter pad spacing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'sc70-3',
    name: 'SC-70-3',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 2, row: 0, label: '3' },
    ],

    features: {
      copper: [
        // SMD pads (0.8 × 0.5 mm) – SC-70 is smaller than SOT-23
        { type: 'pad', x: 1.95, y: 0.945, w: 0.8, h: 0.5 },   // Pin 1
        { type: 'pad', x: 1.95, y: 1.595, w: 0.8, h: 0.5 },   // Pin 2
        { type: 'pad', x: 3.13, y: 1.27, w: 0.8, h: 0.5 },    // Pin 3

        // Fanout traces
        // Pin 1 → TH (0,0)
        { type: 'trace', x1: 1.95, y1: 0.945, x2: 1.5, y2: 0.945, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 0.945, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 → TH (0,1)
        { type: 'trace', x1: 1.95, y1: 1.595, x2: 1.5, y2: 1.595, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.595, x2: 0, y2: 2.54, w: 0.3 },
        // Pin 3 → TH (2,0)
        { type: 'trace', x1: 3.13, y1: 1.27, x2: 3.54, y2: 1.27, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.27, x2: 5.08, y2: 0.0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.95, y: 0.945, w: 0.9, h: 0.6 },
        { type: 'pad', x: 1.95, y: 1.595, w: 0.9, h: 0.6 },
        { type: 'pad', x: 3.13, y: 1.27, w: 0.9, h: 0.6 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.27, y: 0.52 }, { x: 3.81, y: 0.52 },
          { x: 3.81, y: 2.02 }, { x: 1.27, y: 2.02 },
          { x: 1.27, y: 0.52 },
        ]},
        { type: 'circle', x: 1.47, y: 2.22, d: 0.2 },
      ],
    },
    outline: { width: 6.5, height: 4.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 2,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOT-23-5/6  (5/6 pins, 0.95mm pitch)
  // Grid: 3×3  |  TH pins: (0,0) (0,1) (0,2) (2,2) (2,0) [+ (2,1) for 6-pin]
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'sot23-6',
    name: 'SOT-23-5/6',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 2, row: 2, label: '4' },
      { col: 2, row: 1, label: '5' },
      { col: 2, row: 0, label: '6' },
    ],

    features: {
      copper: [
        // SMD pads (1.0 × 0.55 mm, 0.95mm pitch)
        // Left: pins 1, 2, 3
        { type: 'pad', x: 1.84, y: 1.59, w: 1.0, h: 0.55 },
        { type: 'pad', x: 1.84, y: 2.54, w: 1.0, h: 0.55 },
        { type: 'pad', x: 1.84, y: 3.49, w: 1.0, h: 0.55 },
        // Right: pins 6, 5, 4 (top to bottom)
        { type: 'pad', x: 3.24, y: 1.59, w: 1.0, h: 0.55 },
        { type: 'pad', x: 3.24, y: 2.54, w: 1.0, h: 0.55 },
        { type: 'pad', x: 3.24, y: 3.49, w: 1.0, h: 0.55 },

        // Fanout traces
        // Pin 1 → TH (0,0)
        { type: 'trace', x1: 1.84, y1: 1.59, x2: 1.5, y2: 1.59, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.59, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 → TH (0,1) – direct horizontal
        { type: 'trace', x1: 0, y1: 2.54, x2: 1.84, y2: 2.54, w: 0.3 },
        // Pin 3 → TH (0,2)
        { type: 'trace', x1: 1.84, y1: 3.49, x2: 1.5, y2: 3.49, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.49, x2: 0, y2: 5.08, w: 0.3 },
        // Pin 4 → TH (2,2)
        { type: 'trace', x1: 3.24, y1: 3.49, x2: 3.54, y2: 3.49, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 3.49, x2: 5.08, y2: 5.08, w: 0.3 },
        // Pin 5 → TH (2,1) – direct horizontal
        { type: 'trace', x1: 3.24, y1: 2.54, x2: 5.08, y2: 2.54, w: 0.3 },
        // Pin 6 → TH (2,0)
        { type: 'trace', x1: 3.24, y1: 1.59, x2: 3.54, y2: 1.59, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.59, x2: 5.08, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.84, y: 1.59, w: 1.1, h: 0.65 },
        { type: 'pad', x: 1.84, y: 2.54, w: 1.1, h: 0.65 },
        { type: 'pad', x: 1.84, y: 3.49, w: 1.1, h: 0.65 },
        { type: 'pad', x: 3.24, y: 1.59, w: 1.1, h: 0.65 },
        { type: 'pad', x: 3.24, y: 2.54, w: 1.1, h: 0.65 },
        { type: 'pad', x: 3.24, y: 3.49, w: 1.1, h: 0.65 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.09, y: 1.04 }, { x: 3.99, y: 1.04 },
          { x: 3.99, y: 4.04 }, { x: 1.09, y: 4.04 },
          { x: 1.09, y: 1.04 },
        ]},
        { type: 'circle', x: 1.34, y: 4.6, d: 0.2 },
      ],
    },
    outline: { width: 6.5, height: 6.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 3,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SC-70-5/6  (5/6 pins, 0.65mm pitch)
  // Grid: 3×3  |  TH pins: (0,0) (0,1) (0,2) (2,2) (2,1) (2,0)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'sc70-6',
    name: 'SC-70-5/6',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 2, row: 2, label: '4' },
      { col: 2, row: 1, label: '5' },
      { col: 2, row: 0, label: '6' },
    ],

    features: {
      copper: [
        // SMD pads (0.8 × 0.45 mm, 0.65mm pitch)
        // Left: pins 1, 2, 3
        { type: 'pad', x: 1.95, y: 1.89, w: 0.8, h: 0.45 },
        { type: 'pad', x: 1.95, y: 2.54, w: 0.8, h: 0.45 },
        { type: 'pad', x: 1.95, y: 3.19, w: 0.8, h: 0.45 },
        // Right: pins 6, 5, 4
        { type: 'pad', x: 3.13, y: 1.89, w: 0.8, h: 0.45 },
        { type: 'pad', x: 3.13, y: 2.54, w: 0.8, h: 0.45 },
        { type: 'pad', x: 3.13, y: 3.19, w: 0.8, h: 0.45 },

        // Fanout traces
        // Pin 1 → TH (0,0)
        { type: 'trace', x1: 1.95, y1: 1.89, x2: 1.5, y2: 1.89, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.89, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 → TH (0,1) – direct horizontal
        { type: 'trace', x1: 0, y1: 2.54, x2: 1.95, y2: 2.54, w: 0.3 },
        // Pin 3 → TH (0,2)
        { type: 'trace', x1: 1.95, y1: 3.19, x2: 1.5, y2: 3.19, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.19, x2: 0, y2: 5.08, w: 0.3 },
        // Pin 4 → TH (2,2)
        { type: 'trace', x1: 3.13, y1: 3.19, x2: 3.54, y2: 3.19, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 3.19, x2: 5.08, y2: 5.08, w: 0.3 },
        // Pin 5 → TH (2,1) – direct horizontal
        { type: 'trace', x1: 3.13, y1: 2.54, x2: 5.08, y2: 2.54, w: 0.3 },
        // Pin 6 → TH (2,0)
        { type: 'trace', x1: 3.13, y1: 1.89, x2: 3.54, y2: 1.89, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.89, x2: 5.08, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.95, y: 1.89, w: 0.9, h: 0.55 },
        { type: 'pad', x: 1.95, y: 2.54, w: 0.9, h: 0.55 },
        { type: 'pad', x: 1.95, y: 3.19, w: 0.9, h: 0.55 },
        { type: 'pad', x: 3.13, y: 1.89, w: 0.9, h: 0.55 },
        { type: 'pad', x: 3.13, y: 2.54, w: 0.9, h: 0.55 },
        { type: 'pad', x: 3.13, y: 3.19, w: 0.9, h: 0.55 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.27, y: 1.44 }, { x: 3.81, y: 1.44 },
          { x: 3.81, y: 3.64 }, { x: 1.27, y: 3.64 },
          { x: 1.27, y: 1.44 },
        ]},
        { type: 'circle', x: 1.47, y: 3.84, d: 0.2 },
      ],
    },
    outline: { width: 6.5, height: 6.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 3,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOIC-8  (8 pins, 1.27mm pitch, 3.9mm body)
  // Grid: 4×4  |  TH pins: col 0 rows 0-3, col 3 rows 0-3
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'soic8',
    name: 'SOIC-8',
    category: 'SOIC',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 3, row: 3, label: '5' },
      { col: 3, row: 2, label: '6' },
      { col: 3, row: 1, label: '7' },
      { col: 3, row: 0, label: '8' },
    ],

    features: {
      copper: [
        // SMD pads (1.5 × 0.6 mm, 1.27mm pitch)
        // Left: pins 1-4
        { type: 'pad', x: 2.31, y: 1.905, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.5, h: 0.6 },
        // Right: pins 5-8 (5 at bottom)
        { type: 'pad', x: 5.31, y: 5.715, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.5, h: 0.6 },

        // Fanout traces
        // Left: pins 1-4 → col 0
        { type: 'trace', x1: 2.31, y1: 1.905, x2: 1.5, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.905, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 3.175, x2: 1.5, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.175, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 4.445, x2: 1.5, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 4.445, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 5.715, x2: 1.5, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 5.715, x2: 0, y2: 7.62, w: 0.3 },
        // Right: pins 5-8 → col 3
        { type: 'trace', x1: 5.31, y1: 5.715, x2: 6.21, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 5.715, x2: 7.62, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 4.445, x2: 6.21, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 4.445, x2: 7.62, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 3.175, x2: 6.21, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 3.175, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 1.905, x2: 6.21, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 1.905, x2: 7.62, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.31, y: 1.905, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.6, h: 0.7 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.6, y: 1.15 }, { x: 6.02, y: 1.15 },
          { x: 6.02, y: 6.47 }, { x: 1.6, y: 6.47 },
          { x: 1.6, y: 1.15 },
        ]},
        { type: 'circle', x: 1.95, y: 6.2, d: 0.25 },
      ],
    },
    outline: { width: 7.0, height: 10.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TSSOP-8  (8 pins, 0.65mm pitch, 4.4mm body)
  // Grid: 4×4  |  TH pins: col 0 rows 0-3, col 3 rows 0-3
  // TODO: manually adjust pad positions and routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'tssop8',
    name: 'TSSOP-8',
    category: 'TSSOP',
    pitch: 2.54,
    color: '#60a0c0',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 3, row: 3, label: '5' },
      { col: 3, row: 2, label: '6' },
      { col: 3, row: 1, label: '7' },
      { col: 3, row: 0, label: '8' },
    ],

    features: {
      // TSSOP-8: body 4.4mm wide, 0.65mm pitch, pad 1.1×0.4mm
      // Pad span: 3 × 0.65 = 1.95mm (vs 3 × 1.27 = 3.81mm for SOIC)
      // SMD pads are closer together → more diagonal fanout needed
      copper: [
        // Left: pins 1-4 (0.65mm pitch, centered in 4×4 grid)
        { type: 'pad', x: 1.59, y: 2.5725, w: 1.1, h: 0.4 },
        { type: 'pad', x: 1.59, y: 3.2225, w: 1.1, h: 0.4 },
        { type: 'pad', x: 1.59, y: 3.8725, w: 1.1, h: 0.4 },
        { type: 'pad', x: 1.59, y: 4.5225, w: 1.1, h: 0.4 },
        // Right: pins 5-8
        { type: 'pad', x: 6.03, y: 4.5225, w: 1.1, h: 0.4 },
        { type: 'pad', x: 6.03, y: 3.8725, w: 1.1, h: 0.4 },
        { type: 'pad', x: 6.03, y: 3.2225, w: 1.1, h: 0.4 },
        { type: 'pad', x: 6.03, y: 2.5725, w: 1.1, h: 0.4 },

        // Fanout traces – left side
        { type: 'trace', x1: 1.59, y1: 2.5725, x2: 1.0, y2: 2.5725, w: 0.3 },
        { type: 'trace', x1: 1.0, y1: 2.5725, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 1.59, y1: 3.2225, x2: 1.0, y2: 3.2225, w: 0.3 },
        { type: 'trace', x1: 1.0, y1: 3.2225, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 1.59, y1: 3.8725, x2: 1.0, y2: 3.8725, w: 0.3 },
        { type: 'trace', x1: 1.0, y1: 3.8725, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 1.59, y1: 4.5225, x2: 1.0, y2: 4.5225, w: 0.3 },
        { type: 'trace', x1: 1.0, y1: 4.5225, x2: 0, y2: 7.62, w: 0.3 },
        // Fanout traces – right side
        { type: 'trace', x1: 6.03, y1: 4.5225, x2: 6.62, y2: 4.5225, w: 0.3 },
        { type: 'trace', x1: 6.62, y1: 4.5225, x2: 7.62, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 6.03, y1: 3.8725, x2: 6.62, y2: 3.8725, w: 0.3 },
        { type: 'trace', x1: 6.62, y1: 3.8725, x2: 7.62, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 6.03, y1: 3.2225, x2: 6.62, y2: 3.2225, w: 0.3 },
        { type: 'trace', x1: 6.62, y1: 3.2225, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 6.03, y1: 2.5725, x2: 6.62, y2: 2.5725, w: 0.3 },
        { type: 'trace', x1: 6.62, y1: 2.5725, x2: 7.62, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.59, y: 2.5725, w: 1.2, h: 0.5 },
        { type: 'pad', x: 1.59, y: 3.2225, w: 1.2, h: 0.5 },
        { type: 'pad', x: 1.59, y: 3.8725, w: 1.2, h: 0.5 },
        { type: 'pad', x: 1.59, y: 4.5225, w: 1.2, h: 0.5 },
        { type: 'pad', x: 6.03, y: 4.5225, w: 1.2, h: 0.5 },
        { type: 'pad', x: 6.03, y: 3.8725, w: 1.2, h: 0.5 },
        { type: 'pad', x: 6.03, y: 3.2225, w: 1.2, h: 0.5 },
        { type: 'pad', x: 6.03, y: 2.5725, w: 1.2, h: 0.5 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.0, y: 1.85 }, { x: 6.62, y: 1.85 },
          { x: 6.62, y: 5.25 }, { x: 1.0, y: 5.25 },
          { x: 1.0, y: 1.85 },
        ]},
        { type: 'circle', x: 1.3, y: 5.0, d: 0.25 },
      ],
    },
    outline: { width: 7.0, height: 10.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  // MSOP-8  (8 pins, 0.65mm pitch, 3.0mm body)
  // Grid: 4×4  |  TH pins: col 0 rows 0-3, col 3 rows 0-3
  // TODO: manually adjust pad positions and routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'msop8',
    name: 'MSOP-8',
    category: 'MSOP',
    pitch: 2.54,
    color: '#60c0a0',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 3, row: 3, label: '5' },
      { col: 3, row: 2, label: '6' },
      { col: 3, row: 1, label: '7' },
      { col: 3, row: 0, label: '8' },
    ],

    features: {
      // MSOP-8: body 3.0mm wide, 0.65mm pitch, pad 1.0×0.4mm
      copper: [
        // Left: pins 1-4
        { type: 'pad', x: 2.31, y: 2.5725, w: 1.0, h: 0.4 },
        { type: 'pad', x: 2.31, y: 3.2225, w: 1.0, h: 0.4 },
        { type: 'pad', x: 2.31, y: 3.8725, w: 1.0, h: 0.4 },
        { type: 'pad', x: 2.31, y: 4.5225, w: 1.0, h: 0.4 },
        // Right: pins 5-8
        { type: 'pad', x: 5.31, y: 4.5225, w: 1.0, h: 0.4 },
        { type: 'pad', x: 5.31, y: 3.8725, w: 1.0, h: 0.4 },
        { type: 'pad', x: 5.31, y: 3.2225, w: 1.0, h: 0.4 },
        { type: 'pad', x: 5.31, y: 2.5725, w: 1.0, h: 0.4 },

        // Fanout traces – left side
        { type: 'trace', x1: 2.31, y1: 2.5725, x2: 1.5, y2: 2.5725, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 2.5725, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 3.2225, x2: 1.5, y2: 3.2225, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.2225, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 3.8725, x2: 1.5, y2: 3.8725, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.8725, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 4.5225, x2: 1.5, y2: 4.5225, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 4.5225, x2: 0, y2: 7.62, w: 0.3 },
        // Fanout traces – right side
        { type: 'trace', x1: 5.31, y1: 4.5225, x2: 6.21, y2: 4.5225, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 4.5225, x2: 7.62, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 3.8725, x2: 6.21, y2: 3.8725, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 3.8725, x2: 7.62, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 3.2225, x2: 6.21, y2: 3.2225, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 3.2225, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 2.5725, x2: 6.21, y2: 2.5725, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 2.5725, x2: 7.62, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.31, y: 2.5725, w: 1.1, h: 0.5 },
        { type: 'pad', x: 2.31, y: 3.2225, w: 1.1, h: 0.5 },
        { type: 'pad', x: 2.31, y: 3.8725, w: 1.1, h: 0.5 },
        { type: 'pad', x: 2.31, y: 4.5225, w: 1.1, h: 0.5 },
        { type: 'pad', x: 5.31, y: 4.5225, w: 1.1, h: 0.5 },
        { type: 'pad', x: 5.31, y: 3.8725, w: 1.1, h: 0.5 },
        { type: 'pad', x: 5.31, y: 3.2225, w: 1.1, h: 0.5 },
        { type: 'pad', x: 5.31, y: 2.5725, w: 1.1, h: 0.5 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.8, y: 1.85 }, { x: 5.82, y: 1.85 },
          { x: 5.82, y: 5.25 }, { x: 1.8, y: 5.25 },
          { x: 1.8, y: 1.85 },
        ]},
        { type: 'circle', x: 2.1, y: 5.0, d: 0.25 },
      ],
    },
    outline: { width: 7.0, height: 10.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOIC-16  (16 pins, 1.27mm pitch, 3.9mm body)
  // Grid: TODO  |  TH pins: TODO – needs wider grid for fanout
  // TODO: manually design routing to avoid fanout crossings
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'soic16',
    name: 'SOIC-16',
    category: 'SOIC',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      // Left: pins 1-8
      { col: 1, row: 0, label: '1' },
      { col: 0, row: 0, label: '2' },
      { col: 0, row: 1, label: '3' },
      { col: 0, row: 2, label: '4' },
      { col: 0, row: 3, label: '5' },
      { col: 0, row: 4, label: '6' },
      { col: 0, row: 5, label: '7' },
      { col: 1, row: 5, label: '8' },
      // Right: pins 9-16 (reversed)
      { col: 2, row: 5, label: '9' },
      { col: 3, row: 5, label: '10' },
      { col: 3, row: 4, label: '11' },
      { col: 3, row: 3, label: '12' },
      { col: 3, row: 2, label: '13' },
      { col: 3, row: 1, label: '14' },
      { col: 3, row: 0, label: '15' },
      { col: 2, row: 0, label: '16' },
    ],

    features: {
      // 8 pins × 1.27mm = 8.89mm span vs 7 × 2.54 = 17.78mm grid span
      // Center offset: (17.78 - 8.89) / 2 = 4.445mm
copper: [
        // SMD pads (1.5 × 0.6 mm, 1.27mm pitch)
        // Left: pins 1-8
        { type: 'pad', x: 2.31, y: 1.905, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 6.985, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 8.255, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 9.525, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 10.795, w: 1.5, h: 0.6 },


        // Right: pins 9-16 (5 at bottom)
        { type: 'pad', x: 5.31, y: 10.795, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 9.525, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 8.255, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 6.985, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 5.715, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.5, h: 0.6 },

        // Fanout traces
        // Left: pins 1-8 → col 0
        { type: 'trace', x1: 2.31, y1: 1.905, x2: 2.54, y2: 1.905, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 1.905, x2: 2.54, y2: 0, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 3.175, x2: 1.5, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 3.175, x2: 1.2, y2: 2.9, w: 0.25 },
        { type: 'trace', x1: 1.2, y1: 2.9, x2: 1.2, y2: 1.2, w: 0.25 },
        { type: 'trace', x1: 1.2, y1: 1.2, x2: 0, y2: 0, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 4.445, x2: 1.5, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 4.445, x2: 0, y2: 2.54, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 5.715, x2: 1.5, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 5.715, x2: 0, y2: 5.08, w: 0.25 },
        
        { type: 'trace', x1: 2.31, y1: 6.985, x2: 1.5, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 6.985, x2: 0, y2: 7.62, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 8.255, x2: 1.5, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 8.255, x2: 0, y2: 10.16, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 9.525, x2: 1.5, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 1.5, y1: 9.525, x2: 1.2, y2: 9.8, w: 0.25 },
        { type: 'trace', x1: 1.2, y1: 9.8, x2: 1.2, y2: 11.5, w: 0.25 },
        { type: 'trace', x1: 1.2, y1: 11.5, x2: 0, y2: 12.7, w: 0.25 },

        { type: 'trace', x1: 2.31, y1: 10.795, x2: 2.54, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 10.795, x2: 2.54, y2: 12.7, w: 0.25 },

        // Right: pins 9-16 → col 3
        { type: 'trace', x1: 5.31, y1: 1.905, x2: 5.08, y2: 1.905, w: 0.25 },
        { type: 'trace', x1: 5.08, y1: 1.905, x2: 5.08, y2: 0, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 3.175, x2: 6.21, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 3.175, x2: 6.5, y2: 2.9, w: 0.25 },
        { type: 'trace', x1: 6.5, y1: 2.9, x2: 6.5, y2: 1.2, w: 0.25 },
        { type: 'trace', x1: 6.5, y1: 1.2, x2: 7.62, y2: 0, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 4.445, x2: 6.21, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 4.445, x2: 7.62, y2: 2.54, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 5.715, x2: 6.21, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 5.715, x2: 7.62, y2: 5.08, w: 0.25 },
        
        { type: 'trace', x1: 5.31, y1: 6.985, x2: 6.21, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 6.985, x2: 7.62, y2: 7.62, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 8.255, x2: 6.21, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 8.255, x2: 7.62, y2: 10.16, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 9.525, x2: 6.21, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 6.21, y1: 9.525, x2: 6.5, y2: 9.8, w: 0.25 },
        { type: 'trace', x1: 6.5, y1: 9.8, x2: 6.5, y2: 11.5, w: 0.25 },
        { type: 'trace', x1: 6.5, y1: 11.5, x2: 7.62, y2: 12.7, w: 0.25 },

        { type: 'trace', x1: 5.31, y1: 10.795, x2: 5.08, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 5.08, y1: 10.795, x2: 5.08, y2: 12.7, w: 0.25 },

      ],
      mask: [
        { type: 'pad', x: 2.31, y: 1.905, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 6.985, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 8.255, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 9.525, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 10.795, w: 1.6, h: 0.7 },

        { type: 'pad', x: 5.31, y: 10.795, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 9.525, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 8.255, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 6.985, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.6, h: 0.7 },
      ],
      silk: [
        { type: 'poly', points: [
          { x: 1.6, y: 1.15 }, { x: 6.02, y: 1.15 },
          { x: 6.02, y: 11.5 }, { x: 1.6, y: 11.5 },
          { x: 1.6, y: 1.15 },
        ]},
        { type: 'circle', x: 1.95, y: 11.3, d: 0.25 },
      ],
    },
    outline: { width: 10.0, height: 20.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 6,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOIC-18W  (18 pins, 1.27mm pitch, 7.5mm wide body)
  // Grid: TODO  |  TH pins: TODO
  // TODO: manually design routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'soic18w',
    name: 'SOIC-18W',
    category: 'SOIC',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      // Left: pins 1-9
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 0, row: 4, label: '5' },
      { col: 0, row: 5, label: '6' },
      { col: 0, row: 6, label: '7' },
      { col: 0, row: 7, label: '8' },
      { col: 0, row: 8, label: '9' },
      // Right: pins 10-18 (reversed)
      { col: 4, row: 8, label: '10' },
      { col: 4, row: 7, label: '11' },
      { col: 4, row: 6, label: '12' },
      { col: 4, row: 5, label: '13' },
      { col: 4, row: 4, label: '14' },
      { col: 4, row: 3, label: '15' },
      { col: 4, row: 2, label: '16' },
      { col: 4, row: 1, label: '17' },
      { col: 4, row: 0, label: '18' },
    ],

    features: {
      // TODO: SMD pads and fanout routing
      copper: [],
      mask: [],
      silk: [],
    },
    outline: { width: 12.0, height: 24.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 9,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TSSOP-16  (16 pins, 0.65mm pitch, 4.4mm body)
  // Grid: TODO  |  TH pins: TODO
  // TODO: manually design routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'tssop16',
    name: 'TSSOP-16',
    category: 'TSSOP',
    pitch: 2.54,
    color: '#60a0c0',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 0, row: 4, label: '5' },
      { col: 0, row: 5, label: '6' },
      { col: 0, row: 6, label: '7' },
      { col: 0, row: 7, label: '8' },
      { col: 3, row: 7, label: '9' },
      { col: 3, row: 6, label: '10' },
      { col: 3, row: 5, label: '11' },
      { col: 3, row: 4, label: '12' },
      { col: 3, row: 3, label: '13' },
      { col: 3, row: 2, label: '14' },
      { col: 3, row: 1, label: '15' },
      { col: 3, row: 0, label: '16' },
    ],

    features: {
      // TODO: SMD pads and fanout routing
      // 8 pins × 0.65mm = 4.55mm span vs 7 × 2.54 = 17.78mm grid span
      copper: [],
      mask: [],
      silk: [],
    },
    outline: { width: 10.0, height: 20.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TSSOP-20  (20 pins, 0.65mm pitch, 4.4mm body)
  // Grid: TODO  |  TH pins: TODO
  // TODO: manually design routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'tssop20',
    name: 'TSSOP-20',
    category: 'TSSOP',
    pitch: 2.54,
    color: '#60a0c0',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 0, row: 4, label: '5' },
      { col: 0, row: 5, label: '6' },
      { col: 0, row: 6, label: '7' },
      { col: 0, row: 7, label: '8' },
      { col: 0, row: 8, label: '9' },
      { col: 0, row: 9, label: '10' },
      { col: 3, row: 9, label: '11' },
      { col: 3, row: 8, label: '12' },
      { col: 3, row: 7, label: '13' },
      { col: 3, row: 6, label: '14' },
      { col: 3, row: 5, label: '15' },
      { col: 3, row: 4, label: '16' },
      { col: 3, row: 3, label: '17' },
      { col: 3, row: 2, label: '18' },
      { col: 3, row: 1, label: '19' },
      { col: 3, row: 0, label: '20' },
    ],

    features: {
      // TODO: SMD pads and fanout routing
      copper: [],
      mask: [],
      silk: [],
    },
    outline: { width: 10.0, height: 26.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 10,
  },  
];


// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Get adapter definition by ID.
 */
export function getAdapter(adapterId) {
  return ADAPTER_LIBRARY.find(a => a.id === adapterId) || null;
}

/**
 * Get a rotated copy of an adapter definition.
 * Rotation: 0=0°, 1=90° CW, 2=180°, 3=270° CW.
 *
 * Rotates throughPins (grid indices), all feature coordinates (mm),
 * pad dimensions (w/h swap), and outline.
 * Rotation center = middle of the widthPins × heightPins grid rectangle.
 */
export function getRotatedAdapter(adapterId, rotation = 0) {
  const adapter = ADAPTER_LIBRARY.find(a => a.id === adapterId);
  if (!adapter) return null;

  const r = ((rotation % 4) + 4) % 4;
  if (r === 0) return adapter;

  const maxCol = adapter.widthPins - 1;
  const maxRow = adapter.heightPins - 1;
  const pitch = adapter.pitch;

  const cx = maxCol * pitch / 2;
  const cy = maxRow * pitch / 2;

  function rotPin(col, row) {
    switch (r) {
      case 1: return { col: row, row: maxCol - col };
      case 2: return { col: maxCol - col, row: maxRow - row };
      case 3: return { col: maxRow - row, row: col };
    }
  }

  function rotPt(x, y) {
    const dx = x - cx, dy = y - cy;
    switch (r) {
      case 1: return { x: cy + dy, y: cx - dx };
      case 2: return { x: cx - dx, y: cy - dy };
      case 3: return { x: cy - dy, y: cx + dx };
    }
  }

  const throughPins = adapter.throughPins.map(p => ({
    ...rotPin(p.col, p.row),
    label: p.label,
  }));

  const swap = r === 1 || r === 3;
  const widthPins = swap ? adapter.heightPins : adapter.widthPins;
  const heightPins = swap ? adapter.widthPins : adapter.heightPins;
  const outline = swap
    ? { width: adapter.outline.height, height: adapter.outline.width }
    : { ...adapter.outline };

  function rotFeature(f) {
    if (f.type === 'pad') {
      const p = rotPt(f.x, f.y);
      return { type: 'pad', x: p.x, y: p.y, w: swap ? f.h : f.w, h: swap ? f.w : f.h };
    } else if (f.type === 'trace') {
      const p1 = rotPt(f.x1, f.y1);
      const p2 = rotPt(f.x2, f.y2);
      return { type: 'trace', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w: f.w };
    } else if (f.type === 'circle') {
      const p = rotPt(f.x, f.y);
      return { type: 'circle', x: p.x, y: p.y, d: f.d };
    } else if (f.type === 'poly') {
      return { type: 'poly', points: f.points.map(pt => rotPt(pt.x, pt.y)) };
    }
    return f;
  }

  return {
    ...adapter,
    throughPins, widthPins, heightPins, outline,
    features: {
      copper: adapter.features.copper.map(rotFeature),
      mask: adapter.features.mask.map(rotFeature),
      silk: adapter.features.silk.map(rotFeature),
    },
  };
}

/**
 * Compute absolute through-hole positions for a placed adapter.
 */
export function getAdapterThroughHoles(adapter, inst, gridLeft, gridBottom, pitch) {
  return adapter.throughPins.map(pin => {
    const col = inst.col + pin.col;
    const row = inst.row + pin.row;
    return { x: gridLeft + col * pitch, y: gridBottom + row * pitch, col, row };
  });
}

/**
 * Compute absolute positions of all adapter Gerber features.
 */
export function getAdapterFeatures(adapter, inst, gridLeft, gridBottom, pitch) {
  const originX = gridLeft + inst.col * pitch;
  const originY = gridBottom + inst.row * pitch;

  function offsetFeature(f) {
    switch (f.type) {
      case 'pad': return { ...f, x: originX + f.x, y: originY + f.y };
      case 'trace': return { ...f, x1: originX + f.x1, y1: originY + f.y1, x2: originX + f.x2, y2: originY + f.y2 };
      case 'circle': return { ...f, x: originX + f.x, y: originY + f.y };
      case 'poly': return { type: 'poly', points: f.points.map(pt => ({ x: originX + pt.x, y: originY + pt.y })) };
      default: return f;
    }
  }

  return {
    copper: adapter.features.copper.map(offsetFeature),
    mask: adapter.features.mask.map(offsetFeature),
    silk: adapter.features.silk.map(offsetFeature),
  };
}