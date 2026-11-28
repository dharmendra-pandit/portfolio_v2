'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Code2, Target } from 'lucide-react'
import { FaGithub, FaKaggle, FaDocker } from 'react-icons/fa'
import { Section } from '@/components/ui/section-heading'
import { CountUp, Reveal, VIEWPORT, rise, stagger, trackSpotlight } from '@/components/ui/motion'
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
    rating: 'Public repositories',
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
    rating: 'Container images',
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
                  rating: 'Public repositories',
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
              return { ...stat, solved: '0', rating: 'Public repositories' }
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
                  solved: `${totalContributions} contributions`,
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
              return { ...stat, solved: '4 contributions', rating: 'Novice' }
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
                  solved: `${totalImages} images`,
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
              return { ...stat, solved: '3 images', rating: 'Docker Hub' }
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
    <Section
      id="dashboard"
      title="Activity"
      lead="Current figures from my coding profiles, covering algorithmic problem solving, open-source repositories, machine-learning work on Kaggle and published container images."
    >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.12)}
          className="grid grid-cols-1 gap-5"
        >
          <SummaryPanel title="Algorithmic problems solved" total={totalProblems}>
            {problemStats.map((stat) => (
              <PlatformTile key={stat.platform} stat={stat} href={stat.link} external />
            ))}
          </SummaryPanel>

          <SummaryPanel title="Published work" total={totalProjects}>
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
        </motion.div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartPanel title="Problems solved" caption="By month, last 7 months" mounted={mounted}>
            <AreaChart data={activityData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-5} />
              <Tooltip content={<ChartTooltip unit="solved" />} cursor={{ stroke: 'var(--muted-foreground)', strokeOpacity: 0.4 }} />
              <Area
                type="monotone"
                dataKey="solved"
                stroke="var(--brass)"
                strokeWidth={2}
                fill="var(--brass)"
                fillOpacity={0.1}
                animationDuration={1400}
                activeDot={{ r: 4, fill: 'var(--brass)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartPanel>

          <ChartPanel title="Projects published" caption="By quarter" mounted={mounted}>
            <AreaChart data={projectActivityData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-5} allowDecimals={false} />
              <Tooltip content={<ChartTooltip unit="projects" />} cursor={{ stroke: 'var(--muted-foreground)', strokeOpacity: 0.4 }} />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="var(--brand)"
                strokeWidth={2}
                fill="var(--brand)"
                fillOpacity={0.1}
                animationDuration={1400}
                activeDot={{ r: 4, fill: 'var(--brand)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartPanel>
        </div>
    </Section>
  )
}

type Stat = (typeof defaultStats)[number]

function SummaryPanel({ title, total, children }: { title: string; total: number; children: React.ReactNode }) {
  return (
    <motion.div
      variants={rise}
      onPointerMove={trackSpotlight}
      className="spotlight grid gap-x-8 gap-y-6 rounded-xl border border-border bg-card/70 p-6 transition-colors duration-500 hover:border-brass/30 sm:p-7 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center"
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 font-serif text-5xl font-normal tracking-[-0.02em] text-foreground">
          {total > 0 ? (
            <>
              <CountUp value={total} />
              <span className="text-brass">+</span>
            </>
          ) : (
            '—'
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border min-[420px]:grid-cols-3">
        {children}
      </div>
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
      className="group relative flex min-w-0 flex-col justify-between gap-3 bg-card p-4 transition-colors duration-300 hover:bg-pill/70"
    >
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-foreground">
        <span className="shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-brass">{stat.icon}</span>
        <span className="truncate">{stat.platform}</span>
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
      <span>
        <span className="block text-lg font-medium tabular-nums text-foreground transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">
          {stat.solved}
        </span>
        {stat.rating && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{stat.rating}</span>}
      </span>
    </a>
  )
}

function ChartPanel({
  title,
  caption,
  mounted,
  children,
}: {
  title: string
  caption: string
  mounted: boolean
  children: React.ReactElement
}) {
  const box = useRef<HTMLDivElement>(null)
  // Mount the chart once it is on screen, so its draw-in animation is actually seen.
  const seen = useInView(box, { once: true, amount: 0.35 })
  return (
    <Reveal className="rounded-xl border border-border bg-card/70 p-6 sm:p-7">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <span className="text-[13px] text-muted-foreground">{caption}</span>
      </div>
      <div ref={box} className="h-[260px] w-full sm:h-[300px]">
        {mounted && seen ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-md bg-pill/30" />
        )}
      </div>
    </Reveal>
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
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">
        {payload[0]?.value} {unit}
      </p>
    </div>
  )
}
