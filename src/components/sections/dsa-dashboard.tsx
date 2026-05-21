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
import { FaGithub } from 'react-icons/fa'

// Default mock data, will be updated dynamically
const defaultActivityData = [
  { name: 'Jan', solved: 40 },
  { name: 'Feb', solved: 30 },
  { name: 'Mar', solved: 55 },
  { name: 'Apr', solved: 45 },
  { name: 'May', solved: 70 },
  { name: 'Jun', solved: 65 },
  { name: 'Jul', solved: 85 },
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
  const [activityData, setActivityData] = useState(defaultActivityData)

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        const response = await fetch(
          'https://alfa-leetcode-api.onrender.com/dpbth/profile',
        )
        const data = await response.json()

        if (data && data.totalSolved) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'LeetCode') {
                return {
                  ...stat,
                  solved: data.totalSolved.toString(),
                  rating: data.ranking ? `Rank ${data.ranking}` : 'Unranked',
                }
              }
              return stat
            }),
          )
        }
      } catch (error) {
        console.error('Failed to fetch LeetCode data:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'LeetCode') {
              return { ...stat, solved: '400+', rating: 'Unranked' }
            }
            return stat
          }),
        )
      }
    }

    const fetchGitHubData = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/dharmendra-pandit',
        )
        const data = await response.json()
        if (data && data.public_repos !== undefined) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'GitHub') {
                return {
                  ...stat,
                  solved: data.public_repos.toString(),
                  rating: 'Public Projects',
                }
              }
              return stat
            }),
          )
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.platform === 'GitHub') {
              return { ...stat, solved: '20+', rating: 'Public Projects' }
            }
            return stat
          }),
        )
      }
    }

    const fetchCode360Data = async () => {
      try {
        const response = await fetch('/api/code360')
        const data = await response.json()
        if (data && data.solved) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'Code360') {
                return { ...stat, solved: data.solved, rating: data.rating || 'Scholar' }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch Code360 data:', error)
      }
    }

    const fetchGFGData = async () => {
      try {
        const response = await fetch('/api/gfg')
        const data = await response.json()
        if (data && data.solved) {
          setStats((prevStats) =>
            prevStats.map((stat) => {
              if (stat.platform === 'GeeksforGeeks') {
                return { ...stat, solved: data.solved, rating: data.rating || 'Top 5%' }
              }
              return stat
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch GFG data:', error)
      }
    }

    const fetchLeetCodeCalendar = async () => {
      try {
        const response = await fetch('https://alfa-leetcode-api.onrender.com/dpbth/calendar')
        const data = await response.json()
        if (data && data.submissionCalendar) {
          const calendar = JSON.parse(data.submissionCalendar)
          const now = new Date()
          const months: {name: string, year: number, month: number, solved: number}[] = []
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            months.push({
              name: d.toLocaleString('default', { month: 'short' }),
              year: d.getFullYear(),
              month: d.getMonth(),
              solved: 0
            })
          }
          
          Object.entries(calendar).forEach(([timestamp, count]) => {
            const date = new Date(parseInt(timestamp) * 1000)
            const m = months.find(m => m.year === date.getFullYear() && m.month === date.getMonth())
            if (m) {
              m.solved += Number(count)
            }
          })
          
          setActivityData(months.map(m => ({ name: m.name, solved: m.solved })))
        }
      } catch (error) {
        console.error('Failed to fetch LC calendar:', error)
      }
    }

    fetchLeetCodeData()
    fetchLeetCodeCalendar()
    fetchGitHubData()
    fetchCode360Data()
    fetchGFGData()
  }, [])

  return (
    <section id="dashboard" className="relative min-h-screen py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
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
            Consistency is the key to mastery. Here is my problem-solving and
            open-source contribution journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                {/* Animated Glow Border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-foreground/20 to-foreground/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                
                <a
                  href={stat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative z-10 h-full"
                >
                  <Card className="h-full p-6 bg-foreground/5 border border-foreground/5 rounded-3xl backdrop-blur-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
                    <CardHeader className="p-0 pb-2 relative z-10 border-none">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-3 group-hover:text-foreground transition-colors">
                        <div className="p-2.5 bg-foreground/5 rounded-xl border border-border group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                          {stat.icon}
                        </div>
                        {stat.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 relative z-10 border-none">
                      <div className="flex justify-between items-end mt-4">
                        <div className="text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all">
                          {stat.solved}
                        </div>
                        <div className="text-sm text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Trophy className="w-4 h-4" /> {stat.rating}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
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
        </div>
      </div>
    </section>
  )
}
