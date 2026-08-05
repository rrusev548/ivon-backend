import {
  Cartesian3,
  Cartographic,
  Ellipsoid,
  type Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { pickGlobePosition } from '../../cesium/camera';
import { requestRender, useViewer } from '../../cesium/viewerContext';
import { cartographicCenter, geodesicLength, sphericalArea } from '../../lib/geo';
import { formatArea, formatDistance } from '../../lib/format';
import { appStore } from '../../store';
import {
  addDynamicLine,
  addDynamicPolygon,
  addMeasureLabel,
  addVertexEntity,
} from './measureEntities';

interface CompletedMeasurement {
  entities: Entity[];
  /** Meters (distance) or square meters (area). */
  value: number;
  kind: 'distance' | 'area';
}

let points: Cartesian3[] = [];
let hover: Cartesian3 | null = null;
let activeEntities: Entity[] = [];
const completed: CompletedMeasurement[] = [];

/** Wire up measurement pointer handling. Call once at bootstrap. */
export function mountMeasureTool(): void {
  const viewer = useViewer();
  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
    if (!isMeasuring()) return;
    const position = pickGlobePosition(viewer, event.position);
    if (!position) return;
    // A double-click (finish) also fires two clicks — skip duplicate vertices.
    const last = points[points.length - 1];
    if (last && Cartesian3.distance(last, position) < 0.5) return;
    if (points.length === 0) beginDrawing();
    points.push(position);
    activeEntities.push(addVertexEntity(position));
    requestRender();
  }, ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((event: ScreenSpaceEventHandler.MotionEvent) => {
    if (!isMeasuring() || points.length === 0) return;
    hover = pickGlobePosition(viewer, event.endPosition) ?? null;
    requestRender();
  }, ScreenSpaceEventType.MOUSE_MOVE);

  const finish = (): void => {
    if (isMeasuring()) finishDrawing();
  };
  handler.setInputAction(finish, ScreenSpaceEventType.RIGHT_CLICK);
  handler.setInputAction(finish, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  // Leaving the tool (ESC / dock button) abandons any in-progress sketch.
  appStore.subscribe(
    (s) => s.toolMode,
    () => {
      if (!isMeasuring()) cancelDrawing();
    },
  );
  // Re-render finished labels when the user flips km/mi.
  appStore.subscribe(
    (s) => s.units,
    () => requestRender(),
  );
}

/** Remove all finished measurements (dock "clear" button). */
export function clearMeasurements(): void {
  const viewer = useViewer();
  for (const measurement of completed) {
    for (const entity of measurement.entities) viewer.entities.remove(entity);
  }
  completed.length = 0;
  cancelDrawing();
}

function isMeasuring(): boolean {
  const mode = appStore.getState().toolMode;
  return mode === 'distance' || mode === 'area';
}

function livePositions(): Cartesian3[] {
  return hover ? [...points, hover] : [...points];
}

function beginDrawing(): void {
  const isArea = appStore.getState().toolMode === 'area';
  activeEntities.push(
    isArea ? addDynamicPolygon(livePositions) : addDynamicLine(livePositions),
  );
  activeEntities.push(
    addMeasureLabel(
      () => hover ?? points[points.length - 1],
      () => liveLabel(),
    ),
  );
}

function liveLabel(): string {
  const { toolMode, units } = appStore.getState();
  const cartos = toCartographics(livePositions());
  if (toolMode === 'area') {
    return cartos.length < 3
      ? 'Click to add vertices'
      : formatArea(sphericalArea(cartos), units);
  }
  return cartos.length < 2
    ? 'Click to add points'
    : formatDistance(geodesicLength(cartos), units);
}

function finishDrawing(): void {
  const { toolMode } = appStore.getState();
  const isArea = toolMode === 'area';
  const cartos = toCartographics(points);
  const minPoints = isArea ? 3 : 2;
  if (cartos.length < minPoints) {
    cancelDrawing();
    return;
  }

  const value = isArea ? sphericalArea(cartos) : geodesicLength(cartos);
  const fixedPoints = [...points];
  const labelAnchor = isArea
    ? Ellipsoid.WGS84.cartographicToCartesian(cartographicCenter(cartos))
    : fixedPoints[fixedPoints.length - 1];

  removeActiveEntities();
  const entities: Entity[] = fixedPoints.map((p) => addVertexEntity(p));
  entities.push(
    isArea
      ? addDynamicPolygon(() => fixedPoints)
      : addDynamicLine(() => fixedPoints),
  );
  const kind: CompletedMeasurement['kind'] = isArea ? 'area' : 'distance';
  entities.push(
    addMeasureLabel(labelAnchor ?? fixedPoints[0] ?? Cartesian3.ZERO, () => {
      const { units } = appStore.getState();
      return kind === 'area' ? formatArea(value, units) : formatDistance(value, units);
    }),
  );
  completed.push({ entities, value, kind });

  points = [];
  hover = null;
  requestRender();
}

/** Abandon the in-progress sketch (ESC or tool switch). */
export function cancelDrawing(): void {
  if (activeEntities.length === 0 && points.length === 0) return;
  removeActiveEntities();
  points = [];
  hover = null;
  requestRender();
}

function removeActiveEntities(): void {
  const viewer = useViewer();
  for (const entity of activeEntities) viewer.entities.remove(entity);
  activeEntities = [];
}

function toCartographics(positions: readonly Cartesian3[]): Cartographic[] {
  return positions.map((p) => Cartographic.fromCartesian(p));
}
