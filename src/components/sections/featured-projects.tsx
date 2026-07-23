'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaKaggle, FaDocker } from 'react-icons/fa'
import { Database, Code2, User } from 'lucide-react'
import { ProjectCard, Project } from '@/components/ui/project-card'
import { KaggleCard, KaggleNotebook } from '@/components/ui/kaggle-card'
import { DockerCard, DockerRepository } from '@/components/ui/docker-card'
import { ProjectSkeleton } from '@/components/ui/project-skeleton'
import { Button } from '@/components/ui/button'

export const FeaturedProjects = () => {
  const [activeTab, setActiveTab] = useState<'github' | 'kaggle' | 'docker'>('github')
  const [kaggleSubTab, setKaggleSubTab] = useState<'notebooks' | 'datasets'>('notebooks')
  const [projects, setProjects] = useState<any[]>([])
  const [kaggleNotebooks, setKaggleNotebooks] = useState<KaggleNotebook[]>([])
  const [kaggleDatasets, setKaggleDatasets] = useState<KaggleNotebook[]>([])
  const [kaggleUsername, setKaggleUsername] = useState('dharmendrapandit12')
  const [dockerRepos, setDockerRepos] = useState<DockerRepository[]>([])
  const [dockerUsername, setDockerUsername] = useState('iampanditji')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen to hash change from dsa-dashboard navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#projects-kaggle') {
        setActiveTab('kaggle')
        setTimeout(() => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else if (hash === '#projects-github') {
        setActiveTab('github')
        setTimeout(() => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else if (hash === '#projects-docker') {
        setActiveTab('docker')
        setTimeout(() => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    // Check initial hash
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Fetch projects whenever active tab changes
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = activeTab === 'github' ? '/api/github' : activeTab === 'docker' ? '/api/docker' : '/api/kaggle'
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to fetch ${activeTab} projects`)
        const data = await res.json()
        if (activeTab === 'github') {
          setProjects(data.projects || [])
        } else if (activeTab === 'docker') {
          setDockerRepos(data.repositories || [])
          if (data.username) {
            setDockerUsername(data.username)
          }
        } else {
          setKaggleNotebooks(data.notebooks || [])
          setKaggleDatasets(data.datasets || [])
          if (data.username) {
            setKaggleUsername(data.username)
          }
        }
      } catch (err) {
        console.error(err)
        setError(`Unable to load ${activeTab === 'github' ? 'GitHub projects' : activeTab === 'docker' ? 'Docker images' : 'Kaggle data'} at this time.`)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [activeTab])

  return (
    <section
      id="projects"
      className="relative py-48 flex items-center justify-center overflow-hidden border-t border-border/20"
    >
      {/* Dynamic background glow based on active tab */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        activeTab === 'github' ? 'bg-primary/5' : activeTab === 'docker' ? 'bg-[#2496ED]/5' : 'bg-[#20BEFF]/5'
      }`} />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 text-foreground font-heading"
          >
            Featured <span className="text-gradient">Projects.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-400 mb-12"
          >
            Explore full-stack web applications, machine learning code repositories, and container images with live demo links.
          </motion.p>

          {/* Platform Tab Switcher */}
          <div className="flex flex-col items-center gap-6 justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-foreground/5 border border-border rounded-2xl backdrop-blur-md">
              <button
                onClick={() => {
                  setActiveTab('github')
                  window.location.hash = '#projects-github'
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === 'github'
                    ? 'bg-foreground text-background shadow-md font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FaGithub className="w-4 h-4" />
                <span>GitHub Repositories</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('kaggle')
                  window.location.hash = '#projects-kaggle'
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === 'kaggle'
                    ? 'bg-foreground text-background shadow-md font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FaKaggle className="w-4 h-4" />
                <span>Kaggle Workspace</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('docker')
                  window.location.hash = '#projects-docker'
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === 'docker'
                    ? 'bg-foreground text-background shadow-md font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FaDocker className="w-4 h-4" />
                <span>Docker Hub</span>
              </button>
            </div>

            {/* Kaggle Sub-tab Switcher */}
            {activeTab === 'kaggle' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex p-1 bg-foreground/5 border border-border/60 rounded-xl backdrop-blur-md"
              >
                <button
                  onClick={() => setKaggleSubTab('notebooks')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                    kaggleSubTab === 'notebooks'
                      ? 'bg-foreground/10 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Notebooks & Code</span>
                </button>
                <button
                  onClick={() => setKaggleSubTab('datasets')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                    kaggleSubTab === 'datasets'
                      ? 'bg-foreground/10 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Public Datasets</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-center text-destructive bg-destructive/10 p-4 rounded-xl max-w-2xl mx-auto border border-destructive/20 mb-12">
            {error}
          </div>
        )}

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-full">
                  <ProjectSkeleton />
                </div>
              ))
            : activeTab === 'github'
            ? projects.map((project, index) => (
                <ProjectCard key={project.url} project={project} index={index} />
              ))
            : activeTab === 'docker'
            ? dockerRepos.map((repo, index) => (
                <DockerCard key={repo.title} repo={repo} index={index} />
              ))
            : kaggleSubTab === 'notebooks'
            ? kaggleNotebooks.map((notebook, index) => (
                <KaggleCard 
                  key={notebook.title} 
                  notebook={{ ...notebook, type: 'notebook' }} 
                  index={index} 
                />
              ))
            : kaggleDatasets.map((dataset, index) => (
                <KaggleCard 
                  key={dataset.title} 
                  notebook={{ ...dataset, type: 'dataset' }} 
                  index={index} 
                />
              ))}
        </div>

        {/* View All buttons */}
        {!loading && (
          <div className="text-center mt-16">
            {activeTab === 'github' ? (
              projects.length > 0 && (
                <a
                  href="https://github.com/dharmendra-pandit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.05)] cursor-pointer text-sm"
                  >
                    <FaGithub className="w-5 h-5" />
                    <span>View All GitHub Projects</span>
                  </Button>
                </a>
              )
            ) : activeTab === 'docker' ? (
              dockerRepos.length > 0 && (
                <a
                  href={`https://hub.docker.com/u/${dockerUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.05)] cursor-pointer text-sm"
                  >
                    <FaDocker className="w-5 h-5 text-foreground" />
                    <span>View Docker Hub Profile</span>
                  </Button>
                </a>
              )
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <a
                  href={`https://www.kaggle.com/${kaggleUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 py-5 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.03)] cursor-pointer text-xs"
                  >
                    <User className="w-4 h-4 text-foreground" />
                    <span>Kaggle Profile</span>
                  </Button>
                </a>

                <a
                  href={`https://www.kaggle.com/${kaggleUsername}/datasets`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 py-5 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.03)] cursor-pointer text-xs"
                  >
                    <Database className="w-4 h-4 text-foreground" />
                    <span>Kaggle Datasets</span>
                  </Button>
                </a>

                <a
                  href={`https://www.kaggle.com/${kaggleUsername}/code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 py-5 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.03)] cursor-pointer text-xs"
                  >
                    <Code2 className="w-4 h-4 text-foreground" />
                    <span>Kaggle Notebooks & Code</span>
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
