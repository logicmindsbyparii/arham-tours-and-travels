import { useState } from 'react'
import { AlertCircle, MessageCircle, Phone, Save } from 'lucide-react'
import { useApiQuery, useMutation } from '../hooks.js'
import { errorFor, pickFields } from '../format.js'
import { useToast } from '../toast.js'
import { fallbackSettings } from '../../features/site/fallbackSite.js'
import { buildWhatsAppUrl } from '../../features/inquiry/whatsapp.js'
import { Button, Card, ErrorState, LoadingState, PageHeader } from '../components/ui.jsx'
import { FormSection, ImageField, LinesField, RowsField, TextAreaField, TextField } from '../components/fields.jsx'

const DEFAULTS = {
  businessName: '',
  legalName: '',
  contactPerson: '',
  city: '',
  hours: '',
  whatsappNumber: '',
  whatsappMessage: '',
  phones: [],
  email: '',
  addressLines: [],
  socialLinks: [],
  logo: '',
  seoTitle: '',
  seoDescription: '',
}

const digits = (value) => String(value ?? '').replace(/[\s()+-]/g, '')
const PHONE = /^\d{8,15}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values) {
  const errors = {}
  if (!values.businessName.trim()) errors.businessName = 'Business name is required'
  if (!PHONE.test(digits(values.whatsappNumber))) errors.whatsappNumber = 'Use digits with the country code, e.g. 919824100369'
  if (values.email && !EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address'
  values.phones.forEach((phone, index) => {
    if (!phone.label?.trim()) errors[`phones.${index}.label`] = 'Enter how the number is shown'
    if (!PHONE.test(digits(phone.number))) errors[`phones.${index}.number`] = 'Digits with country code'
  })
  values.socialLinks.forEach((link, index) => {
    if (!link.label?.trim()) errors[`socialLinks.${index}.label`] = 'Enter a label'
    if (!/^https?:\/\/\S+$/.test(link.url ?? '')) errors[`socialLinks.${index}.url`] = 'Enter a full https:// URL'
  })
  return errors
}

function SettingsForm({ initial }) {
  const mutate = useMutation()
  const toast = useToast()
  const [values, setValues] = useState(() => pickFields(initial ?? fallbackSettings, DEFAULTS))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== name && !key.startsWith(`${name}.`))))
  }
  const field = (name) => ({ name, value: values[name], onChange: change, error: errorFor(errors, name) })

  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return toast.error('Some fields need attention.')
    setSaving(true)
    try {
      const json = await mutate('put', '/admin/settings', values)
      setValues(pickFields(json.data, DEFAULTS))
      toast.success(json.message ?? 'Settings saved')
    } catch (error) {
      if (error.details) setErrors(error.details)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const whatsappOk = PHONE.test(digits(values.whatsappNumber))

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {!initial && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          Not saved yet. The form shows the website’s built-in details; save to start managing them here.
        </p>
      )}

      <FormSection title="Business">
        <TextField label="Business name" required {...field('businessName')} />
        <TextField label="Registered (legal) name" {...field('legalName')} />
        <TextField label="Contact person" {...field('contactPerson')} />
        <TextField label="City" {...field('city')} />
        <TextField label="Office hours" {...field('hours')} className="md:col-span-2" />
        <LinesField label="Address" hint="One line per row." rows={3} {...field('addressLines')} className="md:col-span-2" />
      </FormSection>

      <FormSection title="WhatsApp and phone" description="Used by every WhatsApp button and call link on the website.">
        <TextField
          label="WhatsApp number"
          required
          inputMode="tel"
          hint="Country code + number, digits only, e.g. 919824100369"
          {...field('whatsappNumber')}
        />
        <div className="flex items-end">
          <Button
            to={undefined}
            onClick={() => window.open(buildWhatsAppUrl(digits(values.whatsappNumber), values.whatsappMessage || 'Test message'), '_blank', 'noopener,noreferrer')}
            disabled={!whatsappOk}
            className="w-full sm:w-auto"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Test WhatsApp link
          </Button>
        </div>
        <TextAreaField
          label="Default WhatsApp message"
          rows={2}
          hint="Pre-filled in the floating WhatsApp button. Leave blank for the standard message."
          {...field('whatsappMessage')}
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <RowsField
            label="Phone number"
            name="phones"
            value={values.phones}
            onChange={change}
            errors={errors}
            max={5}
            addLabel="Add phone number"
            hint="Shown on the website as call links (tel:)."
            newRow={() => ({ label: '', number: '' })}
            columns={[
              { key: 'label', label: 'Shown as', placeholder: '+91 98241 00369' },
              { key: 'number', label: 'Digits with country code', placeholder: '919824100369' },
            ]}
          />
          {values.phones[0] && PHONE.test(digits(values.phones[0].number)) && (
            <a href={`tel:+${digits(values.phones[0].number)}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-admin-primary-strong hover:underline">
              <Phone size={14} aria-hidden="true" />
              Test call link
            </a>
          )}
        </div>
        <TextField label="Email" type="email" {...field('email')} className="md:col-span-2" />
      </FormSection>

      <FormSection title="Social media">
        <div className="md:col-span-2">
          <RowsField
            label="Link"
            name="socialLinks"
            value={values.socialLinks}
            onChange={change}
            errors={errors}
            max={10}
            addLabel="Add link"
            hint="Shown in the website footer."
            newRow={() => ({ label: '', url: '' })}
            columns={[
              { key: 'label', label: 'Label', placeholder: 'Instagram' },
              { key: 'url', label: 'URL', placeholder: 'https://www.instagram.com/…' },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Branding and SEO">
        <ImageField label="Logo (optional)" hint="Leave empty to keep the built-in logo." {...field('logo')} className="md:col-span-2" />
        <TextField label="Home page SEO title" maxLength={70} hint="Up to 70 characters. Empty keeps the default." {...field('seoTitle')} />
        <TextAreaField label="Home page SEO description" rows={3} maxLength={170} {...field('seoDescription')} />
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={saving} className="w-full sm:w-auto">
          {!saving && <Save size={16} aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}

function SettingsPage() {
  const { data, loading, error, reload } = useApiQuery('/admin/settings')
  return (
    <>
      <PageHeader
        title="Business settings"
        description="Contact details and links used across the website."
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Business settings' }]}
      />
      {loading && data === null ? (
        <Card>
          <LoadingState />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : (
        <SettingsForm key={data?.updatedAt ?? 'new'} initial={data} />
      )}
    </>
  )
}

export default SettingsPage
