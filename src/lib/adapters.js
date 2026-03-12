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
 *     - drills[]: vias and drills, outside of the throughPin Grid
 *     - silk[]: silkscreen outlines
 *     - silkText[]: Pin and part Designators
 *   - optionalFeatures: Additional Gerber primitives relative to origin (col 0, row 0 position)
 *     - copper[]: pads and traces on copper layer
 *     - drills[]: vias and drills, outside of the throughPin Grid
 *     - mask[]: solder mask openings
 *     - silk[]: silkscreen outlines
 *     - silkText[]: Pin and part Designators
 *   - outline: { width, height } in mm for preview rendering
 *   - outlineOffset: optional { x, y } mm offset
 *   - widthPins, heightPins: reserved grid rectangle (all inner pads suppressed)
 *   - silkLabel: Name of the adapter printed in silkscreen,
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
 *   { type: 'text', text, x,y, height, rotation } – silkscreen text
 */


import { getPitchProfile } from './gridProfiles.js';

/** Base path for module overlay PNGs. */
export let adapterOverlayBasePath = './assets/adapters';
export const VARIABLE_SUBGRID_ADAPTER_ID = 'subgrid-variable';
export const VARIABLE_SUBGRID_PAD_SHAPES = ['circle', 'square', 'square-smd'];

/** Runtime-registered custom adapters (updated via registerCustomAdapters). */
let _customAdapters = [];

/**
 * Called by App.svelte whenever the customAdaptersList store changes.
 * Keeps the plain-JS lookup functions in sync without requiring Svelte runes here.
 * @param {any[]} list
 */
export function registerCustomAdapters(list) {
  _customAdapters = list;
}

/** Returns all built-in + custom adapters combined. */
export function getAllAdapters() {
  return [...ADAPTER_LIBRARY, ..._customAdapters];
}


/** Basic adapters only - other footprints are separate JSON files in assets/adapters */

export const ADAPTER_LIBRARY = [
    {
      id: VARIABLE_SUBGRID_ADAPTER_ID,
      name: 'Variable Sub-Grid',
      category: 'Grid',      
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
      subGridPitches: [2.54, 2.00, 1.27],
    },

    {
      id: 'bridge_1x3_254',
      name: 'Bridge (1x3)',
      category: 'Grid',
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
      id: 'bridge_1x4_254',
      name: 'Bridge (1x4)',
      category: 'Grid',
      pitch: 2.54,
      color: '#606060',

      throughPins: [
        { col: 0, row: 0, label: '1' },
        { col: 1, row: 0, label: '2' },
        { col: 2, row: 0, label: '3' },
        { col: 3, row: 0, label: '4' },
      ],

      features: {
        copper: [],
        copperBack: [
          // F.Cu traces
          { type: 'trace', x1: 0, y1: 0, x2: 1.5, y2: 1.3, w: 0.4 },
          { type: 'trace', x1: 1.5, y1: 1.3, x2: 6, y2: 1.3, w: 0.4 },
          { type: 'trace', x1: 6, y1: 1.3, x2: 7.62, y2: 0, w: 0.4 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 10, height: 2 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 4,
      heightPins: 1,
    },

    {
      id: 'bridge_1x3_200',
      name: 'Bridge (1x3)',
      category: 'Grid',
      pitch: 2.00,
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
          { type: 'trace', x1: 0, y1: 0, x2: 1, y2: 1, w: 0.3 },
          { type: 'trace', x1: 1, y1: 1, x2: 3, y2: 1, w: 0.3 },
          { type: 'trace', x1: 3, y1: 1, x2: 4, y2: 0, w: 0.3 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 6, height: 1.8 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 3,
      heightPins: 1,
    },
    {
      id: 'bridge_1x4_200',
      name: 'Bridge (1x4)',
      category: 'Grid',
      pitch: 2.00,
      color: '#606060',

      throughPins: [
        { col: 0, row: 0, label: '1' },
        { col: 1, row: 0, label: '2' },
        { col: 2, row: 0, label: '3' },
        { col: 3, row: 0, label: '4' },
      ],

      features: {
        copper: [],
        copperBack: [
          // F.Cu traces
          { type: 'trace', x1: 0, y1: 0, x2: 1, y2: 1, w: 0.3 },
          { type: 'trace', x1: 1, y1: 1, x2: 5, y2: 1, w: 0.3 },
          { type: 'trace', x1: 5, y1: 1, x2: 6, y2: 0, w: 0.3 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 8, height: 1.8 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 4,
      heightPins: 1,
    },
{
      id: 'bridge_1x3_127',
      name: 'Bridge (1x3)',
      category: 'Grid',
      pitch: 1.27,
      color: '#606060',

      throughPins: [
        { col: 0, row: 0, label: '1' },
        { col: 2, row: 0, label: '3' },
      ],

      features: {
        copper: [
          { type: 'pad', x: 1.27, y: 0, w: 0.9, h: 0.9 },
        ],
        copperBack: [
          // F.Cu traces
          { type: 'trace', x1: 0, y1: 0, x2: 2.54, y2: 0, w: 0.4 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 4, height: 1.4 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 3,
      heightPins: 1,
    },
    {
      id: 'bridge_1x4_127',
      name: 'Bridge (1x4)',
      category: 'Grid',
      pitch: 1.27,
      color: '#606060',

      throughPins: [
        { col: 0, row: 0, label: '1' },
        { col: 3, row: 0, label: '4' },
      ],

      features: {
        copper: [
          { type: 'pad', x: 1.27, y: 0, w: 0.9, h: 0.9 },
          { type: 'pad', x: 2.54, y: 0, w: 0.9, h: 0.9 },
        ],
        copperBack: [
          // F.Cu traces
          { type: 'trace', x1: 0, y1: 0, x2: 3.81, y2: 0, w: 0.4 },
        ],
        mask: [
        ],
        silk: [
        ],
      },

      outline: { width: 5.5, height: 1.4 },
      outlineOffset: { x: 0, y: 0 },
      widthPins: 4,
      heightPins: 1,
    },
];

function uniqPitches(values) {
  const out = [];
  for (const value of values) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) continue;
    if (!out.some(existing => Math.abs(existing - num) < 0.0001)) out.push(num);
  }
  return out;
}

export function getVariableSubgridPitches(basePitch) {
  const normalizedBasePitch = Number(basePitch) > 0 ? Number(basePitch) : 2.54;
  return uniqPitches([
    normalizedBasePitch,
    ...(normalizedBasePitch >= 2.54 - 0.0001 ? [2.54] : []),
    ...(normalizedBasePitch >= 2.00 - 0.0001 ? [2.00] : []),
    ...(normalizedBasePitch >= 1.27 - 0.0001 ? [1.27] : []),
  ]);
}

export function isAdapterCompatibleWithPitch(adapter, pitch) {
  if (!adapter) return false;
  if (adapter.id === VARIABLE_SUBGRID_ADAPTER_ID) return true;
  return adapter.pitch === pitch;
}

// ═══════════════════════════════════════════════════════════════════
// Adapter Registration
// ═══════════════════════════════════════════════════════════════════

/**
 * Register a single external adapter definition into ADAPTER_LIBRARY.
 *
 * The adapter object must follow the same structure as entries in ADAPTER_LIBRARY.
 * Required fields: id, name, category, features, throughPins, widthPins, heightPins, outline.
 *
 * @param {object} adapterDef - Adapter definition object.
 */
export function registerAdapter(adapterDef) {
  if (!adapterDef || typeof adapterDef.id !== 'string') {
    throw new Error('registerAdapter: adapter must have a string id');
  }
  if (ADAPTER_LIBRARY.some(a => a.id === adapterDef.id)) {
    console.warn(`registerAdapter: adapter '${adapterDef.id}' is already registered – skipping.`);
    return;
  }
  ADAPTER_LIBRARY.push(adapterDef);
}

/**
 * Register multiple external adapter definitions at once.
 *
 * @param {object[]} adapterDefs - Array of adapter definition objects.
 */
export function registerAdapters(adapterDefs) {
  if (!Array.isArray(adapterDefs)) {
    throw new Error('registerAdapters: argument must be an array');
  }
  adapterDefs.forEach(registerAdapter);
}

/**
 * Load and register adapter definitions from a URL (e.g. public/assets/adapters/library.json).
 * The JSON may contain a single adapter object or an array of adapter objects.
 * Silently skips if the URL returns a non-OK response (e.g. file not present on server).
 *
 * @param {string} url
 * @returns {Promise<number>} Number of newly registered adapters.
 */
export async function loadAdaptersFromUrl(url) {
  const res = await fetch(url);
  if (!res.ok) return 0;
  const data = await res.json();
  const defs = Array.isArray(data) ? data : [data];
  const before = ADAPTER_LIBRARY.length;
  registerAdapters(defs);
  return ADAPTER_LIBRARY.length - before;
}

/**
 * Load and register adapter definitions from a user-uploaded File object.
 * The JSON may contain a single adapter object or an array of adapter objects.
 *
 * @param {File} file
 * @returns {Promise<number>} Number of newly registered adapters.
 */
export async function loadAdaptersFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const defs = Array.isArray(data) ? data : [data];
  const before = ADAPTER_LIBRARY.length;
  registerAdapters(defs);
  return ADAPTER_LIBRARY.length - before;
}

// 1. Build-time: JSON-Dateien aus src/assets/adapters/ (zur Build-Zeit gebündelt)
{
  const modules = import.meta.glob('../assets/adapters/*.json', { eager: true });
  const defs = Object.values(modules).flatMap(m => {
    const data = /** @type {any} */ (m).default ?? m;
    return Array.isArray(data) ? data : [data];
  });
  registerAdapters(defs);
}

// 2. Runtime: optionale Server-Bibliothek aus public/assets/adapters/library.json
//loadAdaptersFromUrl(`${adapterOverlayBasePath}/library.json`);

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

  if (adapter.id !== VARIABLE_SUBGRID_ADAPTER_ID) {
    const optionalFeatures = /** @type {any} */ (adapter).optionalFeatures;
    if (inst.showOptionalFeatures && optionalFeatures) {
      const opt = optionalFeatures;
      return {
        ...adapter,
        features: {
          copper:    [...(adapter.features?.copper    || []), ...(opt.copper    || [])],
          copperBack:[...( adapter.features?.copperBack|| []), ...(opt.copperBack|| [])],
          mask:      [...(adapter.features?.mask      || []), ...(opt.mask      || [])],
          silk:      [...(adapter.features?.silk      || []), ...(opt.silk      || [])],
          silkText:  [...(adapter.features?.silkText  || []), ...(opt.silkText  || [])],
          drills:    [...(adapter.features?.drills    || []), ...(opt.drills    || [])],
        },
      };
    }
    return adapter;
  }

  const widthPins = Math.max(1, Math.round(inst.widthPins || adapter.widthPins || 4));
  const heightPins = Math.max(1, Math.round(inst.heightPins || adapter.heightPins || 4));
  const basePitch = Number(inst.pitch) > 0 ? Number(inst.pitch) : adapter.pitch;
  const supportedPitches = getVariableSubgridPitches(basePitch);
  const fallbackPitch = supportedPitches[0] || adapter.subGridPitches?.[0] || 2.00;
  const fallbackProfile = getPitchProfile(fallbackPitch);
  const fallbackPad = fallbackProfile.padSize;
  const fallbackDrill = fallbackProfile.drillSize;
  const maskExpansion = 0.05;

  const subGridPitch = Number(inst.subGridPitch) > 0 ? Number(inst.subGridPitch) : fallbackPitch;
  const subProfile = getPitchProfile(subGridPitch);
  const requestedPadSize = Number(inst.subPadSize) > 0 ? Number(inst.subPadSize) : subProfile.padSize;
  const subPadSize = Math.max(0.25, Math.min(requestedPadSize, Math.max(0.25, subGridPitch - 0.15)));
  const subDrillSize = Number(inst.subGridDrill) > 0.1 ? Number(inst.subGridDrill) : subProfile.drillSize;
  const subPadShape = VARIABLE_SUBGRID_PAD_SHAPES.includes(inst.subPadShape) ? inst.subPadShape : 'square';
  const subgridPads = buildSubgridPads({
    widthPins,
    heightPins,
    pitch: basePitch,
    subGridPitch,
    subPadSize,
    subPadShape,
    throughPins: adapter.throughPins,
  });

  const subgridMask = buildSubgridMask({
    widthPins,
    heightPins,
    pitch: basePitch,
    subGridPitch,
    subPadSize,
    subPadShape,
    maskExpansion,
    throughPins: adapter.throughPins,
  });

  const subgridDrills = buildSubgridDrills({
    widthPins,
    heightPins,
    pitch: basePitch,
    subGridPitch,
    subDrillSize,
    subPadShape,
    throughPins: adapter.throughPins,
  });

  return {
    ...adapter,
    widthPins,
    heightPins,
    pitch: basePitch,
    subGridPitch,
    subPadSize,
    subPadShape,
    outline: {
      width: Math.max(2.5, (widthPins - 1) * basePitch + 1.6),
      height: Math.max(2.5, (heightPins - 1) * basePitch + 1.6),
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

  const pitches = getVariableSubgridPitches(inst.pitch);
  if (!Array.isArray(pitches) || pitches.length === 0) return inst;

  const currentPitch = Number(inst.subGridPitch ?? pitches[0]);
  const currentIndex = pitches.findIndex(pitch => Math.abs(pitch - currentPitch) < 0.0001);
  const nextIndex = currentIndex >= 0
    ? (currentIndex + 1) % pitches.length
    : 0;

  const nextPitch = pitches[nextIndex];
  const profile = getPitchProfile(nextPitch);
  return {
    ...inst,
    subGridPitch: nextPitch,
    subPadSize: profile.padSize,
    subGridDrill: profile.drillSize,
  };
}

export function cycleVariableSubgridPadShape(inst) {
  if (!inst || inst.adapterId !== VARIABLE_SUBGRID_ADAPTER_ID) return inst;
  const currentIndex = Math.max(0, VARIABLE_SUBGRID_PAD_SHAPES.indexOf(inst.subPadShape));
  const nextIndex = (currentIndex + 1) % VARIABLE_SUBGRID_PAD_SHAPES.length;
  return {
    ...inst,
    subPadShape: VARIABLE_SUBGRID_PAD_SHAPES[nextIndex],
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
  const adapter = getAllAdapters().find(a => a.id === adapterId);
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

  const srcOpt = /** @type {any} */ (adapter).optionalFeatures;
  const rotatedOptionalFeatures = srcOpt ? {
    copper:    srcOpt.copper    ? srcOpt.copper.map(rotFeature)    : undefined,
    copperBack:srcOpt.copperBack? srcOpt.copperBack.map(rotFeature): undefined,
    drills:    srcOpt.drills    ? srcOpt.drills.map(d => { const p = rotPt(d.x, d.y); return { ...d, x: p.x, y: p.y }; }) : undefined,
    mask:      srcOpt.mask      ? srcOpt.mask.map(rotFeature)      : undefined,
    silk:      srcOpt.silk      ? srcOpt.silk.map(rotFeature)      : undefined,
    silkText:  srcOpt.silkText  ? srcOpt.silkText.map(rotFeature)  : undefined,
  } : undefined;

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
    ...(rotatedOptionalFeatures ? { optionalFeatures: rotatedOptionalFeatures } : {}),
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

function buildSubgridPads({ widthPins, heightPins, pitch, subGridPitch, subPadSize, subPadShape, throughPins = [] }) {
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
      if (!blocked) {
        pads.push(subPadShape === 'circle'
          ? { type: 'circle', x: rx, y: ry, d: subPadSize }
          : { type: 'pad', x: rx, y: ry, w: subPadSize, h: subPadSize });
      }
    }
  }

  return pads;
}

function buildSubgridMask({ widthPins, heightPins, pitch, subGridPitch, subPadSize, subPadShape, maskExpansion, throughPins = [] }) {
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
      if (!blocked) {
        const maskSize = subPadSize + 2 * maskExpansion;
        pads.push(subPadShape === 'circle'
          ? { type: 'circle', x: rx, y: ry, d: maskSize }
          : { type: 'pad', x: rx, y: ry, w: maskSize, h: maskSize });
      }
    }
  }

  return pads;
}

function buildSubgridDrills({ widthPins, heightPins, pitch, subGridPitch, subDrillSize, subPadShape = 'square', throughPins = [] }) {
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
      if (!blocked && subPadShape !== 'square-smd') drills.push({ type: 'via', x: rx, y: ry, drill: subDrillSize, size: subDrillSize });
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
