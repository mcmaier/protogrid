/**
 * Module footprint library for MacGizmo GridGen.
 * 
 * Each module defines:
 *   - id: unique identifier
 *   - name: display name
 *   - category: for grouping in dropdown
 *   - pitch: pin pitch in mm (2.54 or 2.0) – module only shown when grid matches
 *   - widthPins / heightPins: dimensions in grid pitch units
 *   - pinRows: array of pin row definitions (dual-inline)
 *   - color: overlay tint color
 *   - outline: { width, height } in mm (physical package size)
 *   - outlineOffset: { x, y } optional mm offset of outline vs pin center
 *       Positive y = body extends above pins, positive x = body extends right
 *   - overlay: optional boolean or string. If true, loads PNG from
 *       {moduleOverlayBasePath}/{id}.png. If string, uses that as filename.
 *       PNG should show the module's pinout/appearance on transparent background.
 *
 * Pin row format: { x, y, count, dx, dy }
 *   Start at (x, y) in pitch units from module origin,
 *   place 'count' pins stepping by (dx, dy) in pitch units.
 */

/** Base path for module overlay PNGs. Override for WordPress deployment. */
export let moduleOverlayBasePath = './assets/modules';

export const RESERVED_AREA_MODULE_ID = 'reserved-area';

export const MODULE_LIBRARY = [
    {
    id: RESERVED_AREA_MODULE_ID,
    name: 'Reserved Area',
    category: 'Utility',
    pitch: 2.54,     // dummy – anyPitch:true overrides filtering
    anyPitch: true,  // visible for all grid pitches
    widthPins: 4,    // default, overridden per-instance
    heightPins: 4,
    pinRows: [],     // no through-hole pins
    resizable: true,
    color: '#e05050',
    outline: { width: 0, height: 0 }, // not used – computed from instance widthPins/heightPins
  },
  {
    id: 'usb-c-pd',
    name: 'USB-C PD Module',
    category: 'Power',
    pitch: 2.54,
    widthPins: 10,    // across (pin-to-pin)
    heightPins: 4,   // along (pins per side)
    pinRows: [
      { x: 9, y: 0, count: 2, dx: 0, dy: 4 },   // right column
    ],
    outline: { width: 23.3, height: 12 },
    outlineOffset: { x: 0, y: 1.27 },  // body extends above the pin row
    color: '#e03056',
    overlay: true,
  },
  {
    id: 'esp32-devkit-30pin',
    name: 'ESP32 DevKit (30-pin)',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 10,    // across (pin-to-pin)
    heightPins: 15,   // along (pins per side)
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },   // left column
      { x: 9, y: 0, count: 15, dx: 0, dy: 1 },   // right column
    ],
    outline: { width: 27.5, height:48.5 },
    outlineOffset: { x: 0, y: -1.2 },  // body extends above the pin row
    color: '#e06030',
    overlay: true,
  },
  {
    id: 'esp32-devkit-38pin',
    name: 'ESP32 DevKit (38-pin)',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 11,
    heightPins: 19,
    pinRows: [
      { x: 0, y: 0, count: 19, dx: 0, dy: 1 },
      { x: 10, y: 0, count: 19, dx: 0, dy: 1 },
    ],
    outline: { width: 28.6, height: 55.3 },
    color: '#e06030',
    overlay: true,
  },
  {
    id: 'esp32-s3-devkit-44pin',
    name: 'ESP32-S3 DevKit (44-pin)',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 11,
    heightPins: 22,
    pinRows: [
      { x: 0, y: 0, count: 22, dx: 0, dy: 1 },
      { x: 10, y: 0, count: 22, dx: 0, dy: 1 },
    ],
    outline: { width: 28, height: 70.1 },
    color: '#e06030',
    overlay: true,
  },
  {
    id: 'arduino-nano',
    name: 'Arduino Nano',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 7,
    heightPins: 15,
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 15, dx: 0, dy: 1 },
    ],
    outline: { width: 18.5, height: 43.2},
    outlineOffset: { x: 0, y: 0.5 },  // body extends above the pin row
    color: '#3080d0',
    overlay: true,

  },
  {
    id: 'arduino-pro-mini',
    name: 'Arduino Pro Mini',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 7,
    heightPins: 12,
    pinRows: [
      { x: 0, y: 0, count: 12, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 12, dx: 0, dy: 1 },
    ],
    outline: { width: 18.2, height: 33.2 },
    color: '#30a050',
    outlineOffset: { x: 0, y: -1.2 },  // body extends above the pin row    
    overlay: true,
  },
  {
    id: 'esp8266-nodemcu',
    name: 'ESP8266 NodeMCU',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 10,
    heightPins: 15,
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },
      { x: 9, y: 0, count: 15, dx: 0, dy: 1 },
    ],
    outline: { width: 25.6, height: 48.5 },
    outlineOffset: { x: 0, y: -0.3 },  // body extends above the pin row    
    color: '#d0a030',
    overlay: true,
  },
  {
    id: 'raspberry-pi-pico',
    name: 'Raspberry Pi Pico',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 8,
    heightPins: 20,
    pinRows: [
      { x: 0, y: 0, count: 20, dx: 0, dy: 1 },
      { x: 7, y: 0, count: 20, dx: 0, dy: 1 },
    ],
    outline: { width: 21.5, height: 53.5 },
    outlineOffset: { x: 0, y: 0.8 },
    color: '#40a070',
    overlay: true,
  },
  {
    id: 'wemos-d1-mini',
    name: 'Wemos D1 Mini',
    category: 'Microcontroller',
    pitch: 2.54,
    widthPins: 10,
    heightPins: 8,
    pinRows: [
      { x: 0, y: 0, count: 8, dx: 0, dy: 1 },
      { x: 9, y: 0, count: 8, dx: 0, dy: 1 },
    ],
    outline: { width: 26, height: 35 },
    outlineOffset: { x: 0, y: -0.4 },
    color: '#3070c0',
    overlay: true,
  },
  {
    id: 'oled-128x64-i2c',
    name: 'OLED 0.96" I2C (4-pin)',
    category: 'Display',
    pitch: 2.54,
    widthPins: 4,       // 4 pins horizontal
    heightPins: 1,      // single row
    pinRows: [
      { x: 0, y: 0, count: 4, dx: 1, dy: 0 },
    ],
    outline: { width: 26, height: 26 },
    outlineOffset: { x: 0, y: -11.2 },  // body extends above the pin row
    color: '#8080d0',
    overlay: true,
  },
  {
    id: 'ds3231-rtc',
    name: 'DS3231 RTC',
    category: 'Modules',
    pitch: 2.54,
    widthPins: 1,      // 6 pins in a row (32K, SQW, SCL, SDA, VCC, GND)
    heightPins: 6,
    pinRows: [
      { x: 0, y: 0, count: 6, dx: 0, dy: 1 },
    ],
    outline: { width: 38.8, height: 22.5},
    outlineOffset: { x: 17.7, y: 0.4 },  // body extends above pin row
    color: '#30a0a0',
    overlay: true,
  },
  {
    id: 'dfplayer-mini',
    name: 'DFPlayer Mini',
    category: 'Modules',
    pitch: 2.54,
    widthPins: 8,      // 2 rows, 8 pins each, 8 pitch units apart
    heightPins: 8,
    pinRows: [
      { x: 0, y: 0, count: 8, dx: 0, dy: 1 },   // left column
      { x: 7, y: 0, count: 8, dx: 0, dy: 1 },   // right column
    ],
    outline: { width: 22, height: 21.0 },
    color: '#d05050',
    overlay: true,
  },
  {
    id: 'dip8',
    name: 'DIP-8 IC',
    category: 'IC',
    pitch: 2.54,
    widthPins: 4,
    heightPins: 4,
    pinRows: [
      { x: 0, y: 0, count: 4, dx: 0, dy: 1 },
      { x: 3, y: 0, count: 4, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 10.2 },
    color: '#606060',
  },
  {
    id: 'dip16',
    name: 'DIP-16 IC',
    category: 'IC',
    pitch: 2.54,
    widthPins: 4,
    heightPins: 8,
    pinRows: [
      { x: 0, y: 0, count: 8, dx: 0, dy: 1 },
      { x: 3, y: 0, count: 8, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 20.3 },
    color: '#606060',
  },
  {
    id: 'dip28',
    name: 'DIP-28 IC (ATmega328)',
    category: 'IC',
    pitch: 2.54,
    widthPins: 4,
    heightPins: 14,
    pinRows: [
      { x: 0, y: 0, count: 14, dx: 0, dy: 1 },
      { x: 3, y: 0, count: 14, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 35.6 },
    color: '#606060',
  },    
];

/**
 * Get pin positions in pitch-unit offsets from module origin.
 * Returns array of { col, row } offsets.
 */
export function getModulePins(moduleId) {
  const mod = MODULE_LIBRARY.find(m => m.id === moduleId);
  if (!mod) return [];

  const pins = [];
  for (const pr of mod.pinRows) {
    for (let i = 0; i < pr.count; i++) {
      pins.push({
        col: pr.x + i * pr.dx,
        row: pr.y + i * pr.dy,
      });
    }
  }
  return pins;
}


 /**
 * Get overlay image URL for a module, or null if none configured.
 * @param {object} mod - Module definition from MODULE_LIBRARY
 * @returns {string|null} URL to PNG overlay
 */
export function getModuleOverlayUrl(mod) {
  if (!mod || !mod.overlay) return null;
  const filename = typeof mod.overlay === 'string' ? mod.overlay : `${mod.id}.png`;
  return `${moduleOverlayBasePath}/${filename}`;
}

/**
 * Set the base path for module overlay PNGs (e.g. for WordPress deployment).
 * @param {string} path - Base path without trailing slash
 */
export function setModuleOverlayBasePath(path) {
  moduleOverlayBasePath = path;
}

/**
 * Get module data rotated by rotation steps (0–3 = 0°/90°/180°/270°).
 * Returns { pins, widthPins, heightPins, outline, outlineOffset }.
 */
export function getRotatedModule(moduleId, rotation = 0) {
  const mod = MODULE_LIBRARY.find(m => m.id === moduleId);
  if (!mod) return null;

  const r = ((rotation % 4) + 4) % 4; // normalize to 0–3
  const basePins = getModulePins(moduleId);
  const maxCol = mod.widthPins - 1;
  const maxRow = mod.heightPins - 1;

  // Rotate pin positions
  const pins = basePins.map(({ col, row }) => {
    switch (r) {
      case 0: return { col, row };
      case 1: return { col: row, row: maxCol - col };
      case 2: return { col: maxCol - col, row: maxRow - row };
      case 3: return { col: maxRow - row, row: col };
    }
  });

  // Swap dimensions for 90°/270°
  const swap = r === 1 || r === 3;
  const widthPins = swap ? mod.heightPins : mod.widthPins;
  const heightPins = swap ? mod.widthPins : mod.heightPins;
  const outline = swap
    ? { width: mod.outline.height, height: mod.outline.width }
    : { ...mod.outline };

  // Rotate outlineOffset
  const oo = mod.outlineOffset || { x: 0, y: 0 };
  let outlineOffset;
  switch (r) {
    case 0: outlineOffset = { x: oo.x, y: oo.y }; break;
    case 1: outlineOffset = { x: oo.y, y: -oo.x }; break;
    case 2: outlineOffset = { x: -oo.x, y: -oo.y }; break;
    case 3: outlineOffset = { x: -oo.y, y: oo.x }; break;
  }

  return { pins, widthPins, heightPins, outline, outlineOffset, name: mod.name, color: mod.color };
}