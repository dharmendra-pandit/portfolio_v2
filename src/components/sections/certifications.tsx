'use client'

import { motion } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedText } from '@/components/ui/animated-text'

const certs = [
  {
    title: 'GenAI',
    issuer: 'Inceptiondb',
    date: '2026',
    link: '#',
  },
  {
    title: 'MERN Stack',
    issuer: 'Udemy',
    date: '2025',
    link: '#',
  },
  {
    title: 'Python',
    issuer: 'Code and Debug',
    date: '2026',
    link: '#',
  },
]

export const Certifications = () => {
  return (
    <section className="relative py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <AnimatedText
            text="Certifications."
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4"
            el="h2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certs.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 bg-foreground/5 border border-foreground/5 rounded-3xl backdrop-blur-3xl group hover:border-foreground/10 transition-all duration-500 cursor-pointer relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-0 relative z-10 flex flex-col items-start gap-4 border-none">
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border group-hover:scale-110 transition-transform duration-500">
                    <Award className="w-8 h-8 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-foreground/80 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {cert.issuer}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex justify-between w-full items-center">
                    <span className="text-xs text-muted-foreground/60">
                      {cert.date}
                    </span>
                    <a
                      href={cert.link}
                      className="text-foreground hover:text-foreground/80 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
