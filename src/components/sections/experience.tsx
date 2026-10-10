'use client'

import { useRef } from 'react'
import { BriefcaseBusiness, CodeXml, GraduationCap, Sparkles, Bot, Cloud } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap'
import { SectionHeading } from '@/components/ui/section-heading'
import { TIMELINE as ENTRIES } from '@/data/portfolio'

const ICONS: Record<(typeof ENTRIES)[number]['id'], typeof Cloud> = {
  brandthink: BriefcaseBusiness,
  hostro: CodeXml,
  btech: GraduationCap,
  'ai-apps': Sparkles,
  genai: Bot,
  cloud: Cloud,
}

const TIMELINE = ENTRIES.map((e) => ({ ...e, icon: ICONS[e.id] }))

export const Experience = () => {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-progress]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-timeline]', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
          },
        )

        gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((entry) => {
          const node = entry.querySelector('[data-node]')
          gsap.from(entry.querySelectorAll('[data-reveal]'), {
            autoAlpha: 0,
            y: 26,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: entry, start: 'top 80%', once: true },
          })
          ScrollTrigger.create({
            trigger: entry,
            start: 'top 60%',
            toggleClass: { targets: node!, className: 'is-active' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experience" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience & education"
          title="My Journey"
          description="Where I've worked, where I study, and the things I've built and learned along the way."
        />

        <div data-timeline className="relative mx-auto mt-20 max-w-4xl">
          <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-frame md:left-[13.5rem]" />
          <span
            data-progress
            aria-hidden
            className="absolute bottom-2 left-[5px] top-2 w-[2px] origin-top bg-coral md:left-[13.5rem]"
          />

          <ol className="space-y-16">
            {TIMELINE.map(({ date, title, org, description, icon: Icon }) => (
              <li
                key={title}
                data-entry
                className="group relative grid gap-3 pl-10 md:grid-cols-[12rem_1fr] md:gap-12 md:pl-0"
              >
                <span
                  data-node
                  aria-hidden
                  className="absolute left-0 top-1.5 z-10 size-3 rounded-full border-2 border-coral bg-background transition-[background-color,scale] duration-300 ease-[var(--ease-out-expo)] md:left-[calc(13.5rem-5px)] [&.is-active]:scale-125 [&.is-active]:bg-coral"
                />
                <p data-reveal className="font-mono text-sm text-coral-ink md:pt-0.5 md:text-right">
                  {date}
                </p>
                <div>
                  <div data-reveal className="flex items-start gap-3">
                    <Icon
                      aria-hidden
                      strokeWidth={1.5}
                      className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-coral-ink"
                    />
                    <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3>
                  </div>
                  <p data-reveal className="mt-1.5 pl-8 text-sm font-medium text-muted-foreground">
                    {org}
                  </p>
                  <p data-reveal className="mt-4 max-w-xl pl-8 leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
