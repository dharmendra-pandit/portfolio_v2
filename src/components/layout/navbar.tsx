'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Moon, Sun, ArrowUpRight } from 'lucide-react'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { scrollToSection, getLenis } from '@/lib/scroll'
import { useIntroDone } from '@/lib/intro'
import { useMounted } from '@/lib/use-mounted'

const NAV = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Activity', id: 'dashboard' },
  { label: 'Projects', id: 'projects' },
  { label: 'Journey', id: 'experience' },
  { label: 'Contact', id: 'contact' },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/dharmendra-pandit', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/dharmendra-pandit1', icon: FaLinkedin },
  { label: 'X (Twitter)', href: 'https://x.com/Dharmendra62042', icon: FaXTwitter },
]

const RESUME = '/Dharmendra_Pandit_Software_Engineer_Resume.pdf'

export const Navbar = () => {
  const introDone = useIntroDone()
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const [active, setActive] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { scrollY } = useScroll()

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

  // Server and first client render don't know the stored theme; stay on the default until mounted.
  const isDark = !mounted || resolvedTheme !== 'light'

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
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <>
      <motion.header
        initial={{ y: '-100%' }}
        animate={{ y: introDone && !hidden ? '0%' : '-100%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled || menuOpen
            ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            className="group relative z-10 text-lg font-bold tracking-tight text-foreground"
          >
            Dharmendra Pandit
            <span className="text-coral transition-opacity duration-300 group-hover:opacity-100">.</span>
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
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
                      'relative block px-3.5 py-2 text-sm font-medium transition-colors duration-300',
                      active === item.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-coral"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <span className="mx-3 h-5 w-px bg-border" aria-hidden />

            <a
              href={RESUME}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-9 items-center gap-1.5 rounded-[3px] border border-coral px-4 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-coral hover:text-[#121f28]"
            >
              Resume
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <ThemeButton mounted={mounted} isDark={isDark} onClick={toggleTheme} />
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
              className="relative z-10 flex size-11 flex-col items-end justify-center gap-[5px] pr-2"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7, width: 22 } : { rotate: 0, y: 0, width: 22 }}
                className="block h-[2px] bg-foreground"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                className="block h-[2px] w-4 bg-coral"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7, width: 22 } : { rotate: 0, y: 0, width: 12 }}
                className="block h-[2px] bg-foreground"
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
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-10 pt-28 lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } }, hidden: {} }}
              className="flex flex-col gap-1"
            >
              {NAV.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    variants={{
                      hidden: { y: '110%' },
                      show: { y: '0%', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    className="flex items-baseline gap-4 py-2 text-4xl font-bold tracking-tight text-foreground"
                  >
                    <span className="font-mono text-sm font-medium text-coral-ink">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="mt-auto flex flex-col gap-6"
            >
              <a
                href={RESUME}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[3px] bg-coral text-sm font-semibold text-[#121f28]"
              >
                Download resume <ArrowUpRight className="size-4" />
              </a>
              <div className="flex items-center justify-between">
                <a href="mailto:dharmendra193728@gmail.com" className="text-sm text-muted-foreground">
                  dharmendra193728@gmail.com
                </a>
                <div className="flex gap-1">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-coral-ink"
                    >
                      <Icon className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
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
}: {
  mounted: boolean
  isDark: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative z-10 flex size-11 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-colors duration-300 hover:text-coral-ink"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ y: 18, rotate: -45, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -18, rotate: 45, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  )
}
