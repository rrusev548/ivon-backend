/** Debounce `fn` by `waitMs`; the returned function also exposes `cancel()`. */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs: number,
): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: A): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
  debounced.cancel = (): void => clearTimeout(timer);
  return debounced;
}

/** Run `fn` at most once every `intervalMs`, with a trailing call. */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  intervalMs: number,
): (...args: A) => void {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | undefined;
  return (...args: A): void => {
    const now = Date.now();
    const remaining = intervalMs - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
      return;
    }
    pending = args;
    if (timer === undefined) {
      timer = setTimeout(() => {
        timer = undefined;
        last = Date.now();
        if (pending) fn(...pending);
        pending = undefined;
      }, remaining);
    }
  };
}
