'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { rise, trackSpotlight } from '@/components/ui/motion'

export interface ProjectRowData {
  id: string
  title: string
  description: string
  tags: string[]
  meta?: string
  icon?: React.ReactNode
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

export const ProjectRow = ({ project }: { project: ProjectRowData }) => (
  <motion.article
    variants={rise}
    aria-labelledby={`project-${project.id}`}
    onPointerMove={trackSpotlight}
    className="spotlight group flex flex-col rounded-xl border border-border bg-card/70 p-6 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-brass/40 hover:shadow-[0_28px_56px_-36px_rgba(13,34,51,0.5)]"
  >
    <div className="flex items-center justify-between gap-4 text-[13px] text-muted-foreground">
      <span className="flex items-center gap-2 [&_svg]:size-4">
        {project.icon}
        {project.meta}
      </span>
      <ArrowUpRight
        aria-hidden
        className="size-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-brass group-hover:opacity-100"
      />
    </div>

    <h3
      id={`project-${project.id}`}
      className="mt-4 text-xl font-medium leading-snug tracking-[-0.005em] text-foreground transition-colors duration-300 group-hover:text-brass sm:text-[1.3rem]"
    >
      {project.title}
    </h3>
    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{project.description}</p>

    {project.tags.length > 0 && (
      <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-pill/80 px-2.5 py-0.5 text-xs text-foreground/80">
            {tag}
          </li>
        ))}
      </ul>
    )}

    <p className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm font-medium text-foreground">
      <ExternalLink {...project.primary} />
      {project.secondary && <ExternalLink {...project.secondary} />}
    </p>
  </motion.article>
)

function ExternalLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export const ProjectRowSkeleton = () => (
  <div className="animate-pulse space-y-4 rounded-xl border border-border bg-card/50 p-6" aria-hidden>
    <div className="h-3.5 w-28 rounded bg-pill" />
    <div className="h-6 w-3/5 rounded bg-pill" />
    <div className="space-y-2">
      <div className="h-3.5 w-full rounded bg-pill" />
      <div className="h-3.5 w-4/5 rounded bg-pill" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-5 w-16 rounded-full bg-pill" />
      <div className="h-5 w-14 rounded-full bg-pill" />
    </div>
  </div>
)
