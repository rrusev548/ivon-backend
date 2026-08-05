import { setupDoubleClickFlyTo } from '../cesium/camera';
import { useViewer } from '../cesium/viewerContext';
import { mountMeasureTool } from '../features/measure/measureTool';
import { mountMarkerLayer } from '../features/places/markers';
import { mountPlaceInteraction } from '../features/places/interaction';
import { mountSearchBar } from '../features/search/searchBar';
import { mountTimePanel } from '../features/time/timePanel';
import { appStore } from '../store';
import { el } from '../ui/dom';
import { mountHud } from '../ui/hud';
import { mountLoadingIndicator } from '../ui/loading';
import { mountDock } from './dock';
import { mountShortcuts } from './shortcuts';
import { mountSidebar } from './sidebar';

/** Assemble the overlay UI and wire all globe interactions. */
export function mountAppShell(root: HTMLElement): void {
  const overlay = el('div', { class: 'pointer-events-none absolute inset-0 z-10' });
  root.append(overlay);

  // Globe interactions.
  setupDoubleClickFlyTo(useViewer());
  mountMarkerLayer();
  mountPlaceInteraction();
  mountMeasureTool();

  // Overlay UI.
  mountSearchBar(overlay);
  mountSidebar(overlay);
  const timePanel = mountTimePanel(overlay);
  mountDock(overlay, timePanel.toggle);
  mountHud(overlay);
  mountLoadingIndicator(overlay);
  mountShortcuts(timePanel.toggle);
  mountToolHint(overlay);
}

/** Small helper banner shown while a pointer tool is active. */
function mountToolHint(root: HTMLElement): void {
  const hint = el('div', {
    class:
      'glass pointer-events-none absolute left-1/2 top-16 z-20 hidden -translate-x-1/2 px-3 py-1.5 text-xs text-white/75',
  });
  root.append(hint);

  const MESSAGES: Record<string, string> = {
    pin: 'Click the globe to drop a pin — ESC to cancel',
    distance: 'Click to add points · double-click or right-click to finish · ESC to cancel',
    area: 'Click to outline an area · double-click or right-click to finish · ESC to cancel',
  };

  appStore.subscribe(
    (s) => s.toolMode,
    (mode) => {
      const message = MESSAGES[mode];
      hint.classList.toggle('hidden', !message);
      if (message) hint.textContent = message;
    },
  );

  // Cursor feedback: crosshair while a pointer tool is armed.
  appStore.subscribe(
    (s) => s.toolMode,
    (mode) => {
      useViewer().scene.canvas.style.cursor = mode === 'idle' ? '' : 'crosshair';
    },
  );
}
