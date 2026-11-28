'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Section, SubHeading } from '@/components/ui/section-heading'
import { EASE, VIEWPORT, pop, slide, stagger, trackSpotlight } from '@/components/ui/motion'
import { EDUCATION, EXPERIENCE, formatDuration, formatRange } from '@/data/portfolio'
import { useMounted } from '@/lib/use-mounted'

type Entry = {
  id: string
  start: string
  end: string | null
  title: string
  org: string
  monogram: string
  type: string
  mode: string | null
  place: string
  description: string
  skills: readonly string[]
}

export const Experience = () => (
  <Section id="experience" title="Experience">
    <SubHeading>Employment</SubHeading>
    <Timeline entries={EXPERIENCE} showDuration />

    <SubHeading className="mt-20">Education</SubHeading>
    <Timeline entries={EDUCATION} />
  </Section>
)

function Timeline({ entries, showDuration = false }: { entries: readonly Entry[]; showDuration?: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  // The brass rail fills in as the reader scrolls through the entries.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  return (
    <ol ref={ref} className="relative mt-8 space-y-6">
      {entries.length > 1 && (
        <>
          <span aria-hidden className="absolute bottom-8 left-[21px] top-8 w-px bg-border" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-8 left-[21px] top-8 w-px origin-top bg-brass"
          />
        </>
      )}
      {entries.map((entry) => (
        <TimelineEntry key={entry.id} entry={entry} showDuration={showDuration} />
      ))}
    </ol>
  )
}

function TimelineEntry({ entry: e, showDuration }: { entry: Entry; showDuration: boolean }) {
  const mounted = useMounted()
  // A current role's length depends on today's date, so it is shown once running in the browser.
  const duration = showDuration && (e.end || mounted) ? formatDuration(e.start, e.end) : null

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(0.08)}
      className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 sm:gap-x-6"
    >
      <motion.div
        aria-hidden
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
        }}
        className="relative z-10 mt-5 flex size-11 items-center justify-center rounded-lg border border-brass/45 bg-card font-serif text-[15px] font-medium tracking-wide text-brass shadow-[0_0_0_6px_var(--background)]"
      >
        {e.monogram}
      </motion.div>

      <motion.article
        variants={slide}
        onPointerMove={trackSpotlight}
        className="spotlight group rounded-xl border border-border bg-card/70 p-5 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-brass/40 hover:shadow-[0_24px_48px_-32px_rgba(13,34,51,0.45)] sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <h4 className="text-lg font-medium leading-snug text-foreground sm:text-xl">{e.title}</h4>
            <p className="mt-1 text-[15px] text-foreground/85">
              {e.org}
              <span className="text-muted-foreground">, {e.type}</span>
            </p>
          </div>
          <p className="flex items-center gap-2 pt-1 text-sm tabular-nums text-muted-foreground">
            {formatRange(e.start, e.end)}
            {duration && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-full bg-brass/12 px-2 py-0.5 text-xs font-medium text-brass"
              >
                {duration}
              </motion.span>
            )}
          </p>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {e.place}
          {e.mode && `, ${e.mode}`}
        </p>

        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{e.description}</p>

        <motion.ul variants={stagger(0.05, 0.25)} aria-label="Skills" className="mt-5 flex flex-wrap gap-2">
          {e.skills.map((skill) => (
            <motion.li
              key={skill}
              variants={pop}
              className="rounded-full border border-border bg-pill/60 px-3 py-1 text-[13px] text-foreground/85 transition-colors duration-300 group-hover:border-brass/30"
            >
              {skill}
            </motion.li>
          ))}
        </motion.ul>
      </motion.article>
    </motion.li>
  )
}
