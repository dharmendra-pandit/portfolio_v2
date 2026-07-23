'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, GitFork, Clock, Globe, Database, FolderGit2, ArrowUpRight, Code2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export type Project = {
  name: string
  description: string
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  updatedAt: string
  primaryLanguage: { name: string; color: string } | null
  languages: { nodes: { name: string; color: string }[] }
}

const getProjectIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('web') || lowerName.includes('site') || lowerName.includes('campus') || lowerName.includes('career')) return <Globe className="w-5 h-5 text-foreground" />
  if (lowerName.includes('data') || lowerName.includes('assistant') || lowerName.includes('generator')) return <Database className="w-5 h-5 text-foreground" />
  return <Code2 className="w-5 h-5 text-foreground" />
}

export const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const date = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })

  const formattedTitle = project.name.replace(/-/g, ' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="relative group h-full flex flex-col"
    >
      <div className="absolute -inset-0.5 bg-foreground/10 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
      
      <Card className="relative flex-grow flex flex-col p-7 bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-lg transition-all duration-300">
        <CardContent className="p-0 relative z-10 flex flex-col h-full border-none">
          {/* Header section with Icon, Title, and Status Badge */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-foreground/5 rounded-2xl border border-border text-foreground group-hover:scale-110 transition-all duration-300 shadow-sm">
                {getProjectIcon(project.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground capitalize tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {formattedTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-mono">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>Updated {date}</span>
                </div>
              </div>
            </div>

            {project.homepageUrl ? (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Live App</span>
              </a>
            ) : (
              <span className="shrink-0 px-3 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground text-xs font-medium">
                Repo
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
            {project.description || 'Production software repository built with modern development practices.'}
          </p>

          {/* Metrics section */}
          <div className="flex items-center gap-4 mb-6 text-xs font-medium text-muted-foreground bg-foreground/5 px-3.5 py-2.5 rounded-xl border border-border">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <FolderGit2 className="w-3.5 h-3.5 text-foreground" />
              <span>Public Project</span>
            </div>

            {project.stargazerCount > 0 && (
              <div className="flex items-center gap-1.5 text-foreground">
                <Star className="w-3.5 h-3.5 fill-foreground text-foreground" /> {project.stargazerCount} Stars
              </div>
            )}

            {project.forkCount > 0 && (
              <div className="flex items-center gap-1.5 text-foreground">
                <GitFork className="w-3.5 h-3.5 text-foreground" /> {project.forkCount} Forks
              </div>
            )}
          </div>

          {/* Language / Tech tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.languages?.nodes?.map((lang, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1 bg-foreground/5 border border-border rounded-full text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-foreground/70" />
                {lang.name}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto w-full">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-border bg-background hover:bg-muted text-foreground text-xs font-semibold cursor-pointer transition-all"
              >
                <FaGithub className="w-3.5 h-3.5 text-foreground" />
                <span>Source Code</span>
              </Button>
            </a>

            {project.homepageUrl ? (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-foreground text-background font-bold hover:bg-foreground/90 text-xs shadow-md cursor-pointer border-0 transition-all"
                >
                  <span>Live App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </a>
            ) : (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-semibold cursor-pointer border-0 transition-all"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


