import type {
  EnterpriseNavigationLabels,
  EnterpriseNavigationModel,
  EnterpriseNavigationOrigins,
} from './types'

function joinOrigin(origin: string, path: string): string {
  return `${origin.replace(/\/$/, '')}${path}`
}

export function createEnterpriseNavigationModel(
  origins: EnterpriseNavigationOrigins,
  labels: EnterpriseNavigationLabels,
  languagePathPrefix: '' | '/en' = ''
): EnterpriseNavigationModel {
  const localized = (path: string) => `${languagePathPrefix}${path}`

  return {
    about: {
      id: 'about',
      label: labels.about,
      href: joinOrigin(origins.www, localized('/about')),
    },
    aips: [
      {
        id: 'aips-home',
        label: labels.home,
        href: joinOrigin(origins.aips, languagePathPrefix || '/'),
      },
      {
        id: 'aips-features',
        label: labels.features,
        href: joinOrigin(origins.aips, localized('/features')),
      },
      {
        id: 'aips-pricing',
        label: labels.pricing,
        href: joinOrigin(origins.aips, localized('/pricing')),
      },
      {
        id: 'aips-download',
        label: labels.download,
        href: joinOrigin(origins.aips, localized('/download')),
      },
    ],
    api: [
      {
        id: 'api-overview',
        label: labels.apiOverview,
        href: joinOrigin(origins.api, '/'),
      },
      {
        id: 'api-models',
        label: labels.apiModels,
        href: joinOrigin(origins.api, '/pricing'),
      },
      {
        id: 'api-docs',
        label: labels.apiDocs,
        href: joinOrigin(origins.api, '/doc'),
      },
    ],
  }
}
