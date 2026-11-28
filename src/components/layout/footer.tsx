'use client'

import { ArrowUp } from 'lucide-react'
import { Reveal } from '@/components/ui/motion'
import { PROFILE } from '@/data/portfolio'

const LINKS = [
  { label: 'Email', href: `mailto:${PROFILE.email}` },
  { label: 'LinkedIn', href: PROFILE.links.linkedin },
  { label: 'GitHub', href: PROFILE.links.github },
  { label: 'X', href: PROFILE.links.x },
]

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-border">
    <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
    <Reveal className="relative mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>
        © {new Date().getFullYear()} <span className="text-foreground">{PROFILE.name}</span>
      </p>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {LINKS.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="relative transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-brass after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] hover:text-foreground hover:after:origin-left hover:after:scale-x-100"
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#home"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 transition-colors duration-300 hover:border-brass/60 hover:text-foreground"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </li>
      </ul>
    </Reveal>
  </footer>
)
