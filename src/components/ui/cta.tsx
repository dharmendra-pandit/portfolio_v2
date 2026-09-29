import { cn } from '@/lib/utils'

type CtaVariant = 'solid' | 'outline' | 'link'

const base =
  'group/cta relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors duration-300 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300'

const variants: Record<CtaVariant, string> = {
  // Coral block with a light sweep on hover; navy label keeps 6:1 contrast.
  solid:
    'isolate h-12 overflow-hidden rounded-[3px] bg-coral px-6 text-sm text-[#121f28] after:absolute after:inset-0 after:-z-10 after:-translate-x-[101%] after:bg-white/25 after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] hover:after:translate-x-0',
  outline:
    'isolate h-12 overflow-hidden rounded-[3px] border border-coral px-6 text-sm text-foreground after:absolute after:inset-0 after:-z-10 after:origin-bottom after:scale-y-0 after:bg-coral/12 after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] hover:after:scale-y-100',
  // Text link with a coral underline that redraws on hover.
  link:
    'h-12 text-sm text-foreground before:absolute before:bottom-2.5 before:left-0 before:h-px before:w-full before:bg-coral before:origin-right before:transition-transform before:duration-500 before:ease-[var(--ease-out-expo)] hover:before:scale-x-0 after:absolute after:bottom-2.5 after:left-0 after:h-px after:w-full after:bg-coral after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:delay-150 after:ease-[var(--ease-out-expo)] hover:after:scale-x-100 hover:[&_svg]:-translate-y-0.5 hover:[&_svg]:translate-x-0.5',
}

export function ctaClasses(variant: CtaVariant = 'solid', className?: string) {
  return cn(base, variants[variant], className)
}
