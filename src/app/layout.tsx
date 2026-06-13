import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { SmoothLoader } from '@/components/ui/smooth-loader'
import { SmoothScroll } from '@/components/ui/smooth-scroll'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { CursorGlow } from '@/components/ui/cursor-glow'
import { Navbar } from '@/components/layout/navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dharmendra Pandit | Portfolio',
  description:
    'Futuristic developer portfolio of Dharmendra Pandit - AI & ML, DevOps & Backend Engineer.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground overflow-x-hidden selection:bg-primary/30 relative"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <AnimatedBackground />
            <CursorGlow />
            <CustomCursor />
            <Navbar />
            <SmoothLoader />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
