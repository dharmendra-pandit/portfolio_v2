'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Send } from 'lucide-react'
import { Section } from '@/components/ui/section-heading'
import { ctaClasses } from '@/components/ui/cta'
import { Reveal, VIEWPORT, rise, stagger } from '@/components/ui/motion'
import { PROFILE } from '@/data/portfolio'

const EMAIL = PROFILE.email
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '')

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
    const subject = encodeURIComponent(`Enquiry from ${name} (${email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`
  }

  return (
    <Section
      id="contact"
      title="Contact"
      lead="For employment opportunities, collaborations or technical enquiries, please write to me by email or use the form below."
    >
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
        <motion.dl
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.07)}
          className="border-t border-border"
        >
          <Detail label="Email">
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <a href={`mailto:${EMAIL}`} className="link break-all">
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[13px] font-medium text-muted-foreground transition-colors duration-300 hover:border-brass/60 hover:text-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'copied' : 'copy'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    {copied ? <Check className="size-3.5 text-brass" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </motion.span>
                </AnimatePresence>
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </span>
          </Detail>
          <Detail label="Phone">
            <a href={`tel:${PROFILE.phone.replace(/\s+/g, '')}`} className="link">
              {PROFILE.phone}
            </a>
          </Detail>
          <Detail label="LinkedIn">
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="link">
              {host(PROFILE.links.linkedin)}
            </a>
          </Detail>
          <Detail label="GitHub">
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="link">
              {host(PROFILE.links.github)}
            </a>
          </Detail>
          <Detail label="Location">{PROFILE.location}</Detail>
        </motion.dl>

        <Reveal delay={0.15}>
        <form
          id="contact-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-xl border border-border bg-card/70 p-6 sm:p-7"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoComplete="name" />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              autoComplete="email"
            />
          </div>
          <Field label="Message" multiline value={form.message} onChange={(v) => setForm({ ...form, message: v })} />

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="submit" className={ctaClasses('solid', 'px-6')}>
              Compose email
              <Send className="group-hover/cta:-translate-y-0.5" />
            </button>
            <p className="text-[13px] text-muted-foreground">Opens your email application with this message filled in.</p>
          </div>
        </form>
        </Reveal>
      </div>
    </Section>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={rise} className="grid gap-x-6 gap-y-1 border-b border-border py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-[15px] text-foreground">{children}</dd>
    </motion.div>
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
  const shared = {
    id,
    name: label.toLowerCase(),
    value,
    required: true,
    autoComplete,
    className:
      'mt-2 block w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-[15px] text-foreground transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/70 hover:border-foreground/40 focus-visible:border-brass focus-visible:shadow-[0_0_0_4px_var(--glow)] focus-visible:outline-none',
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={6}
          onChange={(e) => onChange(e.target.value)}
          data-lenis-prevent
          placeholder="A brief description of the role, project or question."
          className={`${shared.className} resize-y`}
        />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}
