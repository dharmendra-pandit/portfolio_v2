'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { markIntroDone } from '@/lib/intro'

export const SmoothLoader = () => {
  const root = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useGSAP(
    () => {
      const finish = () => {
        markIntroDone()
        setHidden(true)
      }

      // Opened in a background tab: nobody is watching the curtain, so skip it and
      // let the hero intro play the moment the tab becomes visible.
      if (document.visibilityState === 'hidden') {
        finish()
        return
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish })
        return
      }

      const counter = { value: 0 }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from('[data-loader-word] > span', { yPercent: 110, duration: 0.9, stagger: 0.06 })
        .from('[data-loader-dot]', { scale: 0, duration: 0.6, ease: 'back.out(3)' }, '-=0.45')
        .to(
          counter,
          {
            value: 100,
            duration: 1.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              const el = root.current?.querySelector('[data-loader-count]')
              if (el) el.textContent = String(Math.round(counter.value)).padStart(3, '0')
            },
          },
          0.1,
        )
        .fromTo('[data-loader-bar]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.1)
        .to('[data-loader-word] > span, [data-loader-dot]', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.03 }, '+=0.1')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.25')
        .call(markIntroDone, [], '-=0.45')
        .call(finish)
    },
    { scope: root },
  )

  if (hidden) return null

  return (
    <div
      ref={root}
      aria-hidden
      className="loader-failsafe fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="flex items-end overflow-hidden">
        <p data-loader-word className="flex overflow-hidden text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
          {'Hello'.split('').map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </p>
        <span data-loader-dot className="mb-2 sm:mb-3 ml-1.5 inline-block size-3 sm:size-4 rounded-full bg-coral" />
      </div>

      <span
        data-loader-count
        className="absolute bottom-8 right-6 sm:right-10 font-mono text-sm tabular-nums text-muted-foreground"
      >
        000
      </span>
      <span data-loader-bar className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-coral" />
    </div>
  )
}
