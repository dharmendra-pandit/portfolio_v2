'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Code2, Briefcase, Mail, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', icon: Home, href: '#home' },
  { name: 'About', icon: User, href: '#about' },
  { name: 'Skills', icon: Code2, href: '#skills' },
  { name: 'Projects', icon: Briefcase, href: '#projects' },
  { name: 'Contact', icon: Mail, href: '#contact' },
]

export const Navbar = () => {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState('Home')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id')
            if (id) {
              const activeItem = navItems.find((item) => item.href === `#${id}`)
              if (activeItem) {
                setActive(activeItem.name)
              }
            } else if (entry.target.tagName.toLowerCase() === 'section' && !entry.target.hasAttribute('id')) {
              // Assuming top section is home
              setActive('Home')
            }
          }
        })
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is half way
      }
    )

    const sections = document.querySelectorAll('section')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const handleScroll = (href: string, name: string) => {
    setActive(name)
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-xl border border-border shadow-[0_0_20px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleScroll(item.href, item.name)}
            className={cn(
              "relative p-3 rounded-full flex items-center justify-center transition-colors hover:text-primary group",
              active === item.name ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={item.name}
          >
            {active === item.name && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-foreground/10 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className="w-5 h-5 relative z-10" />
            
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur-md border border-border rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.name}
            </span>
          </button>
        ))}

        <div className="w-[1px] h-8 bg-border mx-2" />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative p-3 rounded-full text-muted-foreground hover:text-primary transition-colors group"
          aria-label="Toggle Theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur-md border border-border rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Toggle Theme
          </span>
        </button>
      </div>
    </motion.div>
  )
}
