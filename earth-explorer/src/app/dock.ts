import { buildingsAvailable, setBuildingsEnabled } from '../cesium/buildings';
import { clearMeasurements } from '../features/measure/measureTool';
import { appStore } from '../store';
import type { ToolMode } from '../types';
import { el, icon } from '../ui/dom';
import { ICON } from '../ui/icons';

interface DockButton {
  element: HTMLButtonElement;
  refresh: () => void;
}

/** Bottom-right tool dock: pointer tools, buildings, sun panel, units. */
export function mountDock(root: HTMLElement, toggleTimePanel: () => void): void {
  const buttons: DockButton[] = [
    toolButton('pin', ICON.pin, 'Drop a pin (P)'),
    toolButton('distance', ICON.ruler, 'Measure distance (D)'),
    toolButton('area', ICON.polygon, 'Measure area (A)'),
    plainButton(ICON.eraser, 'Clear measurements', clearMeasurements),
    buildingsButton(),
    plainButton(ICON.clock, 'Sun & time (T)', toggleTimePanel),
    unitsButton(),
  ];

  root.append(
    el(
      'div',
      {
        class:
          'glass pointer-events-auto absolute bottom-8 right-3 z-20 flex flex-col gap-1 p-1.5 sm:bottom-12',
      },
      ...buttons.map((b) => b.element),
    ),
  );

  const refreshAll = (): void => buttons.forEach((b) => b.refresh());
  appStore.subscribe((s) => s.toolMode, refreshAll);
  appStore.subscribe((s) => s.buildingsOn, refreshAll);
  appStore.subscribe((s) => s.buildingsLoading, refreshAll);
  appStore.subscribe((s) => s.units, refreshAll);
  refreshAll();
}

function toolButton(mode: ToolMode, iconPath: string, title: string): DockButton {
  const element = el(
    'button',
    {
      class: 'btn !p-2',
      title,
      on: {
        click: () => {
          const store = appStore.getState();
          store.setToolMode(store.toolMode === mode ? 'idle' : mode);
        },
      },
    },
    icon(iconPath),
  );
  return {
    element,
    refresh: () =>
      element.classList.toggle('btn-active', appStore.getState().toolMode === mode),
  };
}

function plainButton(iconPath: string, title: string, onClick: () => void): DockButton {
  const element = el('button', { class: 'btn !p-2', title, on: { click: onClick } }, icon(iconPath));
  return { element, refresh: () => undefined };
}

function buildingsButton(): DockButton {
  const available = buildingsAvailable();
  const element = el(
    'button',
    {
      class: 'btn !p-2',
      title: available
        ? 'Toggle 3D buildings (B)'
        : '3D buildings need a Cesium Ion token (see README)',
      attrs: available ? {} : { disabled: 'true' },
      on: {
        click: () => {
          const store = appStore.getState();
          void setBuildingsEnabled(!store.buildingsOn);
        },
      },
    },
    icon(ICON.buildings),
  );
  return {
    element,
    refresh: () => {
      const { buildingsOn, buildingsLoading } = appStore.getState();
      element.classList.toggle('btn-active', buildingsOn);
      element.classList.toggle('animate-pulse', buildingsLoading);
    },
  };
}

function unitsButton(): DockButton {
  const element = el('button', {
    class: 'btn !p-2 text-[10px] font-bold tabular-nums',
    title: 'Toggle km / mi (U)',
    text: 'km',
    on: { click: () => appStore.getState().toggleUnits() },
  });
  return {
    element,
    refresh: () => {
      element.textContent = appStore.getState().units === 'metric' ? 'km' : 'mi';
    },
  };
}
