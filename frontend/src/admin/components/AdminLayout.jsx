import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  CarFront,
  ExternalLink,
  FileCheck,
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import Logo from '../../components/ui/Logo.jsx'
import { logout, selectAdminAuth } from '../authSlice.js'
import { useToast } from '../toast.js'
import { IconButton } from './ui.jsx'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
    ],
  },
  {
    label: 'Travel',
    items: [
      { to: '/admin/packages', label: 'Packages', icon: Package },
      { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
      { to: '/admin/visa-countries', label: 'Visa countries', icon: FileCheck },
      { to: '/admin/car-rental', label: 'Car rental rates', icon: CarFront },
      { to: '/admin/banners', label: 'Hero banners', icon: Images },
    ],
  },
  {
    label: 'Website',
    items: [
      { to: '/admin/services', label: 'Services', icon: Sparkles },
      { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/admin/settings', label: 'Business settings', icon: Settings },
      { to: '/admin/activity-logs', label: 'Activity logs', icon: Activity },
      { to: '/admin/profile', label: 'My profile', icon: UserRound },
    ],
  },
]

function SidebarNav({ onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-5">
          <p className="px-3 pb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-admin-muted">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  data-nav-link
                  className={({ isActive }) =>
                    `relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-admin-primary ${
                      isActive
                        ? 'bg-sky-50 text-admin-primary-strong before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r before:bg-admin-primary'
                        : 'text-admin-muted hover:bg-admin-subtle hover:text-admin-text'
                    }`
                  }
                >
                  <Icon size={18} aria-hidden="true" className="shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { pathname } = useLocation()
  const { admin } = useSelector(selectAdminAuth)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const drawerRef = useRef(null)
  const menuButtonRef = useRef(null)

  // Mobile drawer: Escape closes it, focus moves into it and back to the menu
  // button, and the page behind does not scroll.
  useEffect(() => {
    if (!drawerOpen) return undefined
    const menuButton = menuButtonRef.current
    document.documentElement.style.overflow = 'hidden'
    drawerRef.current?.querySelector('[data-nav-link]')?.focus()
    const onKey = (event) => event.key === 'Escape' && setDrawerOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      menuButton?.focus()
    }
  }, [drawerOpen])

  // Close the drawer once the page changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setDrawerOpen(false)
  }

  const signOut = async () => {
    setSigningOut(true)
    try {
      await dispatch(logout()).unwrap()
      toast.success('Signed out')
    } catch {
      toast.error('Could not reach the server; you have been signed out on this device.')
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  const brand = (
    <Link to="/admin/dashboard" className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-admin-primary">
      <Logo className="[&_img]:h-8! [&_img]:max-w-[150px]" />
      <span className="rounded bg-admin-subtle px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-admin-muted ring-1 ring-admin-border">
        Admin
      </span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-admin-bg font-sans text-admin-text">
      <a
        href="#admin-main"
        className="sr-only z-[90] rounded-lg bg-white px-4 py-2 font-semibold text-admin-text shadow focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-admin-border bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-admin-border px-5">{brand}</div>
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}>
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          ref={drawerRef}
          id="admin-drawer"
          aria-label="Admin menu"
          inert={!drawerOpen}
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-admin-border bg-white shadow-xl transition-transform duration-200 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-2 border-b border-admin-border pl-4 pr-2">
            {brand}
            <IconButton label="Close menu" onClick={() => setDrawerOpen(false)}>
              <X size={20} aria-hidden="true" />
            </IconButton>
          </div>
          <SidebarNav onNavigate={() => setDrawerOpen(false)} />
          <div className="border-t border-admin-border p-3">
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-admin-danger hover:bg-red-50"
            >
              <LogOut size={18} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </aside>
      </div>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-admin-border bg-white px-2 sm:px-4 lg:px-8">
          <IconButton
            ref={menuButtonRef}
            label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="admin-drawer"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </IconButton>
          <div className="min-w-0 flex-1 lg:hidden">{brand}</div>
          <div className="hidden flex-1 lg:block" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-admin-muted hover:bg-admin-subtle hover:text-admin-text sm:inline-flex"
          >
            <ExternalLink size={16} aria-hidden="true" />
            View website
          </a>
          <Link
            to="/admin/profile"
            className="hidden min-h-11 min-w-0 items-center gap-2 rounded-lg px-2 hover:bg-admin-subtle md:flex"
            aria-label="My profile"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-admin-primary-strong">
              {admin?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </span>
            <span className="min-w-0 text-left leading-tight">
              <span className="block max-w-[10rem] truncate text-sm font-semibold text-admin-text">{admin?.name}</span>
              <span className="block max-w-[10rem] truncate text-xs text-admin-muted">{admin?.email}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-admin-muted hover:bg-red-50 hover:text-admin-danger disabled:opacity-60"
          >
            <LogOut size={18} aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Sign out</span>
            <span className="sr-only min-[400px]:hidden">Sign out</span>
          </button>
        </header>

        <main id="admin-main" className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
