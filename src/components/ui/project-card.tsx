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
  if (lowerName.includes('web') || lowerName.includes('site') || lowerName.includes('campus') || lowerName.includes('career')) return <Globe className="w-5 h-5 text-indigo-400" />
  if (lowerName.includes('data') || lowerName.includes('assistant') || lowerName.includes('generator')) return <Database className="w-5 h-5 text-purple-400" />
  return <Code2 className="w-5 h-5 text-blue-400" />
}

export const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const date = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })

  const formattedTitle = project.name.replace(/-/g, ' ')
  const ogImageUrl = `https://opengraph.githubassets.com/1/dharmendra-pandit/${project.name}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="relative group h-full flex flex-col"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
      
      <Card className="relative flex-grow flex flex-col glass-card border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300">
        {/* Project Thumbnail Image Header */}
        <div className="relative w-full h-44 overflow-hidden border-b border-white/10 bg-neutral-900/60">
          <img
            src={ogImageUrl}
            alt={project.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              // Fallback if GitHub OG image fails
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-4 right-4 z-10">
            {project.homepageUrl ? (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live App</span>
              </a>
            ) : (
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-neutral-300 text-xs font-medium">
                Repository
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-7 relative z-10 flex flex-col h-full border-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              {getProjectIcon(project.name)}
            </div>
            <h3 className="text-xl font-bold text-white capitalize tracking-tight">
              {formattedTitle}
            </h3>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
            {project.description || 'Production software repository built with modern development practices.'}
          </p>

          {/* Metrics section */}
          <div className="flex items-center gap-4 mb-6 text-xs font-medium text-neutral-400 bg-white/[0.03] px-3.5 py-2.5 rounded-xl border border-white/5">
            {project.stargazerCount > 0 && (
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {project.stargazerCount} Stars
              </div>
            )}

            {project.forkCount > 0 && (
              <div className="flex items-center gap-1.5 text-purple-400">
                <GitFork className="w-3.5 h-3.5" /> {project.forkCount} Forks
              </div>
            )}

            <div className="flex items-center gap-1.5 ml-auto text-neutral-400">
              <Clock className="w-3.5 h-3.5" /> {date}
            </div>
          </div>

          {/* Language / Tech tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.languages?.nodes?.map((lang, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-neutral-300"
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: lang.color || '#3b82f6' }} 
                />
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
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold cursor-pointer"
              >
                <FaGithub className="w-3.5 h-3.5" />
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
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer border-0"
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
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border-0"
                >
                  <span>View Repository</span>
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


