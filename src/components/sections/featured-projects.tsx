'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProjectCard, Project } from '@/components/ui/project-card'
import { ProjectSkeleton } from '@/components/ui/project-skeleton'

export const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/github')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data.projects || [])
      } catch (err) {
        console.error(err)
        setError('Unable to load projects at this time.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section
      id="projects"
      className="relative py-48 flex items-center justify-center overflow-hidden"
    >
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Featured <span className="text-foreground/80">Projects.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            A showcase of my AI-powered applications and full-stack development work, synced dynamically from GitHub.
          </motion.p>
        </div>

        {error && (
          <div className="text-center text-destructive bg-destructive/10 p-4 rounded-xl max-w-2xl mx-auto border border-destructive/20 mb-12">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-full">
                  <ProjectSkeleton />
                </div>
              ))
            : projects.map((project, index) => (
                <ProjectCard key={project.url} project={project} index={index} />
              ))}
        </div>
      </div>
    </section>
  )
}
