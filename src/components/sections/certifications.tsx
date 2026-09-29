'use client'

import { motion } from 'motion/react'
import { Award } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { CERTIFICATIONS as CERTS } from '@/data/portfolio'

export const Certifications = () => {
  return (
    <section id="certifications" className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Always learning" title="Certifications" />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="mx-auto mt-16 max-w-5xl border-t border-border"
        >
          {CERTS.map((cert, i) => (
            <motion.li
              key={cert.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group relative isolate grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border px-2 py-6 sm:grid-cols-[4rem_1fr_1fr_auto] sm:px-4 sm:py-7"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-pill transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
              <span className="font-mono text-sm text-coral-ink">{String(i + 1).padStart(2, '0')}</span>
              <div className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground sm:text-2xl">
                  {cert.title}
                  <Award
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-5 -translate-x-2 text-coral-ink opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground sm:hidden">{cert.issuer}</p>
              </div>
              <p className="hidden text-muted-foreground sm:block">{cert.issuer}</p>
              <span className="font-mono text-sm text-muted-foreground">{cert.date}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
