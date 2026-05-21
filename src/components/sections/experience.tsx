'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { GraduationCap, Award, Cloud, Code } from 'lucide-react'

const timelineData = [
  {
    date: 'July 2023 - July 2027',
    title: 'B.Tech in Computer Science Engineering',
    company: 'JECRC University, Jaipur',
    description:
      "Currently pursuing bachelor's degree with a CGPA of 8.17. Focusing on core computer science fundamentals, full-stack development, and artificial intelligence.",
    icon: <GraduationCap className="w-5 h-5 text-foreground" />,
  },
  {
    date: 'Achievement',
    title: 'AI-Powered Applications',
    company: 'Full Stack Integration',
    description:
      'Built and deployed AI-powered full-stack applications integrating Machine Learning and RAG-based systems.',
    icon: <Award className="w-5 h-5 text-foreground" />,
  },
  {
    date: 'Achievement',
    title: 'Generative AI Integration',
    company: 'Tech Stack Mastery',
    description:
      'Gained hands-on experience with Generative AI tools including LangChain, FAISS, Hugging Face, and LLM API integration.',
    icon: <Code className="w-5 h-5 text-foreground" />,
  },
  {
    date: 'Achievement',
    title: 'Cloud Deployment',
    company: 'DevOps & Infrastructure',
    description:
      'Experience with cloud deployment platforms including AWS (EC2, S3, DynamoDB), Vercel, and Render.',
    icon: <Cloud className="w-5 h-5 text-foreground" />,
  },
]

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <section ref={containerRef} id="experience" className="relative py-48 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Education & <span className="text-foreground/80">Achievements.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            My academic journey and key milestones in technology.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative mt-12">
          {/* Background Timeline Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-foreground/10 -translate-x-1/2 rounded-full" />
          
          {/* Active Glowing Timeline Line */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-foreground/50 via-foreground/20 to-transparent -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" 
          />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-start mb-16 group ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Icon */}
              <div className="absolute left-[28px] md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background border-4 border-background flex items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:border-foreground transition-all duration-500">
                {item.icon}
              </div>

              {/* Content Box */}
              <div
                className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pl-20' : 'md:pr-20 text-left md:text-right'}`}
              >
                <div className="relative p-8 bg-foreground/5 border border-foreground/5 rounded-3xl backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                  <span className="text-foreground font-mono text-sm mb-3 block opacity-60">
                    {item.date}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <h4 className="text-muted-foreground text-lg mb-4">
                    {item.company}
                  </h4>
                  <p className="text-muted-foreground/80 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
