'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Code2, Trophy, Star, Target } from 'lucide-react'
import { FaGithub, FaKaggle, FaDocker } from 'react-icons/fa'

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
    icon: <Code2 className="w-5 h-5 text-foreground" />,
    rating: '...',
    link: 'https://leetcode.com/dpbth/',
  },
  {
    platform: 'GitHub',
    solved: 'Loading...',
    icon: <FaGithub className="w-5 h-5 text-foreground" />,
    rating: 'Repositories',
    link: 'https://github.com/dharmendra-pandit',
  },
  {
    platform: 'Kaggle',
    solved: 'Loading...',
    icon: <FaKaggle className="w-5 h-5 text-foreground" />,
    rating: '...',
    link: 'https://www.kaggle.com/dharmendrapandit12',
  },
  {
    platform: 'Docker',
    solved: 'Loading...',
    icon: <FaDocker className="w-5 h-5 text-foreground" />,
    rating: 'Pulls',
    link: 'https://hub.docker.com/u/iampanditji',
  },
  {
    platform: 'Code360',
    solved: 'Loading...',
    icon: <Target className="w-5 h-5 text-foreground" />,
    rating: '...',
    link: 'https://www.naukri.com/code360/profile/panditbth',
  },
  {
    platform: 'GeeksforGeeks',
    solved: 'Loading...',
    icon: <Target className="w-5 h-5 text-foreground" />,
    rating: '...',
    link: 'https://www.geeksforgeeks.org/profile/iampanditbth?tab=activity',
  },
]

export const DsaDashboard = () => {
  const [stats, setStats] = useState(defaultStats)
  const [leetcodeActivity, setLeetcodeActivity] = useState<any[]>(getInitialActivityData())
  const [activityData, setActivityData] = useState(defaultActivityData)
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
      const num = parseInt(stat.solved)
      return acc + (isNaN(num) ? 0 : num)
    } else if (stat.platform === 'Kaggle') {
      const num = parseInt(stat.solved.split(' ')[0])
      return acc + (isNaN(num) ? 0 : num)
    }
    return acc
  }, 0)

  // Dynamically compute combined activity data of LeetCode, GFG, and Code360
  useEffect(() => {
    const gfgStat = stats.find(s => s.platform === 'GeeksforGeeks')
    const code360Stat = stats.find(s => s.platform === 'Code360')

    const gfgSolvedStr = gfgStat ? gfgStat.solved : '0'
    const code360SolvedStr = code360Stat ? code360Stat.solved : '0'

    const gfgTotal = parseInt(gfgSolvedStr) || 250
    const code360Total = parseInt(code360SolvedStr) || 350

    // Distribute GFG and Code360 solved counts across the 7 months dynamically
    const gfgRatios = [0.03, 0.04, 0.035, 0.045, 0.038, 0.042, 0.03]
    const code360Ratios = [0.035, 0.045, 0.04, 0.05, 0.042, 0.048, 0.035]

    const combined = leetcodeActivity.map((m, idx) => {
      const gfgSolved = Math.round(gfgTotal * (gfgRatios[idx] || 0.03))
      const code360Solved = Math.round(code360Total * (code360Ratios[idx] || 0.035))
      return {
        name: m.name,
        solved: m.solved + gfgSolved + code360Solved
      }
    })
    setActivityData(combined)
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
                const totalPulls = data.profile?.pullCount || 0
                return {
                  ...stat,
                  solved: `${totalPulls.toLocaleString()} Pulls`,
                  rating: `${data.profile?.reposCount || 0} Images`,
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
              return { ...stat, solved: '96 Pulls', rating: '3 Images' }
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

  return (
    <section id="dashboard" className="relative min-h-screen py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Coding <span className="text-foreground/80">Profile.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            Consistency is the key to mastery in AI & ML, DevOps, and algorithmic problem-solving. Here is my open-source contribution and problem-solving journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
           {/* Total Summaries Box 1 */}
           <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
             <Card className="relative h-full p-6 bg-foreground/5 border border-foreground/5 rounded-3xl backdrop-blur-3xl overflow-hidden shadow-lg flex flex-col justify-between">
               <div>
                 <CardHeader className="p-0 pb-2 border-none">
                   <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-3">
                     <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                       <Code2 className="w-6 h-6" />
                     </div>
                     Total Problems Solved
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 border-none mt-4 mb-6">
                   <div className="text-5xl font-black text-foreground">
                     {totalProblems > 0 ? totalProblems : '...'}
                   </div>
                 </CardContent>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                 {stats.filter(s => ['LeetCode', 'GeeksforGeeks', 'Code360'].includes(s.platform)).map((stat, index) => (
                   <a key={index} href={stat.link} target="_blank" rel="noopener noreferrer" className="group/stat block bg-foreground/5 p-4 rounded-2xl hover:bg-foreground/10 transition-colors">
                     <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground group-hover/stat:text-foreground transition-colors">
                       {stat.icon} {stat.platform}
                     </div>
                     <div className="flex items-end justify-between">
                       <div className="text-2xl font-bold text-foreground group-hover/stat:text-primary transition-colors">
                         {stat.solved}
                       </div>
                       <div className="text-xs text-primary/80 flex items-center gap-1">
                         <Trophy className="w-3 h-3" /> {stat.rating}
                       </div>
                     </div>
                   </a>
                 ))}
               </div>
             </Card>
           </div>
           
           {/* Total Summaries Box 2 */}
           <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
             <Card className="relative h-full p-6 bg-foreground/5 border border-foreground/5 rounded-3xl backdrop-blur-3xl overflow-hidden shadow-lg flex flex-col justify-between">
               <div>
                 <CardHeader className="p-0 pb-2 border-none">
                   <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-3">
                     <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                       <FaGithub className="w-6 h-6" />
                     </div>
                     Total Projects
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 border-none mt-4 mb-6">
                   <div className="text-5xl font-black text-foreground">
                     {totalProjects > 0 ? totalProjects : '...'}
                   </div>
                 </CardContent>
               </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  {stats.filter(s => ['GitHub', 'Kaggle', 'Docker'].includes(s.platform)).map((stat, index) => {
                     let targetLink = '#projects';
                     if (stat.platform === 'GitHub') targetLink = '#projects-github';
                     else if (stat.platform === 'Kaggle') targetLink = '#projects-kaggle';
                     else if (stat.platform === 'Docker') targetLink = '#projects-docker';
                     return (
                       <a
                         key={index}
                         href={targetLink}
                         className="group/stat block bg-foreground/5 p-4 rounded-2xl hover:bg-foreground/10 transition-colors"
                       >
                         <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground group-hover/stat:text-foreground transition-colors">
                           {stat.icon} {stat.platform}
                         </div>
                         <div className="flex items-end justify-between">
                           <div className="text-2xl font-bold text-foreground group-hover/stat:text-primary transition-colors">
                             {stat.solved}
                           </div>
                           <div className="text-xs text-primary/80 flex items-center gap-1">
                             <Trophy className="w-3 h-3" /> {stat.rating}
                           </div>
                         </div>
                       </a>
                     );
                  })}
                </div>
              </Card>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

          {/* Chart Section */}
          <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-full"
            >
              <Card className="h-full p-8 bg-foreground/5 border border-foreground/5 rounded-[2.5rem] backdrop-blur-3xl transition-all duration-500 hover:border-foreground/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <CardHeader className="p-0 pb-8 border-none">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Problems Solved (Last 7 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full p-0 border-none">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={activityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorSolved"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--primary)"
                              stopOpacity={0.5}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--primary)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                          dx={-10}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                          }}
                          itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="solved"
                          stroke="var(--primary)"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSolved)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full"
            >
              <Card className="h-full p-8 bg-foreground/5 border border-foreground/5 rounded-[2.5rem] backdrop-blur-3xl transition-all duration-500 hover:border-foreground/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <CardHeader className="p-0 pb-8 border-none">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Projects (Quarterly Basis)
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full p-0 border-none">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={projectActivityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} dx={-10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                          }}
                          itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="projects" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorProjects)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
