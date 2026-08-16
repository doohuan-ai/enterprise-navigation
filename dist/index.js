// src/EnterpriseNavigation.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

// src/navigation.ts
function joinOrigin(origin, path) {
  return `${origin.replace(/\/$/, "")}${path}`;
}
function createEnterpriseNavigationModel(origins, labels, languagePathPrefix = "") {
  const localized = (path) => `${languagePathPrefix}${path}`;
  return {
    about: {
      id: "about",
      label: labels.about,
      href: joinOrigin(origins.www, localized("/about"))
    },
    aips: [
      {
        id: "aips-home",
        label: labels.home,
        href: joinOrigin(origins.aips, languagePathPrefix || "/")
      },
      {
        id: "aips-features",
        label: labels.features,
        href: joinOrigin(origins.aips, localized("/features"))
      },
      {
        id: "aips-pricing",
        label: labels.pricing,
        href: joinOrigin(origins.aips, localized("/pricing"))
      },
      {
        id: "aips-download",
        label: labels.download,
        href: joinOrigin(origins.aips, localized("/download"))
      }
    ],
    api: [
      {
        id: "api-overview",
        label: labels.apiOverview,
        href: joinOrigin(origins.api, "/")
      },
      {
        id: "api-models",
        label: labels.apiModels,
        href: joinOrigin(origins.api, "/models")
      },
      {
        id: "api-docs",
        label: labels.apiDocs,
        href: joinOrigin(origins.api, "/doc")
      }
    ]
  };
}

// src/EnterpriseNavigation.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var FLOAT_ENTER_PX = 120;
var FLOAT_EXIT_PX = 40;
function ChevronIcon() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", className: "dh-nav__chevron", children: /* @__PURE__ */ jsx("path", { d: "m7 10 5 5 5-5" }) });
}
function MenuIcon() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", className: "dh-nav__menu-icon", children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
}
function CloseIcon() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", className: "dh-nav__menu-icon", children: /* @__PURE__ */ jsx("path", { d: "m6 6 12 12M18 6 6 18" }) });
}
function DropdownPanel(props) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: props.id,
      className: "dh-nav__dropdown-position",
      "data-open": props.open || void 0,
      children: /* @__PURE__ */ jsx("div", { className: "dh-nav__dropdown", role: "menu", children: props.links.map((item) => /* @__PURE__ */ jsx(
        "a",
        {
          href: item.href,
          className: "dh-nav__dropdown-link",
          role: "menuitem",
          onClick: props.onNavigate,
          children: item.label
        },
        item.id
      )) })
    }
  );
}
function ProductMenu(props) {
  const panelId = `dh-navigation-${props.id}-menu`;
  return /* @__PURE__ */ jsxs("div", { className: "dh-nav__product", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "dh-nav__product-trigger",
        "data-active": props.active || void 0,
        "aria-expanded": props.open,
        "aria-haspopup": "menu",
        "aria-controls": panelId,
        "aria-current": props.active ? "page" : void 0,
        onClick: props.onToggle,
        children: [
          props.label,
          /* @__PURE__ */ jsx(ChevronIcon, {})
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DropdownPanel,
      {
        id: panelId,
        open: props.open,
        links: props.links,
        onNavigate: props.onNavigate
      }
    )
  ] });
}
function MobileGroup(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "dh-nav__mobile-group-label", "data-active": props.active || void 0, children: props.label }),
    props.links.map((item) => /* @__PURE__ */ jsx(
      "a",
      {
        href: item.href,
        className: "dh-nav__mobile-link dh-nav__mobile-link--nested",
        onClick: props.onNavigate,
        children: item.label
      },
      item.id
    ))
  ] });
}
function AuthenticatedFallback(props) {
  if (!props.dashboardHref) return null;
  return /* @__PURE__ */ jsx("a", { href: props.dashboardHref, className: "dh-nav__dashboard-link", children: props.dashboardLabel });
}
function MarketingActions(props) {
  const { auth, labels } = props;
  if (auth.status === "loading") {
    return /* @__PURE__ */ jsx("span", { className: "dh-nav__auth-placeholder", "aria-hidden": "true" });
  }
  if (auth.status === "anonymous") {
    return /* @__PURE__ */ jsx("a", { href: auth.signInHref, className: "dh-nav__sign-in", children: labels.signIn });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    auth.showDashboardLink && /* @__PURE__ */ jsx(
      AuthenticatedFallback,
      {
        dashboardHref: auth.dashboardHref,
        dashboardLabel: labels.dashboard
      }
    ),
    auth.desktopAuthenticated ?? /* @__PURE__ */ jsx(
      AuthenticatedFallback,
      {
        dashboardHref: auth.dashboardHref,
        dashboardLabel: labels.dashboard
      }
    )
  ] });
}
function MobileAuth(props) {
  const { auth, labels } = props;
  if (auth.status === "loading") return null;
  if (auth.status === "authenticated") {
    return /* @__PURE__ */ jsx("div", { className: "dh-nav__mobile-auth", children: auth.mobileAuthenticated ?? auth.desktopAuthenticated ?? /* @__PURE__ */ jsx(
      AuthenticatedFallback,
      {
        dashboardHref: auth.dashboardHref,
        dashboardLabel: labels.dashboard
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "dh-nav__mobile-auth", children: [
    /* @__PURE__ */ jsx("a", { href: auth.signInHref, className: "dh-nav__mobile-auth-secondary", children: labels.signIn }),
    auth.registerHref && /* @__PURE__ */ jsx("a", { href: auth.registerHref, className: "dh-nav__mobile-auth-primary", children: labels.register })
  ] });
}
function EnterpriseNavigation(props) {
  const {
    site,
    mode = "marketing",
    origins,
    labels,
    assets,
    auth,
    slots,
    languagePathPrefix = ""
  } = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  const mobileCloseRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const model = useMemo(
    () => createEnterpriseNavigationModel(
      origins,
      labels,
      languagePathPrefix
    ),
    [origins, labels, languagePathPrefix]
  );
  useEffect(() => {
    let animationFrame = 0;
    const apply = () => {
      animationFrame = 0;
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (prev) return y > FLOAT_EXIT_PX;
        return y > FLOAT_ENTER_PX;
      });
    };
    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);
  useEffect(() => {
    if (!openDropdown && !mobileOpen) return;
    const onPointerDown = (event) => {
      if (openDropdown && navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (event) => {
      if (mobileOpen && event.key === "Tab") {
        const focusable = mobileDrawerRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable?.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }
      if (event.key !== "Escape") return;
      setOpenDropdown(null);
      if (mobileOpen) {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, openDropdown]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);
  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };
  const toggleDropdown = (id) => {
    setOpenDropdown((current) => current === id ? null : id);
  };
  const logoHref = origins[site];
  const headerStyle = {
    "--dh-navigation-background": props.backgroundColor ?? "#f7f7f4"
  };
  const classes = [
    "dh-nav",
    mode === "console" ? "dh-nav--console" : "dh-nav--marketing",
    props.className
  ].filter(Boolean).join(" ");
  let desktopActions;
  if (mode === "console") {
    desktopActions = slots?.desktopActions;
  } else {
    desktopActions = /* @__PURE__ */ jsxs(Fragment, { children: [
      slots?.desktopActions,
      /* @__PURE__ */ jsx(MarketingActions, { ...props })
    ] });
  }
  return /* @__PURE__ */ jsxs("header", { className: classes, style: headerStyle, children: [
    /* @__PURE__ */ jsx("div", { className: "dh-nav__frame", "data-floated": isScrolled || void 0, children: /* @__PURE__ */ jsxs("div", { className: "dh-nav__inner", "data-floated": isScrolled || void 0, children: [
      /* @__PURE__ */ jsxs("div", { className: "dh-nav__side dh-nav__side--start", children: [
        slots?.leading,
        /* @__PURE__ */ jsx("a", { href: logoHref, className: "dh-nav__brand", "aria-label": assets.alt ?? "Doohuan", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: isScrolled ? assets.iconSrc : assets.wordmarkSrc,
            alt: assets.alt ?? "Doohuan",
            width: isScrolled ? 26 : 104,
            height: isScrolled ? 26 : 16
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { ref: navRef, className: "dh-nav__desktop", "aria-label": labels.navigation, children: [
        /* @__PURE__ */ jsx("a", { href: model.about.href, className: "dh-nav__text-link", children: model.about.label }),
        /* @__PURE__ */ jsx(
          ProductMenu,
          {
            id: "aips",
            label: labels.aips,
            active: site === "aips",
            open: openDropdown === "aips",
            links: model.aips,
            onToggle: () => toggleDropdown("aips"),
            onNavigate: closeMenus
          }
        ),
        /* @__PURE__ */ jsx(
          ProductMenu,
          {
            id: "api",
            label: labels.api,
            active: site === "api",
            open: openDropdown === "api",
            links: model.api,
            onToggle: () => toggleDropdown("api"),
            onNavigate: closeMenus
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "dh-nav__side dh-nav__side--end", children: [
        /* @__PURE__ */ jsx("div", { className: "dh-nav__desktop-actions", children: desktopActions }),
        /* @__PURE__ */ jsxs("div", { className: "dh-nav__mobile-header-actions", children: [
          slots?.mobileHeaderActions,
          mode === "marketing" && auth.status === "authenticated" && auth.mobileHeaderAuthenticated
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: mobileTriggerRef,
            type: "button",
            className: "dh-nav__icon-button dh-nav__mobile-trigger",
            "aria-label": labels.navigation,
            "aria-expanded": mobileOpen,
            "aria-controls": "dh-navigation-mobile-drawer",
            onClick: () => setMobileOpen(true),
            children: /* @__PURE__ */ jsx(MenuIcon, {})
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "dh-nav__mobile-layer",
        "data-open": mobileOpen || void 0,
        "aria-hidden": !mobileOpen,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "dh-nav__mobile-backdrop",
              "aria-label": labels.closeNavigation,
              tabIndex: mobileOpen ? 0 : -1,
              onClick: closeMenus
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: mobileDrawerRef,
              id: "dh-navigation-mobile-drawer",
              className: "dh-nav__mobile-drawer",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": labels.navigation,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "dh-nav__mobile-header", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: assets.wordmarkSrc,
                      alt: assets.alt ?? "Doohuan",
                      width: 120,
                      height: 18
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      ref: mobileCloseRef,
                      type: "button",
                      className: "dh-nav__icon-button",
                      "aria-label": labels.closeNavigation,
                      onClick: () => {
                        closeMenus();
                        mobileTriggerRef.current?.focus();
                      },
                      children: /* @__PURE__ */ jsx(CloseIcon, {})
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "dh-nav__mobile-content", children: [
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: model.about.href,
                      className: "dh-nav__mobile-link",
                      onClick: closeMenus,
                      children: model.about.label
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    MobileGroup,
                    {
                      label: labels.aips,
                      links: model.aips,
                      active: site === "aips",
                      onNavigate: closeMenus
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    MobileGroup,
                    {
                      label: labels.api,
                      links: model.api,
                      active: site === "api",
                      onNavigate: closeMenus
                    }
                  ),
                  slots?.mobileActions,
                  mode === "marketing" && /* @__PURE__ */ jsx(MobileAuth, { ...props })
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  EnterpriseNavigation,
  createEnterpriseNavigationModel
};
