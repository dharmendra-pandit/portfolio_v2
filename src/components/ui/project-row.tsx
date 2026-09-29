'use client'

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap'
import { ctaClasses } from '@/components/ui/cta'
import { cn } from '@/lib/utils'

export type TerminalLine =
  | { kind: 'cmd' | 'out' | 'ok' | 'meta'; text: string }
  | { kind: 'langs'; langs: { name: string; color: string }[] }

export interface ProjectRowData {
  id: string
  title: string
  description: string
  tags: string[]
  meta?: string
  primary: { label: string; href: string; icon?: React.ReactNode }
  secondary?: { label: string; href: string }
  terminal: { title: string; lines: TerminalLine[] }
}

export const ProjectRow = ({ project, index }: { project: ProjectRowData; index: number }) => {
  const root = useRef<HTMLElement>(null)
  const flip = index % 2 === 1

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
          defaults: { ease: 'expo.out', duration: 1 },
        })
        tl.from('[data-copy] > *', { autoAlpha: 0, y: 28, stagger: 0.08 })
          .fromTo(
            '[data-window]',
            { clipPath: flip ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0%)', duration: 1.3, ease: 'expo.inOut' },
            0,
          )
          .from('[data-frame]', { autoAlpha: 0, x: flip ? -24 : 24, y: 24, duration: 1.2 }, 0.35)
          .from('[data-line]', { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.09, ease: 'power2.out' }, 0.8)

        // Frame drifts against the window while scrolling for depth.
        gsap.fromTo(
          '[data-frame-drift]',
          { y: 18 },
          {
            y: -18,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <article
      ref={root}
      className="group grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
      aria-labelledby={`project-${project.id}`}
    >
      {/* Copy */}
      <div data-copy className={cn(flip && 'lg:order-2')}>
        <p className="font-mono text-sm text-coral-ink">{String(index + 1).padStart(2, '0')}</p>
        <h3
          id={`project-${project.id}`}
          className="mt-3 text-2xl font-semibold capitalize tracking-tight text-foreground sm:text-3xl"
        >
          {project.title}
        </h3>
        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-pill px-4 py-1.5 text-[13px] font-medium text-foreground/85">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 line-clamp-4 max-w-xl text-base leading-[1.85] text-muted-foreground">{project.description}</p>
        {project.meta && <p className="mt-4 font-mono text-xs text-muted-foreground/80">{project.meta}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={project.primary.href} target="_blank" rel="noopener noreferrer" className={ctaClasses('solid')}>
            {project.primary.icon}
            {project.primary.label}
          </a>
          {project.secondary && (
            <a href={project.secondary.href} target="_blank" rel="noopener noreferrer" className={ctaClasses('link')}>
              {project.secondary.label}
              <ArrowUpRight />
            </a>
          )}
        </div>
      </div>

      {/* Preview — window with a same-size frame offset up and outward, as in the reference */}
      <div className={cn('relative pt-5', flip ? 'pl-5 lg:order-1' : 'pr-5')} aria-hidden>
        <div className="relative">
          <div data-frame-drift className="absolute inset-0">
            <div
              data-frame
              className={cn(
                'absolute inset-0 border-2 border-frame transition-[translate] duration-700 ease-[var(--ease-out-expo)]',
                flip
                  ? '-translate-x-5 -translate-y-5 group-hover:-translate-x-7 group-hover:-translate-y-7'
                  : 'translate-x-5 -translate-y-5 group-hover:translate-x-7 group-hover:-translate-y-7',
              )}
            />
          </div>
          <div className="relative transition-[translate] duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
            <Terminal data={project.terminal} />
          </div>
        </div>
      </div>
    </article>
  )
}

function Terminal({ data }: { data: ProjectRowData['terminal'] }) {
  return (
    <div
      data-window
      className="overflow-hidden rounded-md border border-[#273744] bg-[#0e1a21] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center gap-2 border-b border-[#273744] bg-[#121f28] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff715b]" />
        <span className="size-2.5 rounded-full bg-[#f5c38a]/80" />
        <span className="size-2.5 rounded-full bg-[#6b7d8a]/60" />
        <span className="ml-3 truncate font-mono text-[11px] text-[#8d9ba7]">{data.title}</span>
      </div>
      <div className="min-h-[15rem] space-y-1.5 px-5 py-5 font-mono text-[12px] leading-relaxed sm:min-h-[17rem] sm:text-[13px]">
        {data.lines.map((line, i) => (
          <TerminalRow key={i} line={line} />
        ))}
        <p data-line className="text-[#e6edf3]">
          <span className="mr-2 text-[#ff715b]">$</span>
          <span className="animate-caret inline-block h-[1.05em] w-[7px] translate-y-[3px] bg-[#ff715b]" />
        </p>
      </div>
    </div>
  )
}

function TerminalRow({ line }: { line: TerminalLine }) {
  if (line.kind === 'langs') {
    return (
      <div data-line className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[#8d9ba7]">
        {line.langs.map((l) => (
          <span key={l.name} className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: l.color || '#8d9ba7' }} />
            {l.name}
          </span>
        ))}
      </div>
    )
  }

  const styles = {
    cmd: 'text-[#e6edf3]',
    out: 'text-[#8d9ba7]',
    ok: 'text-[#8bd5a8]',
    meta: 'text-[#f5c38a]',
  } as const

  return (
    <p data-line className={cn('whitespace-pre-wrap [overflow-wrap:anywhere]', styles[line.kind])}>
      {line.kind === 'cmd' && <span className="mr-2 text-[#ff715b]">$</span>}
      {line.kind === 'ok' && <span className="mr-2">✓</span>}
      {line.text}
    </p>
  )
}

export const ProjectRowSkeleton = ({ flip }: { flip?: boolean }) => (
  <div className="grid animate-pulse items-center gap-12 lg:grid-cols-2 lg:gap-20" aria-hidden>
    <div className={cn('space-y-5', flip && 'lg:order-2')}>
      <div className="h-4 w-8 rounded bg-pill" />
      <div className="h-8 w-2/3 rounded bg-pill" />
      <div className="flex gap-2.5">
        <div className="h-8 w-20 rounded-full bg-pill" />
        <div className="h-8 w-16 rounded-full bg-pill" />
        <div className="h-8 w-24 rounded-full bg-pill" />
      </div>
      <div className="h-20 w-full rounded bg-pill" />
      <div className="h-12 w-36 rounded bg-pill" />
    </div>
    <div className={cn('h-72 rounded-md bg-pill', flip && 'lg:order-1')} />
  </div>
)
