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
 */

/** Base path for module overlay PNGs. Override for WordPress deployment. */
export let adapterOverlayBasePath = './assets/adapters';
export const VARIABLE_SUBGRID_ADAPTER_ID = 'subgrid-variable';

export const ADAPTER_LIBRARY = [
    {
      id: VARIABLE_SUBGRID_ADAPTER_ID,
      name: 'Variable Sub-Grid (2.00 mm / 1.27 mm)',
      category: 'SMD Pads',
      pitch: 2.54,
      color: '#606060',
      throughPins: [],
      features: {
        copper: [],
        copperBack: [],
        mask: [],
        silk: [],
        silkText: [],
        drills: [],
      },
      outline: { width: 9.2, height: 9.2 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 4,
      heightPins: 4,
      isResizable: true,
      subGridPitches: [2.00, 1.27],
    },

    {
      id: 'rail-bridge',
      name: 'Powerrail-Bridge',
      category: 'Passive',
      pitch: 2.54,
      color: '#606060',

      throughPins: [
        { col: 0, row: 0, label: '1' },
        { col: 1, row: 0, label: '2' },
        { col: 2, row: 0, label: '3' },
      ],

      features: {
        copper: [],
        copperBack: [
          // F.Cu traces
          { type: 'trace', x1: 0, y1: 0, x2: 1.5, y2: 1.3, w: 0.4 },
          { type: 'trace', x1: 1.5, y1: 1.3, x2: 3.5, y2: 1.3, w: 0.4 },
          { type: 'trace', x1: 3.5, y1: 1.3, x2: 5.08, y2: 0, w: 0.4 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 7.1, height: 2 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 3,
      heightPins: 1,      
    },

    {
    id: 'padgrid',
    name: 'SMD Pad Grid 6x5 for 0402',
    category: 'SMD Pads',
    pitch: 2.54,
    color: '#606060',

    throughPins: [
      { col: 0, row: 2, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 0, label: '3' },
      { col: 4, row: 0, label: '4' },
      { col: 4, row: 1, label: '5' },
      { col: 4, row: 2, label: '6' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 1.905, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 1.905, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 1.905, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 1.905, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 1.905, y: 0, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 3.175, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 3.175, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 3.175, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 3.175, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 3.175, y: 0, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 4.445, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 4.445, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 4.445, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 4.445, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 4.445, y: 0, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 5.715, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 5.715, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 5.715, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 5.715, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 5.715, y: 0, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.985, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.985, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.985, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.985, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.985, y: 0, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 8.255, y: 5.08, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 8.255, y: 3.81, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 8.255, y: 2.54, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 8.255, y: 1.27, w: 0.9, h: 0.9 },   // Pin 1
        { type: 'pad', x: 8.255, y: 0, w: 0.9, h: 0.9 },   // Pin 1

        // Fanout traces
        { type: 'trace', x1: 0, y1: 5.08, x2: 1.905, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 0, y1: 2.54, x2: 1.905, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 0, y1: 0, x2: 1.905, y2: 0, w: 0.3 },
        { type: 'trace', x1: 8.255, y1: 0, x2: 10.16, y2: 0, w: 0.3 },
        { type: 'trace', x1: 10.16, y1: 2.54, x2: 8.255, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 10.16, y1: 5.08, x2: 8.255, y2: 5.08, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 1.905, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 1.905, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 1.905, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 1.905, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 1.905, y: 0, w: 1, h: 1 },
        { type: 'pad', x: 3.175, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 3.175, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 3.175, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 3.175, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 3.175, y: 0, w: 1, h: 1 },
        { type: 'pad', x: 4.445, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 4.445, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 4.445, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 4.445, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 4.445, y: 0, w: 1, h: 1 },
        { type: 'pad', x: 5.715, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 5.715, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 5.715, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 5.715, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 5.715, y: 0, w: 1, h: 1 },
        { type: 'pad', x: 6.985, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 6.985, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 6.985, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 6.985, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 6.985, y: 0, w: 1, h: 1 },
        { type: 'pad', x: 8.255, y: 5.08, w: 1, h: 1 },
        { type: 'pad', x: 8.255, y: 3.81, w: 1, h: 1 },
        { type: 'pad', x: 8.255, y: 2.54, w: 1, h: 1 },
        { type: 'pad', x: 8.255, y: 1.27, w: 1, h: 1 },
        { type: 'pad', x: 8.255, y: 0, w: 1, h: 1 },
      ],
      silk: [
        //{ type: 'circle', x: 1.605, y: 5.58, d: 0.25 },
      ],
    },

    outline: { width: 12.2, height: 7.1 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 3,    
    //silkLabel: { text: 'GRID', x: 5.08, y: 2.54, height: 1.0 },
  },

    {
    id: 'padgrid-0805',
    name: 'SMD Pad Grid 4x4 for 0805/0603',
    category: 'SMD Pads',
    pitch: 2.54,
    color: '#606060',

    throughPins: [
      { col: 0, row: 3, label: '1' },
      { col: 0, row: 2, label: '2' },
      { col: 0, row: 1, label: '3' },
      { col: 0, row: 0, label: '4' },
      { col: 4, row: 0, label: '5' },
      { col: 4, row: 1, label: '6' },
      { col: 4, row: 2, label: '7' },
      { col: 4, row: 3, label: '8' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 1.27, y: 7.62, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 1.27, y: 5.08, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 1.27, y: 2.54, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 1.27, y: 0, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 3.81, y: 7.62, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 3.81, y: 5.08, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 3.81, y: 2.54, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 3.81, y: 0, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 6.35, y: 7.62, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 6.35, y: 5.08, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 6.35, y: 2.54, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 6.35, y: 0, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 8.89, y: 7.62, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 8.89, y: 5.08, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 8.89, y: 2.54, w: 1.3, h: 1.3 },   // Pin 1
        { type: 'pad', x: 8.89, y: 0, w: 1.3, h: 1.3 },   // Pin 1

        // Fanout traces
      ],
      mask: [
        { type: 'pad', x: 1.27, y: 7.62, w: 1.4, h: 1.4 },
        { type: 'pad', x: 1.27, y: 5.08, w: 1.4, h: 1.4 },
        { type: 'pad', x: 1.27, y: 2.54, w: 1.4, h: 1.4 },
        { type: 'pad', x: 1.27, y: 0, w: 1.4, h: 1.4 },
        { type: 'pad', x: 3.81, y: 7.62, w: 1.4, h: 1.4 },
        { type: 'pad', x: 3.81, y: 5.08, w: 1.4, h: 1.4 },
        { type: 'pad', x: 3.81, y: 2.54, w: 1.4, h: 1.4 },
        { type: 'pad', x: 3.81, y: 0, w: 1.4, h: 1.4 },
        { type: 'pad', x: 6.35, y: 7.62, w: 1.4, h: 1.4 },
        { type: 'pad', x: 6.35, y: 5.08, w: 1.4, h: 1.4 },
        { type: 'pad', x: 6.35, y: 2.54, w: 1.4, h: 1.4 },
        { type: 'pad', x: 6.35, y: 0, w: 1.4, h: 1.4 },
        { type: 'pad', x: 8.89, y: 7.62, w: 1.4, h: 1.4 },
        { type: 'pad', x: 8.89, y: 5.08, w: 1.4, h: 1.4 },
        { type: 'pad', x: 8.89, y: 2.54, w: 1.4, h: 1.4 },
        { type: 'pad', x: 8.89, y: 0, w: 1.4, h: 1.4 },
      ],
      silk: [
        //{ type: 'circle', x: 0.97, y: 8.12, d: 0.25 },
      ],
    },

    outline: { width: 12.2, height: 9.6 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 4,
    //silkLabel: { text: '0805', x: 5.08, y: 3.81, height: 1.0 },
  },

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
    id: 'smd0805',
    name: 'R,L,C 0603/0805 (1×3)',
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
        //{ type: 'circle', x: 1.96, y: 0.5, d: 0.25 },
      ],
    },
    outline: { width: 2.0, height: 6.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 1,
    heightPins: 3,
    overlay: true,
    //silkLabel: { text: '0805', x: 0.0, y: 2.54, height: 0.8 },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SMD 1206  (2-pad passive, 1×4 grid)
  // Grid: 1×4  |  TH pins: (0,0) (0,3)
  // ═══════════════════════════════════════════════════════════════════ 
    {
    id: 'smd1206',
    name: 'R,L,C 1206 (1x4)',
    category: 'Passive',
    pitch: 2.54,
    color: '#c08060',

    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 3, row: 0, label: '2' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.26, y: 0, w: 1.3, h: 1.75 },   // Pin 1
        { type: 'pad', x: 5.36, y: 0, w: 1.3, h: 1.75 },   // Pin 2

        // Fanout traces
        { type: 'trace', x1: 2.286, y1: 0, x2: 0, y2: 0, w: 0.5 },
        { type: 'trace', x1: 5.334, y1: 0, x2: 7.62, y2: 0, w: 0.5 },
      ],
      mask: [
        { type: 'pad', x: 2.26, y: 0, w: 1.4, h: 1.85 },
        { type: 'pad', x: 5.36, y: 0, w: 1.4, h: 1.85 },
      ],
      silk: [
        //{ type: 'circle', x: 1.96, y: 0.5, d: 0.25 },
      ],
    },

    outline: { width: 9.6, height: 2 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 1,
    overlay: true,
    //silkLabel: { text: '1206', x: 3.81, y: 0.0, height: 0.8 },
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
      { col: 0, row: 1, label: '1' },
      { col: 0, row: 0, label: '2' },
      { col: 2, row: 0, label: '3' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 1.563, y: 2.22, w: 1.325, h: 0.6 },   // Pin 1
        { type: 'pad', x: 1.563, y: 0.32, w: 1.325, h: 0.6 },   // Pin 2
        { type: 'pad', x: 3.838, y: 1.27, w: 1.325, h: 0.6 },   // Pin 3

        // Fanout traces
        { type: 'trace', x1: 1.397, y1: 2.286, x2: 0.254, y2: 2.286, w: 0.5 },
        { type: 'trace', x1: 1.397, y1: 0.254, x2: 0.127, y2: 0.254, w: 0.5 },
        { type: 'trace', x1: 3.81, y1: 1.27, x2: 4.191, y2: 1.27, w: 0.5 },
        { type: 'trace', x1: 4.191, y1: 1.27, x2: 5.08, y2: 0, w: 0.5 },
      ],
      mask: [
        { type: 'pad', x: 1.563, y: 2.22, w: 1.425, h: 0.7 },
        { type: 'pad', x: 1.563, y: 0.32, w: 1.425, h: 0.7 },
        { type: 'pad', x: 3.838, y: 1.27, w: 1.425, h: 0.7 },
      ],
      silk: [
        { type: 'circle', x: 1.3, y: 2.9, d: 0.5 },
          /*         
          { type: 'poly', points: [
          { x: 1.09, y: 0.32 }, { x: 3.99, y: 0.32 },
          { x: 3.99, y: 2.22 }, { x: 1.09, y: 2.22 },
          { x: 1.09, y: 0.32 },
        ]},
        */
      ],
    },

    outline: { width: 7.1, height: 4.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 2,
    silkLabel: { text: 'SOT23', x: 4, y: 2.5, height: 0.8 },
    overlay: true,
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
      { col: 0, row: 2, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 3, row: 0, label: '3' },
      { col: 3, row: 2, label: '6' },
      { col: 0, row: 0, label: '5' },
      { col: 3, row: 1, label: '4' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.46, y: 3.49, w: 1.56, h: 0.65 },   // Pin 1
        { type: 'pad', x: 2.46, y: 2.54, w: 1.56, h: 0.65 },   // Pin 2
        { type: 'pad', x: 2.46, y: 1.59, w: 1.56, h: 0.65 },   // Pin 3
        { type: 'pad', x: 5.16, y: 1.59, w: 1.56, h: 0.65 },   // Pin 4
        { type: 'pad', x: 5.16, y: 2.54, w: 1.56, h: 0.65 },   // Pin 5
        { type: 'pad', x: 5.16, y: 3.49, w: 1.56, h: 0.65 },   // Pin 6

        // Fanout traces
        { type: 'trace', x1: 2.413, y1: 2.54, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 5.08, y1: 2.54, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.413, y1: 3.556, x2: 1.524, y2: 3.556, w: 0.3 },
        { type: 'trace', x1: 1.524, y1: 3.556, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.413, y1: 1.524, x2: 1.524, y2: 1.524, w: 0.3 },
        { type: 'trace', x1: 1.524, y1: 1.524, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 5.08, y1: 1.524, x2: 6.096, y2: 1.524, w: 0.3 },
        { type: 'trace', x1: 6.096, y1: 1.524, x2: 7.62, y2: 0, w: 0.3 },
        { type: 'trace', x1: 5.207, y1: 3.556, x2: 6.096, y2: 3.556, w: 0.3 },
        { type: 'trace', x1: 6.096, y1: 3.556, x2: 7.62, y2: 5.08, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.46, y: 3.49, w: 1.66, h: 0.75 },
        { type: 'pad', x: 2.46, y: 2.54, w: 1.66, h: 0.75 },
        { type: 'pad', x: 2.46, y: 1.59, w: 1.66, h: 0.75 },
        { type: 'pad', x: 5.16, y: 1.59, w: 1.66, h: 0.75 },
        { type: 'pad', x: 5.16, y: 2.54, w: 1.66, h: 0.75 },
        { type: 'pad', x: 5.16, y: 3.49, w: 1.66, h: 0.75 },
      ],
      silk: [
        { type: 'circle', x: 2.2, y: 4.3, d: 0.5 },
        /*
          { type: 'poly', points: [
          { x: 1.09, y: 1.04 }, { x: 3.99, y: 1.04 },
          { x: 3.99, y: 4.04 }, { x: 1.09, y: 4.04 },
          { x: 1.09, y: 1.04 },
        ]},
         */
      ],
    },

    outline: { width: 9.6, height: 7.1 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 3,
    silkLabel: { text: 'SOT23-6', x: 3.81, y: 0, height: 0.8 },
    overlay: true,
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
    { col: 0, row: 1, label: '1' },
    { col: 0, row: 0, label: '2' },
    { col: 2, row: 0, label: '3' },
  ],

  features: {
    copper: [
      // SMD pads
      { type: 'pad', x: 1.603, y: 1.92, w: 1.225, h: 0.5 },   // Pin 1
      { type: 'pad', x: 1.603, y: 0.62, w: 1.225, h: 0.5 },   // Pin 2
      { type: 'pad', x: 3.478, y: 1.27, w: 1.225, h: 0.5 },   // Pin 3

      // Fanout traces
      { type: 'trace', x1: 1.651, y1: 1.905, x2: 0.889, y2: 1.905, w: 0.3 },
      { type: 'trace', x1: 0.889, y1: 1.905, x2: 0, y2: 2.54, w: 0.3 },
      { type: 'trace', x1: 1.651, y1: 0.635, x2: 0.889, y2: 0.635, w: 0.3 },
      { type: 'trace', x1: 0.889, y1: 0.635, x2: 0, y2: 0, w: 0.3 },
      { type: 'trace', x1: 3.429, y1: 1.27, x2: 4.191, y2: 1.27, w: 0.3 },
      { type: 'trace', x1: 4.191, y1: 1.27, x2: 4.445, y2: 1.27, w: 0.3 },
      { type: 'trace', x1: 4.445, y1: 1.27, x2: 5.08, y2: 0.635, w: 0.3 },
      { type: 'trace', x1: 5.08, y1: 0.635, x2: 5.08, y2: 0, w: 0.3 },
    ],
    mask: [
      { type: 'pad', x: 1.603, y: 1.92, w: 1.325, h: 0.6 },
      { type: 'pad', x: 1.603, y: 0.62, w: 1.325, h: 0.6 },
      { type: 'pad', x: 3.478, y: 1.27, w: 1.325, h: 0.6 },
    ],
    silk: [
      { type: 'circle', x: 1.5, y: 2.6, d: 0.5 },
      /*
        { type: 'poly', points: [
        { x: 1.27, y: 0.52 }, { x: 3.81, y: 0.52 },
        { x: 3.81, y: 2.02 }, { x: 1.27, y: 2.02 },
        { x: 1.27, y: 0.52 },
      ]},
        */
    ],
  },

  outline: { width: 7.1, height: 4.5 },
  outlineOffset: { x: 0, y: 0 },
  widthPins: 3,
  heightPins: 2,
  silkLabel: { text: 'SC70', x: 4.5, y: 2.5, height: 0.8 },
  overlay: true,
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
      { col: 0, row: 2, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 0, label: '3' },
      { col: 3, row: 0, label: '4' },
      { col: 3, row: 1, label: '5' },
      { col: 3, row: 2, label: '6' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.48, y: 3.19, w: 1.5, h: 0.4 },   // Pin 1
        { type: 'pad', x: 2.48, y: 2.54, w: 1.5, h: 0.4 },   // Pin 2
        { type: 'pad', x: 2.48, y: 1.89, w: 1.5, h: 0.4 },   // Pin 3
        { type: 'pad', x: 5.14, y: 1.89, w: 1.5, h: 0.4 },   // Pin 4
        { type: 'pad', x: 5.14, y: 2.54, w: 1.5, h: 0.4 },   // Pin 5
        { type: 'pad', x: 5.14, y: 3.19, w: 1.5, h: 0.4 },   // Pin 6

        // Fanout traces
        { type: 'trace', x1: 2.413, y1: 3.175, x2: 1.524, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 1.524, y1: 3.175, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.413, y1: 2.54, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.413, y1: 1.905, x2: 1.524, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 1.524, y1: 1.905, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 5.207, y1: 3.175, x2: 6.096, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 6.096, y1: 3.175, x2: 7.62, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 5.08, y1: 2.54, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 5.207, y1: 1.905, x2: 6.096, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 6.096, y1: 1.905, x2: 7.62, y2: 0, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.48, y: 3.19, w: 1.6, h: 0.5 },
        { type: 'pad', x: 2.48, y: 2.54, w: 1.6, h: 0.5 },
        { type: 'pad', x: 2.48, y: 1.89, w: 1.6, h: 0.5 },
        { type: 'pad', x: 5.14, y: 1.89, w: 1.6, h: 0.5 },
        { type: 'pad', x: 5.14, y: 2.54, w: 1.6, h: 0.5 },
        { type: 'pad', x: 5.14, y: 3.19, w: 1.6, h: 0.5 },
      ],
      silk: [
        { type: 'circle', x: 2.3, y: 4, d: 0.5 },
        /*{ type: 'poly', points: [
          { x: 1.27, y: 1.44 }, { x: 3.81, y: 1.44 },
          { x: 3.81, y: 3.64 }, { x: 1.27, y: 3.64 },
          { x: 1.27, y: 1.44 },
        ]},*/
      ],
    },

    outline: { width: 9.6, height: 7.1 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 3,
    silkLabel: { text: 'SC70-6', x: 3.81, y: 0, height: 0.8 },
    overlay: true,
  },
    {
    id: 'sot223',
    name: 'SOT-223',
    category: 'SOT',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      { col: 0, row: 2, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 0, label: '3' },
      { col: 4, row: 1, label: '4' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 1.93, y: 4.84, w: 2, h: 1.5 },   // Pin 1
        { type: 'pad', x: 1.93, y: 2.54, w: 2, h: 1.5 },   // Pin 2
        { type: 'pad', x: 1.93, y: 0.24, w: 2, h: 1.5 },   // Pin 3
        { type: 'pad', x: 8.23, y: 2.54, w: 2, h: 3.8 },   // Pin 4

        // Fanout traces
        { type: 'trace', x1: 0, y1: 5.08, x2: 1.905, y2: 5.08, w: 0.5 },
        { type: 'trace', x1: 0, y1: 2.54, x2: 1.905, y2: 2.54, w: 0.5 },
        { type: 'trace', x1: 0, y1: 0, x2: 1.905, y2: 0, w: 0.5 },
        { type: 'trace', x1: 10.16, y1: 2.54, x2: 8.255, y2: 2.54, w: 0.5 },
      ],
      mask: [
        { type: 'pad', x: 1.93, y: 4.84, w: 2.1, h: 1.6 },
        { type: 'pad', x: 1.93, y: 2.54, w: 2.1, h: 1.6 },
        { type: 'pad', x: 1.93, y: 0.24, w: 2.1, h: 1.6 },
        { type: 'pad', x: 8.23, y: 2.54, w: 2.1, h: 3.9 },
      ],
      silk: [
        { type: 'circle', x: 1.3, y: 6, d: 0.5 },
      ],
    },

    outline: { width: 12.2, height: 7.1 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 3,
    silkLabel: { text: 'SOT223', rotation: 90, x: 5.08, y: 2.54, height: 0.8 },
    overlay: true,
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
      { col: 0, row: 3, label: '1' },
      { col: 0, row: 2, label: '2' },
      { col: 0, row: 1, label: '3' },
      { col: 0, row: 0, label: '4' },
      { col: 4, row: 0, label: '5' },
      { col: 4, row: 1, label: '6' },
      { col: 4, row: 2, label: '7' },
      { col: 4, row: 3, label: '8' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.605, y: 5.715, w: 1.95, h: 0.6 },   // Pin 1
        { type: 'pad', x: 2.605, y: 4.445, w: 1.95, h: 0.6 },   // Pin 2
        { type: 'pad', x: 2.605, y: 3.175, w: 1.95, h: 0.6 },   // Pin 3
        { type: 'pad', x: 2.605, y: 1.905, w: 1.95, h: 0.6 },   // Pin 4
        { type: 'pad', x: 7.555, y: 1.905, w: 1.95, h: 0.6 },   // Pin 5
        { type: 'pad', x: 7.555, y: 3.175, w: 1.95, h: 0.6 },   // Pin 6
        { type: 'pad', x: 7.555, y: 4.445, w: 1.95, h: 0.6 },   // Pin 7
        { type: 'pad', x: 7.555, y: 5.715, w: 1.95, h: 0.6 },   // Pin 8

        // Fanout traces
        { type: 'trace', x1: 2.54, y1: 5.715, x2: 1.651, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 5.715, x2: 0, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 2.667, y1: 4.445, x2: 1.651, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 4.445, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.54, y1: 3.175, x2: 1.651, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 3.175, x2: 0, y2: 2.413, w: 0.3 },
        { type: 'trace', x1: 2.54, y1: 1.905, x2: 1.651, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 1.905, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 7.493, y1: 1.905, x2: 8.509, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 1.905, x2: 10.16, y2: 0, w: 0.3 },
        { type: 'trace', x1: 7.62, y1: 3.175, x2: 8.636, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 8.636, y1: 3.175, x2: 10.16, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 7.62, y1: 4.445, x2: 8.509, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 4.445, x2: 10.16, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 7.62, y1: 5.715, x2: 8.509, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 5.715, x2: 10.16, y2: 7.62, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.605, y: 5.715, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 4.445, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 3.175, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 1.905, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 1.905, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 3.175, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 4.445, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 5.715, w: 2.05, h: 0.7 },
      ],
      silk: [
        { type: 'circle', x: 2.4, y: 6.6, d: 0.5 },
      ],
    },

    outline: { width: 12.2, height: 9.6 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 4,
    silkLabel: { text: 'SOIC-8', rotation: 90, x: 5.08, y: 3.81, height: 0.9 },
    overlay: true,
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
      { col: 1, row: 5, label: '1' },
      { col: 0, row: 5, label: '2' },
      { col: 0, row: 4, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 0, row: 2, label: '5' },
      { col: 0, row: 1, label: '6' },
      { col: 0, row: 0, label: '7' },
      { col: 1, row: 0, label: '8' },
      { col: 3, row: 0, label: '9' },
      { col: 4, row: 0, label: '10' },
      { col: 4, row: 1, label: '11' },
      { col: 4, row: 2, label: '12' },
      { col: 4, row: 3, label: '13' },
      { col: 4, row: 4, label: '14' },
      { col: 4, row: 5, label: '15' },
      { col: 3, row: 5, label: '16' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.605, y: 10.795, w: 1.95, h: 0.6 },   // Pin 1
        { type: 'pad', x: 2.605, y: 9.525, w: 1.95, h: 0.6 },   // Pin 2
        { type: 'pad', x: 2.605, y: 8.255, w: 1.95, h: 0.6 },   // Pin 3
        { type: 'pad', x: 2.605, y: 6.985, w: 1.95, h: 0.6 },   // Pin 4
        { type: 'pad', x: 2.605, y: 5.715, w: 1.95, h: 0.6 },   // Pin 5
        { type: 'pad', x: 2.605, y: 4.445, w: 1.95, h: 0.6 },   // Pin 6
        { type: 'pad', x: 2.605, y: 3.175, w: 1.95, h: 0.6 },   // Pin 7
        { type: 'pad', x: 2.605, y: 1.905, w: 1.95, h: 0.6 },   // Pin 8
        { type: 'pad', x: 7.555, y: 1.905, w: 1.95, h: 0.6 },   // Pin 9
        { type: 'pad', x: 7.555, y: 3.175, w: 1.95, h: 0.6 },   // Pin 10
        { type: 'pad', x: 7.555, y: 4.445, w: 1.95, h: 0.6 },   // Pin 11
        { type: 'pad', x: 7.555, y: 5.715, w: 1.95, h: 0.6 },   // Pin 12
        { type: 'pad', x: 7.555, y: 6.985, w: 1.95, h: 0.6 },   // Pin 13
        { type: 'pad', x: 7.555, y: 8.255, w: 1.95, h: 0.6 },   // Pin 14
        { type: 'pad', x: 7.555, y: 9.525, w: 1.95, h: 0.6 },   // Pin 15
        { type: 'pad', x: 7.555, y: 10.795, w: 1.95, h: 0.6 },   // Pin 16

        // Fanout traces
        { type: 'trace', x1: 2.54, y1: 10.795, x2: 2.54, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 10.795, x2: 7.62, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 1.905, x2: 7.62, y2: 0, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 1.905, x2: 2.54, y2: 0, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 3.175, x2: 1.524, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 1.524, y1: 3.175, x2: 1.143, y2: 2.794, w: 0.25 },
        { type: 'trace', x1: 1.143, y1: 2.794, x2: 1.143, y2: 0.889, w: 0.25 },
        { type: 'trace', x1: 1.143, y1: 0.889, x2: 0, y2: 0, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 4.445, x2: 1.524, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 1.524, y1: 4.445, x2: 0, y2: 2.921, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 5.715, x2: 0.889, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 0.889, y1: 5.715, x2: 0.127, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 6.985, x2: 0.889, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 0.889, y1: 6.985, x2: 0, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 8.255, x2: 1.397, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 1.397, y1: 8.255, x2: 0.127, y2: 9.652, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 9.525, x2: 1.397, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 1.397, y1: 9.525, x2: 1.143, y2: 9.779, w: 0.25 },
        { type: 'trace', x1: 1.143, y1: 9.779, x2: 1.143, y2: 11.557, w: 0.25 },
        { type: 'trace', x1: 1.143, y1: 11.557, x2: 0, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 9.525, x2: 8.636, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 8.636, y1: 9.525, x2: 8.89, y2: 9.779, w: 0.25 },
        { type: 'trace', x1: 8.89, y1: 9.779, x2: 9.017, y2: 9.906, w: 0.25 },
        { type: 'trace', x1: 9.017, y1: 9.906, x2: 9.017, y2: 11.557, w: 0.25 },
        { type: 'trace', x1: 9.017, y1: 11.557, x2: 10.16, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 8.255, x2: 8.763, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 8.763, y1: 8.255, x2: 10.16, y2: 9.779, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 6.985, x2: 9.271, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 6.985, x2: 10.16, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 5.715, x2: 9.271, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 5.715, x2: 10.16, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 4.445, x2: 8.636, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 8.636, y1: 4.445, x2: 10.16, y2: 3.048, w: 0.25 },
        { type: 'trace', x1: 7.62, y1: 3.175, x2: 8.636, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 8.636, y1: 3.175, x2: 9.017, y2: 2.794, w: 0.25 },
        { type: 'trace', x1: 9.017, y1: 2.794, x2: 9.017, y2: 1.143, w: 0.25 },
        { type: 'trace', x1: 9.017, y1: 1.143, x2: 10.16, y2: 0, w: 0.25 },
      ],
      mask: [
        { type: 'pad', x: 2.605, y: 10.795, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 9.525, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 8.255, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 6.985, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 5.715, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 4.445, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 3.175, w: 2.05, h: 0.7 },
        { type: 'pad', x: 2.605, y: 1.905, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 1.905, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 3.175, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 4.445, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 5.715, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 6.985, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 8.255, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 9.525, w: 2.05, h: 0.7 },
        { type: 'pad', x: 7.555, y: 10.795, w: 2.05, h: 0.7 },
      ],
      silk: [
        { type: 'circle', x: 1.8, y: 11.6, d: 0.5 },
        /*{ type: 'poly', points: [
          { x: 1.6, y: 1.15 }, { x: 6.02, y: 1.15 },
          { x: 6.02, y: 11.5 }, { x: 1.6, y: 11.5 },
          { x: 1.6, y: 1.15 },
         */
      ],
    },

    outline: { width: 12.2, height: 14.7 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 6,
    silkLabel: { text: 'SOIC-16', rotation: 90, x: 5.08, y: 6.35, height: 0.9 },
    overlay: true,
  }, 

  // ═══════════════════════════════════════════════════════════════════
  // SOIC-20W  (20 pins, 1.27mm pitch, wide body)
  // ═══════════════════════════════════════════════════════════════════
  
    {
    id: 'soic20w',
    name: 'SOIC-16/18/20W',
    category: 'SOIC',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      { col: 1, row: 7, label: '1' },
      { col: 0, row: 7, label: '2' },
      { col: 0, row: 6, label: '3' },
      { col: 0, row: 5, label: '4' },
      { col: 0, row: 4, label: '5' },
      { col: 0, row: 3, label: '6' },
      { col: 0, row: 2, label: '7' },
      { col: 0, row: 1, label: '8' },
      { col: 0, row: 0, label: '9' },
      { col: 1, row: 0, label: '10' },
      { col: 6, row: 0, label: '11' },
      { col: 7, row: 0, label: '12' },
      { col: 7, row: 1, label: '13' },
      { col: 7, row: 2, label: '14' },
      { col: 7, row: 3, label: '15' },
      { col: 7, row: 4, label: '16' },
      { col: 7, row: 5, label: '17' },
      { col: 7, row: 6, label: '18' },
      { col: 7, row: 7, label: '19' },
      { col: 6, row: 7, label: '20' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 4.24, y: 14.605, w: 2.05, h: 0.6 },   // Pin 1
        { type: 'pad', x: 4.24, y: 13.335, w: 2.05, h: 0.6 },   // Pin 2
        { type: 'pad', x: 4.24, y: 12.065, w: 2.05, h: 0.6 },   // Pin 3
        { type: 'pad', x: 4.24, y: 10.795, w: 2.05, h: 0.6 },   // Pin 4
        { type: 'pad', x: 4.24, y: 9.525, w: 2.05, h: 0.6 },   // Pin 5
        { type: 'pad', x: 4.24, y: 8.255, w: 2.05, h: 0.6 },   // Pin 6
        { type: 'pad', x: 4.24, y: 6.985, w: 2.05, h: 0.6 },   // Pin 7
        { type: 'pad', x: 4.24, y: 5.715, w: 2.05, h: 0.6 },   // Pin 8
        { type: 'pad', x: 4.24, y: 4.445, w: 2.05, h: 0.6 },   // Pin 9
        { type: 'pad', x: 4.24, y: 3.175, w: 2.05, h: 0.6 },   // Pin 10
        { type: 'pad', x: 13.54, y: 3.175, w: 2.05, h: 0.6 },   // Pin 11
        { type: 'pad', x: 13.54, y: 4.445, w: 2.05, h: 0.6 },   // Pin 12
        { type: 'pad', x: 13.54, y: 5.715, w: 2.05, h: 0.6 },   // Pin 13
        { type: 'pad', x: 13.54, y: 6.985, w: 2.05, h: 0.6 },   // Pin 14
        { type: 'pad', x: 13.54, y: 8.255, w: 2.05, h: 0.6 },   // Pin 15
        { type: 'pad', x: 13.54, y: 9.525, w: 2.05, h: 0.6 },   // Pin 16
        { type: 'pad', x: 13.54, y: 10.795, w: 2.05, h: 0.6 },   // Pin 17
        { type: 'pad', x: 13.54, y: 12.065, w: 2.05, h: 0.6 },   // Pin 18
        { type: 'pad', x: 13.54, y: 13.335, w: 2.05, h: 0.6 },   // Pin 19
        { type: 'pad', x: 13.54, y: 14.605, w: 2.05, h: 0.6 },   // Pin 20

        // Fanout traces
        { type: 'trace', x1: 4.318, y1: 13.335, x2: 3.048, y2: 13.335, w: 0.25 },
        { type: 'trace', x1: 3.048, y1: 13.335, x2: 2.032, y2: 14.351, w: 0.25 },
        { type: 'trace', x1: 2.032, y1: 14.351, x2: 2.032, y2: 16.002, w: 0.25 },
        { type: 'trace', x1: 2.032, y1: 16.002, x2: 0.508, y2: 17.78, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 12.065, x2: 3.048, y2: 12.065, w: 0.25 },
        { type: 'trace', x1: 3.048, y1: 12.065, x2: 0.127, y2: 15.113, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 10.795, x2: 2.921, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 10.795, x2: 1.016, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 1.016, y1: 12.7, x2: -0.127, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 9.525, x2: 1.016, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 1.016, y1: 9.525, x2: 0.254, y2: 10.16, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 8.255, x2: 1.016, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 1.016, y1: 8.255, x2: 0.127, y2: 7.747, w: 0.25 },
        { type: 'trace', x1: 4.318, y1: 6.985, x2: 2.794, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 2.794, y1: 6.985, x2: 1.016, y2: 5.334, w: 0.25 },
        { type: 'trace', x1: 1.016, y1: 5.334, x2: 0, y2: 5.334, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 5.715, x2: 3.048, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 3.048, y1: 5.715, x2: 0.127, y2: 3.048, w: 0.25 },
        { type: 'trace', x1: 4.191, y1: 4.445, x2: 3.048, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 3.048, y1: 4.445, x2: 1.905, y2: 3.429, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 3.429, x2: 1.905, y2: 2.159, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 2.159, x2: 1.905, y2: 1.778, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 1.778, x2: 0.127, y2: 0.127, w: 0.25 },
        { type: 'trace', x1: 3.937, y1: 3.175, x2: 3.175, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 3.175, y1: 3.175, x2: 2.667, y2: 2.667, w: 0.25 },
        { type: 'trace', x1: 2.667, y1: 2.667, x2: 2.667, y2: 0, w: 0.25 },
        { type: 'trace', x1: 3.937, y1: 14.605, x2: 3.175, y2: 14.605, w: 0.25 },
        { type: 'trace', x1: 3.175, y1: 14.605, x2: 2.794, y2: 14.986, w: 0.25 },
        { type: 'trace', x1: 2.794, y1: 14.986, x2: 2.794, y2: 17.653, w: 0.25 },
        { type: 'trace', x1: 13.716, y1: 14.605, x2: 14.605, y2: 14.605, w: 0.25 },
        { type: 'trace', x1: 14.605, y1: 14.605, x2: 15.113, y2: 15.113, w: 0.25 },
        { type: 'trace', x1: 15.113, y1: 15.113, x2: 15.113, y2: 17.78, w: 0.25 },
        { type: 'trace', x1: 13.589, y1: 13.335, x2: 14.732, y2: 13.335, w: 0.25 },
        { type: 'trace', x1: 14.732, y1: 13.335, x2: 16.002, y2: 14.732, w: 0.25 },
        { type: 'trace', x1: 16.002, y1: 14.732, x2: 16.002, y2: 16.256, w: 0.25 },
        { type: 'trace', x1: 16.002, y1: 16.256, x2: 17.653, y2: 17.78, w: 0.25 },
        { type: 'trace', x1: 13.589, y1: 12.065, x2: 14.732, y2: 12.065, w: 0.25 },
        { type: 'trace', x1: 14.732, y1: 12.065, x2: 17.526, y2: 15.113, w: 0.25 },
        { type: 'trace', x1: 13.716, y1: 10.795, x2: 14.732, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 14.732, y1: 10.795, x2: 16.637, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 16.637, y1: 12.7, x2: 17.653, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 13.589, y1: 9.525, x2: 16.764, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 16.764, y1: 9.525, x2: 16.891, y2: 9.525, w: 0.25 },
        { type: 'trace', x1: 16.891, y1: 9.525, x2: 17.653, y2: 10.16, w: 0.25 },
        { type: 'trace', x1: 13.589, y1: 8.255, x2: 16.891, y2: 8.255, w: 0.25 },
        { type: 'trace', x1: 16.891, y1: 8.255, x2: 17.653, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 13.462, y1: 6.985, x2: 14.859, y2: 6.985, w: 0.25 },
        { type: 'trace', x1: 14.859, y1: 6.985, x2: 16.764, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 16.764, y1: 5.08, x2: 17.78, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 13.462, y1: 5.715, x2: 14.859, y2: 5.715, w: 0.25 },
        { type: 'trace', x1: 14.859, y1: 5.715, x2: 17.78, y2: 2.921, w: 0.25 },
        { type: 'trace', x1: 13.462, y1: 4.445, x2: 14.732, y2: 4.445, w: 0.25 },
        { type: 'trace', x1: 14.732, y1: 4.445, x2: 16.129, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 16.129, y1: 3.175, x2: 16.129, y2: 1.524, w: 0.25 },
        { type: 'trace', x1: 16.129, y1: 1.524, x2: 17.653, y2: 0.127, w: 0.25 },
        { type: 'trace', x1: 13.716, y1: 3.175, x2: 14.605, y2: 3.175, w: 0.25 },
        { type: 'trace', x1: 14.605, y1: 3.175, x2: 15.113, y2: 2.794, w: 0.25 },
        { type: 'trace', x1: 15.113, y1: 2.794, x2: 15.113, y2: 0.127, w: 0.25 },
      ],
      mask: [
        { type: 'pad', x: 4.24, y: 14.605, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 13.335, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 12.065, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 10.795, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 9.525, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 8.255, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 6.985, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 5.715, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 4.445, w: 2.15, h: 0.7 },
        { type: 'pad', x: 4.24, y: 3.175, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 3.175, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 4.445, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 5.715, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 6.985, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 8.255, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 9.525, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 10.795, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 12.065, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 13.335, w: 2.15, h: 0.7 },
        { type: 'pad', x: 13.54, y: 14.605, w: 2.15, h: 0.7 },
      ],
      silk: [
        { type: 'circle', x: 4, y: 15.5, d: 0.5 },
          /*{ type: 'poly', points: [
          { x: 1.6, y: 1.15 }, { x: 6.02, y: 1.15 },
          { x: 6.02, y: 11.5 }, { x: 1.6, y: 11.5 },
          { x: 1.6, y: 1.15 },
         */
      ],
    },

    outline: { width: 19.8, height: 19.8 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 8,
    heightPins: 8,
    silkLabel: { text: 'SOIC-16/20W', rotation: 90, x: 8.89, y: 8.89, height: 1 },
    overlay: true,
  }, 

  // ═══════════════════════════════════════════════════════════════════
  // MSOP-8  (8 pins, 0.65mm pitch, 3.0mm body)
  // Grid: 4×4  |  TH pins: col 0 rows 0-3, col 3 rows 0-3
  // TODO: manually adjust pad positions and routing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'msop12',
    name: 'MSOP-8/10/12',
    category: 'MSOP',
    pitch: 2.54,
    color: '#60c0a0',

    throughPins: [
      { col: 1, row: 3, label: '1' },
      { col: 0, row: 3, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 1, label: '4' },
      { col: 0, row: 0, label: '5' },
      { col: 1, row: 0, label: '6' },
      { col: 3, row: 0, label: '7' },
      { col: 4, row: 0, label: '8' },
      { col: 4, row: 1, label: '9' },
      { col: 4, row: 2, label: '10' },
      { col: 4, row: 3, label: '11' },
      { col: 3, row: 3, label: '12' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.93, y: 5.435, w: 1.45, h: 0.4 },   // Pin 1
        { type: 'pad', x: 2.93, y: 4.785, w: 1.45, h: 0.4 },   // Pin 2
        { type: 'pad', x: 2.93, y: 4.135, w: 1.45, h: 0.4 },   // Pin 3
        { type: 'pad', x: 2.93, y: 3.485, w: 1.45, h: 0.4 },   // Pin 4
        { type: 'pad', x: 2.93, y: 2.835, w: 1.45, h: 0.4 },   // Pin 5
        { type: 'pad', x: 2.93, y: 2.185, w: 1.45, h: 0.4 },   // Pin 6
        { type: 'pad', x: 7.23, y: 2.185, w: 1.45, h: 0.4 },   // Pin 7
        { type: 'pad', x: 7.23, y: 2.835, w: 1.45, h: 0.4 },   // Pin 8
        { type: 'pad', x: 7.23, y: 3.485, w: 1.45, h: 0.4 },   // Pin 9
        { type: 'pad', x: 7.23, y: 4.135, w: 1.45, h: 0.4 },   // Pin 10
        { type: 'pad', x: 7.23, y: 4.785, w: 1.45, h: 0.4 },   // Pin 11
        { type: 'pad', x: 7.23, y: 5.435, w: 1.45, h: 0.4 },   // Pin 12

        // Fanout traces
        { type: 'trace', x1: 2.921, y1: 5.461, x2: 2.413, y2: 5.461, w: 0.25 },
        { type: 'trace', x1: 2.413, y1: 5.461, x2: 2.413, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 2.794, y1: 4.826, x2: 2.032, y2: 4.826, w: 0.25 },
        { type: 'trace', x1: 2.032, y1: 4.826, x2: 1.651, y2: 5.207, w: 0.25 },
        { type: 'trace', x1: 1.651, y1: 5.207, x2: 1.651, y2: 6.096, w: 0.25 },
        { type: 'trace', x1: 1.651, y1: 6.096, x2: 0, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 2.794, y1: 4.191, x2: 1.651, y2: 4.191, w: 0.25 },
        { type: 'trace', x1: 1.651, y1: 4.191, x2: 0.889, y2: 4.953, w: 0.25 },
        { type: 'trace', x1: 0.889, y1: 4.953, x2: -0.127, y2: 4.953, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 3.429, x2: 1.651, y2: 3.429, w: 0.25 },
        { type: 'trace', x1: 1.651, y1: 3.429, x2: 0.762, y2: 2.54, w: 0.25 },
        { type: 'trace', x1: 0.762, y1: 2.54, x2: 0, y2: 2.54, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 2.794, x2: 2.032, y2: 2.794, w: 0.25 },
        { type: 'trace', x1: 2.032, y1: 2.794, x2: 1.524, y2: 2.286, w: 0.25 },
        { type: 'trace', x1: 1.524, y1: 2.286, x2: 1.524, y2: 1.27, w: 0.25 },
        { type: 'trace', x1: 1.524, y1: 1.27, x2: 0, y2: 0, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 2.159, x2: 2.413, y2: 2.159, w: 0.25 },
        { type: 'trace', x1: 2.413, y1: 2.159, x2: 2.413, y2: -0.127, w: 0.25 },
        { type: 'trace', x1: 7.112, y1: 2.159, x2: 7.747, y2: 2.159, w: 0.25 },
        { type: 'trace', x1: 7.747, y1: 2.159, x2: 7.747, y2: 0, w: 0.25 },
        { type: 'trace', x1: 7.239, y1: 2.794, x2: 8.255, y2: 2.794, w: 0.25 },
        { type: 'trace', x1: 8.255, y1: 2.794, x2: 8.509, y2: 2.54, w: 0.25 },
        { type: 'trace', x1: 8.509, y1: 2.54, x2: 8.509, y2: 1.524, w: 0.25 },
        { type: 'trace', x1: 8.509, y1: 1.524, x2: 10.033, y2: 0.127, w: 0.25 },
        { type: 'trace', x1: 7.112, y1: 3.429, x2: 8.382, y2: 3.429, w: 0.25 },
        { type: 'trace', x1: 8.382, y1: 3.429, x2: 9.144, y2: 2.667, w: 0.25 },
        { type: 'trace', x1: 9.144, y1: 2.667, x2: 10.16, y2: 2.667, w: 0.25 },
        { type: 'trace', x1: 7.239, y1: 4.191, x2: 8.382, y2: 4.191, w: 0.25 },
        { type: 'trace', x1: 8.382, y1: 4.191, x2: 9.271, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 5.08, x2: 10.033, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 7.239, y1: 4.826, x2: 8.128, y2: 4.826, w: 0.25 },
        { type: 'trace', x1: 8.128, y1: 4.826, x2: 8.509, y2: 5.207, w: 0.25 },
        { type: 'trace', x1: 8.509, y1: 5.207, x2: 8.509, y2: 6.223, w: 0.25 },
        { type: 'trace', x1: 8.509, y1: 6.223, x2: 10.033, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 7.239, y1: 5.461, x2: 7.747, y2: 5.461, w: 0.25 },
        { type: 'trace', x1: 7.747, y1: 5.461, x2: 7.747, y2: 7.62, w: 0.25 },
      ],
      mask: [
        { type: 'pad', x: 2.93, y: 5.435, w: 1.55, h: 0.5 },
        { type: 'pad', x: 2.93, y: 4.785, w: 1.55, h: 0.5 },
        { type: 'pad', x: 2.93, y: 4.135, w: 1.55, h: 0.5 },
        { type: 'pad', x: 2.93, y: 3.485, w: 1.55, h: 0.5 },
        { type: 'pad', x: 2.93, y: 2.835, w: 1.55, h: 0.5 },
        { type: 'pad', x: 2.93, y: 2.185, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 2.185, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 2.835, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 3.485, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 4.135, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 4.785, w: 1.55, h: 0.5 },
        { type: 'pad', x: 7.23, y: 5.435, w: 1.55, h: 0.5 },
      ],
      silk: [
        { type: 'circle', x: 2.5, y: 6.2, d: 0.5 },
        /*
        { type: 'poly', points: [
          { x: 1.6, y: 1.15 }, { x: 6.02, y: 1.15 },
          { x: 6.02, y: 6.47 }, { x: 1.6, y: 6.47 },
          { x: 1.6, y: 1.15 },
        ]},*/
      ],
    },

    outline: { width: 12.2, height: 9.6 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 4,
    silkLabel: { text: 'MSOP-8/12', rotation: 90, x: 5.08, y: 3.81, height: 0.8 },
    overlay: true,
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
      { col: 0, row: 3, label: '1' },
      { col: 0, row: 2, label: '2' },
      { col: 0, row: 1, label: '3' },
      { col: 0, row: 0, label: '4' },
      { col: 4, row: 0, label: '5' },
      { col: 4, row: 1, label: '6' },
      { col: 4, row: 2, label: '7' },
      { col: 4, row: 3, label: '8' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 2.218, y: 4.785, w: 1.475, h: 0.4 },   // Pin 1
        { type: 'pad', x: 2.218, y: 4.135, w: 1.475, h: 0.4 },   // Pin 2
        { type: 'pad', x: 2.218, y: 3.485, w: 1.475, h: 0.4 },   // Pin 3
        { type: 'pad', x: 2.218, y: 2.835, w: 1.475, h: 0.4 },   // Pin 4
        { type: 'pad', x: 7.943, y: 2.835, w: 1.475, h: 0.4 },   // Pin 5
        { type: 'pad', x: 7.943, y: 3.485, w: 1.475, h: 0.4 },   // Pin 6
        { type: 'pad', x: 7.943, y: 4.135, w: 1.475, h: 0.4 },   // Pin 7
        { type: 'pad', x: 7.943, y: 4.785, w: 1.475, h: 0.4 },   // Pin 8

        // Fanout traces
        { type: 'trace', x1: 2.159, y1: 4.064, x2: 1.27, y2: 4.064, w: 0.3 },
        { type: 'trace', x1: 1.27, y1: 4.064, x2: 0.127, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.159, y1: 4.826, x2: 1.651, y2: 4.826, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 4.826, x2: 1.651, y2: 6.35, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 6.35, x2: 0.254, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 2.159, y1: 3.429, x2: 1.27, y2: 3.429, w: 0.3 },
        { type: 'trace', x1: 1.27, y1: 3.429, x2: 0.127, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.159, y1: 2.794, x2: 1.651, y2: 2.794, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 2.794, x2: 1.651, y2: 1.016, w: 0.3 },
        { type: 'trace', x1: 1.651, y1: 1.016, x2: 0.127, y2: 0, w: 0.3 },
        { type: 'trace', x1: 8.128, y1: 4.826, x2: 8.509, y2: 4.826, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 4.826, x2: 8.509, y2: 6.35, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 6.35, x2: 9.906, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 8.128, y1: 4.064, x2: 8.89, y2: 4.064, w: 0.3 },
        { type: 'trace', x1: 8.89, y1: 4.064, x2: 10.16, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 8.001, y1: 3.429, x2: 8.89, y2: 3.429, w: 0.3 },
        { type: 'trace', x1: 8.89, y1: 3.429, x2: 10.16, y2: 2.667, w: 0.3 },
        { type: 'trace', x1: 8.128, y1: 2.794, x2: 8.509, y2: 2.794, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 2.794, x2: 8.509, y2: 1.27, w: 0.3 },
        { type: 'trace', x1: 8.509, y1: 1.27, x2: 10.16, y2: -0.127, w: 0.3 },
      ],
      mask: [
        { type: 'pad', x: 2.218, y: 4.785, w: 1.575, h: 0.5 },
        { type: 'pad', x: 2.218, y: 4.135, w: 1.575, h: 0.5 },
        { type: 'pad', x: 2.218, y: 3.485, w: 1.575, h: 0.5 },
        { type: 'pad', x: 2.218, y: 2.835, w: 1.575, h: 0.5 },
        { type: 'pad', x: 7.943, y: 2.835, w: 1.575, h: 0.5 },
        { type: 'pad', x: 7.943, y: 3.485, w: 1.575, h: 0.5 },
        { type: 'pad', x: 7.943, y: 4.135, w: 1.575, h: 0.5 },
        { type: 'pad', x: 7.943, y: 4.785, w: 1.575, h: 0.5 },
      ],
      silk: [
        { type: 'circle', x: 2.1, y: 5.5, d: 0.5 },
          /*{ type: 'poly', points: [
          { x: 1.0, y: 1.85 }, { x: 6.62, y: 1.85 },
          { x: 6.62, y: 5.25 }, { x: 1.0, y: 5.25 },
          { x: 1.0, y: 1.85 },
        ]},
        */
      ],
    },

    outline: { width: 12.2, height: 9.6 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 5,
    heightPins: 4,
    silkLabel: { text: 'TSSOP-8', rotation: 90, x: 5.08, y: 3.81, height: 0.8 },
    overlay: true,
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
      { col: 1, row: 5, label: '1' },
      { col: 0, row: 5, label: '2' },
      { col: 0, row: 4, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 0, row: 2, label: '5' },
      { col: 0, row: 1, label: '6' },
      { col: 0, row: 0, label: '7' },
      { col: 1, row: 0, label: '8' },
      { col: 4, row: 0, label: '9' },
      { col: 5, row: 0, label: '10' },
      { col: 5, row: 1, label: '11' },
      { col: 5, row: 2, label: '12' },
      { col: 5, row: 3, label: '13' },
      { col: 5, row: 4, label: '14' },
      { col: 5, row: 5, label: '15' },
      { col: 4, row: 5, label: '16' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 3.488, y: 8.625, w: 1.475, h: 0.4 },   // Pin 1
        { type: 'pad', x: 3.488, y: 7.975, w: 1.475, h: 0.4 },   // Pin 2
        { type: 'pad', x: 3.488, y: 7.325, w: 1.475, h: 0.4 },   // Pin 3
        { type: 'pad', x: 3.488, y: 6.675, w: 1.475, h: 0.4 },   // Pin 4
        { type: 'pad', x: 3.488, y: 6.025, w: 1.475, h: 0.4 },   // Pin 5
        { type: 'pad', x: 3.488, y: 5.375, w: 1.475, h: 0.4 },   // Pin 6
        { type: 'pad', x: 3.488, y: 4.725, w: 1.475, h: 0.4 },   // Pin 7
        { type: 'pad', x: 3.488, y: 4.075, w: 1.475, h: 0.4 },   // Pin 8
        { type: 'pad', x: 9.213, y: 4.075, w: 1.475, h: 0.4 },   // Pin 9
        { type: 'pad', x: 9.213, y: 4.725, w: 1.475, h: 0.4 },   // Pin 10
        { type: 'pad', x: 9.213, y: 5.375, w: 1.475, h: 0.4 },   // Pin 11
        { type: 'pad', x: 9.213, y: 6.025, w: 1.475, h: 0.4 },   // Pin 12
        { type: 'pad', x: 9.213, y: 6.675, w: 1.475, h: 0.4 },   // Pin 13
        { type: 'pad', x: 9.213, y: 7.325, w: 1.475, h: 0.4 },   // Pin 14
        { type: 'pad', x: 9.213, y: 7.975, w: 1.475, h: 0.4 },   // Pin 15
        { type: 'pad', x: 9.213, y: 8.625, w: 1.475, h: 0.4 },   // Pin 16

        // Fanout traces
        { type: 'trace', x1: 3.429, y1: 8.636, x2: 2.921, y2: 8.636, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 8.636, x2: 2.921, y2: 11.811, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 11.811, x2: 2.413, y2: 12.573, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 8.636, x2: 9.779, y2: 8.636, w: 0.25 },
        { type: 'trace', x1: 9.779, y1: 8.636, x2: 9.779, y2: 11.811, w: 0.25 },
        { type: 'trace', x1: 9.779, y1: 11.811, x2: 10.16, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 3.429, y1: 4.064, x2: 2.921, y2: 4.064, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 4.064, x2: 2.921, y2: 0.889, w: 0.25 },
        { type: 'trace', x1: 2.921, y1: 0.889, x2: 2.54, y2: 0.127, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 4.064, x2: 9.779, y2: 4.064, w: 0.25 },
        { type: 'trace', x1: 9.779, y1: 4.064, x2: 9.779, y2: 0.889, w: 0.25 },
        { type: 'trace', x1: 9.779, y1: 0.889, x2: 10.16, y2: 0.254, w: 0.25 },
        { type: 'trace', x1: 3.429, y1: 6.604, x2: 1.27, y2: 6.604, w: 0.25 },
        { type: 'trace', x1: 1.27, y1: 6.604, x2: 0.127, y2: 7.62, w: 0.25 },
        { type: 'trace', x1: 3.429, y1: 5.969, x2: 1.27, y2: 5.969, w: 0.25 },
        { type: 'trace', x1: 1.27, y1: 5.969, x2: 0, y2: 5.08, w: 0.25 },
        { type: 'trace', x1: 3.429, y1: 4.699, x2: 2.286, y2: 4.699, w: 0.25 },
        { type: 'trace', x1: 2.286, y1: 4.699, x2: 1.905, y2: 4.318, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 4.318, x2: 1.905, y2: 1.778, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 1.778, x2: 0.127, y2: 0.127, w: 0.25 },
        { type: 'trace', x1: 3.302, y1: 5.334, x2: 1.905, y2: 5.334, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 5.334, x2: 1.27, y2: 4.699, w: 0.25 },
        { type: 'trace', x1: 1.27, y1: 4.699, x2: 1.27, y2: 3.683, w: 0.25 },
        { type: 'trace', x1: 1.27, y1: 3.683, x2: 0.127, y2: 2.54, w: 0.25 },
        { type: 'trace', x1: 3.175, y1: 7.366, x2: 1.905, y2: 7.366, w: 0.25 },
        { type: 'trace', x1: 1.905, y1: 7.366, x2: 1.397, y2: 7.874, w: 0.25 },
        { type: 'trace', x1: 1.397, y1: 7.874, x2: 1.397, y2: 9.144, w: 0.25 },
        { type: 'trace', x1: 1.397, y1: 9.144, x2: 0.254, y2: 10.16, w: 0.25 },
        { type: 'trace', x1: 3.175, y1: 8.001, x2: 2.54, y2: 8.001, w: 0.25 },
        { type: 'trace', x1: 2.54, y1: 8.001, x2: 2.159, y2: 8.382, w: 0.25 },
        { type: 'trace', x1: 2.159, y1: 8.382, x2: 2.159, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 2.159, y1: 10.795, x2: 0.127, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 8.001, x2: 10.033, y2: 8.001, w: 0.25 },
        { type: 'trace', x1: 10.033, y1: 8.001, x2: 10.16, y2: 8.001, w: 0.25 },
        { type: 'trace', x1: 10.16, y1: 8.001, x2: 10.541, y2: 8.382, w: 0.25 },
        { type: 'trace', x1: 10.541, y1: 8.382, x2: 10.541, y2: 10.795, w: 0.25 },
        { type: 'trace', x1: 10.541, y1: 10.795, x2: 12.573, y2: 12.7, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 7.366, x2: 10.541, y2: 7.366, w: 0.25 },
        { type: 'trace', x1: 10.541, y1: 7.366, x2: 11.303, y2: 8.128, w: 0.25 },
        { type: 'trace', x1: 11.303, y1: 8.128, x2: 11.303, y2: 9.398, w: 0.25 },
        { type: 'trace', x1: 11.303, y1: 9.398, x2: 12.319, y2: 10.16, w: 0.25 },
        { type: 'trace', x1: 9.144, y1: 6.604, x2: 11.811, y2: 6.604, w: 0.25 },
        { type: 'trace', x1: 11.811, y1: 6.604, x2: 12.573, y2: 7.493, w: 0.25 },
        { type: 'trace', x1: 9.144, y1: 5.969, x2: 11.811, y2: 5.969, w: 0.25 },
        { type: 'trace', x1: 11.811, y1: 5.969, x2: 12.7, y2: 5.207, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 5.334, x2: 10.795, y2: 5.334, w: 0.25 },
        { type: 'trace', x1: 10.795, y1: 5.334, x2: 11.43, y2: 4.826, w: 0.25 },
        { type: 'trace', x1: 11.43, y1: 4.826, x2: 11.43, y2: 3.683, w: 0.25 },
        { type: 'trace', x1: 11.43, y1: 3.683, x2: 12.573, y2: 2.54, w: 0.25 },
        { type: 'trace', x1: 9.271, y1: 4.699, x2: 10.16, y2: 4.699, w: 0.25 },
        { type: 'trace', x1: 10.16, y1: 4.699, x2: 10.795, y2: 4.191, w: 0.25 },
        { type: 'trace', x1: 10.795, y1: 4.191, x2: 10.795, y2: 1.778, w: 0.25 },
        { type: 'trace', x1: 10.795, y1: 1.778, x2: 12.7, y2: 0.127, w: 0.25 },
      ],
      mask: [
        { type: 'pad', x: 3.488, y: 8.625, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 7.975, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 7.325, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 6.675, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 6.025, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 5.375, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 4.725, w: 1.575, h: 0.5 },
        { type: 'pad', x: 3.488, y: 4.075, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 4.075, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 4.725, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 5.375, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 6.025, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 6.675, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 7.325, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 7.975, w: 1.575, h: 0.5 },
        { type: 'pad', x: 9.213, y: 8.625, w: 1.575, h: 0.5 },
      ],
      silk: [
        { type: 'circle', x: 3.2, y: 9.5, d: 0.5 },
          /*{ type: 'poly', points: [
          { x: 1.0, y: 1.85 }, { x: 6.62, y: 1.85 },
          { x: 6.62, y: 5.25 }, { x: 1.0, y: 5.25 },
          { x: 1.0, y: 1.85 },
        ]},
        */
      ],
    },

    outline: { width: 14.7, height: 14.7 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 6,
    heightPins: 6,
    silkLabel: { text: 'TSSOP-16', rotation: 90, x: 6.35, y: 6.35, height: 0.8 },
    overlay: true,
  },   

  {
    id: 'lmr51430',
    name: 'LMR-51430',
    category: 'Subcircuit',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 6.5, y: 2.685, w: 0.9, h: 0.95, rotation: -90 },   // Pin 1
        { type: 'pad', x: 6.5, y: 4.235, w: 0.9, h: 0.95, rotation: -90 },   // Pin 2
        { type: 'pad', x: 8.79, y: 9.06, w: 0.54, h: 0.64 },   // Pin 1
        { type: 'pad', x: 9.81, y: 9.06, w: 0.54, h: 0.64 },   // Pin 2
        { type: 'pad', x: 3.2, y: 10.29, w: 2.15, h: 5.5, rotation: -90 },   // Pin 1
        { type: 'pad', x: 3.2, y: 6.43, w: 2.15, h: 5.5, rotation: -90 },   // Pin 2
        { type: 'pad', x: 2.757, y: 1.717, w: 1.15, h: 1.8, rotation: -135 },   // Pin 1
        { type: 'pad', x: 4.843, y: 3.803, w: 1.15, h: 1.8, rotation: -135 },   // Pin 2
        { type: 'pad', x: 7.98, y: 7.76, w: 0.56, h: 0.62 },   // Pin 1
        { type: 'pad', x: 7.02, y: 7.76, w: 0.56, h: 0.62 },   // Pin 2
        { type: 'pad', x: 6.99, y: 9.06, w: 0.54, h: 0.64 },   // Pin 1
        { type: 'pad', x: 8.01, y: 9.06, w: 0.54, h: 0.64 },   // Pin 2
        { type: 'pad', x: 10.275, y: 10.66, w: 1.15, h: 1.8 },   // Pin 1
        { type: 'pad', x: 7.325, y: 10.66, w: 1.15, h: 1.8 },   // Pin 2
        { type: 'pad', x: 10.4375, y: 6.21, w: 1.325, h: 0.6 },   // Pin 1
        { type: 'pad', x: 10.4375, y: 5.26, w: 1.325, h: 0.6 },   // Pin 2
        { type: 'pad', x: 10.4375, y: 4.31, w: 1.325, h: 0.6 },   // Pin 3
        { type: 'pad', x: 8.1625, y: 4.31, w: 1.325, h: 0.6 },   // Pin 4
        { type: 'pad', x: 8.1625, y: 5.26, w: 1.325, h: 0.6 },   // Pin 5
        { type: 'pad', x: 8.1625, y: 6.21, w: 1.325, h: 0.6 },   // Pin 6
        { type: 'pad', x: 11.175, y: 7.56, w: 0.9, h: 0.95 },   // Pin 1
        { type: 'pad', x: 9.625, y: 7.56, w: 0.9, h: 0.95 },   // Pin 2

        // F.Cu traces
        { type: 'trace', x1: 10.4375, y1: 6.8225, x2: 11.175, y2: 7.56, w: 0.3 },
        { type: 'trace', x1: 10.4375, y1: 6.21, x2: 10.4375, y2: 6.8225, w: 0.3 },
        { type: 'trace', x1: 6.5, y1: 5.26, x2: 5.3, y2: 6.46, w: 0.5 },
        { type: 'trace', x1: 3.7, y1: 6.46, x2: 3.63, y2: 6.53, w: 0.5 },
        { type: 'trace', x1: 9.3125, y1: 7.56, x2: 8.8125, y2: 7.06, w: 0.3 },
        { type: 'trace', x1: 3.63, y1: 6.53, x2: 3.5, y2: 6.53, w: 0.5 },
        { type: 'trace', x1: 6.9, y1: 5.26, x2: 6.5, y2: 5.26, w: 0.5 },
        { type: 'trace', x1: 8.1625, y1: 5.26, x2: 6.9, y2: 5.26, w: 0.5 },
        { type: 'trace', x1: 9.625, y1: 7.56, x2: 9.3125, y2: 7.56, w: 0.3 },
        { type: 'trace', x1: 5.3, y1: 6.46, x2: 3.7, y2: 6.46, w: 0.5 },
        { type: 'trace', x1: 9.3, y1: 3.56, x2: 9.3, y2: 6.06, w: 0.3 },
        { type: 'trace', x1: 9.15, y1: 6.21, x2: 8.1625, y2: 6.21, w: 0.3 },
        { type: 'trace', x1: 8.1625, y1: 6.21, x2: 8.1625, y2: 7.5775, w: 0.3 },
        { type: 'trace', x1: 8.425, y1: 2.685, x2: 9.3, y2: 3.56, w: 0.3 },
        { type: 'trace', x1: 6.5, y1: 2.685, x2: 8.425, y2: 2.685, w: 0.3 },
        { type: 'trace', x1: 8.1625, y1: 7.5775, x2: 7.98, y2: 7.76, w: 0.3 },
        { type: 'trace', x1: 9.81, y1: 9.06, x2: 9.81, y2: 10.195, w: 0.5 },
        { type: 'trace', x1: 5.1, y1: 1.285, x2: 6.5, y2: 2.685, w: 0.5 },
        { type: 'trace', x1: 9.81, y1: 10.195, x2: 10.275, y2: 10.66, w: 0.5 },
        { type: 'trace', x1: 9.3, y1: 6.06, x2: 9.15, y2: 6.21, w: 0.3 },
        { type: 'trace', x1: 3.4, y1: 1.285, x2: 5.1, y2: 1.285, w: 0.5 },
        { type: 'trace', x1: 8.51, y1: 7.76, x2: 9.81, y2: 9.06, w: 0.3 },
        { type: 'trace', x1: 7.98, y1: 7.76, x2: 8.51, y2: 7.76, w: 0.3 },
        { type: 'trace', x1: 3.4, y1: 1.285, x2: 3.4, y2: 1.285, w: 0.5 },
        { type: 'trace', x1: 7.2, y1: 4.31, x2: 6.575, y2: 4.31, w: 0.5 },
        { type: 'trace', x1: 10.4375, y1: 5.26, x2: 11.5, y2: 5.26, w: 0.3 },
        { type: 'trace', x1: 4.015, y1: 4.235, x2: 4.015, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 3.4, y1: 4.235, x2: 4.015, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 6.575, y1: 4.31, x2: 6.5, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 8.1625, y1: 4.31, x2: 7.2, y2: 4.31, w: 0.5 },
        { type: 'trace', x1: 4.015, y1: 4.235, x2: 6.5, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 7.02, y1: 9.03, x2: 6.99, y2: 9.06, w: 0.3 },
        { type: 'trace', x1: 6.99, y1: 10.325, x2: 7.325, y2: 10.66, w: 0.3 },
        { type: 'trace', x1: 7.055, y1: 10.39, x2: 7.325, y2: 10.66, w: 0.3 },
        { type: 'trace', x1: 6.99, y1: 9.06, x2: 6.99, y2: 10.325, w: 0.3 },
        { type: 'trace', x1: 7.02, y1: 7.76, x2: 7.02, y2: 9.03, w: 0.3 },
        { type: 'trace', x1: 3.5, y1: 10.39, x2: 7.055, y2: 10.39, w: 0.3 },
        { type: 'trace', x1: 8.79, y1: 9.06, x2: 8.79, y2: 9.75, w: 0.3 },
        { type: 'trace', x1: 8.79, y1: 9.75, x2: 8.8, y2: 9.76, w: 0.3 },
        { type: 'trace', x1: 11.5, y1: 4.26, x2: 10.4875, y2: 4.26, w: 0.3 },
        { type: 'trace', x1: 10.4875, y1: 4.26, x2: 10.4375, y2: 4.31, w: 0.3 },
        { type: 'trace', x1: 8.01, y1: 9.06, x2: 8.79, y2: 9.06, w: 0.3 },
      ],
      copperBack: [
        { type: 'trace', x1: 8.7, y1: 7.06, x2: 6.9, y2: 5.26, w: 0.3 },
        { type: 'trace', x1: 8.8125, y1: 7.06, x2: 8.7, y2: 7.06, w: 0.3 },
        { type: 'trace', x1: 11.5, y1: 5.26, x2: 12.151, y2: 4.609, w: 0.3 },
        { type: 'trace', x1: 12.151, y1: 4.609, x2: 12.151, y2: 3.9903, w: 0.3 },
        { type: 'trace', x1: 11.7697, y1: 3.609, x2: 7.901, y2: 3.609, w: 0.3 },
        { type: 'trace', x1: 7.901, y1: 3.609, x2: 7.2, y2: 4.31, w: 0.3 },
        { type: 'trace', x1: 12.151, y1: 3.9903, x2: 11.7697, y2: 3.609, w: 0.3 },
        { type: 'trace', x1: 8.8, y1: 9.76, x2: 9.6, y2: 8.96, w: 0.3 },
        { type: 'trace', x1: 9.6, y1: 5.86, x2: 11.2, y2: 4.26, w: 0.3 },
        { type: 'trace', x1: 9.6, y1: 8.96, x2: 9.6, y2: 5.86, w: 0.3 },
        { type: 'trace', x1: 11.2, y1: 4.26, x2: 11.5, y2: 4.26, w: 0.3 },
      ],
      drills: [
        { x: 8.8125, y: 7.06, drill: 0.3, size: 0.6 },
        { x: 6.9, y: 5.26, drill: 0.3, size: 0.6 },
        { x: 11.5, y: 5.26, drill: 0.3, size: 0.6 },
        { x: 7.2, y: 4.31, drill: 0.3, size: 0.6 },
        { x: 8.8, y: 9.76, drill: 0.3, size: 0.6 },
        { x: 11.5, y: 4.26, drill: 0.3, size: 0.6 },
      ],
      mask: [
        { type: 'pad', x: 6.5, y: 2.685, w: 1, h: 1.05, rotation: -90 },
        { type: 'pad', x: 6.5, y: 4.235, w: 1, h: 1.05, rotation: -90 },
        { type: 'pad', x: 8.79, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 9.81, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 3.2, y: 10.29, w: 2.25, h: 5.6, rotation: -90 },
        { type: 'pad', x: 3.2, y: 6.43, w: 2.25, h: 5.6, rotation: -90 },
        { type: 'pad', x: 2.757, y: 1.717, w: 1.25, h: 1.9, rotation: -135 },
        { type: 'pad', x: 4.843, y: 3.803, w: 1.25, h: 1.9, rotation: -135 },
        { type: 'pad', x: 7.98, y: 7.76, w: 0.66, h: 0.72 },
        { type: 'pad', x: 7.02, y: 7.76, w: 0.66, h: 0.72 },
        { type: 'pad', x: 6.99, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 8.01, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 10.275, y: 10.66, w: 1.25, h: 1.9 },
        { type: 'pad', x: 7.325, y: 10.66, w: 1.25, h: 1.9 },
        { type: 'pad', x: 10.4375, y: 6.21, w: 1.425, h: 0.7 },
        { type: 'pad', x: 10.4375, y: 5.26, w: 1.425, h: 0.7 },
        { type: 'pad', x: 10.4375, y: 4.31, w: 1.425, h: 0.7 },
        { type: 'pad', x: 8.1625, y: 4.31, w: 1.425, h: 0.7 },
        { type: 'pad', x: 8.1625, y: 5.26, w: 1.425, h: 0.7 },
        { type: 'pad', x: 8.1625, y: 6.21, w: 1.425, h: 0.7 },
        { type: 'pad', x: 11.175, y: 7.56, w: 1, h: 1.05 },
        { type: 'pad', x: 9.625, y: 7.56, w: 1, h: 1.05 },
      ],
      silk: [
        { type: 'poly', points: [{ x: 0, y: 12.7 }, { x: 12.7, y: 12.7 }] },
        { type: 'poly', points: [{ x: 5.99, y: 3.3194 }, { x: 5.99, y: 3.6006 }] },
        { type: 'poly', points: [{ x: 7.01, y: 3.3194 }, { x: 7.01, y: 3.6006 }] },
        { type: 'poly', points: [{ x: 9.1464, y: 9.44 }, { x: 9.4536, y: 9.44 }] },
        { type: 'poly', points: [{ x: 9.1464, y: 8.68 }, { x: 9.4536, y: 8.68 }] },
        { type: 'poly', points: [{ x: 0.4, y: 8.76 }, { x: 0.4, y: 7.96 }] },
        { type: 'poly', points: [{ x: 6, y: 8.76 }, { x: 6, y: 7.96 }] },
        { type: 'poly', points: [{ x: 2.6536, y: 2.9005 }, { x: 3.6595, y: 3.9064 }] },
        { type: 'poly', points: [{ x: 3.9405, y: 1.6136 }, { x: 4.9464, y: 2.6195 }] },
        { type: 'poly', points: [{ x: 7.6078, y: 8.12 }, { x: 7.3922, y: 8.12 }] },
        { type: 'poly', points: [{ x: 7.6078, y: 7.4 }, { x: 7.3922, y: 7.4 }] },
        { type: 'poly', points: [{ x: 7.3464, y: 9.44 }, { x: 7.6536, y: 9.44 }] },
        { type: 'poly', points: [{ x: 7.3464, y: 8.68 }, { x: 7.6536, y: 8.68 }] },
        { type: 'poly', points: [{ x: 9.5113, y: 11.57 }, { x: 8.0887, y: 11.57 }] },
        { type: 'poly', points: [{ x: 9.5113, y: 9.75 }, { x: 8.0887, y: 9.75 }] },
        { type: 'poly', points: [{ x: 10.21, y: 6.82 }, { x: 8.39, y: 6.82 }] },
        { type: 'poly', points: [{ x: 10.21, y: 6.77 }, { x: 10.21, y: 6.82 }] },
        { type: 'poly', points: [{ x: 10.21, y: 3.7 }, { x: 10.21, y: 3.75 }] },
        { type: 'poly', points: [{ x: 8.39, y: 6.82 }, { x: 8.39, y: 6.77 }] },
        { type: 'poly', points: [{ x: 8.39, y: 3.75 }, { x: 8.39, y: 3.7 }] },
        { type: 'poly', points: [{ x: 8.39, y: 3.7 }, { x: 10.21, y: 3.7 }] },
        { type: 'poly', points: [{ x: 10.5406, y: 8.07 }, { x: 10.2594, y: 8.07 }] },
        { type: 'poly', points: [{ x: 10.5406, y: 7.05 }, { x: 10.2594, y: 7.05 }] },
        { type: 'circle', x: 6.2, y: 3.185, d: 0.25 },
      ],
      silkText: [
        { type: 'text', text: 'C2', x: 6.4, y: 5.76, height: 1, rotation: 0 },
        { type: 'text', text: 'R2', x: 11, y: 8.96, height: 1, rotation: 180 },
        { type: 'text', text: 'L1', x: 4.8, y: 8.36, height: 1, rotation: 270 },
        { type: 'text', text: 'C1', x: 3.8, y: 2.76, height: 1, rotation: 270 },
        { type: 'text', text: 'C4', x: 6.8, y: 6.56, height: 1, rotation: 90 },
        { type: 'text', text: 'R1', x: 5.6, y: 8.36, height: 1, rotation: 180 },
        { type: 'text', text: 'C5', x: 8.8, y: 10.76, height: 1, rotation: 0 },
        { type: 'text', text: 'U1', x: 10.4, y: 2.76, height: 1, rotation: 0 },
        { type: 'text', text: 'C3', x: 12, y: 6.16, height: 1, rotation: 90 },
      ],
    },

    outline: { width: 14.7, height: 14.7 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 6,
    heightPins: 6,
  },

  /*
  {
    id: 'lmr5140',
    name: 'LMR-5140',
    category: 'Subcircuit',
    pitch: 2.54,
    color: '#a060c0',

    throughPins: [
      { col: 1, row: 0, label: '2' },
      { col: 0, row: 0, label: '2' },
      { col: 5, row: 5, label: '3' },
      { col: 5, row: 4, label: '4' },
    ],

    features: {
      copper: [
        // SMD pads
        { type: 'pad', x: 6.5, y: 2.685, w: 0.95, h: 0.9 },   // Pin 1
        { type: 'pad', x: 6.5, y: 4.235, w: 0.95, h: 0.9 },   // Pin 2
        { type: 'pad', x: 9.81, y: 9.06, w: 0.54, h: 0.64 },   // Pin 1
        { type: 'pad', x: 8.79, y: 9.06, w: 0.54, h: 0.64 },   // Pin 2
        { type: 'pad', x: 3.2, y: 10.29, w: 5.5, h: 2.15 },   // Pin 1
        { type: 'pad', x: 3.2, y: 6.43, w: 5.5, h: 2.15 },   // Pin 2
        { type: 'pad', x: 3.8, y: 1.285, w: 1.8, h: 1.15 },   // Pin 1
        { type: 'pad', x: 3.8, y: 4.235, w: 1.8, h: 1.15 },   // Pin 2
        { type: 'pad', x: 7.02, y: 7.76, w: 0.56, h: 0.62 },   // Pin 1
        { type: 'pad', x: 7.98, y: 7.76, w: 0.56, h: 0.62 },   // Pin 2
        { type: 'pad', x: 8.01, y: 9.06, w: 0.54, h: 0.64 },   // Pin 1
        { type: 'pad', x: 6.99, y: 9.06, w: 0.54, h: 0.64 },   // Pin 2
        { type: 'pad', x: 7.325, y: 10.66, w: 1.15, h: 1.8 },   // Pin 1
        { type: 'pad', x: 10.275, y: 10.66, w: 1.15, h: 1.8 },   // Pin 2
        { type: 'pad', x: 8.1625, y: 6.21, w: 1.325, h: 0.6 },   // Pin 1
        { type: 'pad', x: 8.1625, y: 5.26, w: 1.325, h: 0.6 },   // Pin 2
        { type: 'pad', x: 8.1625, y: 4.31, w: 1.325, h: 0.6 },   // Pin 3
        { type: 'pad', x: 10.4375, y: 4.31, w: 1.325, h: 0.6 },   // Pin 4
        { type: 'pad', x: 10.4375, y: 5.26, w: 1.325, h: 0.6 },   // Pin 5
        { type: 'pad', x: 10.4375, y: 6.21, w: 1.325, h: 0.6 },   // Pin 6
        { type: 'pad', x: 9.625, y: 7.56, w: 0.9, h: 0.95 },   // Pin 1
        { type: 'pad', x: 11.175, y: 7.56, w: 0.9, h: 0.95 },   // Pin 2

        // F.Cu traces
        { type: 'trace', x1: 10.4375, y1: 6.8225, x2: 11.175, y2: 7.56, w: 0.3 },
        { type: 'trace', x1: 10.4375, y1: 6.21, x2: 10.4375, y2: 6.8225, w: 0.3 },
        { type: 'trace', x1: 6.5, y1: 5.26, x2: 5.3, y2: 6.46, w: 0.5 },
        { type: 'trace', x1: 3.7, y1: 6.46, x2: 3.63, y2: 6.53, w: 0.5 },
        { type: 'trace', x1: 9.3125, y1: 7.56, x2: 8.8125, y2: 7.06, w: 0.3 },
        { type: 'trace', x1: 3.63, y1: 6.53, x2: 3.5, y2: 6.53, w: 0.5 },
        { type: 'trace', x1: 6.9, y1: 5.26, x2: 6.5, y2: 5.26, w: 0.5 },
        { type: 'trace', x1: 8.1625, y1: 5.26, x2: 6.9, y2: 5.26, w: 0.5 },
        { type: 'trace', x1: 9.625, y1: 7.56, x2: 9.3125, y2: 7.56, w: 0.3 },
        { type: 'trace', x1: 5.3, y1: 6.46, x2: 3.7, y2: 6.46, w: 0.5 },
        { type: 'trace', x1: 9.3, y1: 3.56, x2: 9.3, y2: 6.06, w: 0.3 },
        { type: 'trace', x1: 9.15, y1: 6.21, x2: 8.1625, y2: 6.21, w: 0.3 },
        { type: 'trace', x1: 8.1625, y1: 6.21, x2: 8.1625, y2: 7.5775, w: 0.3 },
        { type: 'trace', x1: 8.425, y1: 2.685, x2: 9.3, y2: 3.56, w: 0.3 },
        { type: 'trace', x1: 6.5, y1: 2.685, x2: 8.425, y2: 2.685, w: 0.3 },
        { type: 'trace', x1: 8.1625, y1: 7.5775, x2: 7.98, y2: 7.76, w: 0.3 },
        { type: 'trace', x1: 9.81, y1: 9.06, x2: 9.81, y2: 10.195, w: 0.5 },
        { type: 'trace', x1: 5.1, y1: 1.285, x2: 6.5, y2: 2.685, w: 0.5 },
        { type: 'trace', x1: 9.81, y1: 10.195, x2: 10.275, y2: 10.66, w: 0.5 },
        { type: 'trace', x1: 9.3, y1: 6.06, x2: 9.15, y2: 6.21, w: 0.3 },
        { type: 'trace', x1: 3.4, y1: 1.285, x2: 5.1, y2: 1.285, w: 0.5 },
        { type: 'trace', x1: 8.51, y1: 7.76, x2: 9.81, y2: 9.06, w: 0.3 },
        { type: 'trace', x1: 7.98, y1: 7.76, x2: 8.51, y2: 7.76, w: 0.3 },
        { type: 'trace', x1: 3.4, y1: 1.285, x2: 3.4, y2: 1.285, w: 0.5 },
        { type: 'trace', x1: 7.2, y1: 4.31, x2: 6.575, y2: 4.31, w: 0.5 },
        { type: 'trace', x1: 10.4375, y1: 5.26, x2: 11.5, y2: 5.26, w: 0.3 },
        { type: 'trace', x1: 4.015, y1: 4.235, x2: 4.015, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 3.4, y1: 4.235, x2: 4.015, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 6.575, y1: 4.31, x2: 6.5, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 8.1625, y1: 4.31, x2: 7.2, y2: 4.31, w: 0.5 },
        { type: 'trace', x1: 4.015, y1: 4.235, x2: 6.5, y2: 4.235, w: 0.5 },
        { type: 'trace', x1: 7.02, y1: 9.03, x2: 6.99, y2: 9.06, w: 0.3 },
        { type: 'trace', x1: 6.99, y1: 10.325, x2: 7.325, y2: 10.66, w: 0.3 },
        { type: 'trace', x1: 7.055, y1: 10.39, x2: 7.325, y2: 10.66, w: 0.3 },
        { type: 'trace', x1: 6.99, y1: 9.06, x2: 6.99, y2: 10.325, w: 0.3 },
        { type: 'trace', x1: 7.02, y1: 7.76, x2: 7.02, y2: 9.03, w: 0.3 },
        { type: 'trace', x1: 3.5, y1: 10.39, x2: 7.055, y2: 10.39, w: 0.3 },
        { type: 'trace', x1: 8.79, y1: 9.06, x2: 8.79, y2: 9.75, w: 0.3 },
        { type: 'trace', x1: 8.79, y1: 9.75, x2: 8.8, y2: 9.76, w: 0.3 },
        { type: 'trace', x1: 11.5, y1: 4.26, x2: 10.4875, y2: 4.26, w: 0.3 },
        { type: 'trace', x1: 10.4875, y1: 4.26, x2: 10.4375, y2: 4.31, w: 0.3 },
        { type: 'trace', x1: 8.01, y1: 9.06, x2: 8.79, y2: 9.06, w: 0.3 },
        { type: 'trace', x1: 2.54, y1: 0, x2: 3.683, y2: 1.27, w: 0.6 },
        { type: 'trace', x1: -0.127, y1: 0, x2: -0.127, y2: 1.397, w: 0.6 },
        { type: 'trace', x1: -0.127, y1: 1.397, x2: 2.794, y2: 4.191, w: 0.6 },
        { type: 'trace', x1: 2.794, y1: 4.191, x2: 3.81, y2: 4.191, w: 0.6 },
        { type: 'trace', x1: 7.366, y1: 10.668, x2: 7.366, y2: 11.684, w: 0.6 },
        { type: 'trace', x1: 7.366, y1: 11.684, x2: 8.128, y2: 12.446, w: 0.6 },
        { type: 'trace', x1: 8.128, y1: 12.446, x2: 12.065, y2: 12.446, w: 0.6 },
        { type: 'trace', x1: 12.065, y1: 12.446, x2: 12.573, y2: 12.7, w: 0.6 },
        { type: 'trace', x1: 10.287, y1: 10.668, x2: 11.811, y2: 10.668, w: 0.6 },
        { type: 'trace', x1: 11.811, y1: 10.668, x2: 12.7, y2: 10.16, w: 0.6 },
      ],
      copperBack: [
        { type: 'trace', x1: 8.7, y1: 7.06, x2: 6.9, y2: 5.26, w: 0.3 },
        { type: 'trace', x1: 8.8125, y1: 7.06, x2: 8.7, y2: 7.06, w: 0.3 },
        { type: 'trace', x1: 11.5, y1: 5.26, x2: 12.151, y2: 4.609, w: 0.3 },
        { type: 'trace', x1: 12.151, y1: 4.609, x2: 12.151, y2: 3.9903, w: 0.3 },
        { type: 'trace', x1: 11.7697, y1: 3.609, x2: 7.901, y2: 3.609, w: 0.3 },
        { type: 'trace', x1: 7.901, y1: 3.609, x2: 7.2, y2: 4.31, w: 0.3 },
        { type: 'trace', x1: 12.151, y1: 3.9903, x2: 11.7697, y2: 3.609, w: 0.3 },
        { type: 'trace', x1: 8.8, y1: 9.76, x2: 9.6, y2: 8.96, w: 0.3 },
        { type: 'trace', x1: 9.6, y1: 5.86, x2: 11.2, y2: 4.26, w: 0.3 },
        { type: 'trace', x1: 9.6, y1: 8.96, x2: 9.6, y2: 5.86, w: 0.3 },
        { type: 'trace', x1: 11.2, y1: 4.26, x2: 11.5, y2: 4.26, w: 0.3 },
      ],
      drills: [
        { x: 8.8125, y: 7.06, drill: 0.3, size: 0.6 },
        { x: 6.9, y: 5.26, drill: 0.3, size: 0.6 },
        { x: 11.5, y: 5.26, drill: 0.3, size: 0.6 },
        { x: 7.2, y: 4.31, drill: 0.3, size: 0.6 },
        { x: 8.8, y: 9.76, drill: 0.3, size: 0.6 },
        { x: 11.5, y: 4.26, drill: 0.3, size: 0.6 },
      ],
      mask: [
        { type: 'pad', x: 6.5, y: 2.685, w: 1.05, h: 1 },
        { type: 'pad', x: 6.5, y: 4.235, w: 1.05, h: 1 },
        { type: 'pad', x: 9.81, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 8.79, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 3.2, y: 10.29, w: 5.6, h: 2.25 },
        { type: 'pad', x: 3.2, y: 6.43, w: 5.6, h: 2.25 },
        { type: 'pad', x: 3.8, y: 1.285, w: 1.9, h: 1.25 },
        { type: 'pad', x: 3.8, y: 4.235, w: 1.9, h: 1.25 },
        { type: 'pad', x: 7.02, y: 7.76, w: 0.66, h: 0.72 },
        { type: 'pad', x: 7.98, y: 7.76, w: 0.66, h: 0.72 },
        { type: 'pad', x: 8.01, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 6.99, y: 9.06, w: 0.64, h: 0.74 },
        { type: 'pad', x: 7.325, y: 10.66, w: 1.25, h: 1.9 },
        { type: 'pad', x: 10.275, y: 10.66, w: 1.25, h: 1.9 },
        { type: 'pad', x: 8.1625, y: 6.21, w: 1.425, h: 0.7 },
        { type: 'pad', x: 8.1625, y: 5.26, w: 1.425, h: 0.7 },
        { type: 'pad', x: 8.1625, y: 4.31, w: 1.425, h: 0.7 },
        { type: 'pad', x: 10.4375, y: 4.31, w: 1.425, h: 0.7 },
        { type: 'pad', x: 10.4375, y: 5.26, w: 1.425, h: 0.7 },
        { type: 'pad', x: 10.4375, y: 6.21, w: 1.425, h: 0.7 },
        { type: 'pad', x: 9.625, y: 7.56, w: 1, h: 1.05 },
        { type: 'pad', x: 11.175, y: 7.56, w: 1, h: 1.05 },
      ],
      silk: [
        { type: 'poly', points: [{ x: 7.01, y: 3.3194 }, { x: 7.01, y: 3.6006 }] },
        { type: 'poly', points: [{ x: 5.99, y: 3.3194 }, { x: 5.99, y: 3.6006 }] },
        { type: 'poly', points: [{ x: 9.4536, y: 9.44 }, { x: 9.1464, y: 9.44 }] },
        { type: 'poly', points: [{ x: 9.4536, y: 8.68 }, { x: 9.1464, y: 8.68 }] },
        { type: 'poly', points: [{ x: 6, y: 8.76 }, { x: 6, y: 7.96 }] },
        { type: 'poly', points: [{ x: 0.4, y: 8.76 }, { x: 0.4, y: 7.96 }] },
        { type: 'poly', points: [{ x: 4.71, y: 2.0487 }, { x: 4.71, y: 3.4713 }] },
        { type: 'poly', points: [{ x: 2.89, y: 2.0487 }, { x: 2.89, y: 3.4713 }] },
        { type: 'poly', points: [{ x: 7.3922, y: 8.12 }, { x: 7.6078, y: 8.12 }] },
        { type: 'poly', points: [{ x: 7.3922, y: 7.4 }, { x: 7.6078, y: 7.4 }] },
        { type: 'poly', points: [{ x: 7.6536, y: 9.44 }, { x: 7.3464, y: 9.44 }] },
        { type: 'poly', points: [{ x: 7.6536, y: 8.68 }, { x: 7.3464, y: 8.68 }] },
        { type: 'poly', points: [{ x: 8.0887, y: 11.57 }, { x: 9.5113, y: 11.57 }] },
        { type: 'poly', points: [{ x: 8.0887, y: 9.75 }, { x: 9.5113, y: 9.75 }] },
        { type: 'poly', points: [{ x: 8.39, y: 6.82 }, { x: 10.21, y: 6.82 }] },
        { type: 'poly', points: [{ x: 8.39, y: 6.77 }, { x: 8.39, y: 6.82 }] },
        { type: 'poly', points: [{ x: 8.39, y: 3.7 }, { x: 8.39, y: 3.75 }] },
        { type: 'poly', points: [{ x: 10.21, y: 6.82 }, { x: 10.21, y: 6.77 }] },
        { type: 'poly', points: [{ x: 10.21, y: 3.75 }, { x: 10.21, y: 3.7 }] },
        { type: 'poly', points: [{ x: 10.21, y: 3.7 }, { x: 8.39, y: 3.7 }] },
        { type: 'poly', points: [{ x: 10.2594, y: 8.07 }, { x: 10.5406, y: 8.07 }] },
        { type: 'poly', points: [{ x: 10.2594, y: 7.05 }, { x: 10.5406, y: 7.05 }] },
        { type: 'circle', x: 6.2, y: 3.185, d: 0.25 },
      ],
      silkText: [
        { type: 'text', text: 'C2', x: 6.4, y: 5.76, height: 1, rotation: 0 },
        { type: 'text', text: 'R2', x: 11, y: 8.96, height: 1, rotation: 180 },
        { type: 'text', text: 'L1', x: 4.8, y: 8.36, height: 1, rotation: 270 },
        { type: 'text', text: 'C1', x: 3.8, y: 2.76, height: 1, rotation: 0 },
        { type: 'text', text: 'C4', x: 6.8, y: 6.56, height: 1, rotation: 90 },
        { type: 'text', text: 'R1', x: 5.6, y: 8.36, height: 1, rotation: 180 },
        { type: 'text', text: 'C5', x: 8.8, y: 10.76, height: 1, rotation: 0 },
        { type: 'text', text: 'U1', x: 10.4, y: 2.76, height: 1, rotation: 0 },
        { type: 'text', text: 'C3', x: 12, y: 6.16, height: 1, rotation: 90 },
      ],
    },

    outline: { width: 14.7, height: 14.7 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 6,
    heightPins: 6,
    silkLabel: { text: 'LMR-51430', rotation: 0, x: 9, y: 0, height: 0.9 },
  },
  */   
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

export function getAdapterForInstance(inst) {
  const adapter = getRotatedAdapter(inst.adapterId, inst.rotation || 0);
  if (!adapter) return null;

  if (adapter.id !== VARIABLE_SUBGRID_ADAPTER_ID) return adapter;

  const widthPins = Math.max(1, Math.round(inst.widthPins || adapter.widthPins || 4));
  const heightPins = Math.max(1, Math.round(inst.heightPins || adapter.heightPins || 4));
  const fallbackPitch = adapter.subGridPitches?.[0] || 2.00;
  const fallbackPad = Math.max(0.4, Math.min(fallbackPitch - 0.2, fallbackPitch * 0.6));
  const fallbackDrill = 0.3;
  const maskExpansion = 0.05;

  const subGridPitch = Number(inst.subGridPitch) > 0 ? Number(inst.subGridPitch) : fallbackPitch;
  const requestedPadSize = Number(inst.subPadSize) > 0 ? Number(inst.subPadSize) : fallbackPad;
  const subPadSize = Math.max(0.25, Math.min(requestedPadSize, Math.max(0.25, subGridPitch - 0.15)));
  const subDrillSize = Number(inst.subGridDrill) > 0.3 ? Number(inst.subGridDrill) : fallbackDrill;
  const subgridPads = buildSubgridPads({
    widthPins,
    heightPins,
    pitch: adapter.pitch,
    subGridPitch,
    subPadSize,
    throughPins: adapter.throughPins,
  });

  const subgridMask = buildSubgridMask({
    widthPins,
    heightPins,
    pitch: adapter.pitch,
    subGridPitch,
    subPadSize,
    maskExpansion,
    throughPins: adapter.throughPins,
  });

  const subgridDrills = buildSubgridDrills({
    widthPins,
    heightPins,
    pitch: adapter.pitch,
    subGridPitch,
    subDrillSize,
    throughPins: adapter.throughPins,
  });

  return {
    ...adapter,
    widthPins,
    heightPins,
    subGridPitch,
    subPadSize,
    outline: {
      width: Math.max(2.5, (widthPins - 1) * adapter.pitch + 1.6),
      height: Math.max(2.5, (heightPins - 1) * adapter.pitch + 1.6),
    },
    features: {
      copper: subgridPads,
      copperBack: subgridPads,
      mask: subgridMask,
      silk: [],
      silkText: [],
      drills: subgridDrills,
    },
  };
}

export function cycleVariableSubgridPitch(inst) {
  if (!inst || inst.adapterId !== VARIABLE_SUBGRID_ADAPTER_ID) return inst;

  const adapter = getAdapter(VARIABLE_SUBGRID_ADAPTER_ID);
  const pitches = adapter?.subGridPitches;
  if (!Array.isArray(pitches) || pitches.length === 0) return inst;

  const currentPitch = Number(inst.subGridPitch ?? pitches[0]);
  const currentIndex = pitches.findIndex(pitch => Math.abs(pitch - currentPitch) < 0.0001);
  const nextIndex = currentIndex >= 0
    ? (currentIndex + 1) % pitches.length
    : 0;

  return {
    ...inst,
    subGridPitch: pitches[nextIndex],
  };
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
      // Add adapter rotation to pad rotation; RoundRect macro handles orientation natively
      const padRot = ((f.rotation || 0) + r * 90) % 360;
      // Normalize to 0-180° range (rectangular pads have 180° symmetry)
      const normRot = padRot % 180;
      return { type: 'pad', x: p.x, y: p.y, w: f.w, h: f.h, rotation: normRot || undefined };
    } else if (f.type === 'trace') {
      const p1 = rotPt(f.x1, f.y1);
      const p2 = rotPt(f.x2, f.y2);
      return { type: 'trace', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w: f.w };
    } else if (f.type === 'circle') {
      const p = rotPt(f.x, f.y);
      return { type: 'circle', x: p.x, y: p.y, d: f.d };
    } else if (f.type === 'poly') {
      return { type: 'poly', points: f.points.map(pt => rotPt(pt.x, pt.y)) };
    } else if (f.type === 'text') {
      const p = rotPt(f.x, f.y);
      const baseRot = f.rotation || 0;
      // Add adapter rotation (r × 90°), then normalize for readability:
      // Text at 180° or 270° is upside-down/mirrored, flip to 0° or 90°
      let textRot = (baseRot + r * 90) % 360;
      if (textRot >= 180) textRot -= 180;
      return { ...f, x: p.x, y: p.y, rotation: textRot };
    }

    return f;
  }

  // Rotate silkLabel position if present
  let silkLabel = adapter.silkLabel;
  if (silkLabel) {
    const p = rotPt(silkLabel.x, silkLabel.y);
    const baseRot = silkLabel.rotation || 0;
    let textRot = (baseRot + r * 90) % 360;
    if (textRot >= 180) textRot -= 180;
    silkLabel = { ...silkLabel, x: p.x, y: p.y, rotation: textRot };
  }

  return {
    ...adapter,
    throughPins, widthPins, heightPins, outline,
    silkLabel,
    features: {
      copper: adapter.features.copper.map(rotFeature),
      copperBack: adapter.features.copperBack ? adapter.features.copperBack.map(rotFeature) : undefined,
      drills: adapter.features.drills ? adapter.features.drills.map(d => {
        const p = rotPt(d.x, d.y);
        return { ...d, x: p.x, y: p.y };
      }) : undefined,
      mask: adapter.features.mask.map(rotFeature),
      silk: adapter.features.silk ? adapter.features.silk.map(rotFeature) : undefined,
      silkText: adapter.features.silkText ? adapter.features.silkText.map(rotFeature) : undefined,
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
    silkText: adapter.features.silkText.map(offsetFeature),
  };
}

function round4(value) {
  return Math.round(value * 10000) / 10000;
}

function buildSubgridPads({ widthPins, heightPins, pitch, subGridPitch, subPadSize, throughPins = [] }) {
  const pads = [];
  const endX = (widthPins - 1) * pitch;
  const endY = (heightPins - 1) * pitch;
  const thKeepout = 1.4;

  for (let x = 0; x <= endX + 1e-9; x += subGridPitch) {
    for (let y = 0; y <= endY + 1e-9; y += subGridPitch) {
      const rx = round4(x);
      const ry = round4(y);
      const blocked = throughPins.some(pin => {
        const tx = pin.col * pitch;
        const ty = pin.row * pitch;
        return Math.abs(rx - tx) < thKeepout && Math.abs(ry - ty) < thKeepout;
      });
      if (!blocked) pads.push({ type: 'pad', x: rx, y: ry, w: subPadSize, h: subPadSize });
    }
  }

  return pads;
}

function buildSubgridMask({ widthPins, heightPins, pitch, subGridPitch, subPadSize, maskExpansion, throughPins = [] }) {
  const pads = [];
  const endX = (widthPins - 1) * pitch;
  const endY = (heightPins - 1) * pitch;
  const thKeepout = 1.4;

  for (let x = 0; x <= endX + 1e-9; x += subGridPitch) {
    for (let y = 0; y <= endY + 1e-9; y += subGridPitch) {
      const rx = round4(x);
      const ry = round4(y);
      const blocked = throughPins.some(pin => {
        const tx = pin.col * pitch;
        const ty = pin.row * pitch;
        return Math.abs(rx - tx) < thKeepout && Math.abs(ry - ty) < thKeepout;
      });
      if (!blocked) pads.push({ type: 'pad', x: rx, y: ry, w: subPadSize + 2*maskExpansion, h: subPadSize + 2*maskExpansion });
    }
  }

  return pads;
}

function buildSubgridDrills({ widthPins, heightPins, pitch, subGridPitch, subDrillSize, throughPins = [] }) {
  const drills = [];
  const endX = (widthPins - 1) * pitch;
  const endY = (heightPins - 1) * pitch;
  const thKeepout = 1.4;

  for (let x = 0; x <= endX + 1e-9; x += subGridPitch) {
    for (let y = 0; y <= endY + 1e-9; y += subGridPitch) {
      const rx = round4(x);
      const ry = round4(y);
      const blocked = throughPins.some(pin => {
        const tx = pin.col * pitch;
        const ty = pin.row * pitch;
        return Math.abs(rx - tx) < thKeepout && Math.abs(ry - ty) < thKeepout;
      });
      if (!blocked) drills.push({ type: 'via', x: rx, y: ry, drill: subDrillSize, size: subDrillSize });
    }
  }

  return drills;
}

 /**
 * Get overlay image URL for a module, or null if none configured.
 * @param {object} adp - Module definition from ADAPTER_LIBRARY
 * @returns {string|null} URL to PNG overlay
 */
export function getAdapterOverlayUrl(adp) {
  if (!adp || !adp.overlay) return null;
  const filename = typeof adp.overlay === 'string' ? adp.overlay : `${adp.id}.png`;
  return `${adapterOverlayBasePath}/${filename}`;
}

/**
 * Set the base path for module overlay PNGs (e.g. for WordPress deployment).
 * @param {string} path - Base path without trailing slash
 */
export function setAdapterOverlayBasePath(path) {
  adapterOverlayBasePath = path;
}
