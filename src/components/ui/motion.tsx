'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useReducedMotion, type HTMLMotionProps, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

/** House easing: fast out, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const

/** Shared in-view trigger: play once, when a fifth of the element is visible. */
export const VIEWPORT = { once: true, amount: 0.2 } as const

/** Parent that staggers its `rise` children into view. */
export const stagger = (step = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})

/** Child that rises out of a soft blur. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
}

/** Child that slides in from the left (timeline entries, table rows). */
export const slide: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
}

/** Child that pops in (chips, tags). */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/** A block that rises into view on scroll. */
export function Reveal({
  delay = 0,
  className,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: rise.hidden,
        show: { ...(rise.show as object), transition: { duration: 0.8, ease: EASE, delay } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Words that rise out of a mask, one after another. Use inside a heading:
 * the text stays readable to assistive tech because it is still plain words.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  step = 0.07,
  onLoad = false,
}: {
  text: string
  className?: string
  delay?: number
  step?: number
  /** Play on page load instead of on scroll. */
  onLoad?: boolean
}) {
  const trigger = onLoad
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, amount: 0.6 } }
  return (
    <motion.span initial="hidden" {...trigger} variants={stagger(step, delay)} className={cn('inline', className)}>
      {text.split(' ').map((word, i, all) => (
        <span key={`${word}-${i}`}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: '110%' },
                show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < all.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  )
}

/**
 * Counts up to `value` the first time it scrolls into view, and glides to the
 * new figure when `value` changes. Renders the final value for SSR and reduced motion.
 */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduce = useReducedMotion()
  const shown = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const format = (n: number) => n.toFixed(decimals)
    if (!inView) {
      // Park at zero until it is seen, so the count plays from the start.
      el.textContent = format(0)
      shown.current = 0
      return
    }
    const controls = animate(shown.current, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (n) => {
        shown.current = n
        el.textContent = format(n)
      },
    })
    return () => controls.stop()
  }, [inView, value, decimals, reduce])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {value.toFixed(decimals)}
    </span>
  )
}

/** Pointer handler for `.spotlight` cards: feeds the cursor position to the CSS glow. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
