/** A saved, user-editable map pin. */
export interface PlaceMarker {
  id: string;
  title: string;
  description: string;
  /** CSS hex color, e.g. "#38bdf8". */
  color: string;
  /** Degrees. */
  lon: number;
  /** Degrees. */
  lat: number;
  /** Meters above the ellipsoid at drop time (informational only). */
  height: number;
  createdAt: number;
}

/** A full camera pose that can be restored exactly. */
export interface CameraPose {
  lon: number;
  lat: number;
  /** Meters above the ellipsoid. */
  height: number;
  /** Radians. */
  heading: number;
  /** Radians. */
  pitch: number;
  /** Radians. */
  roll: number;
}

/** One stop of a recorded camera tour. */
export interface TourKeyframe {
  id: string;
  label: string;
  pose: CameraPose;
  /** Flight time, in seconds, of the leg arriving at this keyframe. */
  durationSec: number;
}

/** Active pointer tool. Exactly one is active at a time. */
export type ToolMode = 'idle' | 'pin' | 'distance' | 'area';

export type TourPlayback = 'stopped' | 'playing' | 'paused';

export type TimePreset = 'now' | 'sunrise' | 'noon' | 'sunset' | 'midnight';

export type Units = 'metric' | 'imperial';

/** A normalized Nominatim geocoding hit. */
export interface SearchResult {
  displayName: string;
  lon: number;
  lat: number;
  /** [south, north, west, east] in degrees, when Nominatim provides one. */
  boundingBox: [number, number, number, number] | null;
  category: string;
}
