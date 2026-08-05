import { createOsmBuildingsAsync, type Cesium3DTileset } from 'cesium';
import { appStore } from '../store';
import { hasIonToken } from './ionToken';
import { requestRender, useViewer } from './viewerContext';

let tileset: Cesium3DTileset | null = null;
let loading: Promise<Cesium3DTileset | null> | null = null;

/** Buildings stream from Cesium Ion, so they need a token. */
export function buildingsAvailable(): boolean {
  return hasIonToken;
}

/**
 * Lazy-load the OSM Buildings tileset on first enable; afterwards toggling
 * only flips visibility. Keeps startup cost at zero for users who never
 * turn buildings on.
 */
export async function setBuildingsEnabled(on: boolean): Promise<void> {
  const store = appStore.getState();
  if (!hasIonToken) return;

  if (!on) {
    if (tileset) {
      tileset.show = false;
      requestRender();
    }
    store.setBuildingsOn(false);
    return;
  }

  store.setBuildingsOn(true);
  if (tileset) {
    tileset.show = true;
    requestRender();
    return;
  }

  if (!loading) {
    store.setBuildingsLoading(true);
    loading = createOsmBuildingsAsync()
      .then((loaded) => {
        tileset = useViewer().scene.primitives.add(loaded) as Cesium3DTileset;
        return tileset;
      })
      .catch((error: unknown) => {
        console.error('Failed to load OSM Buildings', error);
        appStore.getState().setBuildingsOn(false);
        loading = null;
        return null;
      })
      .finally(() => appStore.getState().setBuildingsLoading(false));
  }

  const loaded = await loading;
  if (loaded) {
    // Respect whatever the latest toggle state is (user may have flipped back).
    loaded.show = appStore.getState().buildingsOn;
    requestRender();
  }
}
