import { validateAdapterDef } from './adapters.js';

const PROJECT_FILE_TYPE = 'macgizmo.gridgen.project';
const CURRENT_SCHEMA_VERSION = 1;
const SOFTWARE_VERSION = __APP_VERSION__;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function sanitizeConfig(rawConfig, defaults) {
  const config = isObject(rawConfig) ? rawConfig : {};
  const powerRails = isObject(config.powerRails) ? config.powerRails : {};
  const mountingHoles = isObject(config.mountingHoles) ? config.mountingHoles : {};
  const labels = isObject(config.labels) ? config.labels : {};
  const signalTracks = Array.isArray(config.signalTracks) ? config.signalTracks : [];
  const silkLines = Array.isArray(config.silkLines) ? config.silkLines : [];

  return {
    width: toNumber(config.width, defaults.width),
    height: toNumber(config.height, defaults.height),
    pitch: toNumber(config.pitch, defaults.pitch),
    drillDiameter: toNumber(config.drillDiameter ?? config.padDiameter, defaults.drillDiameter),
    annularRing: toNumber(config.annularRing, defaults.annularRing),
    padShape: typeof config.padShape === 'string' ? config.padShape : defaults.padShape,
    powerRails: {
      top: toBoolean(powerRails.top, defaults.powerRails.top),
      bottom: toBoolean(powerRails.bottom, defaults.powerRails.bottom),
      left: toBoolean(powerRails.left, defaults.powerRails.left),
      right: toBoolean(powerRails.right, defaults.powerRails.right),
    },
    mountingHoles: {
      mode: typeof mountingHoles.mode === 'string' ? mountingHoles.mode : defaults.mountingHoles.mode,
      diameter: toNumber(mountingHoles.diameter, defaults.mountingHoles.diameter),
      edgeDistance: toNumber(mountingHoles.edgeDistance, defaults.mountingHoles.edgeDistance),
    },
    labels: {
      rows: toNumber(labels.rows, defaults.labels.rows),
      cols: toNumber(labels.cols, defaults.labels.cols),
    },
    signalTracks: signalTracks
      .filter(track => isObject(track))
      .map(track => ({
        startCol: Math.floor(toNumber(track.startCol, 0)),
        startRow: Math.floor(toNumber(track.startRow, 0)),
        endCol: Math.floor(toNumber(track.endCol, 0)),
        endRow: Math.floor(toNumber(track.endRow, 0)),
      })),
    silkLines: silkLines
      .filter(line => isObject(line))
      .map(line => ({
        startCol: Math.floor(toNumber(line.startCol, 0)),
        startRow: Math.floor(toNumber(line.startRow, 0)),
        endCol: Math.floor(toNumber(line.endCol, 0)),
        endRow: Math.floor(toNumber(line.endRow, 0)),
      })),
  };
}

function sanitizePlacedItems(rawItems, key) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter(item => isObject(item) && typeof item[key] === 'string')
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      [key]: item[key],
      name: typeof item.name === 'string' ? item.name : '',
      col: Math.max(0, Math.floor(toNumber(item.col, 0))),
      row: Math.max(0, Math.floor(toNumber(item.row, 0))),
      rotation: Math.max(0, Math.floor(toNumber(item.rotation, 0))) % 4,
      color: typeof item.color === 'string' ? item.color : '#ffffff',
      widthPins: Math.max(1, Math.floor(toNumber(item.widthPins, 0))),
      heightPins: Math.max(1, Math.floor(toNumber(item.heightPins, 0))),
      pitch: toNumber(item.pitch, 2).toFixed(2),
      subGridPitch: toNumber(item.subGridPitch, 2).toFixed(2),
      subPadSize: toNumber(item.subPadSize, 1),
      subPadDrill: toNumber(item.subPadDrill, 1),
      subPadShape: typeof item.subPadShape === 'string' ? item.subPadShape : "square",
      showOptionalFeatures: item.showOptionalFeatures === true,
    }));
}

/**
 * @param {{ config: any, modules: any[], adapters: any[], customAdapterDefs?: any[] }} state
 */
export function buildProjectData({ config, modules, adapters, customAdapterDefs = [] }) {
  // Only embed definitions actually referenced by placed adapters
  const placedIds = new Set(adapters.map(a => a.adapterId));
  const usedCustomDefs = customAdapterDefs.filter(def => placedIds.has(def.id));

  return {
    type: PROJECT_FILE_TYPE,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    toolVersion: SOFTWARE_VERSION,
    savedAt: new Date().toISOString(),
    data: {
      config,
      modules,
      adapters,
      ...(usedCustomDefs.length > 0 ? { customAdapterDefs: usedCustomDefs } : {}),
    },
  };
}

export function serializeProject(state) {
  return JSON.stringify(buildProjectData(state), null, 2);
}

export function parseProject(jsonText, defaults) {
  const parsed = JSON.parse(jsonText);

  if (!isObject(parsed) || parsed.type !== PROJECT_FILE_TYPE || !isObject(parsed.data)) {
    throw new Error('Datei ist kein gültiges GridGen-Projekt.');
  }

  const schemaVersion = toNumber(parsed.schemaVersion, 1);
  const isFutureVersion = schemaVersion > CURRENT_SCHEMA_VERSION;

  const rawCustomDefs = parsed.data.customAdapterDefs;
  const customAdapterDefs = Array.isArray(rawCustomDefs)
    ? rawCustomDefs.filter(item => validateAdapterDef(item) === null)
    : [];

  return {
    schemaVersion,
    isFutureVersion,
    config: sanitizeConfig(parsed.data.config, defaults),
    modules: sanitizePlacedItems(parsed.data.modules, 'moduleId'),
    adapters: sanitizePlacedItems(parsed.data.adapters, 'adapterId'),
    customAdapterDefs,
  };
}

export { CURRENT_SCHEMA_VERSION, PROJECT_FILE_TYPE };
