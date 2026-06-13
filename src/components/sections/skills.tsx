'use client'

import { motion } from 'framer-motion'
import {
  FaReact,
  FaPython,
  FaDatabase,
  FaRobot,
  FaNodeJs,
  FaTools,
  FaBook,
  FaServer,
  FaInfinity
} from 'react-icons/fa'
import { TbWorld, TbBrandNextjs } from 'react-icons/tb'

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: <FaPython className="w-8 h-8 text-foreground" />,
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript'],
  },
  {
    title: 'Core Subjects',
    icon: <FaBook className="w-8 h-8 text-foreground" />,
    skills: ['Object-Oriented Programming', 'Database Management', 'Operating Systems', 'Computer Networks'],
  },
  {
    title: 'AI ML',
    icon: <FaRobot className="w-8 h-8 text-foreground" />,
    skills: [
      'NLP & LLMs',
      'Hugging Face',
      'Prompt Engineering',
      'RAG Systems',
      'LangChain',
      'FAISS',
    ],
  },
  {
    title: 'Backend & Data',
    icon: <FaDatabase className="w-8 h-8 text-foreground" />,
    skills: [
      'Node.js',
      'Express.js',
      'FastAPI',
      'REST APIs',
      'Data Pipelines',
    ],
  },
  {
    title: 'DevOps',
    icon: <FaInfinity className="w-8 h-8 text-foreground" />,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux', 'Terraform'],
  },
  {
    title: 'Databases',
    icon: <TbWorld className="w-8 h-8 text-foreground" />,
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    title: 'Cloud & Tools',
    icon: <FaTools className="w-8 h-8 text-foreground" />,
    skills: [
      'AWS',
      'Git & GitHub',
      'Vercel',
      'Render',
      'Postman',
      'VS Code',
    ],
  },
]

const VennDiagram = () => (
  <div className="relative w-full max-w-md mx-auto my-16 aspect-square flex items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad3" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <circle cx="150" cy="150" r="110" fill="url(#grad1)" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
        <circle cx="250" cy="150" r="110" fill="url(#grad2)" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
        <circle cx="200" cy="240" r="110" fill="url(#grad3)" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
        
        <text x="120" y="110" textAnchor="middle" fill="currentColor" className="text-sm font-bold opacity-80" fontSize="16">AI / ML</text>
        <text x="280" y="110" textAnchor="middle" fill="currentColor" className="text-sm font-bold opacity-80" fontSize="16">DevOps</text>
        <text x="200" y="300" textAnchor="middle" fill="currentColor" className="text-sm font-bold opacity-80" fontSize="16">Backend</text>

        <text x="200" y="145" textAnchor="middle" fill="currentColor" className="text-xs font-bold opacity-90" fontSize="12">MLOps</text>
        <text x="150" y="210" textAnchor="middle" fill="currentColor" className="text-xs font-bold opacity-90" fontSize="12">Data Eng</text>
        <text x="250" y="210" textAnchor="middle" fill="currentColor" className="text-xs font-bold opacity-90" fontSize="12">Cloud native</text>
        <text x="200" y="200" textAnchor="middle" fill="currentColor" className="text-sm font-black opacity-100" fontSize="14">AI Engineering</text>
      </svg>
    </div>
  </div>
)

export const Skills = () => {
  return (
    <section id="skills" className="relative min-h-screen py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Technical <span className="text-foreground/80">Skills.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            A comprehensive overview of my technical expertise and tools.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VennDiagram />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group p-8 rounded-[2rem] border border-foreground/5 bg-foreground/5 backdrop-blur-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-4 mb-8">
                <div className="p-4 bg-foreground/5 rounded-2xl border border-border group-hover:scale-110 group-hover:border-foreground/50 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all duration-300">
                  {category.title}
                </h3>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2.5">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-foreground/5 border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/10 group-hover:border-foreground/20 transition-all duration-300 cursor-default shadow-sm backdrop-blur-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
