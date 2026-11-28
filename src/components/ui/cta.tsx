import { cn } from '@/lib/utils'

type CtaVariant = 'solid' | 'outline'

const base =
  'group/cta relative isolate inline-flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-5 text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)] cursor-pointer select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-[var(--ease-out-expo)] hover:[&_svg]:translate-x-0.5'

const variants: Record<CtaVariant, string> = {
  // Brass (dark) / ink (light), with a light sheen that sweeps across on hover.
  solid:
    'bg-cta text-cta-foreground shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_var(--glow),0_1px_0_rgba(255,255,255,0.12)_inset] after:absolute after:inset-y-0 after:-left-1/2 after:-z-10 after:w-1/2 after:-skew-x-12 after:bg-white/25 after:opacity-0 after:transition-[transform,opacity] after:duration-700 after:ease-[var(--ease-out-expo)] hover:after:translate-x-[300%] hover:after:opacity-100',
  outline:
    'border border-foreground/20 text-foreground hover:-translate-y-0.5 hover:border-brass/70 hover:bg-brass/[0.06]',
}

export function ctaClasses(variant: CtaVariant = 'solid', className?: string) {
  return cn(base, variants[variant], className)
}
