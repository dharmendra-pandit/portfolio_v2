'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap'

interface CounterProps {
  value: number
  decimals?: number
  className?: string
}

/** Counts up from zero the first time it scrolls into view. Renders the final value for SSR / reduced motion. */
export const Counter = ({ value, decimals = 0, className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const format = (n: number) => n.toFixed(decimals)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      el.textContent = format(value)

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const state = { n: 0 }
        el.textContent = format(0)
        gsap.to(state, {
          n: value,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = format(state.n)
          },
        })
        return () => {
          el.textContent = format(value)
        }
      })
    },
    { dependencies: [value, decimals] },
  )

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
