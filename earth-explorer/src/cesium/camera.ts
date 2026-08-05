import {
  type Cartesian2,
  Cartesian3,
  Cartographic,
  EasingFunction,
  Math as CesiumMath,
  Rectangle,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  type Viewer,
} from 'cesium';
import type { CameraPose } from '../types';

/** Snapshot the camera so the exact view can be restored later (tours). */
export function getCameraPose(viewer: Viewer): CameraPose {
  const { camera } = viewer;
  const carto = Cartographic.fromCartesian(camera.positionWC);
  return {
    lon: CesiumMath.toDegrees(carto.longitude),
    lat: CesiumMath.toDegrees(carto.latitude),
    height: carto.height,
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
  };
}

/** Fly to a stored pose. Resolves true on completion, false if cancelled. */
export function flyToPose(
  viewer: Viewer,
  pose: CameraPose,
  durationSec: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(pose.lon, pose.lat, pose.height),
      orientation: { heading: pose.heading, pitch: pose.pitch, roll: pose.roll },
      duration: durationSec,
      easingFunction: EasingFunction.QUADRATIC_IN_OUT,
      complete: () => resolve(true),
      cancel: () => resolve(false),
    });
  });
}

/** Cinematic fly-to over a point, looking down at a slight tilt. */
export function flyToLonLat(
  viewer: Viewer,
  lon: number,
  lat: number,
  height = 2500,
  durationSec = 2.4,
): void {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon, lat, height),
    orientation: {
      heading: 0,
      pitch: CesiumMath.toRadians(-55),
      roll: 0,
    },
    duration: durationSec,
    easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  });
}

/** Fly to a search-result bounding box ([south, north, west, east], degrees). */
export function flyToBoundingBox(
  viewer: Viewer,
  box: [number, number, number, number],
  durationSec = 2.4,
): void {
  const [south, north, west, east] = box;
  viewer.camera.flyTo({
    destination: Rectangle.fromDegrees(west, south, east, north),
    duration: durationSec,
    easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  });
}

/**
 * Replace Cesium's default double-click (entity tracking) with a smooth
 * "dive toward the clicked point" flight.
 */
export function setupDoubleClickFlyTo(viewer: Viewer): void {
  viewer.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  );
  viewer.screenSpaceEventHandler.setInputAction(
    (event: ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = pickGlobePosition(viewer, event.position);
      if (!picked) return;
      const carto = Cartographic.fromCartesian(picked);
      const currentHeight = viewer.camera.positionCartographic.height;
      const targetHeight = Math.max(currentHeight / 3, 400);
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          CesiumMath.toDegrees(carto.longitude),
          CesiumMath.toDegrees(carto.latitude),
          targetHeight,
        ),
        orientation: { heading: viewer.camera.heading, pitch: viewer.camera.pitch, roll: 0 },
        duration: 1.6,
        easingFunction: EasingFunction.QUADRATIC_IN_OUT,
      });
    },
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  );
}

/** Pick a position on terrain (or the ellipsoid as fallback). */
export function pickGlobePosition(
  viewer: Viewer,
  windowPosition: Cartesian2,
): Cartesian3 | undefined {
  const ray = viewer.camera.getPickRay(windowPosition);
  if (ray) {
    const onTerrain = viewer.scene.globe.pick(ray, viewer.scene);
    if (onTerrain) return onTerrain;
  }
  return viewer.camera.pickEllipsoid(windowPosition, viewer.scene.globe.ellipsoid);
}
