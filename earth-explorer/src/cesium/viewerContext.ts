import type { Viewer } from 'cesium';

let current: Viewer | null = null;

/** Register the singleton viewer. Called exactly once at bootstrap. */
export function setViewer(viewer: Viewer): void {
  current = viewer;
}

/**
 * Sole access point to the Cesium viewer — features must use this instead of
 * holding their own references so teardown and testing stay centralized.
 */
export function useViewer(): Viewer {
  if (!current) {
    throw new Error('useViewer() called before the viewer was created');
  }
  return current;
}

/** Request a frame; required after scene mutations in request-render mode. */
export function requestRender(): void {
  if (current && !current.isDestroyed()) {
    current.scene.requestRender();
  }
}
