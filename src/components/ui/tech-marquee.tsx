'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap'
import { cn } from '@/lib/utils'

const STACK = [
  'Python',
  'TypeScript',
  'Next.js',
  'Node.js',
  'FastAPI',
  'LangChain',
  'PyTorch',
  'Docker',
  'Kubernetes',
  'AWS',
  'PostgreSQL',
  'MongoDB',
  'Git',
  'GitHub Actions',
]

/**
 * Infinite tech strip. Drifts left on its own, speeds up and flips with the
 * scroll direction, and eases to a stop on hover.
 */
export const TechMarquee = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const el = root.current!
        const setX = gsap.quickSetter(el.querySelector('[data-track]'), 'xPercent')
        const wrap = gsap.utils.wrap(-50, 0)
        const BASE = 50 / 40 // xPercent per second → one full copy every 40s
        const drift = { speed: 1 }
        let pos = 0
        let direction = 1
        let hovering = false

        const tick = (_time: number, deltaMs: number) => {
          pos -= BASE * drift.speed * (deltaMs / 1000)
          setX(wrap(pos))
        }
        gsap.ticker.add(tick)

        const st = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            direction = self.direction
            if (hovering) return
            const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 220)
            gsap.to(drift, {
              speed: boost * direction,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(drift, { speed: direction, duration: 1.4, ease: 'power2.out' })
              },
            })
          },
        })

        const pause = () => {
          hovering = true
          gsap.to(drift, { speed: 0, duration: 0.6, overwrite: true })
        }
        const resume = () => {
          hovering = false
          gsap.to(drift, { speed: direction, duration: 0.8, overwrite: true })
        }
        el.addEventListener('pointerenter', pause)
        el.addEventListener('pointerleave', resume)

        return () => {
          gsap.ticker.remove(tick)
          st.kill()
          el.removeEventListener('pointerenter', pause)
          el.removeEventListener('pointerleave', resume)
        }
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className={cn(
        'relative w-full overflow-hidden border-y border-border/60 bg-surface py-6 sm:py-7',
        '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      <p className="sr-only">Tech stack: {STACK.join(', ')}</p>
      <div data-track aria-hidden className="flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {STACK.map((tech) => (
              <li
                key={`${copy}-${tech}`}
                className="flex items-center gap-10 pr-10 text-xl font-medium text-muted-foreground/45 transition-colors duration-300 hover:text-coral-ink sm:gap-14 sm:pr-14 sm:text-2xl"
              >
                {tech}
                <span className="size-1.5 rounded-full bg-coral/60" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
