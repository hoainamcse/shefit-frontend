import type { Metadata } from 'next'
import { Coiny, Encode_Sans_Semi_Expanded, Signika_Negative } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/auth-context'

const yes = Signika_Negative({
  display: 'swap',
  variable: '--font-yes',
  subsets: ['latin', 'vietnamese'],
})

const coiny = Coiny({
  weight: '400',
  display: 'swap',
  variable: '--font-coiny',
  subsets: ['latin', 'vietnamese'],
})

const encode = Encode_Sans_Semi_Expanded({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-encode',
  subsets: ['latin', 'vietnamese'],
})

export const metadata: Metadata = {
  title: 'Shefit.vn',
  description: 'Start-up giúp cho chị em phái yếu có vóc dáng đẹp & sức khỏe dẻo dai một cách tiện lợi & tiết kiệm',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${yes.className} ${coiny.variable} ${encode.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
