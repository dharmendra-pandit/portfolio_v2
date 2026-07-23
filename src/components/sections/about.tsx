'use client'

import { motion } from 'framer-motion'
import {
  TerminalSquare,
  BrainCircuit,
  Globe,
  Rocket,
  Code2,
} from 'lucide-react'

export const About = () => {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-36 flex items-center justify-center overflow-hidden"
    >
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border text-sm mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <span className="text-foreground">My Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Architecting the <span className="text-foreground/80">Future.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Main Bio Bento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 relative group rounded-[2.5rem] border border-foreground/5 bg-foreground/5 p-10 overflow-hidden backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <Code2 className="w-8 h-8 text-foreground" />
                Dharmendra Pandit
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I am an aspiring Software Engineer driven by an immense passion
                for building intelligent systems and robust applications. My
                expertise spans across Backend Development, Gen-AI, Python, and
                DevOps, and Algorithmic Problem Solving.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What excites me the most is bridging the gap between theoretical
                AI models and real-world practical applications. Whether I'm
                designing complex REST architectures or developing RAG pipelines
                using large language models, my goal is always to create
                impactful, scalable, and efficient software.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                {['Python', 'Next.js', 'FastAPI', 'LLMs', 'Node.js', 'Gen-AI'].map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-foreground/5 border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default backdrop-blur-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Focus Areas */}
          <div className="lg:col-span-4 grid gap-6">
            {[
              {
                icon: TerminalSquare,
                title: "Backend & APIs",
                desc: "Developing scalable backend architectures using Python and Node.js.",
                color: "text-foreground",
                bg: "bg-foreground/10"
              },
              {
                icon: BrainCircuit,
                title: "Generative AI",
                desc: "Engineering intelligence through custom LLMs and complex RAG pipelines.",
                color: "text-foreground",
                bg: "bg-foreground/10"
              },
              {
                icon: Code2,
                title: "Problem Solving",
                desc: "Mastering algorithms and data structures for optimal system performance.",
                color: "text-foreground",
                bg: "bg-foreground/10"
              }
            ].map((focus, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group p-6 rounded-3xl border border-foreground/5 bg-foreground/5 overflow-hidden backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${focus.bg} ${focus.color} group-hover:scale-110 transition-transform duration-500`}>
                    <focus.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{focus.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {focus.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
