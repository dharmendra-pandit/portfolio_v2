'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FileText, ChevronDown } from 'lucide-react'
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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-sm font-medium backdrop-blur-xl mb-8 shadow-2xl"
        >
          <span className="relative flex h-2.5 w-2.5 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-foreground"></span>
          </span>
          Available for new opportunities
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.9] mb-6"
        >
          <span className="text-foreground">Dharmendra</span><br />
          <span className="text-foreground/80">Pandit.</span>
        </motion.h1>

        <div className="h-10 mb-8 flex items-center justify-center">
          <TypingAnimation 
            text="Aspiring Software Engineer & Generative AI Enthusiast"
            className="text-xl md:text-3xl font-medium text-muted-foreground"
            delay={1}
            duration={0.05}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12"
        >
          Building futuristic digital experiences, intelligent AI solutions, and
          highly scalable web applications. Let's create the future together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <MagneticButton>
            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-shadow hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              View My Work
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-8 text-lg border-border bg-foreground/5 backdrop-blur-md hover:bg-foreground/10 hover:text-foreground"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Let's Connect
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-8 text-lg border-border bg-foreground/5 backdrop-blur-md hover:bg-foreground/10 hover:text-foreground"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Resume
            </Button>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="flex items-center gap-6 mt-16"
        >
          {[
            { icon: FaGithub, href: "https://github.com/dharmendra-pandit" },
            { icon: FaLinkedin, href: "https://linkedin.com/in/dharmendra-pandit1" },
            { icon: FaTwitter, href: "https://x.com/Dharmendra62042" }
          ].map((social, i) => (
            <MagneticButton key={i} intensity={0.5}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-foreground/5 border border-border rounded-full hover:bg-foreground/10 hover:scale-110 transition-all backdrop-blur-md text-muted-foreground hover:text-foreground"
              >
                <social.icon className="w-6 h-6" />
              </a>
            </MagneticButton>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center animate-bounce cursor-pointer z-20"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
