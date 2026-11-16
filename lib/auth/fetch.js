export function authFetch(input, options = {}) {
  const timeout = AbortSignal.timeout(3000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;
  return fetch(input, { ...options, signal });
}
