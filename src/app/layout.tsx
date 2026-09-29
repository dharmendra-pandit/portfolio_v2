import type { Metadata, Viewport } from 'next'
import { Montserrat, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { SmoothLoader } from '@/components/ui/smooth-loader'
import { SmoothScroll } from '@/components/ui/smooth-scroll'
import { Navbar } from '@/components/layout/navbar'
import { ChatAssistant } from '@/components/ui/chat-assistant'

const fontSans = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dharmendra Pandit | Software Engineer',
  description:
    'Portfolio of Dharmendra Pandit — software engineer working across AI/ML systems, backend engineering, DevOps and algorithms.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#121f28' },
    { media: '(prefers-color-scheme: light)', color: '#f6f2ef' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} antialiased`} suppressHydrationWarning>
      <body className="relative overflow-x-clip bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <a
              href="#about"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-[3px] focus:bg-coral focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#121f28]"
            >
              Skip to content
            </a>
            <SmoothLoader />
            <CustomCursor />
            <Navbar />
            {children}
            <ChatAssistant />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
