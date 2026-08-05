import type { SearchResult } from '../../types';

const ENDPOINT = 'https://nominatim.openstreetmap.org/search';

interface NominatimHit {
  display_name?: string;
  lat?: string;
  lon?: string;
  boundingbox?: string[];
  category?: string;
  type?: string;
}

/**
 * Geocode with OpenStreetMap Nominatim. Callers pass an AbortSignal so a
 * newer keystroke cancels the in-flight request.
 */
export async function geocode(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  const url = new URL(ENDPOINT);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '8');
  url.searchParams.set('accept-language', 'en');

  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Nominatim responded ${response.status}`);
  }
  const hits = (await response.json()) as NominatimHit[];
  const results: SearchResult[] = [];
  for (const hit of hits) {
    const lat = Number(hit.lat);
    const lon = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !hit.display_name) continue;
    results.push({
      displayName: hit.display_name,
      lat,
      lon,
      boundingBox: parseBoundingBox(hit.boundingbox),
      category: hit.type ?? hit.category ?? 'place',
    });
  }
  return results;
}

function parseBoundingBox(
  box: string[] | undefined,
): [number, number, number, number] | null {
  if (!box || box.length !== 4) return null;
  const [south, north, west, east] = box.map(Number);
  if (
    south === undefined || north === undefined ||
    west === undefined || east === undefined ||
    [south, north, west, east].some((v) => !Number.isFinite(v))
  ) {
    return null;
  }
  return [south, north, west, east];
}
