import { flyToBoundingBox, flyToLonLat } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { debounce } from '../../lib/debounce';
import type { SearchResult } from '../../types';
import { el, icon, replaceChildren } from '../../ui/dom';
import { ICON } from '../../ui/icons';
import { geocode } from './nominatim';

/** Top-center search bar with debounced Nominatim autocomplete. */
export function mountSearchBar(root: HTMLElement): void {
  let results: SearchResult[] = [];
  let highlighted = -1;
  let controller: AbortController | null = null;

  const input = el('input', {
    class: 'input bg-transparent border-0 focus:border-0 py-2 pl-0',
    attrs: {
      type: 'search',
      placeholder: 'Search places…',
      autocomplete: 'off',
      spellcheck: 'false',
      'aria-label': 'Search places',
    },
    on: { input: () => onInput(), keydown: (ev) => onKeyDown(ev), blur: () => scheduleClose() },
  });
  const dropdown = el('ul', {
    class: 'glass mt-1.5 hidden max-h-72 overflow-y-auto py-1 text-sm',
    on: { mousedown: (ev) => ev.preventDefault() },
  });
  root.append(
    el(
      'div',
      { class: 'pointer-events-auto absolute left-1/2 top-3 z-30 w-[min(92vw,26rem)] -translate-x-1/2' },
      el(
        'div',
        { class: 'glass flex items-center gap-2 px-3' },
        icon(ICON.search, 'h-4 w-4 text-white/40'),
        input,
      ),
      dropdown,
    ),
  );

  const runSearch = debounce((query: string) => {
    controller?.abort();
    controller = new AbortController();
    geocode(query, controller.signal)
      .then((hits) => {
        results = hits;
        highlighted = hits.length > 0 ? 0 : -1;
        renderResults(hits.length === 0 ? 'No places found' : null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        renderResults('Search failed — check your connection');
      });
  }, 300);

  function onInput(): void {
    const query = input.value.trim();
    if (query.length < 2) {
      runSearch.cancel();
      controller?.abort();
      close();
      return;
    }
    runSearch(query);
  }

  function onKeyDown(ev: KeyboardEvent): void {
    if (dropdown.classList.contains('hidden')) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const delta = ev.key === 'ArrowDown' ? 1 : -1;
      if (results.length > 0) {
        highlighted = (highlighted + delta + results.length) % results.length;
        renderResults(null);
      }
    } else if (ev.key === 'Enter') {
      const chosen = results[highlighted];
      if (chosen) select(chosen);
    } else if (ev.key === 'Escape') {
      close();
      input.blur();
    }
  }

  function renderResults(message: string | null): void {
    dropdown.classList.remove('hidden');
    if (message) {
      replaceChildren(dropdown, el('li', { class: 'px-3 py-2 text-white/50', text: message }));
      return;
    }
    replaceChildren(
      dropdown,
      ...results.map((result, index) =>
        el(
          'li',
          {
            class: `cursor-pointer px-3 py-2 leading-snug ${
              index === highlighted ? 'bg-sky-500/25 text-white' : 'text-white/75 hover:bg-white/10'
            }`,
            on: { click: () => select(result), mousemove: () => highlight(index) },
          },
          el('div', { class: 'truncate', text: result.displayName }),
          el('div', { class: 'text-[11px] capitalize text-white/40', text: result.category }),
        ),
      ),
    );
  }

  function highlight(index: number): void {
    if (highlighted !== index) {
      highlighted = index;
      renderResults(null);
    }
  }

  function select(result: SearchResult): void {
    const viewer = useViewer();
    close();
    input.value = result.displayName;
    input.blur();
    // A degenerate (point-sized) bounding box zooms in absurdly far — fall
    // back to a fixed-height fly-to for those.
    const box = result.boundingBox;
    if (box && Math.abs(box[1] - box[0]) > 0.005 && Math.abs(box[3] - box[2]) > 0.005) {
      flyToBoundingBox(viewer, box);
    } else {
      flyToLonLat(viewer, result.lon, result.lat);
    }
  }

  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  function scheduleClose(): void {
    closeTimer = setTimeout(close, 150);
  }
  function close(): void {
    clearTimeout(closeTimer);
    dropdown.classList.add('hidden');
    results = [];
    highlighted = -1;
  }
}
