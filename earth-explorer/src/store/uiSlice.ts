import type { ToolMode, Units } from '../types';

export interface UiSlice {
  toolMode: ToolMode;
  sidebarOpen: boolean;
  buildingsOn: boolean;
  buildingsLoading: boolean;
  units: Units;
  /** Number of tiles still streaming in (drives the loading indicator). */
  tilesLoading: number;
  setToolMode: (mode: ToolMode) => void;
  toggleSidebar: () => void;
  setBuildingsOn: (on: boolean) => void;
  setBuildingsLoading: (loading: boolean) => void;
  toggleUnits: () => void;
  setTilesLoading: (count: number) => void;
}

type Set = (partial: Partial<UiSlice> | ((s: UiSlice) => Partial<UiSlice>)) => void;

export function createUiSlice(set: Set): UiSlice {
  return {
    toolMode: 'idle',
    sidebarOpen: window.matchMedia('(min-width: 768px)').matches,
    buildingsOn: false,
    buildingsLoading: false,
    units: 'metric',
    tilesLoading: 0,
    setToolMode: (toolMode) => set({ toolMode }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setBuildingsOn: (buildingsOn) => set({ buildingsOn }),
    setBuildingsLoading: (buildingsLoading) => set({ buildingsLoading }),
    toggleUnits: () =>
      set((s) => ({ units: s.units === 'metric' ? 'imperial' : 'metric' })),
    setTilesLoading: (tilesLoading) => set({ tilesLoading }),
  };
}
