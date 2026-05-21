import { motion } from 'framer-motion'
import { ExternalLink, Sparkles, Star, GitFork, Clock, BrainCircuit, Landmark, Globe, ShoppingCart, MessageSquare, Database, FolderGit2, Bot } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'

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
  if (lowerName.includes('ai') || lowerName.includes('gpt') || lowerName.includes('knowledge') || lowerName.includes('llm') || lowerName.includes('rag')) return <BrainCircuit className="w-6 h-6 text-foreground" />
  if (lowerName.includes('bank') || lowerName.includes('credit') || lowerName.includes('loan') || lowerName.includes('finance')) return <Landmark className="w-6 h-6 text-foreground" />
  if (lowerName.includes('portfolio') || lowerName.includes('web') || lowerName.includes('site')) return <Globe className="w-6 h-6 text-foreground" />
  if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('ecommerce')) return <ShoppingCart className="w-6 h-6 text-foreground" />
  if (lowerName.includes('chat') || lowerName.includes('message')) return <MessageSquare className="w-6 h-6 text-foreground" />
  if (lowerName.includes('data') || lowerName.includes('analytics')) return <Database className="w-6 h-6 text-foreground" />
  if (lowerName.includes('bot')) return <Bot className="w-6 h-6 text-foreground" />
  return <FolderGit2 className="w-6 h-6 text-foreground" />
}

export const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const date = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="relative group h-full"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-foreground/20 to-foreground/5 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      <Card className="relative h-full p-8 bg-foreground/5 border border-foreground/5 rounded-[2rem] backdrop-blur-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardContent className="p-0 relative z-10 flex flex-col h-full border-none">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-foreground/5 rounded-2xl border border-border group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              {getProjectIcon(project.name)}
            </div>
            <div className="flex gap-4">
              <a
                href={project.url}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-foreground/5 rounded-full"
                aria-label="GitHub Repository"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              {project.homepageUrl && (
                <a
                  href={project.homepageUrl}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-foreground/5 rounded-full"
                  aria-label="Live Demo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all capitalize">
            {project.name.replace(/-/g, ' ')}
          </h3>
          <p className="text-muted-foreground mb-6 flex-grow leading-relaxed line-clamp-3">
            {project.description || 'No description available for this repository.'}
          </p>

          <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
            {project.stargazerCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4" /> {project.stargazerCount}
              </div>
            )}
            {project.forkCount > 0 && (
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" /> {project.forkCount}
              </div>
            )}
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock className="w-4 h-4" /> {date}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.languages?.nodes.map((lang, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-4 py-1.5 bg-foreground/5 border border-border rounded-full text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 backdrop-blur-md"
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: lang.color || '#fff' }} 
                />
                {lang.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
