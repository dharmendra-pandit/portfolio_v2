'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Phone, Check, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText('dharmendra193728@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, message } = formData
    const mailtoUrl = `mailto:dharmendra193728@gmail.com?subject=New Inquiry from ${name} (${email})&body=${encodeURIComponent(message)}`
    window.location.href = mailtoUrl
  }

  return (
    <section id="contact" className="relative min-h-[90vh] w-full py-24 sm:py-36 flex items-center justify-center overflow-hidden border-t border-border/40">
      <div className="container px-4 mx-auto max-w-5xl flex flex-col items-center relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 font-heading text-foreground"
          >
            Let's <span className="text-gradient">Connect.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed"
          >
            Available for full-time engineering opportunities, AI/ML systems research, and freelance technical consultation.
          </motion.p>
        </div>

        {/* Contact Quick Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-16 w-full"
        >
          <button
            onClick={handleCopyEmail}
            className="flex flex-col items-center gap-3 group cursor-pointer text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all shadow-md">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                Email {copied && <span className="text-primary lowercase font-mono text-xs">(copied!)</span>}
              </p>
              <p className="text-base text-foreground font-medium transition-colors">
                dharmendra193728@gmail.com
              </p>
            </div>
          </button>

          <a href="tel:+916204298947" className="flex flex-col items-center gap-3 group cursor-pointer text-center">
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all shadow-md">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-base text-foreground font-medium transition-colors">
                +91-6204298947
              </p>
            </div>
          </a>

          <div className="flex flex-col items-center gap-3 group text-center">
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-foreground shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-base text-foreground font-medium">
                Jaipur, Rajasthan, India
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative group w-full max-w-2xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-foreground/10 via-foreground/5 to-foreground/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
          
          <div className="relative p-6 sm:p-10 bg-card border border-border/60 rounded-[2rem] shadow-xl">
            <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background border-border hover:border-foreground/30 rounded-xl h-12 px-5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary transition-all shadow-sm"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background border-border hover:border-foreground/30 rounded-xl h-12 px-5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary transition-all shadow-sm"
                />
              </div>
              <div className="w-full">
                <Textarea
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-background border-border hover:border-foreground/30 rounded-2xl min-h-[140px] px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary transition-all resize-none shadow-sm"
                />
              </div>

              <div className="pt-4 w-full flex flex-col items-center gap-8">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-foreground/90 shadow-md transition-all cursor-pointer border-0"
                >
                  <span>Send Direct Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4 pt-4 border-t border-border/40 w-full justify-center">
                  <a
                    href="https://github.com/dharmendra-pandit"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2.5 hover:bg-foreground/10 rounded-full"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/dharmendra-pandit1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2.5 hover:bg-foreground/10 rounded-full"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/Dharmendra62042"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2.5 hover:bg-foreground/10 rounded-full"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    © 2026 Dharmendra Pandit. All rights reserved.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

