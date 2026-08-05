import { mountPlacesPanel } from '../features/places/placesPanel';
import { mountTourPanel } from '../features/tour/tourPanel';
import { appStore } from '../store';
import { el, icon } from '../ui/dom';
import { ICON } from '../ui/icons';

/** Collapsible left sidebar hosting the places list and tour recorder. */
export function mountSidebar(root: HTMLElement): void {
  const content = el('div', {
    class: 'flex-1 space-y-5 overflow-y-auto overscroll-contain p-3',
  });
  mountPlacesPanel(content);
  mountTourPanel(content);

  const panel = el(
    'aside',
    {
      class:
        'glass pointer-events-auto absolute bottom-16 left-3 top-14 z-20 flex w-[min(85vw,19rem)] flex-col overflow-hidden transition-transform duration-300 sm:bottom-14',
    },
    el(
      'div',
      { class: 'flex items-center justify-between border-b border-white/10 px-3 py-2' },
      el('span', { class: 'text-sm font-semibold text-white/85', text: 'Earth Explorer' }),
      el(
        'button',
        {
          class: 'btn !px-1.5 !py-1',
          title: 'Close sidebar',
          on: { click: () => appStore.getState().toggleSidebar() },
        },
        icon(ICON.chevronLeft),
      ),
    ),
    content,
  );

  const openButton = el(
    'button',
    {
      class: 'glass btn pointer-events-auto absolute left-3 top-3 z-20 !p-2',
      title: 'Open sidebar',
      on: { click: () => appStore.getState().toggleSidebar() },
    },
    icon(ICON.menu),
  );

  root.append(panel, openButton);

  const sync = (open: boolean): void => {
    panel.classList.toggle('-translate-x-[120%]', !open);
    openButton.classList.toggle('hidden', open);
  };
  appStore.subscribe((s) => s.sidebarOpen, sync);
  sync(appStore.getState().sidebarOpen);
}
