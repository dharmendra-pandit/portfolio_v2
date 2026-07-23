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
    <section id="contact" className="relative min-h-screen w-full py-36 flex items-center justify-center overflow-hidden border-t border-white/5">
      <div className="container px-4 mx-auto max-w-5xl flex flex-col items-center relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 font-heading"
          >
            Let's <span className="text-gradient">Connect.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed"
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
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-lg">
              {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                Email {copied && <span className="text-white lowercase font-mono text-xs">(copied!)</span>}
              </p>
              <p className="text-base text-white font-medium group-hover:text-white transition-colors">
                dharmendra193728@gmail.com
              </p>
            </div>
          </button>

          <a href="tel:+916204298947" className="flex flex-col items-center gap-3 group cursor-pointer text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-lg">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-base text-white font-medium group-hover:text-white transition-colors">
                +91-6204298947
              </p>
            </div>
          </a>

          <div className="flex flex-col items-center gap-3 group text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-base text-white font-medium">
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
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-neutral-400/20 to-white/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
          
          <div className="relative p-8 sm:p-10 glass-card border border-white/10 rounded-[2rem] shadow-2xl">
            <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 hover:border-white/20 rounded-xl h-12 px-5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 hover:border-white/20 rounded-xl h-12 px-5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm"
                />
              </div>
              <div className="w-full">
                <Textarea
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 hover:border-white/20 rounded-2xl min-h-[140px] px-5 py-4 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white transition-all resize-none shadow-sm"
                />
              </div>

              <div className="pt-4 w-full flex flex-col items-center gap-8">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 shadow-lg transition-all cursor-pointer"
                >
                  <span>Send Direct Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5 w-full justify-center">
                  <a
                    href="https://github.com/dharmendra-pandit"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-neutral-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/dharmendra-pandit1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-neutral-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/Dharmendra62042"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-neutral-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-neutral-400 font-medium">
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

