import '@/styles/app.css'

import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Announcement from '@/ui/Announcement'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import OrganizationSchema from '@/ui/OrganizationSchema'
import LocalBusinessSchema from '@/ui/LocalBusinessSchema'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { notFound } from 'next/navigation'
import { enabledLanguages, isEnabledLanguage } from '@/lib/i18n'

export function generateStaticParams() {
  return enabledLanguages.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  // Middleware already 404s disabled prefixes; this catches paths it skips, like `/foo.php`.
  if (!isEnabledLanguage(lang)) notFound()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang={lang}>
      <body className="bg-canvas text-ink antialiased">
        <GoogleTagManager gtmId="GTM-T652B5TL" />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <NextTopLoader />

        <NuqsAdapter>
          <SkipToContent />
          <Announcement />
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />

          <VisualEditingControls />
        </NuqsAdapter>

        <Analytics />
        <SpeedInsights />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
