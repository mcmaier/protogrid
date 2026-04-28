/**
 * MacGizmo GridGen Stroke Font
 * Minimal vector font for PCB silkscreen labels.
 * 
 * Each character is defined as an array of strokes.
 * Each stroke is an array of [x, y] points (polyline).
 * Coordinates are normalized: width=3, height=5 (aspect ~0.6)
 * Origin is bottom-left of character cell.
 */

const GLYPHS = {
  // Punctuation & symbols
  '.': [[[1,0],[1,1],[2,1],[2,0],[1,0]]],
  '•': [[[0.5,1],[0.5,4],[2.5,4],[2.5,1],[0.5,1]]],   // big dot for pin markings
  '/': [[[1,0],[3,5]]],
  '-': [[[1,3],[3,3]]],
  '0': [[[0,0],[0,5],[3,5],[3,0],[0,0]], [[0,0],[3,5]]],
  '1': [[[1,4],[1.5,5],[1.5,0]], [[0,0],[3,0]]],
  '2': [[[0,4],[0,5],[3,5],[3,3],[0,0],[3,0]]],
  '3': [[[0,5],[3,5],[3,0],[0,0]], [[0,2.5],[3,2.5]]],
  '4': [[[0,5],[0,2.5],[3,2.5]], [[3,5],[3,0]]],
  '5': [[[3,5],[0,5],[0,2.5],[3,2.5],[3,0],[0,0]]],
  '6': [[[3,5],[0,5],[0,0],[3,0],[3,2.5],[0,2.5]]],
  '7': [[[0,5],[3,5],[1,0]]],
  '8': [[[0,0],[0,5],[3,5],[3,0],[0,0]], [[0,2.5],[3,2.5]]],
  '9': [[[0,0],[3,0],[3,5],[0,5],[0,2.5],[3,2.5]]],
  'A': [[[0,0],[0,4],[1.5,5],[3,4],[3,0]], [[0,2.5],[3,2.5]]],
  'B': [[[0,0],[0,5],[2.5,5],[3,4.5],[3,3.5],[2.5,3],[0,2.5]], [[0,2.5],[2.5,2.5],[3,1.5],[3,0.5],[2.5,0],[0,0]]],
  'C': [[[3,4],[2,5],[1,5],[0,4],[0,1],[1,0],[2,0],[3,1]]],
  'D': [[[0,0],[0,5],[2,5],[3,4],[3,1],[2,0],[0,0]]],
  'E': [[[3,5],[0,5],[0,0],[3,0]], [[0,2.5],[2,2.5]]],
  'F': [[[3,5],[0,5],[0,0]], [[0,2.5],[2,2.5]]],
  'G': [[[3,4],[2,5],[1,5],[0,4],[0,1],[1,0],[2,0],[3,1],[3,2.5],[1.5,2.5]]],
  'H': [[[0,0],[0,5]], [[3,0],[3,5]], [[0,2.5],[3,2.5]]],
  'I': [[[0,5],[3,5]], [[1.5,5],[1.5,0]], [[0,0],[3,0]]],
  'J': [[[1,5],[3,5],[3,0],[2,0],[1,0],[0,1]]],
  'K': [[[0,0],[0,5]], [[3,5],[0,2.5],[3,0]]],
  'L': [[[0,5],[0,0],[3,0]]],
  'M': [[[0,0],[0,5],[1.5,3],[3,5],[3,0]]],
  'N': [[[0,0],[0,5],[3,0],[3,5]]],
  'O': [[[0,1],[0,4],[1,5],[2,5],[3,4],[3,1],[2,0],[1,0],[0,1]]],
  'P': [[[0,0],[0,5],[3,5],[3,2.5],[0,2.5]]],
  'Q': [[[0,1],[0,4],[1,5],[2,5],[3,4],[3,1],[2,0],[1,0],[0,1]], [[2,1],[3,0]]],
  'R': [[[0,0],[0,5],[3,5],[3,2.5],[0,2.5]], [[1.5,2.5],[3,0]]],
  'S': [[[3,4],[2,5],[1,5],[0,4],[0,3],[1,2.5],[2,2.5],[3,2],[3,1],[2,0],[1,0],[0,1]]],
  'T': [[[0,5],[3,5]], [[1.5,5],[1.5,0]]],
  'U': [[[0,5],[0,1],[1,0],[2,0],[3,1],[3,5]]],
  'V': [[[0,5],[1.5,0],[3,5]]],
  'W': [[[0,5],[0.75,0],[1.5,3],[2.25,0],[3,5]]],
  'X': [[[0,0],[3,5]], [[0,5],[3,0]]],
  'Y': [[[0,5],[1.5,2.5],[3,5]], [[1.5,2.5],[1.5,0]]],
  'Z': [[[0,5],[3,5],[0,0],[3,0]]],

  // Lowercase letters — x-height 0–3, ascenders to 5
  // (needed for SI prefixes and component value labels)
  'k': [[[0,0],[0,5]], [[3,3.5],[1.5,1.75],[3,0]]],
  'm': [[[0,3],[0,0]], [[0,3],[1.5,4],[3,3],[3,0]], [[1.5,4],[1.5,0]]],
  'n': [[[0,3],[0,0]], [[0,3],[2,3],[3,2],[3,0]]],
  'p': [[[0,3],[0,0]], [[0,3],[2,3],[3,2],[3,1],[2,0],[0,0]]],
  'u': [[[0,3],[0,1],[1,0],[2,0],[3,1],[3,3]]],

  // Special characters for electronic component values
  'µ': [[[0,3],[0,0]], [[0,3],[0,1],[1,0],[2,0],[3,1],[3,3]]],  // micro sign (U+00B5)
  'μ': [[[0,3],[0,0]], [[0,3],[0,1],[1,0],[2,0],[3,1],[3,3]]],  // Greek mu (U+03BC)
  'Ω': [[[0,0],[1,0]], [[2,0],[3,0]], [[0,0.5],[0,3.5],[1.5,5],[3,3.5],[3,0.5]]],  // Ohm (U+03A9)
  'ω': [[[0,0],[1,0]], [[2,0],[3,0]], [[0,0.5],[0,3.5],[1.5,5],[3,3.5],[3,0.5]]],  // omega (U+03C9) alias
};

/**
 * Get strokes for a character string, positioned and scaled.
 * @param {string} text - Text to render
 * @param {number} x - X position (left edge)
 * @param {number} y - Y position (vertical center of text)
 * @param {number} height - Character height in mm
 * @param {string} anchor - 'left', 'center', 'right'
 * @returns {Array} Array of polylines: [[{x,y}, {x,y}, ...], ...]
 */
export function getTextStrokes(text, x, y, height, anchor = 'left', rotation = 0) {
  const scale = height / 5;  // font design height is 5
  const charWidth = 2 * scale;
  const charGap = 2 * scale;
  const totalWidth = text.length * charWidth + (text.length - 1) * charGap;

  let offsetX = x;
  if (anchor === 'center') offsetX = x - totalWidth / 2;
  else if (anchor === 'right') offsetX = x - totalWidth;

  // Y: position is vertical center, font baseline is 0, center is 2.5
  const baseY = y - 2.5 * scale;

  const allStrokes = [];

  for (let i = 0; i < text.length; i++) {
    const orig = text[i];
    const ch = GLYPHS[orig] !== undefined ? orig : orig.toUpperCase();
    const glyph = GLYPHS[ch];
    if (!glyph) continue;

    const cx = offsetX + i * (charWidth + charGap);

    for (const stroke of glyph) {
      const polyline = stroke.map(([gx, gy]) => ({
        x: round4(cx + gx * scale),
        y: round4(baseY + gy * scale),
      }));
      allStrokes.push(polyline);
    }
  }
  
  // Rotate all strokes around (x, y)
  if (rotation === 90) {
    return allStrokes.map(polyline =>
      polyline.map(p => ({
        x: round4(x + (p.y - y)),
        y: round4(y - (p.x - x)),
      }))
    );
  } else if (rotation === -90 || rotation === 270) {
    return allStrokes.map(polyline =>
      polyline.map(p => ({
        x: round4(x - (p.y - y)),
        y: round4(y + (p.x - x)),
      }))
    );
  }

  return allStrokes;
}

/**
 * Generate column label (A, B, C, ... Z, AA, AB, ...)
 */
export function colLabel(index) {
  let label = '';
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

function round4(val) {
  return Math.round(val * 10000) / 10000;
}