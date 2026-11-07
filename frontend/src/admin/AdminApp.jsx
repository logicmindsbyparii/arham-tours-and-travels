import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { setUnauthorizedHandler } from '../lib/api.js'
import { checkSession, selectAdminAuth, sessionExpired } from './authSlice.js'
import Toaster from './components/Toaster.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import { LoadingState } from './components/ui.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import InquiriesPage from './pages/InquiriesPage.jsx'
import PackagesPage from './pages/PackagesPage.jsx'
import PackageFormPage from './pages/PackageFormPage.jsx'
import VisaCountriesPage from './pages/VisaCountriesPage.jsx'
import VisaCountryFormPage from './pages/VisaCountryFormPage.jsx'
import ResourcePage from './pages/ResourcePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ActivityLogsPage from './pages/ActivityLogsPage.jsx'
import CarRentalRatesPage from './pages/CarRentalRatesPage.jsx'
import { RESOURCES } from './resources.jsx'

// Signed-in pages. The real protection is on the server (every admin API
// checks the session); this only decides what to show in the browser.
function RequireAdmin({ children }) {
  const { status } = useSelector(selectAdminAuth)
  const location = useLocation()
  if (status === 'unknown' || status === 'checking') {
    return (
      <div className="min-h-screen bg-admin-bg">
        <LoadingState label="Checking your session…" />
      </div>
    )
  }
  if (status !== 'authenticated') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}

function AdminApp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // useNavigate returns a new function after every page change. Reading it
  // through a ref keeps the effect below from re-running (and re-checking the
  // session, which blanked the whole panel) on each sidebar click.
  const navigateRef = useRef(navigate)
  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  // Once, when the admin panel opens.
  useEffect(() => {
    document.title = 'Admin | Arham Tours & Travels'
    // Admin pages should never be indexed.
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    dispatch(checkSession())
    // Any admin request answered with 401 ends the session in the browser too.
    setUnauthorizedHandler((error) => {
      dispatch(sessionExpired(error.message))
      navigateRef.current('/admin/login', { replace: true })
    })
    return () => {
      robots.remove()
      setUnauthorizedHandler(null)
    }
  }, [dispatch])

  return (
    <Toaster>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="packages/new" element={<PackageFormPage />} />
          <Route path="packages/edit/:id" element={<PackageFormPage />} />
          <Route path="visa-countries" element={<VisaCountriesPage />} />
          <Route path="visa-countries/new" element={<VisaCountryFormPage />} />
          <Route path="visa-countries/:id" element={<VisaCountryFormPage />} />
          <Route path="visa-countries/edit/:id" element={<VisaCountryFormPage />} />
          <Route path="car-rental" element={<CarRentalRatesPage />} />
          {Object.entries(RESOURCES).map(([key, resource]) => (
            <Route key={key} path={resource.route} element={<ResourcePage key={key} resource={resource} />} />
          ))}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Toaster>
  )
}

export default AdminApp
