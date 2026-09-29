'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/scroll'
import { onIntroDone } from '@/lib/intro'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // The intro plays from the top of the page, so don't restore a stale scroll offset.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)

    // Async sections (projects, stats) change the page height after load;
    // keep ScrollTrigger start/end positions in sync with the real layout.
    let refreshTimer: ReturnType<typeof setTimeout>
    const ro = new ResizeObserver(() => {
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      return () => {
        ro.disconnect()
        clearTimeout(refreshTimer)
      }
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    setLenis(lenis)

    // Hold the page still while the intro curtain is up.
    lenis.stop()
    const stopWaiting = onIntroDone(() => lenis.start())

    // Drive Lenis from GSAP's ticker so scroll-linked tweens never lag a frame.
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      ro.disconnect()
      clearTimeout(refreshTimer)
      stopWaiting()
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
