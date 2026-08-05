import { Ion } from 'cesium';

const token: string = (import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined) ?? '';

/**
 * True when a Cesium Ion token is configured. Without one the app degrades
 * gracefully: OSM imagery, ellipsoid terrain, no 3D buildings.
 */
export const hasIonToken: boolean = token.trim().length > 0;

/** Apply the token globally. Must run before any Ion-backed provider is created. */
export function configureIon(): void {
  if (hasIonToken) {
    Ion.defaultAccessToken = token.trim();
  }
}
