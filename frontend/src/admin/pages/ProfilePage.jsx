import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { KeyRound, Save } from 'lucide-react'
import { api } from '../../lib/api.js'
import { adminUpdated, selectAdminAuth } from '../authSlice.js'
import { formatDateTime } from '../format.js'
import { useToast } from '../toast.js'
import { Button, Card, PageHeader } from '../components/ui.jsx'
import { FormSection, PasswordField, TextField } from '../components/fields.jsx'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function ProfileForm({ admin }) {
  const dispatch = useDispatch()
  const toast = useToast()
  const [values, setValues] = useState({ name: admin.name, email: admin.email })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    const found = {}
    if (!values.name.trim()) found.name = 'Enter your name'
    if (!EMAIL.test(values.email.trim())) found.email = 'Enter a valid email address'
    setErrors(found)
    if (Object.keys(found).length) return
    setSaving(true)
    try {
      const json = await api.put('/admin/profile', { name: values.name.trim(), email: values.email.trim() })
      dispatch(adminUpdated(json.data))
      toast.success(json.message ?? 'Profile saved')
    } catch (error) {
      if (error.details) setErrors(error.details)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FormSection title="Profile" description={`Last sign-in: ${formatDateTime(admin.lastLoginAt)}`}>
        <TextField label="Name" name="name" value={values.name} onChange={change} error={errors.name} required autoComplete="name" />
        <TextField label="Email (used to sign in)" name="email" type="email" value={values.email} onChange={change} error={errors.email} required autoComplete="email" />
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" loading={saving} className="w-full sm:w-auto">
            {!saving && <Save size={16} aria-hidden="true" />}
            Save profile
          </Button>
        </div>
      </FormSection>
    </form>
  )
}

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' }

function PasswordForm() {
  const toast = useToast()
  const [values, setValues] = useState(EMPTY_PASSWORDS)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    const found = {}
    if (!values.currentPassword) found.currentPassword = 'Enter your current password'
    if (values.newPassword.length < 10) found.newPassword = 'Use at least 10 characters'
    else if (!/[A-Za-z]/.test(values.newPassword) || !/\d/.test(values.newPassword)) found.newPassword = 'Include a letter and a number'
    if (values.confirmPassword !== values.newPassword) found.confirmPassword = 'Passwords do not match'
    setErrors(found)
    if (Object.keys(found).length) return
    setSaving(true)
    try {
      const json = await api.put('/admin/profile/password', values)
      setValues(EMPTY_PASSWORDS)
      toast.success(json.message ?? 'Password changed')
    } catch (error) {
      if (error.details) setErrors(error.details)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FormSection title="Change password" description="At least 10 characters with a letter and a number. Other signed-in devices are signed out.">
        <PasswordField
          label="Current password"
          name="currentPassword"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={change}
          error={errors.currentPassword}
          required
          className="md:col-span-2"
        />
        <PasswordField label="New password" name="newPassword" autoComplete="new-password" value={values.newPassword} onChange={change} error={errors.newPassword} required />
        <PasswordField label="Repeat new password" name="confirmPassword" autoComplete="new-password" value={values.confirmPassword} onChange={change} error={errors.confirmPassword} required />
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" loading={saving} className="w-full sm:w-auto">
            {!saving && <KeyRound size={16} aria-hidden="true" />}
            Change password
          </Button>
        </div>
      </FormSection>
    </form>
  )
}

function ProfilePage() {
  const { admin } = useSelector(selectAdminAuth)
  return (
    <>
      <PageHeader title="My profile" crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'My profile' }]} />
      <div className="grid max-w-3xl gap-5">
        {admin ? <ProfileForm admin={admin} /> : <Card className="p-5">Not signed in.</Card>}
        <PasswordForm />
      </div>
    </>
  )
}

export default ProfilePage
