import type { PlaceMarker } from '../types';

export interface PlacesSlice {
  places: PlaceMarker[];
  /** Currently selected place id (drives the editor card). */
  selectedPlaceId: string | null;
  addPlace: (place: PlaceMarker) => void;
  updatePlace: (id: string, patch: Partial<Omit<PlaceMarker, 'id'>>) => void;
  removePlace: (id: string) => void;
  /** Move the place at `from` to index `to` (sidebar drag reorder). */
  reorderPlaces: (from: number, to: number) => void;
  /** Append imported places (GeoJSON import). */
  importPlaces: (places: PlaceMarker[]) => void;
  selectPlace: (id: string | null) => void;
}

type Set = (partial: Partial<PlacesSlice> | ((s: PlacesSlice) => Partial<PlacesSlice>)) => void;

export function createPlacesSlice(set: Set): PlacesSlice {
  return {
    places: [],
    selectedPlaceId: null,
    addPlace: (place) =>
      set((s) => ({ places: [...s.places, place], selectedPlaceId: place.id })),
    updatePlace: (id, patch) =>
      set((s) => ({
        places: s.places.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    removePlace: (id) =>
      set((s) => ({
        places: s.places.filter((p) => p.id !== id),
        selectedPlaceId: s.selectedPlaceId === id ? null : s.selectedPlaceId,
      })),
    reorderPlaces: (from, to) =>
      set((s) => {
        if (from === to || from < 0 || from >= s.places.length) return {};
        const next = [...s.places];
        const [moved] = next.splice(from, 1);
        if (!moved) return {};
        next.splice(Math.max(0, Math.min(to, next.length)), 0, moved);
        return { places: next };
      }),
    importPlaces: (places) => set((s) => ({ places: [...s.places, ...places] })),
    selectPlace: (id) => set({ selectedPlaceId: id }),
  };
}
