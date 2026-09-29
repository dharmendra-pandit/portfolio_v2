'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, MapPin, Phone, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { ctaClasses } from '@/components/ui/cta'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { cn } from '@/lib/utils'
import { PROFILE } from '@/data/portfolio'

const EMAIL = PROFILE.email
const EASE = [0.16, 1, 0.3, 1] as const

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, message } = form
    const subject = encodeURIComponent(`New inquiry from ${name} (${email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-20 gap-y-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Heading + details */}
        <div className="lg:row-span-1">
          <SectionHeading align="left" eyebrow="Contact" title="Have a project? Let's talk!" />

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
            className="mt-10 space-y-4"
          >
            <DetailItem>
              <button
                type="button"
                onClick={copyEmail}
                className="group flex items-center gap-4 text-left"
                aria-label={`Copy email address ${EMAIL}`}
              >
                <IconBox>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'check' : 'copy'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </motion.span>
                  </AnimatePresence>
                </IconBox>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Email {copied && <span className="normal-case tracking-normal text-coral-ink">— copied</span>}
                  </span>
                  <span className="break-all text-foreground transition-colors group-hover:text-coral-ink">{EMAIL}</span>
                </span>
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </DetailItem>
            <DetailItem>
              <a href="tel:+916204298947" className="group flex items-center gap-4">
                <IconBox>
                  <Phone className="size-4" />
                </IconBox>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Phone</span>
                  <span className="text-foreground transition-colors group-hover:text-coral-ink">{PROFILE.phone}</span>
                </span>
              </a>
            </DetailItem>
            <DetailItem>
              <div className="flex items-center gap-4">
                <IconBox>
                  <MapPin className="size-4" />
                </IconBox>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Location
                  </span>
                  <span className="text-foreground">{PROFILE.location}</span>
                </span>
              </div>
            </DetailItem>
          </motion.ul>
        </div>

        {/* Form */}
        <motion.form
          id="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="flex flex-col gap-9 lg:pt-16"
        >
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoComplete="name" />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            autoComplete="email"
          />
          <Field label="Message" multiline value={form.message} onChange={(v) => setForm({ ...form, message: v })} />

          <div className="pt-2">
            <MagneticButton>
              <button type="submit" className={ctaClasses('solid', 'px-8')}>
                Submit
                <ArrowRight className="group-hover/cta:translate-x-1" />
              </button>
            </MagneticButton>
            <p className="mt-4 text-xs text-muted-foreground">Opens your email app with the message ready to send.</p>
          </div>
        </motion.form>
      </div>
    </section>
  )
}

function DetailItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -16 },
        show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.li>
  )
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-coral-ink transition-colors duration-300 group-hover:border-coral group-hover:bg-coral group-hover:text-[#121f28]">
      {children}
    </span>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  multiline,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  multiline?: boolean
  autoComplete?: string
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const shared = {
    id,
    name: label.toLowerCase(),
    value,
    required: true,
    autoComplete,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'peer block w-full resize-none border-0 bg-transparent px-0 pb-3 pt-2 text-base text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:outline-none',
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          data-lenis-prevent
          placeholder="Tell me a little about what you're building…"
        />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-muted-foreground/40" />
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-[2px] origin-left bg-coral transition-transform duration-500 ease-[var(--ease-out-expo)]',
          focused ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </div>
  )
}
