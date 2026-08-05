import {
  Cartesian3,
  ImageryLayer,
  JulianDate,
  OpenStreetMapImageryProvider,
  Terrain,
  Viewer,
} from 'cesium';
import { appStore } from '../store';
import { configureIon, hasIonToken } from './ionToken';

/**
 * Build the app viewer: satellite imagery + world terrain when an Ion token
 * is present, OSM tiles on a smooth ellipsoid otherwise. All default widget
 * chrome is disabled — the app supplies its own UI.
 */
export function createAppViewer(container: HTMLElement): Viewer {
  configureIon();

  const viewer = new Viewer(container, {
    // Render only when something changes; features call requestRender().
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    baseLayer: hasIonToken
      ? ImageryLayer.fromWorldImagery({})
      : new ImageryLayer(
          new OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' }),
        ),
    terrain: hasIonToken
      ? Terrain.fromWorldTerrain({ requestVertexNormals: true, requestWaterMask: true })
      : undefined,
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    shouldAnimate: false,
  });

  configureScene(viewer);
  configureCameraControls(viewer);
  trackTileLoading(viewer);

  viewer.clock.currentTime = JulianDate.now();
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(10, 25, 22_000_000),
  });
  return viewer;
}

function configureScene(viewer: Viewer): void {
  const { scene } = viewer;
  const { globe } = scene;

  // Sun lighting + day/night terminator and atmosphere.
  globe.enableLighting = true;
  globe.dynamicAtmosphereLighting = true;
  globe.dynamicAtmosphereLightingFromSun = true;
  globe.atmosphereLightIntensity = 12;
  globe.showGroundAtmosphere = true;
  if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
  scene.fog.enabled = true;

  if (hasIonToken) {
    // Accurate picks on mountains; markers opt out via disableDepthTestDistance.
    globe.depthTestAgainstTerrain = true;
  }
  scene.msaaSamples = 4;
}

function configureCameraControls(viewer: Viewer): void {
  const controller = viewer.scene.screenSpaceCameraController;
  controller.enableCollisionDetection = true;
  controller.minimumZoomDistance = 40;
  controller.maximumZoomDistance = 40_000_000;
  // Slightly floatier inertia than Cesium defaults for a cinematic feel.
  controller.inertiaSpin = 0.95;
  controller.inertiaTranslate = 0.95;
  controller.inertiaZoom = 0.9;
}

function trackTileLoading(viewer: Viewer): void {
  viewer.scene.globe.tileLoadProgressEvent.addEventListener((pending: number) => {
    if (appStore.getState().tilesLoading !== pending) {
      appStore.getState().setTilesLoading(pending);
    }
  });
}
