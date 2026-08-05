import type { TourKeyframe, TourPlayback } from '../types';

export interface TourSlice {
  keyframes: TourKeyframe[];
  playback: TourPlayback;
  /** Index of the keyframe currently being flown to (highlight in UI). */
  activeKeyframeIndex: number;
  addKeyframe: (frame: TourKeyframe) => void;
  removeKeyframe: (id: string) => void;
  updateKeyframe: (id: string, patch: Partial<Omit<TourKeyframe, 'id'>>) => void;
  clearKeyframes: () => void;
  setPlayback: (playback: TourPlayback) => void;
  setActiveKeyframeIndex: (index: number) => void;
}

type Set = (partial: Partial<TourSlice> | ((s: TourSlice) => Partial<TourSlice>)) => void;

export function createTourSlice(set: Set): TourSlice {
  return {
    keyframes: [],
    playback: 'stopped',
    activeKeyframeIndex: -1,
    addKeyframe: (frame) => set((s) => ({ keyframes: [...s.keyframes, frame] })),
    removeKeyframe: (id) =>
      set((s) => ({ keyframes: s.keyframes.filter((k) => k.id !== id) })),
    updateKeyframe: (id, patch) =>
      set((s) => ({
        keyframes: s.keyframes.map((k) => (k.id === id ? { ...k, ...patch } : k)),
      })),
    clearKeyframes: () =>
      set({ keyframes: [], playback: 'stopped', activeKeyframeIndex: -1 }),
    setPlayback: (playback) => set({ playback }),
    setActiveKeyframeIndex: (index) => set({ activeKeyframeIndex: index }),
  };
}
