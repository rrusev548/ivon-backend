import type { Units } from '../types';

const KM_PER_MI = 1.609344;
const SQKM_PER_SQMI = KM_PER_MI * KM_PER_MI;

/** "12,345.6 km" / "7,671.2 mi" from meters. */
export function formatDistance(meters: number, units: Units): string {
  if (units === 'imperial') {
    const mi = meters / 1000 / KM_PER_MI;
    if (mi < 0.189) return `${(mi * 5280).toFixed(0)} ft`;
    return `${round(mi)} mi`;
  }
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  return `${round(meters / 1000)} km`;
}

/** "123.4 km²" / "47.6 mi²" from square meters. */
export function formatArea(sqMeters: number, units: Units): string {
  const sqKm = sqMeters / 1e6;
  if (units === 'imperial') {
    const sqMi = sqKm / SQKM_PER_SQMI;
    if (sqMi < 0.01) return `${(sqMeters * 10.7639).toFixed(0)} ft²`;
    return `${round(sqMi)} mi²`;
  }
  if (sqMeters < 1e4) return `${sqMeters.toFixed(0)} m²`;
  return `${round(sqKm)} km²`;
}

/** "48.85853°N, 2.29435°E" */
export function formatLatLon(lat: number, lon: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}°${ns}, ${Math.abs(lon).toFixed(5)}°${ew}`;
}

/** Camera altitude: "1,234 m" or "1,234.5 km". */
export function formatAltitude(meters: number): string {
  if (meters < 10_000) return `${meters.toLocaleString('en-US', { maximumFractionDigits: 0 })} m`;
  return `${round(meters / 1000)} km`;
}

function round(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
