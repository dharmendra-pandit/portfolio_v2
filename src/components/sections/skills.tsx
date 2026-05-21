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
} from 'react-icons/fa'
import { TbWorld, TbBrandNextjs } from 'react-icons/tb'

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: <FaPython className="w-8 h-8 text-foreground" />,
    skills: ['Java', 'Python', 'TypeScript'],
  },
  {
    title: 'Core Subjects',
    icon: <FaBook className="w-8 h-8 text-foreground" />,
    skills: ['Object-Oriented Programming', 'Database Management', 'Operating Systems', 'Computer Networks'],
  },
  {
    title: 'AI & Generative AI',
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
    title: 'Frontend Development',
    icon: <FaReact className="w-8 h-8 text-foreground" />,
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    title: 'Databases',
    icon: <TbWorld className="w-8 h-8 text-foreground" />,
    skills: ['MongoDB', 'MySQL'],
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

export const Skills = () => {
  return (
    <section id="skills" className="relative min-h-screen py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
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
