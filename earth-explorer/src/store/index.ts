import { createStore } from 'zustand/vanilla';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { createPlacesSlice, type PlacesSlice } from './placesSlice';
import { createTourSlice, type TourSlice } from './tourSlice';
import { createUiSlice, type UiSlice } from './uiSlice';

export type AppState = PlacesSlice & TourSlice & UiSlice;

/**
 * Single app-wide store. Only durable user data (places, tour keyframes,
 * units) is persisted; transient UI/tool state resets on reload.
 */
export const appStore = createStore<AppState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...createPlacesSlice(set),
        ...createTourSlice(set),
        ...createUiSlice(set),
      }),
      {
        name: 'earth-explorer',
        version: 1,
        partialize: (s) => ({
          places: s.places,
          keyframes: s.keyframes,
          units: s.units,
        }),
      },
    ),
  ),
);

export const useStore = appStore.getState;
