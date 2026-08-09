import * as react from 'react';
import { ReactNode } from 'react';

type EnterpriseSite = 'www' | 'aips' | 'api';
type EnterpriseNavigationMode = 'marketing' | 'console';
type EnterpriseAuthStatus = 'loading' | 'anonymous' | 'authenticated';
type EnterpriseNavigationOrigins = {
    www: string;
    aips: string;
    api: string;
};
type EnterpriseNavigationLabels = {
    about: string;
    aips: string;
    api: string;
    home: string;
    features: string;
    pricing: string;
    download: string;
    apiOverview: string;
    apiModels: string;
    apiDocs: string;
    signIn: string;
    register: string;
    dashboard: string;
    navigation: string;
    closeNavigation: string;
};
type EnterpriseNavigationAuth = {
    status: EnterpriseAuthStatus;
    signInHref: string;
    registerHref?: string;
    dashboardHref?: string;
    showDashboardLink?: boolean;
    desktopAuthenticated?: ReactNode;
    mobileAuthenticated?: ReactNode;
};
type EnterpriseNavigationAssets = {
    wordmarkSrc: string;
    iconSrc: string;
    alt?: string;
};
type EnterpriseNavigationSlots = {
    leading?: ReactNode;
    desktopActions?: ReactNode;
    mobileActions?: ReactNode;
};
type EnterpriseNavigationProps = {
    site: EnterpriseSite;
    mode?: EnterpriseNavigationMode;
    origins: EnterpriseNavigationOrigins;
    labels: EnterpriseNavigationLabels;
    assets: EnterpriseNavigationAssets;
    auth: EnterpriseNavigationAuth;
    slots?: EnterpriseNavigationSlots;
    languagePathPrefix?: '' | '/en';
    className?: string;
    backgroundColor?: string;
};
type EnterpriseNavigationLink = {
    id: string;
    label: string;
    href: string;
};
type EnterpriseNavigationModel = {
    about: EnterpriseNavigationLink;
    aips: EnterpriseNavigationLink[];
    api: EnterpriseNavigationLink[];
};

declare function EnterpriseNavigation(props: EnterpriseNavigationProps): react.JSX.Element;

declare function createEnterpriseNavigationModel(origins: EnterpriseNavigationOrigins, labels: EnterpriseNavigationLabels, languagePathPrefix?: '' | '/en'): EnterpriseNavigationModel;

export { type EnterpriseAuthStatus, EnterpriseNavigation, type EnterpriseNavigationAssets, type EnterpriseNavigationAuth, type EnterpriseNavigationLabels, type EnterpriseNavigationLink, type EnterpriseNavigationMode, type EnterpriseNavigationModel, type EnterpriseNavigationOrigins, type EnterpriseNavigationProps, type EnterpriseNavigationSlots, type EnterpriseSite, createEnterpriseNavigationModel };
