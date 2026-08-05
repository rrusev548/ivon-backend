import { flyToLonLat } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { formatLatLon } from '../../lib/format';
import { appStore } from '../../store';
import type { PlaceMarker } from '../../types';
import { el, icon } from '../../ui/dom';
import { ICON } from '../../ui/icons';
import { PLACE_COLORS } from './interaction';

/** Inline editor card for the selected place (title, description, color). */
export function renderPlaceEditor(place: PlaceMarker): HTMLElement {
  const store = appStore.getState();

  const title = el('input', {
    class: 'input',
    attrs: { type: 'text', value: place.title, placeholder: 'Title', maxlength: '80' },
    on: { input: () => store.updatePlace(place.id, { title: title.value }) },
  });
  title.value = place.title;

  const description = el('textarea', {
    class: 'input min-h-[3.5rem] resize-y text-xs',
    attrs: { placeholder: 'Notes…', maxlength: '500', rows: '2' },
    on: { input: () => store.updatePlace(place.id, { description: description.value }) },
  });
  description.value = place.description;

  const swatches = el(
    'div',
    { class: 'flex flex-wrap gap-1.5' },
    ...PLACE_COLORS.map((color) =>
      el('button', {
        class: `h-5 w-5 rounded-full border transition-transform hover:scale-110 ${
          color === place.color ? 'border-white scale-110' : 'border-white/20'
        }`,
        title: color,
        attrs: { type: 'button', style: `background:${color}` },
        on: { click: () => store.updatePlace(place.id, { color }) },
      }),
    ),
  );

  return el(
    'div',
    { class: 'space-y-2 rounded-lg border border-sky-400/30 bg-sky-500/10 p-2.5' },
    title,
    description,
    swatches,
    el(
      'div',
      { class: 'flex items-center justify-between gap-2' },
      el('span', {
        class: 'text-[10px] tabular-nums text-white/40',
        text: formatLatLon(place.lat, place.lon),
      }),
      el(
        'div',
        { class: 'flex gap-1.5' },
        el(
          'button',
          {
            class: 'btn',
            title: 'Fly to place',
            on: { click: () => flyToLonLat(useViewer(), place.lon, place.lat) },
          },
          icon(ICON.crosshair),
        ),
        el(
          'button',
          {
            class: 'btn hover:bg-rose-500/30',
            title: 'Delete place',
            on: { click: () => store.removePlace(place.id) },
          },
          icon(ICON.trash),
        ),
      ),
    ),
  );
}
