import { ClientLayout } from './client-layout'

// Force dynamic rendering to read env vars at request time
export const dynamic = 'force-dynamic'

const env = (key: string, defaultValue = '') =>
  process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue

// Server Component - reads env vars at runtime
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = {
    plcDirectoryUrl: env('PLC_DIRECTORY_URL', 'https://plc.directory'),
    handleResolverUrl: env('HANDLE_RESOLVER_URL', 'https://api.bsky.app'),
    ozoneServiceDid: env('OZONE_SERVICE_DID'),
    ozonePublicUrl: env('OZONE_PUBLIC_URL'),
    queueConfig: env('QUEUE_CONFIG', '{}'),
    queueSeed: env('QUEUE_SEED'),
    socialAppUrl: env('SOCIAL_APP_URL', 'https://bsky.app'),
    newAccountMarkerThresholdInDays: env('NEW_ACCOUNT_MARKER_THRESHOLD_IN_DAYS', '7'),
    youngAccountMarkerThresholdInDays: env('YOUNG_ACCOUNT_MARKER_THRESHOLD_IN_DAYS', '30'),
    domainsAllowingEmailCommunication: env('DOMAINS_ALLOWING_EMAIL_COMMUNICATION'),
    highProfileFollowerThreshold: env('HIGH_PROFILE_FOLLOWER_THRESHOLD', 'Infinity'),
    fallbackVideoUrl: env('FALLBACK_VIDEO_URL'),
  }

  return <ClientLayout config={config}>{children}</ClientLayout>
}
