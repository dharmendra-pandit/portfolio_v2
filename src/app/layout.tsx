import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { SmoothLoader } from '@/components/ui/smooth-loader'
import { SmoothScroll } from '@/components/ui/smooth-scroll'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { CursorGlow } from '@/components/ui/cursor-glow'
import { Navbar } from '@/components/layout/navbar'

const fontSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const fontHeading = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dharmendra Pandit | Software Engineer & AI/ML Portfolio',
  description:
    'Futuristic developer portfolio of Dharmendra Pandit - AI & ML Systems, Full Stack Engineering, DevOps & Algorithm Specialist.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} ${geistMono.variable} antialiased`}
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
