'use client'

import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

/** Smoothly scroll to a section id (or the top), via Lenis when it is running. */
export function scrollToSection(target: string) {
  const id = target.replace(/^#/, '')

  if (!id || id === 'home' || id === 'top') {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const el = document.getElementById(id)
  if (!el) return

  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
