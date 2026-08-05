import {
  Cartographic,
  Entity,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { pickGlobePosition } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { newId } from '../../lib/id';
import { appStore } from '../../store';
import { PLACE_ENTITY_PREFIX } from './markers';

export const PLACE_COLORS = [
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#a78bfa',
  '#f97316',
  '#e879f9',
  '#f8fafc',
] as const;

/**
 * Left-click behavior outside the measure tools:
 * - pin mode: drop a new place at the clicked globe position
 * - idle mode: select/deselect place markers
 */
export function mountPlaceInteraction(): void {
  const viewer = useViewer();
  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
    const store = appStore.getState();
    if (store.toolMode === 'pin') {
      dropPin(event.position);
      return;
    }
    if (store.toolMode !== 'idle') return;

    const picked: unknown = viewer.scene.pick(event.position);
    const entity =
      picked && typeof picked === 'object' && 'id' in picked ? picked.id : undefined;
    if (entity instanceof Entity && entity.id.startsWith(PLACE_ENTITY_PREFIX)) {
      store.selectPlace(entity.id.slice(PLACE_ENTITY_PREFIX.length));
    } else {
      store.selectPlace(null);
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
}

function dropPin(position: Parameters<typeof pickGlobePosition>[1]): void {
  const viewer = useViewer();
  const store = appStore.getState();
  const cartesian = pickGlobePosition(viewer, position);
  if (!cartesian) return;
  const carto = Cartographic.fromCartesian(cartesian);
  const count = store.places.length + 1;
  store.addPlace({
    id: newId(),
    title: `Place ${count}`,
    description: '',
    color: PLACE_COLORS[(count - 1) % PLACE_COLORS.length] ?? '#38bdf8',
    lon: CesiumMath.toDegrees(carto.longitude),
    lat: CesiumMath.toDegrees(carto.latitude),
    height: carto.height,
    createdAt: Date.now(),
  });
  store.setToolMode('idle');
}
