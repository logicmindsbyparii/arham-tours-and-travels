import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Plus, Save, Trash2, ArrowLeft } from 'lucide-react'
import { useApiQuery, useMutation } from '../hooks.js'
import { errorFor, pickFields } from '../format.js'
import { useToast } from '../toast.js'
import { Button, Card, ErrorState, IconButton, LoadingState, PageHeader } from '../components/ui.jsx'
import {
  FormSection,
  ImageField,
  LinesField,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/fields.jsx'

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'AED', label: 'AED (د.إ)' },
]

const DEFAULTS = {
  name: '',
  slug: '',
  flag: '',
  tagline: '',
  image: '',
  processingTime: '',
  stayDuration: '',
  validity: '',
  entryType: '',
  documentGroups: [],
  charges: [],
  chargesNote: '',
  notes: '',
  status: 'draft',
  sortOrder: 0,
}

function validate(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Country name is required'
  if (values.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    errors.slug = 'Use lowercase letters, numbers and single dashes'
  }
  values.documentGroups?.forEach((group, index) => {
    if (!group.title?.trim()) {
      errors[`documentGroups.${index}.title`] = 'Group title is required'
    }
  })
  values.charges?.forEach((charge, index) => {
    if (!charge.visaType?.trim()) {
      errors[`charges.${index}.visaType`] = 'Visa type is required'
    }
    const embassyFeeNum = Number(charge.embassyFee)
    if (charge.embassyFee === '' || charge.embassyFee === null || charge.embassyFee === undefined || isNaN(embassyFeeNum) || embassyFeeNum < 0) {
      errors[`charges.${index}.embassyFee`] = 'Enter an embassy fee, use 0 if none'
    }
    const serviceFeeNum = Number(charge.serviceFee)
    if (charge.serviceFee === '' || charge.serviceFee === null || charge.serviceFee === undefined || isNaN(serviceFeeNum) || serviceFeeNum < 0) {
      errors[`charges.${index}.serviceFee`] = 'Enter a service fee, use 0 if none'
    }
  })
  return errors
}

function VisaCountryForm({ initial, id }) {
  const navigate = useNavigate()
  const mutate = useMutation()
  const toast = useToast()
  const [values, setValues] = useState(() => pickFields(initial, DEFAULTS))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!Object.keys(current).some((key) => key === name || key.startsWith(`${name}.`))) return current
      return Object.fromEntries(Object.entries(current).filter(([key]) => key !== name && !key.startsWith(`${name}.`)))
    })
  }

  // Document group repeater helpers
  const addDocumentGroup = () => {
    const current = values.documentGroups ?? []
    if (current.length >= 12) return
    change('documentGroups', [...current, { title: '', items: [] }])
  }

  const removeDocumentGroup = (index) => {
    const current = values.documentGroups ?? []
    change(
      'documentGroups',
      current.filter((_, i) => i !== index),
    )
  }

  const updateDocumentGroup = (index, key, val) => {
    const current = values.documentGroups ?? []
    change(
      'documentGroups',
      current.map((group, i) => (i === index ? { ...group, [key]: val } : group)),
    )
  }

  // Charge repeater helpers
  const addChargeRow = () => {
    const current = values.charges ?? []
    if (current.length >= 15) return
    change('charges', [
      ...current,
      {
        visaType: '',
        currency: 'INR',
        embassyFee: 0,
        serviceFee: 0,
        processingTime: '',
        note: '',
      },
    ])
  }

  const removeChargeRow = (index) => {
    const current = values.charges ?? []
    change(
      'charges',
      current.filter((_, i) => i !== index),
    )
  }

  const updateChargeRow = (index, key, val) => {
    const current = values.charges ?? []
    change(
      'charges',
      current.map((row, i) => (i === index ? { ...row, [key]: val } : row)),
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error('Some fields need attention.')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...values,
        sortOrder: Number(values.sortOrder) || 0,
        charges: (values.charges ?? []).map((row) => ({
          ...row,
          currency: row.currency || 'INR',
          embassyFee: Number(row.embassyFee) || 0,
          serviceFee: Number(row.serviceFee) || 0,
        })),
      }
      const json = id
        ? await mutate('put', `/admin/visa-countries/${id}`, body)
        : await mutate('post', '/admin/visa-countries', body)
      toast.success(json.message ?? 'Visa country saved')
      navigate('/admin/visa-countries')
    } catch (error) {
      if (error.details) setErrors(error.details)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const field = (name) => ({ name, value: values[name], onChange: change, error: errorFor(errors, name) })
  const errorCount = Object.keys(errors).length

  return (
    <form onSubmit={submit} noValidate className="space-y-6 pb-24">
      {errorCount > 0 && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-admin-danger">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          Please fix the highlighted {errorCount === 1 ? 'field' : 'fields'} below.
        </p>
      )}

      {/* 1. Country */}
      <FormSection title="Country" description="Destination country information and display basics.">
        <TextField label="Country name" required hint="e.g. Vietnam, Dubai / UAE, Singapore" {...field('name')} />
        <TextField label="Slug (web address)" hint="Leave blank to create it from the name." {...field('slug')} />
        <TextField label="Flag" hint="Emoji or short text, e.g. 🇻🇳, 🇦🇪, 🇸🇬" maxLength={20} {...field('flag')} />
        <div className="md:col-span-2">
          <TextAreaField label="Tagline" hint="Brief overview or sub-heading (max 300 characters)" rows={2} maxLength={300} {...field('tagline')} />
        </div>
        <div className="md:col-span-2">
          <ImageField label="Header photo (optional)" hint="Banner photo for this country's document page." {...field('image')} />
        </div>
      </FormSection>

      {/* 2. Visa details */}
      <FormSection title="Visa details" description="Key information travelers need to know before applying.">
        <TextField label="Processing time" hint="e.g. Usually 5–7 working days" {...field('processingTime')} />
        <TextField label="Stay duration" hint="e.g. Up to 30 days, 60 days" {...field('stayDuration')} />
        <TextField label="Validity" hint="e.g. 90 days from date of issue" {...field('validity')} />
        <TextField label="Entry type" hint="e.g. Single entry, Multiple entry" {...field('entryType')} />
      </FormSection>

      {/* 3. Documents */}
      <FormSection
        title="Documents"
        description="Organize required documents into clear groups. Each country displays only its own documents."
      >
        <div className="md:col-span-2 space-y-4">
          {(values.documentGroups ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-admin-border bg-admin-subtle p-6 text-center">
              <p className="text-sm font-medium text-admin-text">No document groups added yet</p>
              <p className="mt-1 text-xs text-admin-muted">
                Add groups such as Common documents, Employed, Business, Student
              </p>
              <Button type="button" variant="primary" onClick={addDocumentGroup} className="mt-4">
                <Plus size={16} aria-hidden="true" />
                Add document group
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {values.documentGroups.map((group, index) => {
                const titleError = errors[`documentGroups.${index}.title`]
                const itemsError = errors[`documentGroups.${index}.items`]
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-admin-border bg-admin-subtle p-4 sm:p-5 transition-shadow hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-admin-border pb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-admin-primary-strong">
                        Group {index + 1}: {group.title || 'Untitled group'}
                      </span>
                      <IconButton
                        label={`Remove group ${index + 1}`}
                        onClick={() => removeDocumentGroup(index)}
                        className="h-8 w-8 hover:bg-red-50 hover:text-admin-danger"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </IconButton>
                    </div>
                    <div className="mt-4 space-y-4">
                      <TextField
                        label="Group title"
                        required
                        value={group.title ?? ''}
                        onChange={(_, val) => updateDocumentGroup(index, 'title', val)}
                        error={titleError}
                        hint="e.g. Common documents, If you are employed, If you are self-employed / business, Minor / children"
                      />
                      <LinesField
                        label="Required document items"
                        value={group.items ?? []}
                        onChange={(_, val) => updateDocumentGroup(index, 'items', val)}
                        error={itemsError}
                        rows={4}
                        hint="One document requirement per line."
                      />
                    </div>
                  </div>
                )
              })}

              {values.documentGroups.length < 12 && (
                <Button type="button" onClick={addDocumentGroup} className="mt-2">
                  <Plus size={16} aria-hidden="true" />
                  Add another document group
                </Button>
              )}
            </div>
          )}
        </div>
      </FormSection>

      {/* 4. Charges */}
      <FormSection
        title="Charges & fees"
        description="Specify embassy and service fees per visa type. Total is automatically calculated."
      >
        <div className="md:col-span-2 space-y-4">
          {(values.charges ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-admin-border bg-admin-subtle p-6 text-center">
              <p className="text-sm font-medium text-admin-text">No visa fee rows added yet</p>
              <p className="mt-1 text-xs text-admin-muted">
                Add rows such as Tourist visa 30 days, Express visa, Business visa
              </p>
              <Button type="button" variant="primary" onClick={addChargeRow} className="mt-4">
                <Plus size={16} aria-hidden="true" />
                Add fee row
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {values.charges.map((row, index) => {
                const visaTypeError = errors[`charges.${index}.visaType`]
                const embassyFeeError = errors[`charges.${index}.embassyFee`]
                const serviceFeeError = errors[`charges.${index}.serviceFee`]
                const total = (Number(row.embassyFee) || 0) + (Number(row.serviceFee) || 0)

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-admin-border bg-admin-subtle p-4 sm:p-5 transition-shadow hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-admin-border pb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-admin-primary-strong">
                        Fee row {index + 1}: {row.visaType || 'Untitled fee'}
                      </span>
                      <IconButton
                        label={`Remove fee row ${index + 1}`}
                        onClick={() => removeChargeRow(index)}
                        className="h-8 w-8 hover:bg-red-50 hover:text-admin-danger"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </IconButton>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="sm:col-span-2">
                        <TextField
                          label="Visa type"
                          required
                          value={row.visaType ?? ''}
                          onChange={(_, val) => updateChargeRow(index, 'visaType', val)}
                          error={visaTypeError}
                          hint="e.g. Tourist visa, 30 days, single entry"
                        />
                      </div>
                      <div>
                        <SelectField
                          label="Currency"
                          value={row.currency || 'INR'}
                          onChange={(_, val) => updateChargeRow(index, 'currency', val)}
                          options={CURRENCY_OPTIONS}
                        />
                      </div>
                      <div>
                        <NumberField
                          label="Embassy fee"
                          required
                          value={row.embassyFee ?? 0}
                          onChange={(_, val) => updateChargeRow(index, 'embassyFee', val)}
                          error={embassyFeeError}
                          min={0}
                          hint="Official embassy/consulate charge"
                        />
                      </div>
                      <div>
                        <NumberField
                          label="Service fee"
                          required
                          value={row.serviceFee ?? 0}
                          onChange={(_, val) => updateChargeRow(index, 'serviceFee', val)}
                          error={serviceFeeError}
                          min={0}
                          hint="Our processing and assistance fee"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-admin-text">
                          Total (calculated)
                        </label>
                        <div className="flex min-h-11 items-center rounded-lg border border-admin-border bg-white px-3 py-2 text-sm font-semibold text-admin-primary-strong">
                          {row.currency || 'INR'} {total.toLocaleString('en-IN')}
                        </div>
                        <p className="mt-1.5 text-xs text-admin-muted">Embassy + Service</p>
                      </div>
                      <div>
                        <TextField
                          label="Processing time (optional)"
                          value={row.processingTime ?? ''}
                          onChange={(_, val) => updateChargeRow(index, 'processingTime', val)}
                          hint="e.g. 3–5 working days"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextField
                          label="Note (optional)"
                          value={row.note ?? ''}
                          onChange={(_, val) => updateChargeRow(index, 'note', val)}
                          maxLength={300}
                          hint="e.g. VFS biometric fees separate if applicable"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {values.charges.length < 15 && (
                <Button type="button" onClick={addChargeRow} className="mt-2">
                  <Plus size={16} aria-hidden="true" />
                  Add another fee row
                </Button>
              )}
            </div>
          )}

          <div className="pt-2">
            <TextAreaField
              label="Charges note / disclaimer"
              hint="General fee disclaimer displayed beneath the charges table (max 500 characters)."
              rows={2}
              maxLength={500}
              {...field('chargesNote')}
            />
          </div>
        </div>
      </FormSection>

      {/* 5. Notes */}
      <FormSection title="Notes" description="Instructions, warnings, or embassy disclaimer notes.">
        <div className="md:col-span-2">
          <TextAreaField
            label="Notes & instructions"
            hint="Displayed under the document checklist on the country's page (max 1500 characters)."
            rows={4}
            maxLength={1500}
            {...field('notes')}
          />
        </div>
      </FormSection>

      {/* 6. Publishing */}
      <FormSection title="Publishing" description="Control website visibility and display order.">
        <SelectField
          label="Status"
          hint="Only published countries appear on the website."
          {...field('status')}
          options={[
            { value: 'draft', label: 'Draft (hidden)' },
            { value: 'published', label: 'Published (visible on website)' },
          ]}
        />
        <NumberField label="Display order" hint="Lower numbers appear first." {...field('sortOrder')} />
      </FormSection>

      {/* Sticky Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-admin-border bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-8">
        <Button to="/admin/visa-countries" variant="ghost">
          <ArrowLeft size={16} aria-hidden="true" />
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="primary" type="submit" loading={saving}>
            <Save size={16} aria-hidden="true" />
            {saving ? 'Saving…' : id ? 'Save changes' : 'Create country'}
          </Button>
        </div>
      </div>
    </form>
  )
}

function VisaCountryFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { data, loading, error, reload } = useApiQuery(isEdit ? `/admin/visa-countries/${id}` : null)

  const crumbs = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Visa countries', to: '/admin/visa-countries' },
    { label: isEdit ? (data?.name ?? 'Edit country') : 'New country' },
  ]

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${data?.name ?? 'visa country'}` : 'New visa country'}
        description={
          isEdit
            ? 'Update visa details, document requirements, charges, and status.'
            : 'Add a country with its own document requirements, visa fees, and guidance.'
        }
        crumbs={crumbs}
        actions={
          <Button to="/admin/visa-countries">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to list
          </Button>
        }
      />

      {isEdit && loading && !data ? (
        <Card>
          <LoadingState label="Loading visa country…" />
        </Card>
      ) : isEdit && error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : (
        <VisaCountryForm initial={data ?? DEFAULTS} id={id} />
      )}
    </>
  )
}

export default VisaCountryFormPage
