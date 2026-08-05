import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  LabelStyle,
  NearFarScalar,
  PinBuilder,
  VerticalOrigin,
} from 'cesium';
import { requestRender, useViewer } from '../../cesium/viewerContext';
import { appStore } from '../../store';
import type { PlaceMarker } from '../../types';

export const PLACE_ENTITY_PREFIX = 'place-';

const pinBuilder = new PinBuilder();
const pinCache = new Map<string, HTMLCanvasElement>();

function pinImage(color: string, selected: boolean): HTMLCanvasElement {
  const key = `${color}-${selected ? 'sel' : 'idle'}`;
  let canvas = pinCache.get(key);
  if (!canvas) {
    const css = Color.fromCssColorString(color) ?? Color.SKYBLUE;
    canvas = pinBuilder.fromColor(css, selected ? 56 : 44) as HTMLCanvasElement;
    pinCache.set(key, canvas);
  }
  return canvas;
}

/**
 * Keep viewer entities in sync with the places store. Marker count is small
 * (user pins), so a full rebuild per change is simpler and safely fast.
 */
export function mountMarkerLayer(): void {
  const rebuild = (): void => {
    const viewer = useViewer();
    const { places, selectedPlaceId } = appStore.getState();
    const stale = viewer.entities.values.filter((e) =>
      e.id.startsWith(PLACE_ENTITY_PREFIX),
    );
    for (const entity of stale) viewer.entities.remove(entity);
    for (const place of places) {
      addMarkerEntity(place, place.id === selectedPlaceId);
    }
    requestRender();
  };

  appStore.subscribe((s) => s.places, rebuild);
  appStore.subscribe((s) => s.selectedPlaceId, rebuild);
  rebuild();
}

function addMarkerEntity(place: PlaceMarker, selected: boolean): void {
  const viewer = useViewer();
  viewer.entities.add({
    id: `${PLACE_ENTITY_PREFIX}${place.id}`,
    position: Cartesian3.fromDegrees(place.lon, place.lat),
    billboard: {
      image: pinImage(place.color, selected),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scaleByDistance: new NearFarScalar(2000, 1, 3_000_000, 0.55),
    },
    label: {
      text: place.title,
      font: '13px Inter, system-ui, sans-serif',
      style: LabelStyle.FILL_AND_OUTLINE,
      fillColor: Color.WHITE,
      outlineColor: Color.fromCssColorString('#0f141e'),
      outlineWidth: 4,
      pixelOffset: new Cartesian2(0, -52),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      distanceDisplayCondition: new DistanceDisplayCondition(0, 2_500_000),
    },
  });
}
