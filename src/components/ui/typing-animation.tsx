'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TypingAnimationProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export const TypingAnimation = ({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
}: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0
    let timeout: NodeJS.Timeout

    const startTyping = () => {
      timeout = setInterval(() => {
        setDisplayedText(text.slice(0, i))
        i++
        if (i > text.length) {
          clearInterval(timeout)
        }
      }, duration * 1000)
    }

    const initialDelay = setTimeout(startTyping, delay * 1000)

    return () => {
      clearInterval(timeout)
      clearTimeout(initialDelay)
    }
  }, [text, delay, duration])

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  )
}
