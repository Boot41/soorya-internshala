import React, { PropsWithChildren } from 'react'

interface MarqueeProps {
  speedMs?: number // default 30000
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

export default function Marquee({
  children,
  speedMs = 30000,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: PropsWithChildren<MarqueeProps>) {
  const animName = direction === 'left' ? 'marquee-left' : 'marquee-right'
  const pauseClass = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 gap-6 pr-6 [animation-iteration-count:infinite] [animation-timing-function:linear] ${pauseClass}`}
        style={{
          animationName: animName as any,
          animationDuration: `${speedMs}ms`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
