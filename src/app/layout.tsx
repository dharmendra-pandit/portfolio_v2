import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/ui/smooth-scroll'
import { Navbar } from '@/components/layout/navbar'
import { ChatAssistant } from '@/components/ui/chat-assistant'

const fontSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const fontSerif = IBM_Plex_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const fontMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dharmendra Pandit | Software Engineer',
  description:
    'Dharmendra Pandit is a software engineer specialising in backend services, applied AI and cloud infrastructure. Experience, projects, skills and contact details.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c1c2b' },
    { media: '(prefers-color-scheme: light)', color: '#f5f7f9' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="relative overflow-x-clip bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <a
              href="#about"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
            >
              Skip to content
            </a>
            <Navbar />
            {children}
            <ChatAssistant />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
