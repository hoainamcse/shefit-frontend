import type { Metadata } from 'next'
import {
  Roboto_Flex,
  Roboto,
  Roboto_Condensed,
  Encode_Sans_Semi_Expanded,
  Black_Ops_One,
  Montserrat,
} from 'next/font/google'
import Script from 'next/script'
import localFont from 'next/font/local'

import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { PreventScrollRestoration } from '@/components/prevent-scroll-restoration'

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

const roboto = Roboto({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-roboto',
  subsets: ['latin', 'vietnamese'],
})

const robotoCondensed = Roboto_Condensed({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-roboto-condensed',
  subsets: ['latin', 'vietnamese'],
})

const encode = Encode_Sans_Semi_Expanded({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-encode',
  subsets: ['latin', 'vietnamese'],
})

const blackOpsOne = Black_Ops_One({
  weight: ['400'],
  display: 'swap',
  variable: '--font-black-ops-one',
  subsets: ['latin', 'vietnamese'],
})

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
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
      <head>
        <Script src="/assets/lang-config.js" strategy="beforeInteractive" />
        <Script src="/assets/translation.js" strategy="beforeInteractive" />
        <Script src="//translate.google.com/translate_a/element.js?cb=TranslateInit" strategy="afterInteractive" />
      </head>
      <body
        className={`${bdLifelessGrotesk.className} ${coiny.variable} ${encode.variable} ${blackOpsOne.variable} ${roboto.variable} ${robotoCondensed.variable} ${montserrat.variable} antialiased !top-0`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <div id="google_translate_element" />
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </ThemeProvider>
        <PreventScrollRestoration />
      </body>
    </html>
  )
}
