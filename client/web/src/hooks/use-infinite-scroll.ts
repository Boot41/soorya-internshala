import { useEffect, useRef } from "react"

/**
 * useInfiniteScroll sets up an IntersectionObserver on the returned ref.
 * When the element enters the viewport and canLoad is true, it calls onLoadMore.
 */
export function useInfiniteScroll({
  onLoadMore,
  canLoad,
}: {
  onLoadMore: () => void
  canLoad: boolean
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && canLoad) {
        onLoadMore()
      }
    })

    io.observe(node)
    return () => io.disconnect()
  }, [onLoadMore, canLoad])

  return { ref }
}
