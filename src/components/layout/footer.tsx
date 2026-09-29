'use client'

import { ArrowUp } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { scrollToSection } from '@/lib/scroll'
import { MagneticButton } from '@/components/ui/magnetic-button'

const LINKS = [
  { label: 'Email', href: 'mailto:dharmendra193728@gmail.com', icon: MdEmail },
  { label: 'GitHub', href: 'https://github.com/dharmendra-pandit', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/dharmendra-pandit1', icon: FaLinkedinIn },
  { label: 'X (Twitter)', href: 'https://x.com/Dharmendra62042', icon: FaXTwitter },
]

export const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-14 text-center sm:px-8">
        <p className="text-xl font-bold tracking-tight text-foreground">
          Dharmendra Pandit<span className="text-coral">.</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Designed &amp; built with care. © {new Date().getFullYear()} Dharmendra Pandit — all rights reserved.
        </p>

        <ul className="mt-8 flex items-center gap-4">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <MagneticButton intensity={0.35}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-full bg-foreground text-background transition-colors duration-300 hover:bg-coral hover:text-[#121f28]"
                >
                  <Icon className="size-5" />
                </a>
              </MagneticButton>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="group mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-coral-ink"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </footer>
  )
}
