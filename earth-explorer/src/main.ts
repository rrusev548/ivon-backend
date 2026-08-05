import './style.css';
import { mountAppShell } from './app/appShell';
import { createAppViewer } from './cesium/createViewer';
import { setViewer } from './cesium/viewerContext';
import { el } from './ui/dom';

const root = document.getElementById('app');
if (!root) {
  throw new Error('Missing #app root element');
}

try {
  const viewer = createAppViewer(root);
  setViewer(viewer);
  mountAppShell(root);
} catch (error) {
  console.error('Failed to start Earth Explorer', error);
  root.append(
    el(
      'div',
      { class: 'flex h-full items-center justify-center p-6' },
      el(
        'div',
        { class: 'glass max-w-md space-y-2 p-6 text-center' },
        el('h1', { class: 'text-lg font-semibold', text: 'Earth Explorer failed to start' }),
        el('p', {
          class: 'text-sm text-white/60',
          text: 'Your browser may not support WebGL, or a required resource failed to load. See the console for details.',
        }),
      ),
    ),
  );
}
