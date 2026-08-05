import { appStore } from '../store';
import { el } from './dom';

/** Slim top progress bar shown while imagery/terrain tiles stream in. */
export function mountLoadingIndicator(root: HTMLElement): void {
  const bar = el('div', {
    class:
      'absolute left-0 top-0 z-40 h-0.5 w-full origin-left scale-x-0 bg-sky-400/80 transition-transform duration-500',
  });
  const badge = el('div', {
    class:
      'glass pointer-events-none absolute bottom-8 right-3 z-20 hidden px-2.5 py-1 text-[11px] text-white/60',
    text: 'Loading tiles…',
  });
  root.append(bar, badge);

  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  appStore.subscribe(
    (s) => s.tilesLoading,
    (pending) => {
      clearTimeout(hideTimer);
      if (pending > 0) {
        // Ease toward full as the queue drains; exact progress is unknowable.
        const progress = Math.min(0.9, 1 / (1 + pending / 12));
        bar.style.transform = `scaleX(${progress})`;
        bar.style.opacity = '1';
        badge.classList.remove('hidden');
      } else {
        bar.style.transform = 'scaleX(1)';
        badge.classList.add('hidden');
        hideTimer = setTimeout(() => {
          bar.style.opacity = '0';
          bar.style.transform = 'scaleX(0)';
        }, 350);
      }
    },
  );
}
