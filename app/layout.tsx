import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { Roboto_Flex, Encode_Sans_Semi_Expanded } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'

const bdLifelessGrotesk = localFont({
  src: [
    {
      path: './_fonts/BDLifelessGrotesk-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './_fonts/BDLifelessGrotesk-Thin.otf',
      weight: '100',
      style: 'normal',
    },
  ],
})

const coiny = Roboto_Flex({
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
      <body className={`${bdLifelessGrotesk.className} ${coiny.variable} ${encode.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
