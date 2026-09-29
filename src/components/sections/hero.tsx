'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/lib/gsap'
import { useIntroDone } from '@/lib/intro'
import { scrollToSection } from '@/lib/scroll'
import { ctaClasses } from '@/components/ui/cta'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { TechMarquee } from '@/components/ui/tech-marquee'
import { PROFILE } from '@/data/portfolio'

const FOCUS = PROFILE.focus

export const Hero = () => {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const introDone = useIntroDone()

  // Pointer parallax for the visual (motion values → no re-renders)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const hello = SplitText.create('[data-hello]', { type: 'chars', mask: 'chars', aria: 'none' })
        const role = SplitText.create('[data-role]', { type: 'chars,words', mask: 'chars', aria: 'none' })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.1 } })
        tl.from(hello.chars, { yPercent: 115, stagger: 0.05 })
          .from('[data-dot]', { scale: 0, duration: 0.7, ease: 'back.out(4)' }, '-=0.7')
          .from('[data-rule]', { scaleX: 0, duration: 1.3, ease: 'expo.inOut' }, 0.15)
          .from('[data-name]', { autoAlpha: 0, x: -24 }, 0.75)
          .from(role.chars, { yPercent: 115, stagger: 0.022 }, 0.8)
          .from('[data-sub] > *', { autoAlpha: 0, y: 18, stagger: 0.1 }, 1.1)
          .from('[data-cta] > *', { autoAlpha: 0, y: 22, stagger: 0.1 }, 1.25)
          // Visual
          .from('[data-glow]', { autoAlpha: 0, scale: 0.6, duration: 1.8, ease: 'power2.out' }, 0.2)
          .fromTo('[data-ring]', { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.8, ease: 'expo.inOut' }, 0.3)
          .from('[data-ring-inner]', { autoAlpha: 0, scale: 0.85, duration: 1.4 }, 0.6)
          .from('[data-chev="l"]', { autoAlpha: 0, x: -60 }, 0.9)
          .from('[data-chev="r"]', { autoAlpha: 0, x: 60 }, 1)
          .from('[data-card]', { autoAlpha: 0, y: 60, rotate: -4, duration: 1.3 }, 0.85)
          .from('[data-code-line]', { autoAlpha: 0, x: -10, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 1.35)
          .from('[data-marquee]', { autoAlpha: 0, y: 30, duration: 1 }, 1.2)

        // Ambient loops
        gsap.to('[data-orbit]', { rotate: 360, duration: 16, ease: 'none', repeat: -1, svgOrigin: '250 250' })
        gsap.to('[data-ring-inner]', { rotate: -360, duration: 90, ease: 'none', repeat: -1, svgOrigin: '250 250' })
        gsap.to('[data-chev="l"]', { y: -12, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to('[data-chev="r"]', { y: 12, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.4 })

        // Scroll-out parallax
        gsap.to('[data-copy]', {
          yPercent: -12,
          autoAlpha: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-visual]', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })

        intro.current = tl
        return () => {
          intro.current = null
        }
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (introDone) intro.current?.play()
  }, [introDone])

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      ref={root}
      id="home"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-18"
    >
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-6 lg:py-10">
        {/* Copy */}
        <div data-copy className="relative z-10">
          <h1 aria-label="Hello, I'm Dharmendra Pandit — Software Engineer" className="text-foreground">
            <span className="flex items-end">
              <span data-hello className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl xl:text-[3.5rem]">
                Hello
              </span>
              <span data-dot className="mb-[0.55rem] ml-1.5 inline-block size-3 rounded-full bg-coral sm:mb-3 sm:size-3.5" />
            </span>

            <span className="relative mt-5 block pl-14 sm:mt-6 sm:pl-24">
              <span
                data-rule
                aria-hidden
                className="absolute right-[calc(100%-2.75rem)] top-1/2 h-[2px] w-[100vw] origin-left bg-coral sm:right-[calc(100%-4.75rem)]"
              />
              <span data-name className="block text-2xl font-normal sm:text-4xl">
                I&apos;m Dharmendra
              </span>
            </span>

            <span data-role className="mt-5 block text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:mt-6 sm:text-6xl xl:whitespace-nowrap xl:text-[3.75rem]">
              Software Engineer
            </span>
          </h1>

          <div data-sub className="mt-7 max-w-lg">
            <p className="flex items-center gap-2 text-base font-medium text-foreground sm:text-lg">
              Focused on <RotatingWord words={FOCUS} />
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              I build production software, scalable backend services and machine-learning models — backed by a solid
              foundation in data structures, algorithms and system design.
            </p>
          </div>

          <div data-cta className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('contact')
                }}
                className={ctaClasses('solid')}
              >
                Got a project?
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="/Dharmendra_Pandit_Software_Engineer_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClasses('outline')}
              >
                My resume
                <ArrowUpRight className="group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Visual */}
        <div data-visual className="relative">
          <HeroVisual sx={sx} sy={sy} />
        </div>
      </div>

      <div data-marquee>
        <TechMarquee />
      </div>
    </section>
  )
}

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600)
    return () => clearInterval(id)
  }, [words.length])

  return (
    <span className="relative inline-flex h-[1.5em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="block whitespace-nowrap font-semibold text-coral-ink"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

type Spring = ReturnType<typeof useSpring>

function HeroVisual({ sx, sy }: { sx: Spring; sy: Spring }) {
  const chevLx = useTransform(sx, (v) => v * -36)
  const chevLy = useTransform(sy, (v) => v * -28)
  const chevRx = useTransform(sx, (v) => v * 36)
  const chevRy = useTransform(sy, (v) => v * 28)
  const ringX = useTransform(sx, (v) => v * 14)
  const ringY = useTransform(sy, (v) => v * 14)
  const tiltX = useTransform(sy, (v) => v * -10)
  const tiltY = useTransform(sx, (v) => v * 12)

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(520px,88vw)] [perspective:1200px]">
      <div
        data-glow
        aria-hidden
        className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(255,113,91,0.30)_0%,rgba(255,113,91,0.08)_45%,transparent_70%)] blur-2xl"
      />

      <motion.svg
        style={{ x: ringX, y: ringY }}
        viewBox="0 0 500 500"
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <linearGradient id="hero-ring" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#ff715b" />
            <stop offset="55%" stopColor="#ff715b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff715b" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <circle
          data-ring-inner
          cx="250"
          cy="250"
          r="166"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 12"
          strokeLinecap="round"
          className="text-frame"
        />
        <circle
          data-ring
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="url(#hero-ring)"
          strokeWidth="18"
          transform="rotate(-100 250 250)"
        />
        <g data-orbit>
          <circle cx="250" cy="50" r="7" fill="#ff715b" />
          <circle cx="250" cy="50" r="14" fill="#ff715b" opacity="0.18" />
        </g>
      </motion.svg>

      <motion.div style={{ x: chevLx, y: chevLy }} className="absolute left-[-2%] top-[10%] w-[15%]" aria-hidden>
        <Chevron dir="l" />
      </motion.div>
      <motion.div style={{ x: chevRx, y: chevRy }} className="absolute bottom-[8%] right-[-3%] w-[15%]" aria-hidden>
        <Chevron dir="r" />
      </motion.div>

      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className="absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] sm:w-[80%]"
      >
        <CodeCard />
      </motion.div>
    </div>
  )
}

function Chevron({ dir }: { dir: 'l' | 'r' }) {
  return (
    <svg data-chev={dir} viewBox="0 0 80 100" className="w-full overflow-visible">
      <polygon
        points={dir === 'l' ? '68,2 80,16 26,50 80,84 68,98 2,50' : '12,2 0,16 54,50 0,84 12,98 78,50'}
        fill="none"
        stroke="#ff715b"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const k = 'text-[#ff8a76]'
const p = 'text-[#e6edf3]'
const s = 'text-[#f5c38a]'
const b = 'text-[#8cc8ff]'
const m = 'text-[#6b7d8a]'

function CodeCard() {
  const lines: React.ReactNode[] = [
    <>
      <span className={k}>const</span> <span className={p}>dharmendra</span> <span className={m}>=</span>{' '}
      <span className={m}>{'{'}</span>
    </>,
    <>
      {'  '}
      <span className={p}>role</span>
      <span className={m}>:</span> <span className={s}>&apos;Software Engineer&apos;</span>
      <span className={m}>,</span>
    </>,
    <>
      {'  '}
      <span className={p}>focus</span>
      <span className={m}>: [</span>
      <span className={s}>&apos;AI/ML&apos;</span>
      <span className={m}>, </span>
      <span className={s}>&apos;Backend&apos;</span>
      <span className={m}>, </span>
      <span className={s}>&apos;DevOps&apos;</span>
      <span className={m}>],</span>
    </>,
    <>
      {'  '}
      <span className={p}>stack</span>
      <span className={m}>: [</span>
      <span className={s}>&apos;Python&apos;</span>
      <span className={m}>, </span>
      <span className={s}>&apos;TypeScript&apos;</span>
      <span className={m}>],</span>
    </>,
    <>
      {'  '}
      <span className={p}>based</span>
      <span className={m}>:</span> <span className={s}>&apos;Jaipur, IN&apos;</span>
      <span className={m}>,</span>
    </>,
    <>
      {'  '}
      <span className={p}>openToWork</span>
      <span className={m}>:</span> <span className={b}>true</span>
      <span className={m}>,</span>
    </>,
    <>
      <span className={m}>{'}'}</span>
      <span className="animate-caret ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-coral" />
    </>,
  ]

  return (
    <div
      data-card
      className="overflow-hidden rounded-lg border border-[#273744] bg-[#0e1a21]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,113,91,0.06)] backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-[#273744] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff715b]" />
        <span className="size-2.5 rounded-full bg-[#f5c38a]/80" />
        <span className="size-2.5 rounded-full bg-[#6b7d8a]/60" />
        <span className="ml-3 font-mono text-[11px] text-[#8d9ba7]">dharmendra.ts</span>
      </div>
      <pre className="overflow-hidden px-3.5 py-4 font-mono text-[10px] leading-[1.9] min-[400px]:text-[11px] sm:px-5 sm:text-[13px]">
        <code>
          {lines.map((line, i) => (
            <span key={i} data-code-line className="block">
              <span className="mr-4 hidden w-3 select-none text-right text-[#3d4e5a] sm:inline-block">{i + 1}</span>
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
