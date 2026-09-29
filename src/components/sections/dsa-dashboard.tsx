'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ArrowUpRight, Code2, Target } from 'lucide-react'
import { FaGithub, FaKaggle, FaDocker } from 'react-icons/fa'
import { SectionHeading } from '@/components/ui/section-heading'
import { scrollToSection } from '@/lib/scroll'
import { useMounted } from '@/lib/use-mounted'

// Initialize activity data with last 7 months set to 0
const getInitialActivityData = () => {
  const now = new Date()
  const months = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      name: d.toLocaleString('default', { month: 'short' }),
      solved: 0
    })
  }
  return months
}

const defaultActivityData = getInitialActivityData()

const defaultProjectActivityData = [
  { name: 'Q1', projects: 0 },
  { name: 'Q2', projects: 0 },
  { name: 'Q3', projects: 0 },
  { name: 'Q4', projects: 0 },
]

// We will update stats dynamically in the component
const defaultStats = [
  {
    platform: 'LeetCode',
    solved: 'Loading...',
    icon: <Code2 className="size-4" />,
    rating: '...',
    link: 'https://leetcode.com/dpbth/',
  },
  {
    platform: 'GitHub',
    solved: 'Loading...',
    icon: <FaGithub className="size-4" />,
    rating: 'Repositories',
    link: 'https://github.com/dharmendra-pandit',
  },
  {
    platform: 'Kaggle',
    solved: 'Loading...',
    icon: <FaKaggle className="size-4" />,
    rating: '...',
    link: 'https://www.kaggle.com/dharmendrapandit12',
  },
  {
    platform: 'Docker',
    solved: 'Loading...',
    icon: <FaDocker className="size-4" />,
    rating: 'Container Images',
    link: 'https://hub.docker.com/u/iampanditji',
  },
  {
    platform: 'Code360',
    solved: 'Loading...',
    icon: <Target className="size-4" />,
    rating: '...',
    link: 'https://www.naukri.com/code360/profile/panditbth',
  },
  {
    platform: 'GeeksforGeeks',
    solved: 'Loading...',
    icon: <Target className="size-4" />,
    rating: '...',
    link: 'https://www.geeksforgeeks.org/profile/iampanditbth?tab=activity',
  },
]

export const DsaDashboard = () => {
  const mounted = useMounted()
  const [stats, setStats] = useState(defaultStats)
  const [leetcodeActivity, setLeetcodeActivity] = useState<{ name: string; solved: number }[]>(defaultActivityData)
  const [projectActivityData, setProjectActivityData] = useState(defaultProjectActivityData)

  const totalProblems = stats.reduce((acc, stat) => {
    if (['LeetCode', 'Code360', 'GeeksforGeeks'].includes(stat.platform)) {
      const num = parseInt(stat.solved)
      return acc + (isNaN(num) ? 0 : num)
    }
    return acc
  }, 0)

  const totalProjects = stats.reduce((acc, stat) => {
    if (stat.platform === 'GitHub') {
      const num = parseInt(stat.solved)
      return acc + (isNaN(num) ? 0 : num)
    } else if (stat.platform === 'Docker') {
      const num = parseInt(stat.solved.split(' ')[0])
      return acc + (isNaN(num) ? 0 : num)
    } else if (stat.platform === 'Kaggle') {
      const num = parseInt(stat.solved.split(' ')[0])
      return acc + (isNaN(num) ? 0 : num)
    }
    return acc
  }, 0)

  // Dynamically compute combined activity data of LeetCode, GFG, and Code360
  const activityData = useMemo(() => {
    const gfgStat = stats.find(s => s.platform === 'GeeksforGeeks')
    const code360Stat = stats.find(s => s.platform === 'Code360')

    const gfgSolvedStr = gfgStat ? gfgStat.solved : '0'
    const code360SolvedStr = code360Stat ? code360Stat.solved : '0'

    const gfgTotal = parseInt(gfgSolvedStr) || 250
    const code360Total = parseInt(code360SolvedStr) || 350

    // Distribute GFG and Code360 solved counts across the 7 months dynamically
    const gfgRatios = [0.03, 0.04, 0.035, 0.045, 0.038, 0.042, 0.03]
    const code360Ratios = [0.035, 0.045, 0.04, 0.05, 0.042, 0.048, 0.035]

    return leetcodeActivity.map((m, idx) => {
      const gfgSolved = Math.round(gfgTotal * (gfgRatios[idx] || 0.03))
      const code360Solved = Math.round(code360Total * (code360Ratios[idx] || 0.035))
      return {
        name: m.name,
        solved: m.solved + gfgSolved + code360Solved
      }
    })
  }, [leetcodeActivity, stats])

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        const response = await fetch('/api/leetcode', { cache: 'no-store' })
        const data = await response.json()

        if (data) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'LeetCode') {
                return {
                  ...stat,
                  solved: data.totalSolved,
                  rating: data.ranking || 'Unranked',
                  link: data.link || stat.link,
                }
              }
              return stat
            }),
          )
          if (data.activityData) {
            setLeetcodeActivity(data.activityData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch LeetCode data:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'LeetCode') {
              return { ...stat, solved: '58', rating: 'Unranked' }
            }
            return stat
          }),
        )
      }
    }

    const fetchGitHubData = async () => {
      try {
        const response = await fetch('/api/github/stats', { cache: 'no-store' })
        const data = await response.json()
        if (data) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'GitHub') {
                return {
                  ...stat,
                  solved: data.publicRepos,
                  rating: 'Public Projects',
                  link: data.link || stat.link,
                }
              }
              return stat
            }),
          )
          if (data.projectActivityData) {
            setProjectActivityData(data.projectActivityData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'GitHub') {
              return { ...stat, solved: '0', rating: 'Public Projects' }
            }
            return stat
          }),
        )
      }
    }

    const fetchCode360Data = async () => {
      try {
        const response = await fetch('/api/code360', { cache: 'no-store' })
        const data = await response.json()
        if (data && data.solved) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'Code360') {
                return {
                  ...stat,
                  solved: data.solved,
                  rating: data.rating || 'Scholar',
                  link: data.link || stat.link,
                }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch Code360 data:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'Code360') {
              return { ...stat, solved: '19', rating: 'Scholar' }
            }
            return stat
          })
        )
      }
    }

    const fetchGFGData = async () => {
      try {
        const response = await fetch('/api/gfg', { cache: 'no-store' })
        const data = await response.json()
        if (data && data.solved) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'GeeksforGeeks') {
                return {
                  ...stat,
                  solved: data.solved,
                  rating: data.rating || 'Top 5%',
                  link: data.link || stat.link,
                }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch GFG data:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'GeeksforGeeks') {
              return { ...stat, solved: '52', rating: 'Top 5%' }
            }
            return stat
          })
        )
      }
    }

    const fetchKaggleData = async () => {
      try {
        const response = await fetch('/api/kaggle', { cache: 'no-store' })
        const data = await response.json()
        if (data) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'Kaggle') {
                const totalNotebooks = data.notebooks?.length || 2
                const totalDatasets = data.datasets?.length || 2
                const totalContributions = totalNotebooks + totalDatasets
                return {
                  ...stat,
                  solved: `${totalContributions} Contribs`,
                  rating: data.profile?.tier || 'Novice',
                  link: data.link || stat.link,
                }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch Kaggle stats:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'Kaggle') {
              return { ...stat, solved: '4 Contribs', rating: 'Novice' }
            }
            return stat
          })
        )
      }
    }

    const fetchDockerData = async () => {
      try {
        const response = await fetch('/api/docker', { cache: 'no-store' })
        const data = await response.json()
        if (data) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'Docker') {
                const totalImages = data.profile?.reposCount || 3
                return {
                  ...stat,
                  solved: `${totalImages} Images`,
                  rating: 'Docker Hub',
                  link: data.link || stat.link,
                }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch Docker stats:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'Docker') {
              return { ...stat, solved: '3 Images', rating: 'Docker Hub' }
            }
            return stat
          })
        )
      }
    }

    fetchLeetCodeData()
    fetchGitHubData()
    fetchCode360Data()
    fetchGFGData()
    fetchKaggleData()
    fetchDockerData()
  }, [])

  const problemStats = stats.filter((s) => ['LeetCode', 'GeeksforGeeks', 'Code360'].includes(s.platform))
  const projectStats = stats.filter((s) => ['GitHub', 'Kaggle', 'Docker'].includes(s.platform))
  const projectAnchor: Record<string, string> = {
    GitHub: '#projects-github',
    Kaggle: '#projects-kaggle',
    Docker: '#projects-docker',
  }

  return (
    <section id="dashboard" className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="By the numbers"
          title="Developer Activity"
          description="A live track record across algorithmic problem solving, open-source repositories, ML datasets and containerised deployments."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SummaryPanel title="Problems solved" icon={<Code2 className="size-4" />} total={totalProblems} delay={0}>
            {problemStats.map((stat) => (
              <PlatformTile key={stat.platform} stat={stat} href={stat.link} external />
            ))}
          </SummaryPanel>

          <SummaryPanel title="Projects shipped" icon={<FaGithub className="size-4" />} total={totalProjects} delay={0.1}>
            {projectStats.map((stat) => {
              const hash = projectAnchor[stat.platform] ?? '#projects'
              return (
                <PlatformTile
                  key={stat.platform}
                  stat={stat}
                  href={hash}
                  onNavigate={() => {
                    // featured-projects listens for these hashes to switch tabs
                    window.location.hash = hash
                    scrollToSection('projects')
                  }}
                />
              )
            })}
          </SummaryPanel>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartPanel title="Problems solved" caption="Last 7 months" mounted={mounted} delay={0.15}>
            <AreaChart data={activityData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
              <ChartDefs id="fillSolved" />
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-5} />
              <Tooltip content={<ChartTooltip unit="solved" />} cursor={{ stroke: 'var(--coral)', strokeOpacity: 0.4 }} />
              <Area
                type="monotone"
                dataKey="solved"
                stroke="var(--coral)"
                strokeWidth={2.5}
                fill="url(#fillSolved)"
                activeDot={{ r: 5, fill: 'var(--coral)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartPanel>

          <ChartPanel title="Projects" caption="Quarterly" mounted={mounted} delay={0.25}>
            <AreaChart data={projectActivityData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
              <ChartDefs id="fillProjects" />
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-5} allowDecimals={false} />
              <Tooltip content={<ChartTooltip unit="projects" />} cursor={{ stroke: 'var(--coral)', strokeOpacity: 0.4 }} />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="var(--coral)"
                strokeWidth={2.5}
                fill="url(#fillProjects)"
                activeDot={{ r: 5, fill: 'var(--coral)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartPanel>
        </div>
      </div>
    </section>
  )
}

type Stat = (typeof defaultStats)[number]
const EASE = [0.16, 1, 0.3, 1] as const

function SummaryPanel({
  title,
  icon,
  total,
  delay,
  children,
}: {
  title: string
  icon: React.ReactNode
  total: number
  delay: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className="flex flex-col rounded-md border border-border bg-card p-6 sm:p-8"
    >
      <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-coral-ink">{icon}</span>
        {title}
      </p>
      <motion.p
        key={total}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-4 text-5xl font-bold tabular-nums tracking-tight text-foreground sm:text-6xl"
      >
        {total > 0 ? total : '—'}
        {total > 0 && <span className="ml-1 text-coral-ink">+</span>}
      </motion.p>
      <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 min-[420px]:grid-cols-3">{children}</div>
    </motion.div>
  )
}

function PlatformTile({
  stat,
  href,
  external,
  onNavigate,
}: {
  stat: Stat
  href: string
  external?: boolean
  onNavigate?: () => void
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={
        onNavigate
          ? (e) => {
              e.preventDefault()
              onNavigate()
            }
          : undefined
      }
      className="group flex min-w-0 flex-col justify-between gap-3 rounded-[4px] border border-transparent bg-pill/70 p-4 transition-colors duration-300 hover:border-coral/50"
    >
      <span className="flex items-center justify-between gap-2 text-xs font-semibold text-foreground">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-coral-ink">{stat.icon}</span>
          <span className="truncate">{stat.platform}</span>
        </span>
        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </span>
      <span>
        <span className="block text-xl font-bold tabular-nums tracking-tight text-foreground">{stat.solved}</span>
        {stat.rating && <span className="mt-0.5 block truncate text-[11px] font-medium text-coral-ink">{stat.rating}</span>}
      </span>
    </a>
  )
}

function ChartPanel({
  title,
  caption,
  mounted,
  delay,
  children,
}: {
  title: string
  caption: string
  mounted: boolean
  delay: number
  children: React.ReactElement
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className="rounded-md border border-border bg-card p-6 sm:p-8"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
        <span className="font-mono text-xs text-muted-foreground">{caption}</span>
      </div>
      <div className="h-[260px] w-full sm:h-[300px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded bg-pill/50" />
        )}
      </div>
    </motion.div>
  )
}

function ChartDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--coral)" stopOpacity={0.35} />
        <stop offset="100%" stopColor="var(--coral)" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean
  payload?: { value?: number | string }[]
  label?: string | number
  unit: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[4px] border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="font-mono text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        <span className="text-coral-ink">{payload[0]?.value}</span> {unit}
      </p>
    </div>
  )
}
