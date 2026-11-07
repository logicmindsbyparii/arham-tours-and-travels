import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Info, Lock } from 'lucide-react'
import Logo from '../../components/ui/Logo.jsx'
import { clearNotice, login, selectAdminAuth } from '../authSlice.js'
import { useToast } from '../toast.js'
import { Button } from '../components/ui.jsx'
import { PasswordField, TextField } from '../components/fields.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Enter your email address'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Enter your password'
  return errors
}

// There is no sign-up here on purpose: admin accounts are created on the
// server with `npm run seed:admin`.
function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { status, notice } = useSelector(selectAdminAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') return <Navigate to="/admin/dashboard" replace />

  const change = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    const found = validate(form)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return
    setSubmitting(true)
    dispatch(clearNotice())
    try {
      await dispatch(login({ email: form.email.trim(), password: form.password })).unwrap()
      toast.success('Welcome back')
      const from = location.state?.from
      navigate(from && from.startsWith('/admin/') && from !== '/admin/login' ? from : '/admin/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message ?? 'Could not sign in')
      if (error.details) setErrors(error.details)
      setForm((current) => ({ ...current, password: '' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-10 font-sans text-admin-text">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="[&_img]:h-10!" />
          <p className="mt-3 text-sm text-admin-muted">Arham Tours &amp; Travels · Admin panel</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-admin-primary-strong">
              <Lock size={18} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Sign in</h1>
              <p className="text-sm text-admin-muted">For site administrators only.</p>
            </div>
          </div>

          {notice && !formError && (
            <p role="status" className="mt-5 flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm text-admin-primary-strong">
              <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {notice}
            </p>
          )}
          {formError && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-admin-danger">
              <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {formError}
            </p>
          )}

          <form onSubmit={submit} noValidate className="mt-5 space-y-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={form.email}
              onChange={change}
              error={errors.email}
              required
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={change}
              error={errors.password}
              required
            />
            <Button type="submit" variant="primary" loading={submitting} className="w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm">
          <a href="/" className="text-admin-muted hover:text-admin-primary-strong hover:underline">
            ← Back to the website
          </a>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
