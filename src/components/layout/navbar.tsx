'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { scrollToSection, getLenis } from '@/lib/scroll'
import { useMounted } from '@/lib/use-mounted'
import { PROFILE } from '@/data/portfolio'

const NAV = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Activity', id: 'dashboard' },
  { label: 'Contact', id: 'contact' },
]

const SOCIALS = [
  { label: 'LinkedIn', href: PROFILE.links.linkedin },
  { label: 'GitHub', href: PROFILE.links.github },
  { label: 'X', href: PROFILE.links.x },
]

export const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const [active, setActive] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.2 })

  // Hide while scrolling down, reveal on the way up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > prev && y > 320 && !menuOpen)
  })

  // Track the section in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = entry.target.id
          setActive(NAV.some((n) => n.id === id) ? id : null)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Mobile menu: freeze page scroll, move focus inside, keep Tab within the
  // menu + header controls, and close on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('header nav a, header nav button, #mobile-menu a, #mobile-menu button'),
      ).filter((el) => el.offsetParent !== null)

    const focusTimer = setTimeout(() => {
      document.querySelector<HTMLElement>('#mobile-menu a')?.focus({ preventScroll: true })
    }, 80)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(focusTimer)
      lenis?.start()
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    // Let the menu start closing before the page glides away.
    requestAnimationFrame(() => scrollToSection(id))
  }

  // Server and first client render don't know the stored theme; stay neutral until mounted.
  const isDark = mounted && resolvedTheme === 'dark'

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      setTheme(next)
      return
    }

    const x = e.clientX || window.innerWidth - 40
    const y = e.clientY || 32
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => {
      const root = document.documentElement
      root.classList.toggle('dark', next === 'dark')
      root.classList.toggle('light', next === 'light')
      root.style.colorScheme = next
      flushSync(() => setTheme(next))
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand via-brass to-brass"
      />
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300',
          scrolled || menuOpen
            ? 'border-b border-border bg-background/90 backdrop-blur-md'
            : 'border-b border-transparent bg-background',
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            aria-label={`${PROFILE.name}, back to top`}
            className="group relative z-10 flex items-center"
          >
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-md bg-cta font-serif text-base font-medium text-cta-foreground transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6"
            >
              D
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={cn(
                      'relative block px-3 py-2 text-sm transition-colors duration-200',
                      active === item.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 bottom-0.5 h-[2px] rounded-full bg-brass"
                        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <span className="mx-4 h-5 w-px bg-border" aria-hidden />

            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-md bg-cta px-4 text-sm font-medium text-cta-foreground transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_var(--glow)] active:scale-[0.97]"
            >
              Résumé
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>

            <ThemeButton mounted={mounted} isDark={isDark} onClick={toggleTheme} className="ml-2" />
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeButton mounted={mounted} isDark={isDark} onClick={toggleTheme} />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="relative z-10 flex size-11 flex-col items-center justify-center gap-[5px]"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-5 bg-foreground"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[1.5px] w-5 bg-foreground"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-5 bg-foreground"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-10 pt-24 lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
              className="flex flex-col border-t border-border"
            >
              {NAV.map((item) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="border-b border-border"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={cn(
                      'block py-4 font-serif text-2xl transition-colors',
                      active === item.id ? 'text-brass' : 'text-foreground',
                    )}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-auto flex flex-col gap-6">
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-cta text-sm font-medium text-cta-foreground"
              >
                Download résumé
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <a href={`mailto:${PROFILE.email}`} className="text-muted-foreground">
                  {PROFILE.email}
                </a>
                <div className="flex gap-5">
                  {SOCIALS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 font-medium text-foreground"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ThemeButton({
  mounted,
  isDark,
  onClick,
  className,
}: {
  mounted: boolean
  isDark: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative z-10 flex size-11 items-center justify-center overflow-hidden rounded-md text-muted-foreground transition-colors duration-200 hover:bg-pill/60 hover:text-brass',
        className,
      )}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ y: 14, rotate: -60, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -14, rotate: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  )
}
