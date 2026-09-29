'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  eyebrow?: string
  description?: string
  /** `center`: title with a coral drop-line and dot. `left`: eyebrow with a coral rule from the page edge. */
  align?: 'center' | 'left'
  className?: string
}

export const SectionHeading = ({ title, eyebrow, description, align = 'center', className }: SectionHeadingProps) => {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('[data-title]', {
          type: 'words',
          mask: 'words',
          wordsClass: 'split-word',
        })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
        })

        tl.from(split.words, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.07 })
          .from('[data-rule]', { scaleX: 0, duration: 1, ease: 'expo.inOut' }, 0)
          .from('[data-eyebrow]', { autoAlpha: 0, x: -12, duration: 0.7 }, 0.25)
          .from('[data-drop]', { scaleY: 0, duration: 0.7, ease: 'power3.inOut' }, 0.35)
          .from('[data-dot]', { scale: 0, duration: 0.5, ease: 'back.out(3)' }, '>-0.1')
          .from('[data-desc]', { autoAlpha: 0, y: 14, duration: 0.8 }, 0.45)
      })
    },
    { scope: root },
  )

  if (align === 'left') {
    return (
      <div ref={root} className={cn('relative', className)}>
        {eyebrow && (
          <div className="relative mb-5 flex items-center">
            <span
              data-rule
              aria-hidden
              className="absolute right-full mr-4 h-[2px] w-[100vw] origin-left bg-coral"
            />
            <p data-eyebrow className="text-lg font-medium text-foreground">
              {eyebrow}
            </p>
          </div>
        )}
        <h2 data-title className="text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description && (
          <p data-desc className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
    )
  }

  return (
    <div ref={root} className={cn('flex flex-col items-center text-center', className)}>
      {eyebrow && (
        <p data-eyebrow className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-coral-ink">
          {eyebrow}
        </p>
      )}
      <h2 data-title className="text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <span data-drop aria-hidden className="mt-7 h-12 w-[2px] origin-top bg-coral sm:h-14" />
      <span data-dot aria-hidden className="mt-1 size-2 rounded-full bg-coral" />
      {description && (
        <p data-desc className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
