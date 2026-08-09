import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { createEnterpriseNavigationModel } from './navigation'
import type {
  EnterpriseNavigationLink,
  EnterpriseNavigationProps,
} from './types'

const FLOAT_AFTER_PX = 120

type OpenDropdown = null | 'aips' | 'api'

function ChevronIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='dh-nav__chevron'>
      <path d='m7 10 5 5 5-5' />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='dh-nav__menu-icon'>
      <path d='M4 7h16M4 12h16M4 17h16' />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='dh-nav__menu-icon'>
      <path d='m6 6 12 12M18 6 6 18' />
    </svg>
  )
}

function DropdownPanel(props: {
  id: string
  open: boolean
  links: EnterpriseNavigationLink[]
  onNavigate: () => void
}) {
  return (
    <div
      id={props.id}
      className='dh-nav__dropdown-position'
      data-open={props.open || undefined}
    >
      <div className='dh-nav__dropdown' role='menu'>
        {props.links.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className='dh-nav__dropdown-link'
            role='menuitem'
            onClick={props.onNavigate}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function ProductMenu(props: {
  id: Exclude<OpenDropdown, null>
  label: string
  active: boolean
  open: boolean
  links: EnterpriseNavigationLink[]
  onToggle: () => void
  onNavigate: () => void
}) {
  const panelId = `dh-navigation-${props.id}-menu`

  return (
    <div className='dh-nav__product'>
      <button
        type='button'
        className='dh-nav__product-trigger'
        data-active={props.active || undefined}
        aria-expanded={props.open}
        aria-haspopup='menu'
        aria-controls={panelId}
        aria-current={props.active ? 'page' : undefined}
        onClick={props.onToggle}
      >
        {props.label}
        <ChevronIcon />
      </button>
      <DropdownPanel
        id={panelId}
        open={props.open}
        links={props.links}
        onNavigate={props.onNavigate}
      />
    </div>
  )
}

function MobileGroup(props: {
  label: string
  links: EnterpriseNavigationLink[]
  active: boolean
  onNavigate: () => void
}) {
  return (
    <>
      <div className='dh-nav__mobile-group-label' data-active={props.active || undefined}>
        {props.label}
      </div>
      {props.links.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className='dh-nav__mobile-link dh-nav__mobile-link--nested'
          onClick={props.onNavigate}
        >
          {item.label}
        </a>
      ))}
    </>
  )
}

function AuthenticatedFallback(props: {
  dashboardHref?: string
  dashboardLabel: string
}) {
  if (!props.dashboardHref) return null

  return (
    <a href={props.dashboardHref} className='dh-nav__dashboard-link'>
      {props.dashboardLabel}
    </a>
  )
}

function MarketingActions(props: EnterpriseNavigationProps) {
  const { auth, labels } = props

  if (auth.status === 'loading') {
    return <span className='dh-nav__auth-placeholder' aria-hidden='true' />
  }

  if (auth.status === 'anonymous') {
    return (
      <a href={auth.signInHref} className='dh-nav__sign-in'>
        {labels.signIn}
      </a>
    )
  }

  return (
    <>
      {auth.showDashboardLink && (
        <AuthenticatedFallback
          dashboardHref={auth.dashboardHref}
          dashboardLabel={labels.dashboard}
        />
      )}
      {auth.desktopAuthenticated ?? (
        <AuthenticatedFallback
          dashboardHref={auth.dashboardHref}
          dashboardLabel={labels.dashboard}
        />
      )}
    </>
  )
}

function MobileAuth(props: EnterpriseNavigationProps) {
  const { auth, labels } = props

  if (auth.status === 'loading') return null
  if (auth.status === 'authenticated') {
    return (
      <div className='dh-nav__mobile-auth'>
        {auth.mobileAuthenticated ??
          auth.desktopAuthenticated ?? (
            <AuthenticatedFallback
              dashboardHref={auth.dashboardHref}
              dashboardLabel={labels.dashboard}
            />
          )}
      </div>
    )
  }

  return (
    <div className='dh-nav__mobile-auth'>
      <a href={auth.signInHref} className='dh-nav__mobile-auth-secondary'>
        {labels.signIn}
      </a>
      {auth.registerHref && (
        <a href={auth.registerHref} className='dh-nav__mobile-auth-primary'>
          {labels.register}
        </a>
      )}
    </div>
  )
}

export function EnterpriseNavigation(props: EnterpriseNavigationProps) {
  const {
    site,
    mode = 'marketing',
    origins,
    labels,
    assets,
    auth,
    slots,
    languagePathPrefix = '',
  } = props
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileCloseRef = useRef<HTMLButtonElement>(null)
  const mobileDrawerRef = useRef<HTMLDivElement>(null)
  const model = useMemo(
    () =>
      createEnterpriseNavigationModel(
        origins,
        labels,
        languagePathPrefix
      ),
    [origins, labels, languagePathPrefix]
  )

  useEffect(() => {
    let animationFrame = 0
    const apply = () => {
      animationFrame = 0
      setIsScrolled(window.scrollY > FLOAT_AFTER_PX)
    }
    const onScroll = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(apply)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    if (!openDropdown && !mobileOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (
        openDropdown &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (mobileOpen && event.key === 'Tab') {
        const focusable = mobileDrawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable?.length) {
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }
      }
      if (event.key !== 'Escape') return
      setOpenDropdown(null)
      if (mobileOpen) {
        setMobileOpen(false)
        mobileTriggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen, openDropdown])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    mobileCloseRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  const closeMenus = () => {
    setOpenDropdown(null)
    setMobileOpen(false)
  }
  const toggleDropdown = (id: Exclude<OpenDropdown, null>) => {
    setOpenDropdown((current) => (current === id ? null : id))
  }
  const logoHref = origins[site]
  const headerStyle = {
    '--dh-navigation-background': props.backgroundColor ?? '#f7f7f4',
  } as CSSProperties
  const classes = [
    'dh-nav',
    mode === 'console' ? 'dh-nav--console' : 'dh-nav--marketing',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')

  let desktopActions: ReactNode
  if (mode === 'console') {
    desktopActions = slots?.desktopActions
  } else {
    desktopActions = (
      <>
        {slots?.desktopActions}
        <MarketingActions {...props} />
      </>
    )
  }

  return (
    <header className={classes} style={headerStyle}>
      <div className='dh-nav__frame' data-floated={isScrolled || undefined}>
        <div className='dh-nav__inner' data-floated={isScrolled || undefined}>
          <div className='dh-nav__side dh-nav__side--start'>
            {slots?.leading}
            <a href={logoHref} className='dh-nav__brand' aria-label={assets.alt ?? 'Doohuan'}>
              <img
                src={isScrolled ? assets.iconSrc : assets.wordmarkSrc}
                alt={assets.alt ?? 'Doohuan'}
                width={isScrolled ? 26 : 104}
                height={isScrolled ? 26 : 16}
              />
            </a>
          </div>

          <nav ref={navRef} className='dh-nav__desktop' aria-label={labels.navigation}>
            <a href={model.about.href} className='dh-nav__text-link'>
              {model.about.label}
            </a>
            <ProductMenu
              id='aips'
              label={labels.aips}
              active={site === 'aips'}
              open={openDropdown === 'aips'}
              links={model.aips}
              onToggle={() => toggleDropdown('aips')}
              onNavigate={closeMenus}
            />
            <ProductMenu
              id='api'
              label={labels.api}
              active={site === 'api'}
              open={openDropdown === 'api'}
              links={model.api}
              onToggle={() => toggleDropdown('api')}
              onNavigate={closeMenus}
            />
          </nav>

          <div className='dh-nav__side dh-nav__side--end'>
            <div className='dh-nav__desktop-actions'>{desktopActions}</div>
            <div className='dh-nav__mobile-header-actions'>
              {slots?.mobileHeaderActions}
              {mode === 'marketing' &&
                auth.status === 'authenticated' &&
                auth.mobileHeaderAuthenticated}
            </div>
            <button
              ref={mobileTriggerRef}
              type='button'
              className='dh-nav__icon-button dh-nav__mobile-trigger'
              aria-label={labels.navigation}
              aria-expanded={mobileOpen}
              aria-controls='dh-navigation-mobile-drawer'
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      <div
        className='dh-nav__mobile-layer'
        data-open={mobileOpen || undefined}
        aria-hidden={!mobileOpen}
      >
        <button
          type='button'
          className='dh-nav__mobile-backdrop'
          aria-label={labels.closeNavigation}
          tabIndex={mobileOpen ? 0 : -1}
          onClick={closeMenus}
        />
        <div
          ref={mobileDrawerRef}
          id='dh-navigation-mobile-drawer'
          className='dh-nav__mobile-drawer'
          role='dialog'
          aria-modal='true'
          aria-label={labels.navigation}
        >
          <div className='dh-nav__mobile-header'>
            <img
              src={assets.wordmarkSrc}
              alt={assets.alt ?? 'Doohuan'}
              width={120}
              height={18}
            />
            <button
              ref={mobileCloseRef}
              type='button'
              className='dh-nav__icon-button'
              aria-label={labels.closeNavigation}
              onClick={() => {
                closeMenus()
                mobileTriggerRef.current?.focus()
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <div className='dh-nav__mobile-content'>
            <a
              href={model.about.href}
              className='dh-nav__mobile-link'
              onClick={closeMenus}
            >
              {model.about.label}
            </a>
            <MobileGroup
              label={labels.aips}
              links={model.aips}
              active={site === 'aips'}
              onNavigate={closeMenus}
            />
            <MobileGroup
              label={labels.api}
              links={model.api}
              active={site === 'api'}
              onNavigate={closeMenus}
            />
            {slots?.mobileActions}
            {mode === 'marketing' && <MobileAuth {...props} />}
          </div>
        </div>
      </div>
    </header>
  )
}
