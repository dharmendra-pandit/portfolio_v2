'use client'

import { useEffect, useState } from 'react'

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-10]">
      {/* Universal Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Blobs using CSS for hardware acceleration */}
      <div
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-foreground/5 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob-slow"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-foreground/5 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob-medium"
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-foreground/5 rounded-full mix-blend-screen filter blur-[90px] opacity-20 animate-blob-fast"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background/90" />
    </div>
  )
}
