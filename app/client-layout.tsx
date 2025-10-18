'use client'
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

interface Config {
  plcDirectoryUrl?: string
  handleResolverUrl?: string
  ozoneServiceDid?: string
  ozonePublicUrl?: string
  queueConfig?: string
  queueSeed?: string
  socialAppUrl?: string
  newAccountMarkerThresholdInDays?: string
  youngAccountMarkerThresholdInDays?: string
  domainsAllowingEmailCommunication?: string
  highProfileFollowerThreshold?: string
  fallbackVideoUrl?: string
}

export function ClientLayout({
  config,
  children,
}: {
  config: Config
  children: React.ReactNode
}) {
  const isLocal =
    typeof window !== 'undefined'
      ? window?.location.host.includes('localhost:')
      : false

  return (
    <html
      lang="en"
      className={`h-full bg-gray-50 dark:bg-slate-900 ${
        isDarkModeEnabled() ? 'dark' : ''
      }`}
    >
      <head>
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
      </head>
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
