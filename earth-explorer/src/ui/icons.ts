/** 24×24 stroke path data (heroicons-outline style). */
export const ICON = {
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1 1 15 0Z',
  ruler: 'M3 16.5 16.5 3l4.5 4.5L7.5 21 3 16.5Z M7 13l1.5 1.5 M10 10l1.5 1.5 M13 7l1.5 1.5',
  polygon: 'M12 3l8 5.5-3 9.5H7L4 8.5 12 3Z M12 3v0 M20 8.5v0 M17 18v0 M7 18v0 M4 8.5v0',
  clock: 'M12 6v6l3.5 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  film: 'M7 4v16 M17 4v16 M3 8h4 M3 12h18 M3 16h4 M17 8h4 M17 16h4 M3.6 4h16.8c.33 0 .6.27.6.6v14.8c0 .33-.27.6-.6.6H3.6a.6.6 0 0 1-.6-.6V4.6c0-.33.27-.6.6-.6Z',
  buildings: 'M3 21h18 M5 21V7l6-4v18 M13 21V11l6 3v7 M8 9h.01 M8 12h.01 M8 15h.01 M8 18h.01',
  search: 'M21 21l-4.35-4.35 M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  trash: 'M6 7h12 M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2 M7 7l1 13h8l1-13 M10 11v6 M14 11v6',
  play: 'M6 4.5v15l13-7.5-13-7.5Z',
  pause: 'M7 4.5h3.5v15H7Z M13.5 4.5H17v15h-3.5Z',
  stop: 'M6 6h12v12H6Z',
  plus: 'M12 5v14 M5 12h14',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 19h16',
  upload: 'M12 15V3 M7 8l5-5 5 5 M4 19h16',
  close: 'M6 6l12 12 M18 6 6 18',
  grip: 'M9 6h.01 M9 12h.01 M9 18h.01 M15 6h.01 M15 12h.01 M15 18h.01',
  crosshair: 'M12 2v4 M12 18v4 M2 12h4 M18 12h4 M12 12h.01',
  camera: 'M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z M15.5 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z',
  chevronLeft: 'M15 5l-7 7 7 7',
  eraser: 'M5 16 15.5 5.5a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L10 21H6l-1-1a2.5 2.5 0 0 1 0-4Z M8 21h13',
} as const;

export type IconName = keyof typeof ICON;
