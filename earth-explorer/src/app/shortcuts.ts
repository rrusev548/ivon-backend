import { setBuildingsEnabled, buildingsAvailable } from '../cesium/buildings';
import { cancelDrawing } from '../features/measure/measureTool';
import { appStore } from '../store';

/**
 * Global keyboard shortcuts. Ignored while typing in inputs, except ESC
 * which always backs out of the current tool/selection.
 */
export function mountShortcuts(toggleTimePanel: () => void): void {
  document.addEventListener('keydown', (ev) => {
    const store = appStore.getState();

    if (ev.key === 'Escape') {
      cancelDrawing();
      store.setToolMode('idle');
      store.selectPlace(null);
      return;
    }

    const target = ev.target as HTMLElement | null;
    const typing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;
    if (typing || ev.metaKey || ev.ctrlKey || ev.altKey) return;

    switch (ev.key.toLowerCase()) {
      case 'p':
        store.setToolMode(store.toolMode === 'pin' ? 'idle' : 'pin');
        break;
      case 'd':
        store.setToolMode(store.toolMode === 'distance' ? 'idle' : 'distance');
        break;
      case 'a':
        store.setToolMode(store.toolMode === 'area' ? 'idle' : 'area');
        break;
      case 'b':
        if (buildingsAvailable()) void setBuildingsEnabled(!store.buildingsOn);
        break;
      case 't':
        toggleTimePanel();
        break;
      case 'u':
        store.toggleUnits();
        break;
      case 's':
        store.toggleSidebar();
        break;
      case '/': {
        ev.preventDefault();
        const search = document.querySelector<HTMLInputElement>('input[type="search"]');
        search?.focus();
        break;
      }
      default:
        break;
    }
  });
}
