'use client'

import { motion } from 'motion/react'
import { BrainCircuit, CloudCog, ServerCog } from 'lucide-react'
import { Section, SubHeading } from '@/components/ui/section-heading'
import { VIEWPORT, rise, stagger, trackSpotlight } from '@/components/ui/motion'
import { ABOUT, SERVICES } from '@/data/portfolio'

const ICONS: Record<(typeof SERVICES)[number]['id'], typeof ServerCog> = {
  backend: ServerCog,
  genai: BrainCircuit,
  devops: CloudCog,
}

export const About = () => (
  <Section id="about" title="About">
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(0.12)}
      className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-[1.8] text-foreground/85"
    >
      {ABOUT.map((paragraph) => (
        <motion.p key={paragraph.slice(0, 24)} variants={rise}>
          {paragraph}
        </motion.p>
      ))}
    </motion.div>

    <SubHeading className="mt-16">Areas of practice</SubHeading>
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(0.1)}
      className="mt-6 grid gap-4 md:grid-cols-3"
    >
      {SERVICES.map(({ id, title, desc }) => {
        const Icon = ICONS[id]
        return (
          <motion.li
            key={id}
            variants={rise}
            onPointerMove={trackSpotlight}
            className="spotlight group rounded-xl border border-border bg-card/70 p-6 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-brass/40 hover:shadow-[0_24px_48px_-32px_rgba(13,34,51,0.45)]"
          >
            <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-[color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:border-brass/50 group-hover:text-brass">
              <Icon aria-hidden strokeWidth={1.5} className="size-5" />
            </span>
            <p className="mt-5 font-medium text-foreground">{title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
          </motion.li>
        )
      })}
    </motion.ul>
  </Section>
)
