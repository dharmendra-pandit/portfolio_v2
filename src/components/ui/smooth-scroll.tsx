'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { setLenis } from '@/lib/scroll'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      anchors: true,
    })
    setLenis(lenis)

    return () => {
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
