'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, GitFork, Clock, BrainCircuit, Landmark, Globe, ShoppingCart, MessageSquare, Database, FolderGit2, Bot, Sparkles, ArrowUpRight } from 'lucide-react'
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
  if (lowerName.includes('ai') || lowerName.includes('gpt') || lowerName.includes('knowledge') || lowerName.includes('llm') || lowerName.includes('rag')) return <BrainCircuit className="w-6 h-6 text-sky-400" />
  if (lowerName.includes('bank') || lowerName.includes('credit') || lowerName.includes('loan') || lowerName.includes('finance')) return <Landmark className="w-6 h-6 text-emerald-400" />
  if (lowerName.includes('portfolio') || lowerName.includes('web') || lowerName.includes('site') || lowerName.includes('campus')) return <Globe className="w-6 h-6 text-indigo-400" />
  if (lowerName.includes('career') || lowerName.includes('audit')) return <Sparkles className="w-6 h-6 text-amber-400" />
  if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('ecommerce')) return <ShoppingCart className="w-6 h-6 text-rose-400" />
  if (lowerName.includes('chat') || lowerName.includes('message')) return <MessageSquare className="w-6 h-6 text-teal-400" />
  if (lowerName.includes('data') || lowerName.includes('analytics')) return <Database className="w-6 h-6 text-purple-400" />
  if (lowerName.includes('bot')) return <Bot className="w-6 h-6 text-cyan-400" />
  return <FolderGit2 className="w-6 h-6 text-blue-400" />
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
      {/* Ambient gradient glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
      
      <Card className="relative flex-grow flex flex-col p-8 glass-card border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300">
        <CardContent className="p-0 relative z-10 flex flex-col h-full border-none">
          
          {/* Header row with Icon, Live Badge & Actions */}
          <div className="flex justify-between items-start mb-6">
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-md">
              {getProjectIcon(project.name)}
            </div>

            <div className="flex items-center gap-2">
              {project.homepageUrl ? (
                <a
                  href={project.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Live App</span>
                </a>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-medium">
                  Open Source
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all capitalize tracking-tight">
            {formattedTitle}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
            {project.description || 'Full-stack production repository built with modern software engineering practices.'}
          </p>

          {/* Metrics section */}
          <div className="flex items-center gap-4 mb-6 text-xs font-medium text-muted-foreground bg-white/[0.03] p-3 rounded-xl border border-white/5">
            {project.stargazerCount > 0 ? (
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" /> {project.stargazerCount} Stars
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-blue-400">
                <Star className="w-4 h-4" /> Featured Repo
              </div>
            )}

            {project.forkCount > 0 && (
              <div className="flex items-center gap-1.5 text-purple-400">
                <GitFork className="w-4 h-4" /> {project.forkCount} Forks
              </div>
            )}

            <div className="flex items-center gap-1.5 ml-auto text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> {date}
            </div>
          </div>

          {/* Language / Tech tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.languages?.nodes?.map((lang, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-neutral-300 group-hover:border-white/20 transition-all"
              >
                <span 
                  className="w-2 h-2 rounded-full shadow-sm" 
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
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg cursor-pointer border-0"
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

