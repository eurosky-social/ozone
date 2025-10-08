'use client' // @TODO Totally circumventing SSC
import '../styles/globals.css'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { ToastContainer } from 'react-toastify'

import { Shell } from '@/shell/Shell'
import { CommandPaletteRoot } from '@/shell/CommandPalette/Root'
import { AuthProvider } from '@/shell/AuthContext'
import { DefaultQueryClientProvider } from '@/shell/QueryClient'
import { GlobalQueryClientProvider } from '@/shell/QueryClient'
import { isDarkModeEnabled } from '@/common/useColorScheme'
import { HANDLE_RESOLVER_URL, PLC_DIRECTORY_URL } from '@/lib/constants'
import { ConfigProvider } from '@/shell/ConfigContext'
import { ConfigurationProvider } from '@/shell/ConfigurationContext'
import { ExternalLabelersProvider } from '@/shell/ExternalLabelersContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Since we're doing everything client side and not using RSC, we can't use `Metadata` feature from next
  // to have these head tags from the server
  const isLocal =
    typeof window !== 'undefined'
      ? window?.location.host.includes('localhost:')
      : false

  // Runtime config injection
  const config = {
    plcDirectoryUrl: process.env.PLC_DIRECTORY_URL || process.env.NEXT_PUBLIC_PLC_DIRECTORY_URL || 'https://plc.directory',
    handleResolverUrl: process.env.HANDLE_RESOLVER_URL || process.env.NEXT_PUBLIC_HANDLE_RESOLVER_URL || 'https://api.bsky.app',
    ozoneServiceDid: process.env.OZONE_SERVICE_DID || process.env.NEXT_PUBLIC_OZONE_SERVICE_DID,
    ozonePublicUrl: process.env.OZONE_PUBLIC_URL || process.env.NEXT_PUBLIC_OZONE_PUBLIC_URL,
    queueConfig: process.env.QUEUE_CONFIG || process.env.NEXT_PUBLIC_QUEUE_CONFIG || '{}',
    queueSeed: process.env.QUEUE_SEED || process.env.NEXT_PUBLIC_QUEUE_SEED || '',
    socialAppUrl: process.env.SOCIAL_APP_URL || process.env.NEXT_PUBLIC_SOCIAL_APP_URL || 'https://bsky.app',
    newAccountMarkerThresholdInDays: process.env.NEW_ACCOUNT_MARKER_THRESHOLD_IN_DAYS || process.env.NEXT_PUBLIC_NEW_ACCOUNT_MARKER_THRESHOLD_IN_DAYS || '7',
    youngAccountMarkerThresholdInDays: process.env.YOUNG_ACCOUNT_MARKER_THRESHOLD_IN_DAYS || process.env.NEXT_PUBLIC_YOUNG_ACCOUNT_MARKER_THRESHOLD_IN_DAYS || '30',
    domainsAllowingEmailCommunication: process.env.DOMAINS_ALLOWING_EMAIL_COMMUNICATION || process.env.NEXT_PUBLIC_DOMAINS_ALLOWING_EMAIL_COMMUNICATION || '',
    highProfileFollowerThreshold: process.env.HIGH_PROFILE_FOLLOWER_THRESHOLD || process.env.NEXT_PUBLIC_HIGH_PROFILE_FOLLOWER_THRESHOLD || 'Infinity',
    fallbackVideoUrl: process.env.FALLBACK_VIDEO_URL || process.env.NEXT_PUBLIC_FALLBACK_VIDEO_URL || '',
  }

  return (
    <html
      lang="en"
      className={`h-full bg-gray-50 dark:bg-slate-900 ${
        isDarkModeEnabled() ? 'dark' : ''
      }`}
    >
      <title>Ozone</title>
      <link
        rel="icon"
        href={`/img/logo-${isLocal ? 'white' : 'colorful'}.png`}
        sizes="any"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script
          dangerouslySetInnerHTML={{
            __html: `window.__OZONE_CONFIG__ = ${JSON.stringify(config)};`,
          }}
      />
      <body className="h-full overflow-hidden">
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
        />

        <GlobalQueryClientProvider>
          <ConfigProvider>
            <AuthProvider
              plcDirectoryUrl={PLC_DIRECTORY_URL}
              handleResolver={HANDLE_RESOLVER_URL}
            >
              <DefaultQueryClientProvider>
                <ConfigurationProvider>
                  <ExternalLabelersProvider>
                    <CommandPaletteRoot>
                      <Shell>{children}</Shell>
                    </CommandPaletteRoot>
                  </ExternalLabelersProvider>
                </ConfigurationProvider>
              </DefaultQueryClientProvider>
            </AuthProvider>
          </ConfigProvider>
        </GlobalQueryClientProvider>
      </body>
    </html>
  )
}
