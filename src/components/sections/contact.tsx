'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, message } = formData
    const mailtoUrl = `mailto:dharmendra193728@gmail.com?subject=New Message from ${name} (${email})&body=${encodeURIComponent(message)}`
    window.location.href = mailtoUrl
  }

  return (
    <section id="contact" className="relative min-h-screen w-full py-48 flex items-center justify-center overflow-hidden">
      <div className="container px-4 mx-auto max-w-5xl flex flex-col items-center relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-foreground"
          >
            Get in <span className="text-foreground">touch.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light"
          >
            I'm currently looking for new opportunities. Whether you have a
            question or just want to say hi, I'll try my best to get back to
            you!
          </motion.p>
        </div>

        {/* Contact Details (Centered Grid/Flex) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mb-20 w-full"
        >
          <a
            href="mailto:dharmendra193728@gmail.com"
            className="flex flex-col items-center gap-4 group cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="text-lg text-foreground font-medium group-hover:text-primary transition-colors">
                dharmendra193728@gmail.com
              </p>
            </div>
          </a>

          <div className="flex flex-col items-center gap-4 group cursor-pointer text-center">
            <div className="w-16 h-16 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-lg text-foreground font-medium group-hover:text-primary transition-colors">
                +91-6204298947
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-pointer text-center">
            <div className="w-16 h-16 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-lg text-foreground font-medium group-hover:text-primary transition-colors">
                Jaipur, Rajasthan
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group w-full max-w-3xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-foreground/20 to-foreground/5 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative p-8 md:p-12 bg-foreground/5 border border-border rounded-[2rem] backdrop-blur-xl">
            <form
              className="space-y-10 flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/50 hover:bg-background/80 border-border/50 hover:border-border rounded-2xl h-14 px-6 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-background transition-all text-center md:text-left shadow-sm"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/50 hover:bg-background/80 border-border/50 hover:border-border rounded-2xl h-14 px-6 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-background transition-all text-center md:text-left shadow-sm"
                />
              </div>
              <div className="w-full">
                <Textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-background/50 hover:bg-background/80 border-border/50 hover:border-border rounded-3xl min-h-[160px] px-6 py-5 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-background transition-all resize-none text-center md:text-left shadow-sm"
                />
              </div>

              <div className="pt-10 w-full flex flex-col items-center gap-10">
                <button type="submit" className="flex items-center gap-4 text-2xl font-medium text-foreground group hover:text-foreground/80 transition-colors">
                  Send Message
                  <div className="w-14 h-14 rounded-full bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all group-hover:translate-x-2">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </button>

                {/* Social Links Centered at bottom */}
                <div className="flex items-center gap-8 mt-4">
                  <a
                    href="https://github.com/dharmendra-pandit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-3 hover:bg-foreground/5 rounded-full"
                  >
                    <FaGithub className="w-7 h-7" />
                  </a>
                  <a
                    href="https://linkedin.com/in/dharmendra-pandit1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-3 hover:bg-foreground/5 rounded-full"
                  >
                    <FaLinkedin className="w-7 h-7" />
                  </a>
                </div>
                <div className="flex flex-col items-center mt-2 gap-3">
                  <p className="text-sm text-muted-foreground">
                    © 2026 Dharmendra Pandit.
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Daily / Total Visitors</p>
                    <img 
                      src="https://hits.sh/dharmendra-pandit.vercel.app.svg?view=today-total&style=for-the-badge&label=visitors&color=263759&labelColor=1f2937" 
                      alt="visitor counter" 
                      className="opacity-70 hover:opacity-100 transition-opacity rounded-md"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
