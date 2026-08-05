import type { TimePreset } from '../types';

/**
 * Solar-time helpers for the time-of-day feature. We use local *solar* time at
 * a given longitude (UTC offset = longitude / 15°/h), which is what actually
 * drives the sun position Cesium renders — no timezone tables needed. Sunrise
 * and sunset are the ideal 06:00/18:00 solar times (equinox approximation);
 * seasonal drift is visible but small at typical latitudes.
 */

const MS_PER_HOUR = 3_600_000;

/** Hours [0, 24) of local solar time at `lonDeg` for a UTC date. */
export function solarHoursAt(date: Date, lonDeg: number): number {
  const utcHours =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return ((utcHours + lonDeg / 15) % 24 + 24) % 24;
}

/** UTC Date for `solarHours` local solar time today at `lonDeg`. */
export function dateForSolarHours(solarHours: number, lonDeg: number, base: Date): Date {
  const utcHours = ((solarHours - lonDeg / 15) % 24 + 24) % 24;
  const dayStart = Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate());
  return new Date(dayStart + utcHours * MS_PER_HOUR);
}

/** Solar hours for each preset; `now` is handled by the caller. */
export function presetSolarHours(preset: Exclude<TimePreset, 'now'>): number {
  switch (preset) {
    case 'sunrise':
      return 6;
    case 'noon':
      return 12;
    case 'sunset':
      return 18;
    case 'midnight':
      return 0;
  }
}

/** "13:45" from fractional hours. */
export function formatSolarHours(hours: number): string {
  const h = Math.floor(hours) % 24;
  const m = Math.floor((hours - Math.floor(hours)) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
