import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Color,
  Entity,
  HeightReference,
  LabelStyle,
  PolygonHierarchy,
  VerticalOrigin,
} from 'cesium';
import { useViewer } from '../../cesium/viewerContext';

export const MEASURE_COLOR = Color.fromCssColorString('#fbbf24');
export const MEASURE_FILL = MEASURE_COLOR.withAlpha(0.25);

export function addVertexEntity(position: Cartesian3): Entity {
  return useViewer().entities.add({
    position,
    point: {
      pixelSize: 7,
      color: MEASURE_COLOR,
      outlineColor: Color.BLACK.withAlpha(0.6),
      outlineWidth: 1.5,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
}

export function addDynamicLine(positions: () => Cartesian3[]): Entity {
  return useViewer().entities.add({
    polyline: {
      positions: new CallbackProperty(positions, false),
      width: 3,
      material: MEASURE_COLOR,
      clampToGround: true,
    },
  });
}

export function addDynamicPolygon(positions: () => Cartesian3[]): Entity {
  return useViewer().entities.add({
    polygon: {
      hierarchy: new CallbackProperty(
        () => new PolygonHierarchy(positions()),
        false,
      ),
      material: MEASURE_FILL,
      outline: false,
    },
  });
}

export function addMeasureLabel(
  position: Cartesian3 | (() => Cartesian3 | undefined),
  text: () => string,
): Entity {
  const dynamicPosition =
    typeof position === 'function'
      ? new CallbackProperty(() => position(), false)
      : position;
  return useViewer().entities.add({
    // Entity.position accepts a PositionProperty; CallbackProperty works at
    // runtime but the constructor typing is narrower, hence the cast.
    position: dynamicPosition as Cartesian3,
    label: {
      text: new CallbackProperty(text, false),
      font: '13px Inter, system-ui, sans-serif',
      style: LabelStyle.FILL_AND_OUTLINE,
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 4,
      showBackground: true,
      backgroundColor: Color.fromCssColorString('#0f141e').withAlpha(0.8),
      backgroundPadding: new Cartesian2(7, 5),
      pixelOffset: new Cartesian2(0, -18),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
}
