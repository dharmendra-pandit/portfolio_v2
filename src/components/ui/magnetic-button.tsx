'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  intensity?: number
}

/** Pulls its child toward the pointer. Motion values only — no React re-renders per frame. */
export function MagneticButton({ children, className, intensity = 0.25, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.2 })

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    x.set((e.clientX - (left + width / 2)) * intensity)
    y.set((e.clientY - (top + height / 2)) * intensity)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn('relative inline-flex', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
