import { useCallback, useSyncExternalStore } from 'react'

/**
 * Whether a CSS media query matches, kept in sync as it changes.
 * Renders `serverValue` on the server and during hydration, so the first client render matches
 * the server's, then switches to the real value.
 */
export function useMatchMedia(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}
