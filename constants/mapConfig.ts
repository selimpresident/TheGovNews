/**
 * Map configuration constants
 */

export const MAP_CONFIG = {
  GEO_URL: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
  PROJECTION: {
    ROTATE: [0, 0, 0] as [number, number, number],
    SCALE: 140
  },
  ZOOM: {
    MIN: 1,
    DEFAULT: 1,
    MAX_LON_DEVIATION_FACTOR: 180,
    MAX_LAT_DEVIATION_FACTOR: 85,
    DEFAULT_LAT: 20
  },
  ANIMATION: {
    MASS: 1,
    TENSION: 150,
    FRICTION: 18
  }
} as const;

export const STARS_CONFIG = {
  COUNT: 250,
  SIZE_RANGE: { MIN: 0.5, MAX: 2 },
  OPACITY_RANGE: { MIN: 0.2, MAX: 0.7 }
} as const;