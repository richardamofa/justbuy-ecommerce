/**
 * Simulates network latency so loading states are exercised in dev.
 * Swap this module's callers for real `fetch` calls once the API exists —
 * nothing above the services layer needs to change.
 */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
