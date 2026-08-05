import { flyToLonLat } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { formatLatLon } from '../../lib/format';
import { geoJsonToPlaces, placesToGeoJson } from '../../lib/geojson';
import { appStore } from '../../store';
import type { PlaceMarker } from '../../types';
import { el, icon, replaceChildren } from '../../ui/dom';
import { ICON } from '../../ui/icons';
import { renderPlaceEditor } from './placeEditor';

/** Sidebar section: saved places list with reorder, editor, export/import. */
export function mountPlacesPanel(root: HTMLElement): void {
  const list = el('div', { class: 'space-y-1' });
  const status = el('p', { class: 'hidden text-[11px] text-rose-300' });
  const fileInput = el('input', {
    class: 'hidden',
    attrs: { type: 'file', accept: '.geojson,.json,application/geo+json' },
    on: { change: () => importFile() },
  });

  root.append(
    el(
      'section',
      { class: 'space-y-2' },
      el(
        'div',
        { class: 'flex items-center justify-between' },
        el('h2', { class: 'text-xs font-semibold uppercase tracking-wider text-white/50', text: 'Places' }),
        el(
          'div',
          { class: 'flex gap-1' },
          el(
            'button',
            { class: 'btn', title: 'Export GeoJSON', on: { click: exportPlaces } },
            icon(ICON.download),
          ),
          el(
            'button',
            { class: 'btn', title: 'Import GeoJSON', on: { click: () => fileInput.click() } },
            icon(ICON.upload),
          ),
        ),
      ),
      status,
      list,
      fileInput,
    ),
  );

  function render(): void {
    const { places, selectedPlaceId } = appStore.getState();
    if (places.length === 0) {
      replaceChildren(
        list,
        el('p', {
          class: 'rounded-lg border border-dashed border-white/15 p-3 text-center text-xs text-white/40',
          text: 'No places yet. Use the pin tool, then click the globe.',
        }),
      );
      return;
    }
    replaceChildren(
      list,
      ...places.map((place, index) =>
        place.id === selectedPlaceId
          ? renderPlaceEditor(place)
          : renderRow(place, index),
      ),
    );
  }

  function renderRow(place: PlaceMarker, index: number): HTMLElement {
    const row = el(
      'div',
      {
        class:
          'group flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-1.5 py-1.5 hover:border-white/10 hover:bg-white/5',
        attrs: { draggable: 'true' },
        dataset: { index: String(index) },
        on: {
          click: () => appStore.getState().selectPlace(place.id),
          dblclick: () => flyToLonLat(useViewer(), place.lon, place.lat),
          dragstart: (ev) => ev.dataTransfer?.setData('text/plain', String(index)),
          dragover: (ev) => ev.preventDefault(),
          drop: (ev) => {
            ev.preventDefault();
            const from = Number(ev.dataTransfer?.getData('text/plain'));
            if (Number.isInteger(from)) appStore.getState().reorderPlaces(from, index);
          },
        },
      },
      el('span', { class: 'cursor-grab text-white/25' }, icon(ICON.grip, 'h-3.5 w-3.5')),
      el('span', {
        class: 'h-2.5 w-2.5 shrink-0 rounded-full',
        attrs: { style: `background:${place.color}` },
      }),
      el(
        'div',
        { class: 'min-w-0 flex-1' },
        el('div', { class: 'truncate text-sm text-white/85', text: place.title }),
        el('div', {
          class: 'truncate text-[10px] tabular-nums text-white/35',
          text: formatLatLon(place.lat, place.lon),
        }),
      ),
      el(
        'button',
        {
          class: 'btn hidden !px-1.5 !py-1 group-hover:inline-flex',
          title: 'Fly to',
          on: {
            click: (ev) => {
              ev.stopPropagation();
              flyToLonLat(useViewer(), place.lon, place.lat);
            },
          },
        },
        icon(ICON.crosshair, 'h-3.5 w-3.5'),
      ),
    );
    return row;
  }

  function exportPlaces(): void {
    const { places } = appStore.getState();
    const blob = new Blob([placesToGeoJson(places)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = el('a', { attrs: { href: url, download: 'earth-explorer-places.geojson' } });
    link.click();
    URL.revokeObjectURL(url);
  }

  function importFile(): void {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    file
      .text()
      .then((text) => {
        const imported = geoJsonToPlaces(text);
        if (imported.length === 0) {
          showStatus('No point features found in that file.');
          return;
        }
        appStore.getState().importPlaces(imported);
        showStatus(null);
      })
      .catch(() => showStatus('Could not parse that file as GeoJSON.'));
  }

  function showStatus(message: string | null): void {
    status.textContent = message ?? '';
    status.classList.toggle('hidden', message === null);
  }

  appStore.subscribe((s) => s.places, render);
  appStore.subscribe((s) => s.selectedPlaceId, render);
  render();
}
