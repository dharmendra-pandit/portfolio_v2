'use client'

import { motion } from 'motion/react'
import { BadgeCheck } from 'lucide-react'
import { Section } from '@/components/ui/section-heading'
import { VIEWPORT, slide, stagger } from '@/components/ui/motion'
import { CERTIFICATIONS } from '@/data/portfolio'

export const Certifications = () => (
  <Section id="certifications" title="Certifications">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-foreground/15 text-[13px] text-muted-foreground">
          <th scope="col" className="pb-3 pl-3 pr-6 font-normal">Certification</th>
          <th scope="col" className="pb-3 pr-6 font-normal">Issued by</th>
          <th scope="col" className="pb-3 pr-3 text-right font-normal">Year</th>
        </tr>
      </thead>
      <motion.tbody initial="hidden" whileInView="show" viewport={VIEWPORT} variants={stagger(0.06)}>
        {CERTIFICATIONS.map((cert) => (
          <motion.tr
            key={cert.title}
            variants={slide}
            className="group relative border-b border-border transition-colors duration-300 hover:bg-card/80"
          >
            <th scope="row" className="relative py-4 pl-3 pr-6 font-sans font-medium text-foreground">
              <span
                aria-hidden
                className="absolute inset-y-2 left-0 w-[2px] origin-center scale-y-0 rounded-full bg-brass transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <span className="flex items-center gap-2.5">
                <BadgeCheck
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-[18px] shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-brass"
                />
                {cert.title}
              </span>
            </th>
            <td className="py-4 pr-6 text-[15px] text-muted-foreground">{cert.issuer}</td>
            <td className="py-4 pr-3 text-right text-[15px] tabular-nums text-muted-foreground">{cert.date}</td>
          </motion.tr>
        ))}
      </motion.tbody>
    </table>
  </Section>
)
