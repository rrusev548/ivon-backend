import {
  Cartesian2,
  Cartographic,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { pickGlobePosition } from '../cesium/camera';
import { useViewer } from '../cesium/viewerContext';
import { throttle } from '../lib/debounce';
import { formatAltitude, formatLatLon } from '../lib/format';
import { el } from './dom';

/**
 * Corner HUD: pointer coordinates + camera altitude, throttled to ~10 fps so
 * mouse movement never becomes a render hotspot.
 */
export function mountHud(root: HTMLElement): void {
  const viewer = useViewer();
  const coords = el('span', { class: 'tabular-nums', text: '—' });
  const altitude = el('span', { class: 'tabular-nums', text: '—' });

  root.append(
    el(
      'div',
      {
        class:
          'glass pointer-events-none absolute bottom-8 left-3 z-20 hidden gap-3 px-3 py-1.5 text-[11px] text-white/70 sm:flex',
      },
      coords,
      el('span', { class: 'text-white/25', text: '|' }),
      altitude,
    ),
  );

  const updateAltitude = throttle(() => {
    const height = viewer.camera.positionCartographic.height;
    altitude.textContent = `alt ${formatAltitude(height)}`;
  }, 100);
  updateAltitude();
  viewer.camera.changed.addEventListener(updateAltitude);
  viewer.camera.percentageChanged = 0.01;

  const updateCoords = throttle((windowPosition: Cartesian2) => {
    const position = pickGlobePosition(viewer, windowPosition);
    if (!position) {
      coords.textContent = '—';
      return;
    }
    const carto = Cartographic.fromCartesian(position);
    coords.textContent = formatLatLon(
      CesiumMath.toDegrees(carto.latitude),
      CesiumMath.toDegrees(carto.longitude),
    );
  }, 100);

  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((event: ScreenSpaceEventHandler.MotionEvent) => {
    // Cesium reuses the event object across events — clone before throttling.
    updateCoords(Cartesian2.clone(event.endPosition));
  }, ScreenSpaceEventType.MOUSE_MOVE);
}
