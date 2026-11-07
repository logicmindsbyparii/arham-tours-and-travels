import { Component, Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import WhatsAppButton from './components/layout/WhatsAppButton.jsx'
import ScrollManager from './components/layout/ScrollManager.jsx'
import Loader from './components/layout/Loader.jsx'
import HomePage from './pages/HomePage.jsx'
import VisaPage from './pages/VisaPage.jsx'
import { useSmoothScroll, getSmoothScroll } from './hooks/useSmoothScroll.js'
import { useFirstLoad } from './hooks/useFirstLoad.js'
import { useSiteLoader } from './features/site/useSiteLoader.js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('App ErrorBoundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center text-ink">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate">{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-sky px-4 py-2 text-white font-medium cursor-pointer"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// The admin panel is its own bundle: visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

// The home page ships in the main bundle; every other page is its own file,
// so the first visit downloads and runs less before the site appears. Once the
// loader has gone they are fetched in the background, so moving between pages
// never waits.
const pageImports = {
  packages: () => import('./pages/PackagesPage.jsx'),
  destinations: () => import('./pages/DestinationsPage.jsx'),
  services: () => import('./pages/ServicesPage.jsx'),
  carRental: () => import('./pages/CarRentalPage.jsx'),
  about: () => import('./pages/AboutPage.jsx'),
  contact: () => import('./pages/ContactPage.jsx'),
}
const PackagesPage = lazy(pageImports.packages)
const DestinationsPage = lazy(pageImports.destinations)
const ServicesPage = lazy(pageImports.services)
const CarRentalPage = lazy(pageImports.carRental)
const AboutPage = lazy(pageImports.about)
const ContactPage = lazy(pageImports.contact)

function VisaCountryRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/visa?country=${encodeURIComponent(slug || '')}`} replace />
}

function usePreloadPages(ready) {
  useEffect(() => {
    if (!ready) return undefined
    const preload = () => Object.values(pageImports).forEach((load) => load())
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(preload, 1500)
    return () => window.clearTimeout(id)
  }, [ready])
}

// The public website: everything outside /admin.
function PublicSite() {
  useSiteLoader()
  useSmoothScroll()
  const reduceMotion = useReducedMotion()
  const loading = useFirstLoad(reduceMotion ? 400 : 2000)
  usePreloadPages(!loading)

  return (
    // reducedMotion="user": framer-motion skips transform animations for
    // visitors whose operating system asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <AnimatePresence
        onExitComplete={() => {
          document.documentElement.style.overflow = ''
          getSmoothScroll()?.start()
        }}
      >
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-paper px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <ErrorBoundary>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/visa" element={<VisaPage />} />
              <Route path="/visa/:slug" element={<VisaCountryRedirect />} />
              <Route path="/car-rental" element={<CarRentalPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
      <div aria-hidden="true" className="grain" />
    </MotionConfig>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-admin-bg" />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}

export default App
