import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { QueryProvider, SessionWrapper } from './providers'

export const metadata = {
  metadataBase: new URL('https://tools4.tech'),
  title: 'Tools4.tech - Essential Tools for Developers',
  description:
    'Find the best developer tools and accelerate your software development with carefully curated resources at Tools4.tech.',
  keywords:
    'developer tools, software development, programming resources, coding, technology',
  openGraph: {
    title: 'Tools4.tech - Essential Tools for Developers',
    description:
      'Discover essential programming tools and accelerate your software development at Tools4.tech.',
    url: 'https://tools4.tech/',
    siteName: 'Tools4.tech',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/favicon.ico',
        width: 800,
        height: 600,
        alt: 'Tools4.tech - Developer Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools4.tech - Essential Tools for Developers',
    description:
      'Accelerate your software development with the best developer tools.',
    images: ['/favicon.ico'],
  },
  robots: 'index, follow',
  authors: [{ name: 'Tools4.tech' }],
  alternates: {
    canonical: 'https://tools4.tech/',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({ children, session }) {
  return (
    <html lang='en' className='h-full'>
      <body className='bg-[#111111] h-full '>
        <SessionWrapper session={session}>
          <QueryProvider>
            <Navbar />

            {children}
            <Analytics />
            <SpeedInsights />
          </QueryProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
