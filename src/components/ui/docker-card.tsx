'use client'

import { motion } from 'framer-motion'
import { Calendar, Download, Star, ExternalLink, ShieldCheck } from 'lucide-react'
import { FaDocker } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface DockerRepository {
  title: string
  description: string
  url: string
  starCount: number
  pullCount: number
  lastUpdated: string
  tags: string[]
  type?: 'docker'
}

export const DockerCard = ({ repo, index }: { repo: DockerRepository; index: number }) => {
  // Premium Docker brand dynamic color configurations
  const glowColor = 'from-[#2496ED]/30 to-[#008AFF]/10'
  const logoColor = 'text-[#2496ED]'
  const titleGradient = 'group-hover:to-[#2496ED]'
  const iconColor = 'text-[#2496ED]'
  const buttonBg = 'from-[#2496ED] to-[#008AFF] shadow-[#2496ED]/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="relative group h-full flex flex-col"
    >
      {/* Premium hover gradient glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${glowColor} rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-300`} />

      <Card className="relative flex-grow flex flex-col p-8 bg-foreground/5 border border-foreground/5 rounded-[2rem] backdrop-blur-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
        <CardContent className="p-0 relative z-10 flex flex-col h-full border-none">
          {/* Header section with Docker Logo & Type Badge & Date */}
          <div className="flex justify-between items-center mb-6">
            <div className={`p-3.5 bg-foreground/5 rounded-2xl border border-border group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)] ${logoColor}`}>
              <FaDocker className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border bg-[#2496ED]/10 text-[#2496ED] border-[#2496ED]/20">
                Container Image
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-foreground/5 py-1.5 px-3 rounded-full border border-border">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{repo.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground ${titleGradient} transition-all`}>
            {repo.title}
          </h3>

          {/* Resource Name badge */}
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-4 font-mono bg-muted/30 px-3 py-1 rounded-md max-w-fit border border-border/40">
            <ShieldCheck className={`w-3.5 h-3.5 ${iconColor}`} />
            <span className="truncate max-w-[220px]">
              docker.hub/{repo.title}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
            {repo.description}
          </p>

          {/* Metrics section */}
          <div className="flex items-center gap-4 mb-6 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1 bg-foreground/5 px-2.5 py-1 rounded-lg border border-border">
              <Download className="w-3.5 h-3.5 text-[#2496ED]" />
              <span>{repo.pullCount.toLocaleString()} Pulls</span>
            </div>
            {repo.starCount > 0 && (
              <div className="flex items-center gap-1 bg-foreground/5 px-2.5 py-1 rounded-lg border border-border">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>{repo.starCount} Stars</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {repo.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-foreground/5 border border-border rounded-full text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Card Actions */}
          <div className="grid grid-cols-2 gap-3 mt-auto w-full">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all text-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Details</span>
              </Button>
            </a>
            
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="default"
                size="sm"
                className={`w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${buttonBg} text-white font-medium hover:brightness-110 border-0 shadow-lg transition-all text-xs cursor-pointer`}
              >
                <FaDocker className="w-3.5 h-3.5" />
                <span>On Docker Hub</span>
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
