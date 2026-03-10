export const PAD_SHAPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
};

export const GRID_PITCH_PROFILES = {
  '2.54': { pitch: 2.54, padSize: 1.6, drillSize: 1.0, padShape: PAD_SHAPES.CIRCLE },
  '2.00': { pitch: 2.00, padSize: 1.4, drillSize: 0.9, padShape: PAD_SHAPES.CIRCLE },
  '1.27': { pitch: 1.27, padSize: 1.0, drillSize: 0.6, padShape: PAD_SHAPES.CIRCLE },
};

function pitchKey(pitch) {
  const normalized = Number(pitch);  
  return Number.isFinite(normalized) ? normalized.toFixed(2) : '2.54';
}

export function getPitchProfile(pitch) {
  const profile = GRID_PITCH_PROFILES[pitchKey(pitch)];
  return profile || GRID_PITCH_PROFILES['2.54'];
}

export function toAnnularRing(padSize, drillSize) {
  return Math.max(0.05, (padSize - drillSize) / 2);
}

export function applyPitchProfile(config, pitch) {
  const profile = getPitchProfile(pitch);
  const annularRing = toAnnularRing(profile.padSize, profile.drillSize);

  return {
    ...config,
    pitch: profile.pitch,
    drillDiameter: profile.drillSize,
    annularRing,
    padShape: profile.padShape,
  };
}
