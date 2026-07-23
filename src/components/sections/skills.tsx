'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPython,
  FaDatabase,
  FaRobot,
  FaTools,
  FaServer,
  FaInfinity
} from 'react-icons/fa'
import { Code2, Sparkles, Layers } from 'lucide-react'

const skillCategories = [
  {
    id: 'ai-ml',
    title: 'AI & ML',
    icon: <FaRobot className="w-6 h-6 text-foreground" />,
    skills: [
      'Machine Learning',
      'Deep Learning',
      'NLP & LLMs',
      'Computer Vision',
      'Hugging Face',
      'Prompt Engineering',
      'RAG Systems',
      'LangChain',
      'TensorFlow',
      'PyTorch',
    ],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    icon: <FaServer className="w-6 h-6 text-foreground" />,
    skills: [
      'Node.js',
      'Express.js',
      'FastAPI',
      'REST APIs',
      'Microservices',
      'System Design',
      'Data Pipelines',
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    icon: <FaInfinity className="w-6 h-6 text-foreground" />,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'AWS', 'Linux', 'Terraform'],
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    icon: <FaDatabase className="w-6 h-6 text-foreground" />,
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Vector DBs (FAISS)'],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: <Code2 className="w-6 h-6 text-foreground" />,
    skills: ['Problem Solving (148+ Solved)', 'Algorithm Design', 'Time/Space Complexity', 'Graph Theory', 'Dynamic Programming'],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: <FaPython className="w-6 h-6 text-foreground" />,
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'C++'],
  },
  {
    id: 'tools',
    title: 'Tools & Ecosystem',
    icon: <FaTools className="w-6 h-6 text-foreground" />,
    skills: [
      'Git & GitHub',
      'Vercel',
      'Postman',
      'VS Code',
      'Jupyter',
    ],
  },
]

const filterTabs = [
  { id: 'all', label: 'All Stack' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'databases', label: 'Databases' },
  { id: 'languages', label: 'Languages' },
]

export const Skills = () => {
  const [selectedTab, setSelectedTab] = useState('all')

  const filteredCategories = selectedTab === 'all'
    ? skillCategories
    : skillCategories.filter(cat => cat.id === selectedTab)

  return (
    <section id="skills" className="relative py-24 sm:py-36 flex items-center justify-center overflow-hidden border-t border-border/40">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-xs font-semibold text-foreground mb-6 shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-foreground" />
            <span>Technologies & Skills</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 font-heading text-foreground"
          >
            Skills & <span className="text-gradient">Tech Stack.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed"
          >
            Core programming languages, frameworks, cloud infrastructure, and database systems I use to build production software.
          </motion.p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-foreground/5 border border-border rounded-2xl backdrop-blur-md max-w-fit mx-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  selectedTab === tab.id
                    ? 'bg-foreground text-background font-bold shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="relative group p-8 rounded-[2rem] bg-card border border-border/60 overflow-hidden shadow-lg transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-foreground/5 rounded-2xl border border-border group-hover:scale-110 transition-all duration-500 shadow-sm text-foreground">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {category.title}
                  </h3>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-foreground/5 border border-border rounded-full text-xs font-medium text-foreground hover:bg-foreground/10 transition-all duration-300 cursor-default shadow-sm backdrop-blur-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

