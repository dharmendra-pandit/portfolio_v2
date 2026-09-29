'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { FaGithub, FaKaggle, FaDocker } from 'react-icons/fa'
import { ArrowUpRight } from 'lucide-react'
import { ProjectRow, ProjectRowSkeleton, type ProjectRowData } from '@/components/ui/project-row'
import { SectionHeading } from '@/components/ui/section-heading'
import { ctaClasses } from '@/components/ui/cta'
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

const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
const slugOf = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? ''

function fromGithub(p: Project): ProjectRowData {
  const langs = p.languages?.nodes ?? []
  return {
    id: `gh-${p.name}`,
    title: p.name.replace(/[-_]/g, ' '),
    description: p.description || 'Production software repository built with modern development practices.',
    tags: langs.map((l) => l.name),
    meta: `Updated ${monthYear(p.updatedAt)}`,
    primary: { label: 'View GitHub', href: p.url, icon: <FaGithub /> },
    secondary: p.homepageUrl ? { label: 'Live project', href: p.homepageUrl } : undefined,
    terminal: {
      title: `bash — ${p.name}`,
      lines: [
        { kind: 'cmd', text: `git clone github.com/${GITHUB_USER}/${p.name}` },
        { kind: 'out', text: `Cloning into '${p.name}'...` },
        { kind: 'ok', text: `done  ·  ★ ${p.stargazerCount}  ·  ⑂ ${p.forkCount}` },
        { kind: 'cmd', text: `cd ${p.name} && git log -1 --format=%cd` },
        { kind: 'meta', text: monthYear(p.updatedAt) },
        ...(langs.length ? [{ kind: 'langs' as const, langs }] : []),
        ...(p.homepageUrl
          ? [
              { kind: 'cmd' as const, text: 'open live-demo' },
              { kind: 'ok' as const, text: p.homepageUrl.replace(/^https?:\/\//, '') },
            ]
          : []),
      ],
    },
  }
}

function fromKaggle(n: KaggleNotebook, owner: string): ProjectRowData {
  const isDataset = n.type === 'dataset'
  const slug = slugOf(n.notebookUrl)
  return {
    id: `kg-${slug || n.title}`,
    title: n.title,
    description: n.description,
    tags: n.tags,
    meta: `${isDataset ? 'Dataset' : 'Notebook'} · Updated ${n.lastUpdated}`,
    primary: { label: 'Open on Kaggle', href: n.kaggleUrl, icon: <FaKaggle /> },
    secondary:
      n.notebookUrl && n.notebookUrl !== n.kaggleUrl
        ? { label: isDataset ? 'View dataset' : 'View notebook', href: n.notebookUrl }
        : undefined,
    terminal: {
      title: `kaggle — ${slug}`,
      lines: isDataset
        ? [
            { kind: 'cmd', text: `kaggle datasets download -d ${owner}/${slug}` },
            { kind: 'out', text: `Downloading ${slug}.zip to ./data` },
            { kind: 'ok', text: '100% · unzipped' },
            { kind: 'cmd', text: 'ls data/' },
            { kind: 'meta', text: n.tags.join('  ') || 'dataset.csv' },
            { kind: 'out', text: `updated ${n.lastUpdated}` },
          ]
        : [
            { kind: 'cmd', text: `kaggle kernels pull ${owner}/${slug}` },
            { kind: 'out', text: `Source code downloaded to ./${slug}.ipynb` },
            { kind: 'ok', text: 'kernel ready' },
            { kind: 'cmd', text: 'kaggle kernels status' },
            { kind: 'meta', text: `dataset: ${n.datasetName}` },
            { kind: 'out', text: `updated ${n.lastUpdated}` },
          ],
    },
  }
}

function fromDocker(r: DockerRepository, owner: string): ProjectRowData {
  return {
    id: `dk-${r.title}`,
    title: r.title.replace(/[-_]/g, ' '),
    description: r.description,
    tags: r.tags,
    meta: `Container image · Updated ${r.lastUpdated}`,
    primary: { label: 'View on Docker Hub', href: r.url, icon: <FaDocker /> },
    terminal: {
      title: `docker — ${owner}/${r.title}`,
      lines: [
        { kind: 'cmd', text: `docker pull ${owner}/${r.title}` },
        { kind: 'out', text: `latest: Pulling from ${owner}/${r.title}` },
        { kind: 'ok', text: 'Status: Downloaded newer image' },
        { kind: 'meta', text: `pulls ${r.pullCount}  ·  stars ${r.starCount}` },
        { kind: 'cmd', text: `docker run -d ${owner}/${r.title}:latest` },
        { kind: 'out', text: 'container started' },
      ],
    },
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

  // The dashboard links here with #projects-{platform}
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
          setError(`Unable to load ${name} right now.`)
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
        ? dockerRepos.map((r) => fromDocker(r, dockerUsername))
        : (kaggleSubTab === 'notebooks' ? kaggleNotebooks : kaggleDatasets).map((n) =>
            fromKaggle({ ...n, type: kaggleSubTab === 'notebooks' ? 'notebook' : 'dataset' }, kaggleUsername),
          )

  const viewAll =
    activeTab === 'github'
      ? { label: 'More on GitHub', href: `https://github.com/${GITHUB_USER}` }
      : activeTab === 'docker'
        ? { label: 'Docker Hub profile', href: `https://hub.docker.com/u/${dockerUsername}` }
        : {
            label: kaggleSubTab === 'notebooks' ? 'All Kaggle notebooks' : 'All Kaggle datasets',
            href: `https://www.kaggle.com/${kaggleUsername}/${kaggleSubTab === 'notebooks' ? 'code' : 'datasets'}`,
          }

  const listKey = `${activeTab}-${activeTab === 'kaggle' ? kaggleSubTab : ''}-${loading ? 'loading' : 'ready'}`

  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading title="Projects" />

        {/* Platform switcher */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <LayoutGroup id="project-tabs">
            <div role="group" aria-label="Project source" className="flex flex-wrap justify-center gap-1">
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
                    'relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-4',
                    activeTab === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="hidden size-4 sm:block" />
                  {label}
                  {activeTab === id && (
                    <motion.span
                      layoutId="project-tab-indicator"
                      className="absolute inset-x-3 bottom-0 h-[2px] bg-coral sm:inset-x-4"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>

          <AnimatePresence initial={false}>
            {activeTab === 'kaggle' && (
              <motion.div
                role="group"
                aria-label="Kaggle content type"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-2 overflow-hidden"
              >
                {(['notebooks', 'datasets'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={kaggleSubTab === t}
                    onClick={() => setKaggleSubTab(t)}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors duration-300',
                      kaggleSubTab === t
                        ? 'bg-coral text-[#121f28]'
                        : 'bg-pill text-muted-foreground hover:text-foreground',
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
          <p role="alert" className="mx-auto mt-12 max-w-xl rounded-md border border-coral/40 bg-coral/10 p-4 text-center text-sm text-foreground">
            {error}
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={listKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-16 flex flex-col gap-24 sm:mt-20 sm:gap-32"
          >
            {loading ? (
              <>
                <ProjectRowSkeleton />
                <ProjectRowSkeleton flip />
              </>
            ) : rows.length > 0 ? (
              rows.map((row, i) => <ProjectRow key={row.id} project={row} index={i} />)
            ) : (
              !error && <p className="text-center text-muted-foreground">Nothing published here yet — check back soon.</p>
            )}
          </motion.div>
        </AnimatePresence>

        {!loading && rows.length > 0 && (
          <div className="mt-20 flex justify-center">
            <a href={viewAll.href} target="_blank" rel="noopener noreferrer" className={ctaClasses('outline')}>
              {viewAll.label}
              <ArrowUpRight className="group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
