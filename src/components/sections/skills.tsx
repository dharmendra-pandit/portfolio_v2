'use client'

import { motion } from 'motion/react'
import { Binary, BrainCircuit, Braces, Database, Infinity as InfinityIcon, Server, Wrench } from 'lucide-react'
import { Section } from '@/components/ui/section-heading'
import { VIEWPORT, pop, stagger } from '@/components/ui/motion'
import { SKILL_CATEGORIES } from '@/data/portfolio'

const ICONS: Record<(typeof SKILL_CATEGORIES)[number]['id'], typeof Server> = {
  languages: Braces,
  backend: Server,
  'ai-ml': BrainCircuit,
  devops: InfinityIcon,
  databases: Database,
  dsa: Binary,
  tools: Wrench,
}

export const Skills = () => (
  <Section id="skills" title="Skills">
    <dl className="border-t border-border">
      {SKILL_CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.id]
        return (
          <motion.div
            key={cat.id}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.035)}
            className="group grid gap-x-10 gap-y-3 border-b border-border py-6 sm:grid-cols-[14rem_minmax(0,1fr)]"
          >
            <motion.dt
              variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="flex items-center gap-3 font-medium text-foreground"
            >
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="size-[18px] text-muted-foreground transition-colors duration-300 group-hover:text-brass"
              />
              {cat.title}
            </motion.dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={pop}
                    className="cursor-default rounded-full border border-border bg-card/70 px-3 py-1 text-[13px] text-foreground/85 transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brass/60 hover:bg-brass/10 hover:text-foreground"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </dd>
          </motion.div>
        )
      })}
    </dl>
  </Section>
)
