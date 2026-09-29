'use client'

import { useRef } from 'react'
import { ServerCog, BrainCircuit, CloudCog } from 'lucide-react'
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap'
import { SectionHeading } from '@/components/ui/section-heading'
import { Counter } from '@/components/ui/counter'
import { ABOUT, SERVICES as SERVICE_DATA } from '@/data/portfolio'

const ICONS: Record<(typeof SERVICE_DATA)[number]['id'], typeof ServerCog> = {
  backend: ServerCog,
  genai: BrainCircuit,
  devops: CloudCog,
}

const SERVICES = SERVICE_DATA.map((s) => ({ ...s, icon: ICONS[s.id] }))

export interface AboutStats {
  problemsSolved: number
  publicRepos: number
  cgpa: number
}

export const About = ({ stats }: { stats: AboutStats }) => {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '[data-services]', start: 'top 78%', once: true },
        })
        tl.from('[data-seg]', { scaleY: 0, duration: 0.7, ease: 'power3.inOut', stagger: 0.28 })
          .from('[data-seg-dot]', { scale: 0, duration: 0.45, ease: 'back.out(3)', stagger: 0.28 }, 0.55)
          .from('[data-service]', { autoAlpha: 0, x: -24, duration: 0.9, ease: 'expo.out', stagger: 0.18 }, 0.15)

        gsap.from('[data-about-copy] > p, [data-stat]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-about-copy]', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* What I do */}
        <ol data-services aria-label="What I do" className="relative self-center">
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="group relative py-7 pl-10 sm:pl-12">
              <span data-seg aria-hidden className="absolute bottom-3 left-0 top-3 w-[2px] origin-top bg-coral" />
              {i < SERVICES.length - 1 && (
                <span
                  data-seg-dot
                  aria-hidden
                  className="absolute -bottom-[5px] -left-1 z-10 size-2.5 rounded-full bg-coral"
                />
              )}
              <div
                data-service
                className="flex items-start gap-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 sm:gap-7"
              >
                <Icon
                  aria-hidden
                  strokeWidth={1.25}
                  className="size-10 shrink-0 text-foreground transition-colors duration-300 group-hover:text-coral-ink sm:size-12"
                />
                <div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* About me */}
        <div>
          <SectionHeading align="left" title="About me" />

          <div data-about-copy className="mt-8 space-y-5 text-base leading-[1.9] text-muted-foreground sm:text-[17px]">
            {ABOUT.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-10">
            <Stat value={stats.problemsSolved} suffix="+" label="DSA problems solved" />
            <Stat value={stats.publicRepos} suffix="+" label="Public repositories" />
            <Stat value={stats.cgpa} decimals={2} suffix="/10" label="University CGPA" />
          </dl>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  return (
    <div data-stat className="flex flex-col-reverse justify-end gap-2">
      <dt className="max-w-[9rem] text-sm leading-snug text-muted-foreground sm:text-base">{label}</dt>
      <dd className="flex items-baseline text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
        <Counter value={value} decimals={decimals} />
        <span className="ml-1 text-coral-ink">{suffix}</span>
      </dd>
    </div>
  )
}
