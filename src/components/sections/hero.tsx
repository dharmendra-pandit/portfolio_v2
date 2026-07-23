'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FileText, ChevronDown, ArrowRight, Code2, Cpu, Globe, Terminal } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Button } from '@/components/ui/button'
import { TypingAnimation } from '@/components/ui/typing-animation'

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-[90vh] py-20 sm:py-32 flex items-center justify-center overflow-hidden" id="home">
      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center"
      >
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground backdrop-blur-xl mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Software Engineer & Full-Stack Developer</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6 font-heading text-foreground"
        >
          <span className="text-gradient">
            Dharmendra
          </span><br />
          <span className="text-foreground">
            Pandit.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <div className="h-auto min-h-12 mb-8 flex items-center justify-center">
          <TypingAnimation 
            text="AI/ML • DevOps • Python Developer"
            className="text-base sm:text-2xl md:text-3xl font-semibold text-muted-foreground text-center tracking-tight"
            delay={0.8}
            duration={0.04}
          />
        </div>

        {/* Short Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-12 text-center leading-relaxed"
        >
          Engineering production software applications, scalable backend microservices, and machine learning models.
          Strong foundation in Data Structures, Algorithms (148+ Solved), and System Design.
        </motion.p>

        {/* Action Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full h-14 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all cursor-pointer border-0 gap-2"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full h-14 px-8 text-base font-semibold border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Let's Connect
            </Button>
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto">
            <a
              href="/Dharmendra_Pandit_Software_Engineer_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full h-14 px-8 text-base border border-border bg-background hover:bg-muted text-foreground transition-all duration-300 font-semibold cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-foreground" />
              Resume
            </a>
          </MagneticButton>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          {[
            { icon: FaGithub, href: "https://github.com/dharmendra-pandit", label: "GitHub" },
            { icon: FaLinkedin, href: "https://linkedin.com/in/dharmendra-pandit1", label: "LinkedIn" },
            { icon: FaTwitter, href: "https://x.com/Dharmendra62042", label: "Twitter" }
          ].map((social, i) => (
            <MagneticButton key={i} intensity={0.4}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex items-center justify-center w-12 h-12 bg-foreground/5 border border-border rounded-full hover:bg-foreground/10 hover:border-border hover:scale-110 transition-all backdrop-blur-md text-foreground shadow-sm"
              >
                <social.icon className="w-5 h-5" />
              </a>
            </MagneticButton>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Down Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center animate-bounce cursor-pointer z-20"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-medium">
          Scroll Down
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </section>
  )
}

