'use client'

import { useSyncExternalStore } from 'react'

// Tiny store that flips once the intro loader has finished, so the hero
// timeline can start exactly as the curtain lifts.
let done = false
const listeners = new Set<() => void>()

export function markIntroDone() {
  if (done) return
  done = true
  ;[...listeners].forEach((l) => l())
}

/** Run a callback once the intro finishes (immediately if it already has). */
export function onIntroDone(cb: () => void) {
  if (done) {
    cb()
    return () => {}
  }
  const once = () => {
    listeners.delete(once)
    cb()
  }
  listeners.add(once)
  return () => listeners.delete(once)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  )
}
