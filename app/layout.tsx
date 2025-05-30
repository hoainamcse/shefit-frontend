import type { Metadata } from 'next'
import { Coiny, Encode_Sans_Semi_Expanded, Signika_Negative } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/auth-context'

const bdLifelessGrotesk = localFont({
  src: [
    {
      path: './fonts/BDLifelessGrotesk-Black.otf',
      weight: '900',
    },
    {
      path: './fonts/BDLifelessGrotesk-ExtraBold.otf',
      weight: '800',
    },
    {
      path: './fonts/BDLifelessGrotesk-Bold.otf',
      weight: '700',
    },
    {
      path: './fonts/BDLifelessGrotesk-SemiBold.otf',
      weight: '600',
    },
    {
      path: './fonts/BDLifelessGrotesk-Medium.otf',
      weight: '500',
    },
    {
      path: './fonts/BDLifelessGrotesk-Regular.otf',
      weight: '400',
    },
    {
      path: './fonts/BDLifelessGrotesk-Light.otf',
      weight: '300',
    },
    {
      path: './fonts/BDLifelessGrotesk-ExtraLight.otf',
      weight: '200',
    },
    {
      path: './fonts/BDLifelessGrotesk-Thin.otf',
      weight: '100',
    },
  ],
  display: 'swap',
  weight: '100 900',
})

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
