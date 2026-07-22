'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FileText, ChevronDown, Sparkles, ArrowRight, Code2, Cpu, Globe } from 'lucide-react'
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
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="home">
      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center"
      >
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-400 backdrop-blur-xl mb-8 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Available for Full-Time & Engineering Roles</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-[0.9] mb-6 font-heading"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
            Dharmendra
          </span><br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Pandit.
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <div className="h-auto min-h-12 mb-8 flex items-center justify-center">
          <TypingAnimation 
            text="Software Engineer • AI & ML Developer • DevOps Specialist"
            className="text-lg sm:text-2xl md:text-3xl font-semibold text-neutral-300 text-center tracking-tight"
            delay={0.8}
            duration={0.04}
          />
        </div>

        {/* Short Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-10 text-center leading-relaxed"
        >
          Building scalable production software, deep learning ML pipelines, and cloud microservices. 
          Driven by algorithmic excellence with 148+ solved problem profiles.
        </motion.p>

        {/* Tech Stack Pills Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12 max-w-xl"
        >
          {[
            { label: 'Next.js 16', icon: Globe },
            { label: 'TypeScript', icon: Code2 },
            { label: 'Python & PyTorch', icon: Cpu },
            { label: 'FastAPI & Node', icon: Sparkles },
            { label: 'Docker & Kubernetes', icon: Cpu },
          ].map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <pill.icon className="w-3.5 h-3.5 text-blue-400" />
              <span>{pill.label}</span>
            </span>
          ))}
        </motion.div>

        {/* Action Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <MagneticButton>
            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(79,70,229,0.35)] transition-all cursor-pointer border-0 gap-2"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-8 text-base font-semibold border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all cursor-pointer"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Let's Connect
            </Button>
          </MagneticButton>
          <MagneticButton>
            <a
              href="/Dharmendra_Pandit_Software_Engineer_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full h-14 px-8 text-base border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all duration-300 font-semibold cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-blue-400" />
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
                className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all backdrop-blur-md text-neutral-300 hover:text-white shadow-md"
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
        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2 font-medium">
          Scroll Down
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-400" />
      </motion.div>
    </section>
  )
}

