import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Armstrong Pricing',
    template: '%s — Armstrong Pricing',
  },
  description: 'Intelligent pricing calculators for Armstrong partner companies.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
