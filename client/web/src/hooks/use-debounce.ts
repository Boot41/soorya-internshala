import { useEffect, useState } from "react"

/**
 * useDebounce returns a debounced version of a value that only updates
 * after `delay` milliseconds have elapsed without further changes.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handle)
  }, [value, delay])

  return debounced
}
