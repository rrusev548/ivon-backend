import { Cartographic, EllipsoidGeodesic } from 'cesium';

const EARTH_RADIUS_M = 6_371_008.8;

/** Geodesic (surface) length in meters of a polyline of cartographic points. */
export function geodesicLength(points: readonly Cartographic[]): number {
  let total = 0;
  const geodesic = new EllipsoidGeodesic();
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    geodesic.setEndPoints(a, b);
    total += geodesic.surfaceDistance;
  }
  return total;
}

/**
 * Approximate spherical polygon area in square meters (unsigned).
 * Uses the lat/lon shoelace formula on the authalic sphere — accurate to a
 * fraction of a percent for regions up to continental scale.
 */
export function sphericalArea(points: readonly Cartographic[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if (!a || !b) continue;
    sum += (b.longitude - a.longitude) * (2 + Math.sin(a.latitude) + Math.sin(b.latitude));
  }
  return Math.abs((sum * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

/** Arithmetic midpoint of cartographic points (fine for label placement). */
export function cartographicCenter(points: readonly Cartographic[]): Cartographic {
  let lon = 0;
  let lat = 0;
  let height = 0;
  for (const p of points) {
    lon += p.longitude;
    lat += p.latitude;
    height += p.height;
  }
  const n = Math.max(points.length, 1);
  return new Cartographic(lon / n, lat / n, height / n);
}

/** Clamp a longitude in degrees to [-180, 180]. */
export function wrapLongitude(lonDeg: number): number {
  let lon = ((lonDeg + 180) % 360 + 360) % 360 - 180;
  if (lon === -180) lon = 180;
  return lon;
}
