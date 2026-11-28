'use client'

import { motion } from 'motion/react'
import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import { ctaClasses } from '@/components/ui/cta'
import { EASE, SplitWords, rise, stagger } from '@/components/ui/motion'
import { EDUCATION, EXPERIENCE, PROFILE, formatMonth } from '@/data/portfolio'

export interface HeroStats {
  problemsSolved: number
  publicRepos: number
}

const current = EXPERIENCE[0]
const degree = EDUCATION[0]
const [city, ...region] = PROFILE.location.split(', ')

export const Hero = ({ stats }: { stats: HeroStats }) => {
  // Laid out like the title block of an engineering drawing: the essentials, ruled and labelled.
  const facts = [
    { label: 'Current position', value: current.title, detail: `${current.org}, since ${formatMonth(current.start)}` },
    { label: 'Education', value: degree.short, detail: `${degree.org}, CGPA ${PROFILE.cgpa.toFixed(2)}` },
    { label: 'Based in', value: city, detail: region.join(', ') },
    { label: 'Focus', value: PROFILE.focus },
    {
      label: 'Algorithmic problems solved',
      value: stats.problemsSolved > 0 ? `${stats.problemsSolved}+` : '—',
      detail: 'LeetCode, GeeksforGeeks and Code360',
    },
    {
      label: 'Open-source work',
      value: stats.publicRepos > 0 ? `${stats.publicRepos} public repositories` : 'Public repositories',
      detail: 'GitHub',
    },
  ]

  return (
    <section id="home" aria-labelledby="home-title" className="relative isolate overflow-hidden">
      {/* Backdrop: drafting grid and a slow brass glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-blueprint absolute inset-0" />
        <div className="animate-drift absolute -right-[10%] -top-[20%] size-[46rem] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_62%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[13px] text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-brass" />
            <span className="relative size-2 rounded-full bg-brass" />
          </span>
          {current.title} at <span className="font-medium text-foreground">{current.org}</span>
        </motion.p>

        <h1
          id="home-title"
          className="text-[clamp(2.75rem,8vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.025em] text-foreground"
        >
          <SplitWords text={PROFILE.name} onLoad delay={0.15} step={0.12} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mt-6 max-w-[30ch] font-serif text-[1.375rem] leading-snug text-muted-foreground sm:text-[1.625rem]"
        >
          {PROFILE.headline}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.08, 0.7)}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <motion.a
            variants={rise}
            href={PROFILE.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaClasses('solid')}
          >
            Download résumé
            <ArrowDownToLine className="group-hover/cta:translate-x-0! group-hover/cta:translate-y-0.5" />
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </motion.a>
          <motion.a variants={rise} href="#contact" className={ctaClasses('outline')}>
            Contact me
            <ArrowRight />
          </motion.a>
          <motion.span variants={rise} className="flex items-center gap-5 text-sm font-medium text-foreground sm:ml-2">
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="link">
              LinkedIn
            </a>
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="link">
              GitHub
            </a>
          </motion.span>
        </motion.div>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={stagger(0.07, 0.9)}
          className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border shadow-[0_30px_60px_-40px_rgba(13,34,51,0.35)] sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
        >
          {facts.map(({ label, value, detail }) => (
            <motion.div
              key={label}
              variants={rise}
              className="group relative bg-card/95 px-5 py-4 transition-colors duration-300 hover:bg-card sm:px-6 sm:py-5"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-brass transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <dt className="text-[13px] text-muted-foreground">{label}</dt>
              <dd className="mt-1.5 text-[15px] font-medium leading-snug text-foreground">{value}</dd>
              {detail && <dd className="mt-0.5 text-sm text-muted-foreground">{detail}</dd>}
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
