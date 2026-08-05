type EventMap = {
  [K in keyof HTMLElementEventMap]?: (ev: HTMLElementEventMap[K]) => void;
};

export interface ElOptions {
  class?: string;
  text?: string;
  title?: string;
  id?: string;
  on?: EventMap;
  /** Arbitrary HTML attributes (type, placeholder, draggable, …). */
  attrs?: Record<string, string>;
  dataset?: Record<string, string>;
}

/** Terse, typed element builder — the app's entire "component" primitive. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElOptions = {},
  ...children: (Node | string | null | undefined)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.title) node.title = options.title;
  if (options.id) node.id = options.id;
  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      node.setAttribute(name, value);
    }
  }
  if (options.dataset) {
    for (const [name, value] of Object.entries(options.dataset)) {
      node.dataset[name] = value;
    }
  }
  if (options.on) {
    for (const [type, handler] of Object.entries(options.on)) {
      node.addEventListener(type, handler as EventListener);
    }
  }
  for (const child of children) {
    if (child !== null && child !== undefined) node.append(child);
  }
  return node;
}

/** Inline stroke icon from SVG path data (24×24 viewBox). */
export function icon(pathData: string, sizeClass = 'h-4 w-4'): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', `${sizeClass} shrink-0`);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.append(path);
  return svg;
}

/** Replace all children of `parent` with `children`. */
export function replaceChildren(parent: HTMLElement, ...children: Node[]): void {
  parent.replaceChildren(...children);
}
