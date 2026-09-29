'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { BrainCircuit, Server, Infinity as InfinityIcon, Database, Binary, Braces, Wrench } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { SKILL_CATEGORIES } from '@/data/portfolio'
import { cn } from '@/lib/utils'

const ICONS: Record<(typeof SKILL_CATEGORIES)[number]['id'], typeof Server> = {
  'ai-ml': BrainCircuit,
  backend: Server,
  devops: InfinityIcon,
  databases: Database,
  dsa: Binary,
  languages: Braces,
  tools: Wrench,
}

const CATEGORIES = SKILL_CATEGORIES.map((c) => ({ ...c, icon: ICONS[c.id] }))

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'databases', label: 'Databases' },
  { id: 'languages', label: 'Languages' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export const Skills = () => {
  const [tab, setTab] = useState('all')
  const visible = tab === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === tab)

  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What I work with"
          title="Skills & Stack"
          description="The languages, frameworks, cloud tooling and data systems I reach for when building production software."
        />

        <LayoutGroup id="skills-tabs">
          <div role="group" aria-label="Filter skills" className="mt-12 flex flex-wrap justify-center gap-x-1 gap-y-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative px-4 py-2.5 text-sm font-medium transition-colors duration-300',
                  tab === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId="skills-tab-indicator"
                    className="absolute inset-x-4 bottom-0 h-[2px] bg-coral"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>
        </LayoutGroup>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((cat, i) => (
              <motion.article
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden rounded-md border border-border bg-card p-7 transition-colors duration-500 hover:border-coral/40"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-coral transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <cat.icon
                    aria-hidden
                    strokeWidth={1.4}
                    className="size-8 text-foreground transition-colors duration-300 group-hover:text-coral-ink"
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(CATEGORIES.indexOf(cat) + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{cat.title}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-pill px-3.5 py-1.5 text-[13px] font-medium text-foreground/85 transition-colors duration-300 hover:bg-coral hover:text-[#121f28]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
