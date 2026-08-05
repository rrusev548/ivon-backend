import { Math as CesiumMath } from 'cesium';
import { getCameraPose } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { newId } from '../../lib/id';
import { appStore } from '../../store';
import type { PlaceMarker, TourKeyframe } from '../../types';
import { el, icon, replaceChildren } from '../../ui/dom';
import { ICON } from '../../ui/icons';
import { pauseTour, playTour, stopTour } from './player';

const DEFAULT_LEG_SECONDS = 4;

/** Sidebar section: record keyframes and play them back as a camera tour. */
export function mountTourPanel(root: HTMLElement): void {
  const list = el('div', { class: 'space-y-1' });
  const controls = el('div', { class: 'flex gap-1.5' });
  const placeSelect = el('select', {
    class: 'input flex-1 !py-1 text-xs',
    title: 'Add a saved place as a keyframe',
    on: { change: () => addFromPlace() },
  });

  root.append(
    el(
      'section',
      { class: 'space-y-2' },
      el(
        'div',
        { class: 'flex items-center justify-between' },
        el('h2', { class: 'text-xs font-semibold uppercase tracking-wider text-white/50', text: 'Camera tour' }),
        controls,
      ),
      el(
        'div',
        { class: 'flex gap-1.5' },
        el(
          'button',
          {
            class: 'btn flex-1',
            title: 'Record the current camera view',
            on: { click: addCurrentView },
          },
          icon(ICON.camera),
          el('span', { text: 'Add view' }),
        ),
        placeSelect,
      ),
      list,
    ),
  );

  function addCurrentView(): void {
    const store = appStore.getState();
    store.addKeyframe({
      id: newId(),
      label: `View ${store.keyframes.length + 1}`,
      pose: getCameraPose(useViewer()),
      durationSec: DEFAULT_LEG_SECONDS,
    });
  }

  function addFromPlace(): void {
    const id = placeSelect.value;
    placeSelect.value = '';
    const place = appStore.getState().places.find((p) => p.id === id);
    if (place) {
      appStore.getState().addKeyframe(keyframeFromPlace(place));
    }
  }

  function renderControls(): void {
    const { playback, keyframes } = appStore.getState();
    replaceChildren(
      controls,
      el(
        'button',
        {
          class: 'btn !px-2',
          title: playback === 'playing' ? 'Pause tour' : 'Play tour',
          attrs: keyframes.length === 0 ? { disabled: 'true' } : {},
          on: { click: () => (playback === 'playing' ? pauseTour() : void playTour()) },
        },
        icon(playback === 'playing' ? ICON.pause : ICON.play, 'h-3.5 w-3.5'),
      ),
      el(
        'button',
        {
          class: 'btn !px-2',
          title: 'Stop tour',
          attrs: playback === 'stopped' ? { disabled: 'true' } : {},
          on: { click: stopTour },
        },
        icon(ICON.stop, 'h-3.5 w-3.5'),
      ),
    );
  }

  function renderList(): void {
    const { keyframes, activeKeyframeIndex } = appStore.getState();
    if (keyframes.length === 0) {
      replaceChildren(
        list,
        el('p', {
          class: 'rounded-lg border border-dashed border-white/15 p-3 text-center text-xs text-white/40',
          text: 'Record views or add saved places, then press play.',
        }),
      );
      return;
    }
    replaceChildren(list, ...keyframes.map((frame, index) => renderRow(frame, index, activeKeyframeIndex)));
  }

  function renderRow(frame: TourKeyframe, index: number, activeIndex: number): HTMLElement {
    const duration = el('input', {
      class: 'input w-14 !px-1.5 !py-0.5 text-center text-xs',
      title: 'Leg duration (seconds)',
      attrs: { type: 'number', min: '1', max: '60', step: '1', value: String(frame.durationSec) },
      on: {
        change: () => {
          const value = Math.max(1, Math.min(60, Number(duration.value) || DEFAULT_LEG_SECONDS));
          duration.value = String(value);
          appStore.getState().updateKeyframe(frame.id, { durationSec: value });
        },
      },
    });
    return el(
      'div',
      {
        class: `flex items-center gap-2 rounded-lg px-1.5 py-1 ${
          index === activeIndex ? 'bg-sky-500/20' : 'hover:bg-white/5'
        }`,
      },
      el('span', { class: 'w-4 text-right text-[10px] tabular-nums text-white/35', text: String(index + 1) }),
      el('span', { class: 'min-w-0 flex-1 truncate text-sm text-white/85', text: frame.label }),
      duration,
      el('span', { class: 'text-[10px] text-white/35', text: 's' }),
      el(
        'button',
        {
          class: 'btn !px-1.5 !py-1 hover:bg-rose-500/30',
          title: 'Remove keyframe',
          on: { click: () => appStore.getState().removeKeyframe(frame.id) },
        },
        icon(ICON.trash, 'h-3.5 w-3.5'),
      ),
    );
  }

  function renderPlaceOptions(): void {
    const { places } = appStore.getState();
    replaceChildren(
      placeSelect,
      el('option', { text: '+ Place…', attrs: { value: '' } }),
      ...places.map((p) => el('option', { text: p.title, attrs: { value: p.id } })),
    );
  }

  appStore.subscribe((s) => s.keyframes, () => { renderList(); renderControls(); });
  appStore.subscribe((s) => s.playback, renderControls);
  appStore.subscribe((s) => s.activeKeyframeIndex, renderList);
  appStore.subscribe((s) => s.places, renderPlaceOptions);
  renderList();
  renderControls();
  renderPlaceOptions();
}

/** A keyframe hovering over a saved place, matching the app's fly-to framing. */
function keyframeFromPlace(place: PlaceMarker): TourKeyframe {
  return {
    id: newId(),
    label: place.title,
    pose: {
      lon: place.lon,
      lat: place.lat,
      height: place.height + 2500,
      heading: 0,
      pitch: CesiumMath.toRadians(-55),
      roll: 0,
    },
    durationSec: DEFAULT_LEG_SECONDS,
  };
}
