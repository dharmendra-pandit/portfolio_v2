'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { FaDocker, FaGithub, FaKaggle } from 'react-icons/fa'
import { ProjectRow, ProjectRowSkeleton, type ProjectRowData } from '@/components/ui/project-row'
import { EASE, stagger } from '@/components/ui/motion'
import { Section } from '@/components/ui/section-heading'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import type { Project, KaggleNotebook, DockerRepository } from '@/lib/types'

type Platform = 'github' | 'kaggle' | 'docker'

const PLATFORMS: { id: Platform; label: string; icon: typeof FaGithub }[] = [
  { id: 'github', label: 'GitHub', icon: FaGithub },
  { id: 'kaggle', label: 'Kaggle', icon: FaKaggle },
  { id: 'docker', label: 'Docker Hub', icon: FaDocker },
]

const GITHUB_USER = 'dharmendra-pandit'

const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
// Repository slugs ("my-cool_repo") read better as titles ("My Cool Repo").
const fromSlug = (slug: string) =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)(\p{Ll})/gu, (_, sp: string, c: string) => sp + c.toUpperCase())

function fromGithub(p: Project): ProjectRowData {
  return {
    id: `gh-${p.name}`,
    title: fromSlug(p.name),
    description: p.description || 'Software repository on GitHub.',
    tags: (p.languages?.nodes ?? []).map((l) => l.name),
    meta: `Updated ${monthYear(p.updatedAt)}`,
    icon: <FaGithub aria-hidden />,
    primary: { label: 'Source code', href: p.url },
    secondary: p.homepageUrl ? { label: 'Live site', href: p.homepageUrl } : undefined,
  }
}

function fromKaggle(n: KaggleNotebook): ProjectRowData {
  const isDataset = n.type === 'dataset'
  return {
    id: `kg-${n.notebookUrl || n.title}`,
    title: n.title,
    description: n.description,
    tags: n.tags,
    meta: `${isDataset ? 'Dataset' : 'Notebook'}, updated ${n.lastUpdated}`,
    icon: <FaKaggle aria-hidden />,
    primary: { label: 'View on Kaggle', href: n.kaggleUrl },
    secondary:
      n.notebookUrl && n.notebookUrl !== n.kaggleUrl
        ? { label: isDataset ? 'Dataset page' : 'Notebook', href: n.notebookUrl }
        : undefined,
  }
}

function fromDocker(r: DockerRepository): ProjectRowData {
  return {
    id: `dk-${r.title}`,
    title: fromSlug(r.title),
    description: r.description,
    tags: r.tags,
    meta: `Container image, updated ${r.lastUpdated}`,
    icon: <FaDocker aria-hidden />,
    primary: { label: 'View on Docker Hub', href: r.url },
  }
}

export const FeaturedProjects = () => {
  const [activeTab, setActiveTab] = useState<Platform>('github')
  const [kaggleSubTab, setKaggleSubTab] = useState<'notebooks' | 'datasets'>('notebooks')
  const [projects, setProjects] = useState<Project[]>([])
  const [kaggleNotebooks, setKaggleNotebooks] = useState<KaggleNotebook[]>([])
  const [kaggleDatasets, setKaggleDatasets] = useState<KaggleNotebook[]>([])
  const [kaggleUsername, setKaggleUsername] = useState('dharmendrapandit12')
  const [dockerRepos, setDockerRepos] = useState<DockerRepository[]>([])
  const [dockerUsername, setDockerUsername] = useState('iampanditji')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // The activity section links here with #projects-{platform}
  useEffect(() => {
    const handleHashChange = () => {
      const match = window.location.hash.match(/^#projects-(github|kaggle|docker)$/)
      if (!match) return
      setActiveTab(match[1] as Platform)
      setTimeout(() => scrollToSection('projects'), 100)
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = activeTab === 'github' ? '/api/github' : activeTab === 'docker' ? '/api/docker' : '/api/kaggle'
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to fetch ${activeTab} projects`)
        const data = await res.json()
        if (cancelled) return
        if (activeTab === 'github') {
          setProjects(data.projects || [])
        } else if (activeTab === 'docker') {
          setDockerRepos(data.repositories || [])
          if (data.username) setDockerUsername(data.username)
        } else {
          setKaggleNotebooks(data.notebooks || [])
          setKaggleDatasets(data.datasets || [])
          if (data.username) setKaggleUsername(data.username)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          const name = activeTab === 'github' ? 'GitHub projects' : activeTab === 'docker' ? 'Docker images' : 'Kaggle work'
          setError(`${name} could not be loaded. Use the profile link below to view them directly.`)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProjects()
    return () => {
      cancelled = true
    }
  }, [activeTab])

  const rows: ProjectRowData[] =
    activeTab === 'github'
      ? projects.map(fromGithub)
      : activeTab === 'docker'
        ? dockerRepos.map(fromDocker)
        : (kaggleSubTab === 'notebooks' ? kaggleNotebooks : kaggleDatasets).map((n) =>
            fromKaggle({ ...n, type: kaggleSubTab === 'notebooks' ? 'notebook' : 'dataset' }),
          )

  const viewAll =
    activeTab === 'github'
      ? { label: 'All repositories on GitHub', href: `https://github.com/${GITHUB_USER}` }
      : activeTab === 'docker'
        ? { label: 'All images on Docker Hub', href: `https://hub.docker.com/u/${dockerUsername}` }
        : {
            label: kaggleSubTab === 'notebooks' ? 'All notebooks on Kaggle' : 'All datasets on Kaggle',
            href: `https://www.kaggle.com/${kaggleUsername}/${kaggleSubTab === 'notebooks' ? 'code' : 'datasets'}`,
          }

  return (
    <Section
      id="projects"
      title="Projects"
      lead="Selected work, loaded directly from my GitHub, Kaggle and Docker Hub profiles."
    >
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <LayoutGroup id="project-tabs">
          <div role="group" aria-label="Project source" className="flex rounded-lg border border-border bg-card/60 p-1">
            {PLATFORMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={activeTab === id}
                onClick={() => {
                  setActiveTab(id)
                  history.replaceState(null, '', `#projects-${id}`)
                }}
                className={cn(
                  'relative flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-300 sm:px-4',
                  activeTab === id ? 'text-cta-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {activeTab === id && (
                  <motion.span
                    layoutId="project-tab-pill"
                    className="absolute inset-0 -z-0 rounded-md bg-cta shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <Icon aria-hidden className="relative hidden size-4 sm:block" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence initial={false}>
          {activeTab === 'kaggle' && (
            <motion.div
              role="group"
              aria-label="Kaggle content type"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex gap-1"
            >
              {(['notebooks', 'datasets'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={kaggleSubTab === t}
                  onClick={() => setKaggleSubTab(t)}
                  className={cn(
                    'rounded-full border px-3.5 py-1 text-[13px] font-medium capitalize transition-colors duration-300',
                    kaggleSubTab === t
                      ? 'border-brass/60 bg-brass/10 text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-[15px] text-foreground"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${kaggleSubTab}-${loading ? 'loading' : 'ready'}`}
          aria-busy={loading}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          variants={stagger(0.08)}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {loading ? (
            <>
              <ProjectRowSkeleton />
              <ProjectRowSkeleton />
              <ProjectRowSkeleton />
              <ProjectRowSkeleton />
            </>
          ) : rows.length > 0 ? (
            rows.map((row) => <ProjectRow key={row.id} project={row} />)
          ) : (
            !error && <p className="py-8 text-muted-foreground md:col-span-2">No published items to show yet.</p>
          )}
        </motion.div>
      </AnimatePresence>

      {!loading && (
        <p className="mt-10 text-sm font-medium text-foreground">
          <a href={viewAll.href} target="_blank" rel="noopener noreferrer" className="link">
            {viewAll.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
    </Section>
  )
}
