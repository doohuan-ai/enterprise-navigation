import type { ReactNode } from 'react'

export type EnterpriseSite = 'www' | 'aips' | 'api'
export type EnterpriseNavigationMode = 'marketing' | 'console'
export type EnterpriseAuthStatus = 'loading' | 'anonymous' | 'authenticated'

export type EnterpriseNavigationOrigins = {
  www: string
  aips: string
  api: string
}

export type EnterpriseNavigationLabels = {
  about: string
  aips: string
  api: string
  home: string
  features: string
  pricing: string
  download: string
  apiOverview: string
  apiModels: string
  apiDocs: string
  signIn: string
  register: string
  dashboard: string
  navigation: string
  closeNavigation: string
}

export type EnterpriseNavigationAuth = {
  status: EnterpriseAuthStatus
  signInHref: string
  registerHref?: string
  dashboardHref?: string
  showDashboardLink?: boolean
  desktopAuthenticated?: ReactNode
  mobileAuthenticated?: ReactNode
}

export type EnterpriseNavigationAssets = {
  wordmarkSrc: string
  iconSrc: string
  alt?: string
}

export type EnterpriseNavigationSlots = {
  leading?: ReactNode
  desktopActions?: ReactNode
  mobileActions?: ReactNode
}

export type EnterpriseNavigationProps = {
  site: EnterpriseSite
  mode?: EnterpriseNavigationMode
  origins: EnterpriseNavigationOrigins
  labels: EnterpriseNavigationLabels
  assets: EnterpriseNavigationAssets
  auth: EnterpriseNavigationAuth
  slots?: EnterpriseNavigationSlots
  languagePathPrefix?: '' | '/en'
  className?: string
  backgroundColor?: string
}

export type EnterpriseNavigationLink = {
  id: string
  label: string
  href: string
}

export type EnterpriseNavigationModel = {
  about: EnterpriseNavigationLink
  aips: EnterpriseNavigationLink[]
  api: EnterpriseNavigationLink[]
}
