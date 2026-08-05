import { JulianDate, Math as CesiumMath } from 'cesium';
import { requestRender, useViewer } from '../../cesium/viewerContext';
import {
  dateForSolarHours,
  formatSolarHours,
  presetSolarHours,
  solarHoursAt,
} from '../../lib/sun';
import type { TimePreset } from '../../types';
import { el } from '../../ui/dom';

const PRESETS: { key: TimePreset; label: string }[] = [
  { key: 'now', label: 'Now' },
  { key: 'sunrise', label: 'Sunrise' },
  { key: 'noon', label: 'Noon' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'midnight', label: 'Midnight' },
];

/**
 * Bottom-center sun/time panel: a 24h solar-time slider plus presets, driving
 * `viewer.clock` (and therefore lighting and the day/night terminator).
 */
export function mountTimePanel(root: HTMLElement): { toggle: () => void } {
  const readout = el('span', { class: 'tabular-nums text-xs text-white/70', text: '—' });
  const slider = el('input', {
    class: 'w-full accent-sky-400',
    attrs: { type: 'range', min: '0', max: '24', step: '0.05', value: '12' },
    on: { input: () => applySolarHours(Number(slider.value)) },
  });

  const presetRow = el(
    'div',
    { class: 'flex flex-wrap justify-center gap-1.5' },
    ...PRESETS.map(({ key, label }) =>
      el('button', {
        class: 'btn !py-1 text-[11px]',
        text: label,
        on: { click: () => applyPreset(key) },
      }),
    ),
  );

  const panel = el(
    'div',
    {
      class:
        'glass pointer-events-auto absolute bottom-14 left-1/2 z-20 hidden w-[min(92vw,22rem)] -translate-x-1/2 space-y-2 p-3',
    },
    el(
      'div',
      { class: 'flex items-center justify-between' },
      el('span', { class: 'text-[11px] font-semibold uppercase tracking-wider text-white/50', text: 'Sun & time' }),
      readout,
    ),
    slider,
    presetRow,
  );
  root.append(panel);

  function cameraLongitude(): number {
    return CesiumMath.toDegrees(useViewer().camera.positionCartographic.longitude);
  }

  function applySolarHours(hours: number): void {
    const viewer = useViewer();
    const date = dateForSolarHours(hours, cameraLongitude(), new Date());
    viewer.clock.currentTime = JulianDate.fromDate(date);
    readout.textContent = `${formatSolarHours(hours)} solar`;
    requestRender();
  }

  function applyPreset(preset: TimePreset): void {
    if (preset === 'now') {
      const viewer = useViewer();
      viewer.clock.currentTime = JulianDate.now();
      const hours = solarHoursAt(new Date(), cameraLongitude());
      slider.value = hours.toFixed(2);
      readout.textContent = `${formatSolarHours(hours)} solar`;
      requestRender();
      return;
    }
    const hours = presetSolarHours(preset);
    slider.value = String(hours);
    applySolarHours(hours);
  }

  applyPreset('now');

  return { toggle: () => void panel.classList.toggle('hidden') };
}
