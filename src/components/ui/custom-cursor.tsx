'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .cursor-pointer'

/**
 * A lagging ring that trails the native cursor and swells over interactive
 * elements. Mouse/trackpad only; skipped entirely for touch and reduced motion.
 */
export const CustomCursor = () => {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !fine || reduce) return

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    let visible = false
    let hovering = false
    const scaleFor = (pressed = false) => (hovering ? 1.8 : 1) * (pressed ? 0.8 : 1)

    const move = (e: PointerEvent) => {
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
        visible = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const hit = Boolean((e.target as Element | null)?.closest?.(INTERACTIVE))
      if (hit === hovering) return
      hovering = hit
      gsap.to(el, {
        scale: scaleFor(),
        backgroundColor: hit ? 'rgba(255,113,91,0.12)' : 'rgba(255,113,91,0)',
        borderColor: hit ? 'rgba(255,113,91,0.9)' : 'rgba(255,113,91,0.55)',
        duration: 0.35,
        ease: 'power3.out',
      })
    }

    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 })
      visible = false
    }

    const down = () => gsap.to(el, { scale: scaleFor(true), duration: 0.15 })
    const up = () => gsap.to(el, { scale: scaleFor(), duration: 0.25 })

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [])

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-9 rounded-full border-[1.5px] border-coral/55 opacity-0 md:block"
    />
  )
}
