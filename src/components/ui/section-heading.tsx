'use client'

import { motion } from 'motion/react'
import { EASE, Reveal, SplitWords } from '@/components/ui/motion'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  title: string
  /** Optional lead paragraph that opens the content column. */
  lead?: string
  className?: string
  children: React.ReactNode
}

/**
 * Document-style section: the title sits in a margin column (sticky on wide
 * screens) and the content runs beside it, like a formal CV or report.
 * The title rises word by word and a brass rule draws in beneath it.
 */
export const Section = ({ id, title, lead, className, children }: SectionProps) => {
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} className={cn('relative border-t border-border', className)}>
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 id={titleId} className="text-[1.875rem] font-medium leading-tight tracking-[-0.015em] text-foreground sm:text-[2.25rem]">
            <SplitWords text={title} />
          </h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
            className="mt-4 block h-[2px] w-12 origin-left rounded-full bg-brass"
          />
        </div>
        <div className="min-w-0">
          {lead && (
            <Reveal delay={0.1}>
              <p className="mb-12 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">{lead}</p>
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}

/** Sub-heading within a section's content column. */
export const SubHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Reveal className={className}>
    <h3 className="text-xl font-medium tracking-[-0.005em] text-foreground">{children}</h3>
  </Reveal>
)
