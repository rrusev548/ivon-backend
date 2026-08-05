import { newId } from './id';
import type { PlaceMarker } from '../types';

interface PointFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number, number] };
  properties: { title: string; description: string; color: string; createdAt: number };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: PointFeature[];
}

/** Serialize saved places to a GeoJSON FeatureCollection string. */
export function placesToGeoJson(places: readonly PlaceMarker[]): string {
  const collection: FeatureCollection = {
    type: 'FeatureCollection',
    features: places.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lon, p.lat, p.height] },
      properties: {
        title: p.title,
        description: p.description,
        color: p.color,
        createdAt: p.createdAt,
      },
    })),
  };
  return JSON.stringify(collection, null, 2);
}

/**
 * Parse a GeoJSON string into places. Tolerates foreign files: any Point
 * feature is accepted, missing properties get defaults. Throws on non-GeoJSON.
 */
export function geoJsonToPlaces(text: string): PlaceMarker[] {
  const raw: unknown = JSON.parse(text);
  if (!isRecord(raw) || raw.type !== 'FeatureCollection' || !Array.isArray(raw.features)) {
    throw new Error('Not a GeoJSON FeatureCollection');
  }
  const places: PlaceMarker[] = [];
  for (const feature of raw.features as unknown[]) {
    if (!isRecord(feature) || !isRecord(feature.geometry)) continue;
    const { geometry } = feature;
    if (geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) continue;
    const [lon, lat, height] = geometry.coordinates as unknown[];
    if (typeof lon !== 'number' || typeof lat !== 'number') continue;
    const props = isRecord(feature.properties) ? feature.properties : {};
    places.push({
      id: newId(),
      title: typeof props.title === 'string' && props.title ? props.title : 'Imported place',
      description: typeof props.description === 'string' ? props.description : '',
      color: typeof props.color === 'string' ? props.color : '#38bdf8',
      lon,
      lat,
      height: typeof height === 'number' ? height : 0,
      createdAt: typeof props.createdAt === 'number' ? props.createdAt : Date.now(),
    });
  }
  return places;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
