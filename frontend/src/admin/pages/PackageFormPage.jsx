import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Eye, Save } from 'lucide-react'
import { useApiQuery, useMutation } from '../hooks.js'
import { errorFor, pickFields } from '../format.js'
import { useToast } from '../toast.js'
import PackagePreview from '../components/PackagePreview.jsx'
import { Button, Card, ErrorState, LoadingState, PageHeader } from '../components/ui.jsx'
import {
  FormSection,
  ImageField,
  LinesField,
  NumberField,
  RowsField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from '../components/fields.jsx'

const DEFAULTS = {
  title: '',
  slug: '',
  region: '',
  category: 'international',
  featured: false,
  nights: 1,
  days: 2,
  price: 0,
  currency: 'INR',
  priceBasis: 'per person',
  badge: '',
  places: [],
  description: '',
  fullDescription: '',
  highlights: [],
  inclusions: [],
  exclusions: [],
  hotels: [],
  itinerary: [],
  departures: [],
  validUntil: '',
  image: '',
  imageAlt: '',
  gallery: [],
  flyer: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  sortOrder: 0,
}

const DATE = /^\d{4}-\d{2}-\d{2}$/

// Mirrors the server rules so most mistakes are caught before saving.
function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Package name is required'
  if (values.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) errors.slug = 'Use lowercase letters, numbers and single dashes'
  if (!values.region.trim()) errors.region = 'Destination is required'
  if (!values.description.trim()) errors.description = 'Short description is required'
  if (!values.image) errors.image = 'Choose a main image'
  if (values.price === '' || values.price < 0) errors.price = 'Enter a price of 0 or more'
  if (values.nights === '' || values.nights < 0) errors.nights = 'Enter the number of nights'
  if (values.days === '' || values.days < 1) errors.days = 'Enter the number of days'
  else if (values.days < values.nights) errors.days = 'Days cannot be fewer than nights'
  const badDate = values.departures.find((date) => !DATE.test(date))
  if (badDate) errors.departures = `“${badDate}” is not in the format YYYY-MM-DD`
  values.itinerary.forEach((day, index) => {
    if (!day.title?.trim()) errors[`itinerary.${index}.title`] = 'Day title is required'
    if (!day.day || day.day < 1) errors[`itinerary.${index}.day`] = 'Enter the day number'
  })
  values.gallery.forEach((photo, index) => {
    if (!photo.src) errors[`gallery.${index}.src`] = 'Choose an image or remove this row'
  })
  return errors
}

function PackageForm({ initial, id }) {
  const navigate = useNavigate()
  const mutate = useMutation()
  const toast = useToast()
  const [values, setValues] = useState(() => pickFields(initial, DEFAULTS))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)

  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!Object.keys(current).some((key) => key === name || key.startsWith(`${name}.`))) return current
      return Object.fromEntries(Object.entries(current).filter(([key]) => key !== name && !key.startsWith(`${name}.`)))
    })
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
      const body = { ...values, price: Number(values.price), nights: Number(values.nights), days: Number(values.days), sortOrder: Number(values.sortOrder) || 0 }
      const json = id ? await mutate('put', `/admin/packages/${id}`, body) : await mutate('post', '/admin/packages', body)
      toast.success(json.message ?? 'Package saved')
      navigate('/admin/packages')
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
    <form onSubmit={submit} noValidate className="space-y-5 pb-24">
      {errorCount > 0 && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-admin-danger">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          Please fix the highlighted {errorCount === 1 ? 'field' : 'fields'} below.
        </p>
      )}

      <FormSection title="Basics">
        <TextField label="Package name" required {...field('title')} />
        <TextField label="Slug (web address)" hint="Leave blank to create it from the name." {...field('slug')} />
        <TextField label="Destination / region" required hint="e.g. Vietnam, Goa" {...field('region')} />
        <SelectField
          label="Category"
          {...field('category')}
          options={[
            { value: 'international', label: 'International' },
            { value: 'domestic', label: 'Domestic' },
          ]}
        />
        <SelectField
          label="Status"
          {...field('status')}
          hint="Only published packages are shown on the website."
          options={[
            { value: 'draft', label: 'Draft (hidden)' },
            { value: 'published', label: 'Published (visible on website)' },
          ]}
        />
        <NumberField label="Display order" hint="Lower numbers are shown first." {...field('sortOrder')} />
        <SwitchField label="Featured" hint="Shown in the Featured tab on the home page." {...field('featured')} className="md:col-span-2" />
      </FormSection>

      <FormSection title="Price and duration">
        <NumberField label="Price" required min={0} {...field('price')} />
        <SelectField
          label="Currency"
          {...field('currency')}
          options={['INR', 'USD', 'EUR', 'AED'].map((code) => ({ value: code, label: code }))}
        />
        <TextField label="Price basis" hint="e.g. per person, per couple" {...field('priceBasis')} />
        <TextField label="Badge" hint="Short label on the photo, e.g. Fixed group departure" {...field('badge')} />
        <NumberField label="Nights" required min={0} {...field('nights')} />
        <NumberField label="Days" required min={1} {...field('days')} />
      </FormSection>

      <FormSection title="Descriptions">
        <TextAreaField label="Short description" required rows={3} hint="Shown on package cards (max 600 characters)." maxLength={600} {...field('description')} className="md:col-span-2" />
        <TextAreaField label="Full description" rows={6} hint="Shown in the package details. Separate paragraphs with a blank line." {...field('fullDescription')} className="md:col-span-2" />
      </FormSection>

      <FormSection title="Trip details" description="One item per line.">
        <LinesField label="Places visited (route)" {...field('places')} />
        <LinesField label="Highlights" {...field('highlights')} />
        <LinesField label="Inclusions" {...field('inclusions')} rows={7} />
        <LinesField label="Exclusions" {...field('exclusions')} rows={7} />
        <LinesField label="Hotels (or similar)" {...field('hotels')} className="md:col-span-2" />
      </FormSection>

      <FormSection title="Itinerary">
        <div className="md:col-span-2">
          <RowsField
            label="Day"
            name="itinerary"
            value={values.itinerary}
            onChange={change}
            errors={errors}
            addLabel="Add day"
            newRow={(count) => ({ day: count + 1, title: '', description: '' })}
            columns={[
              { key: 'day', label: 'Day number', type: 'number' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'What happens', type: 'textarea', wide: true },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Dates">
        <LinesField label="Departure dates" hint="One per line, as YYYY-MM-DD. Past dates are hidden automatically." {...field('departures')} />
        <TextField label="Offer valid until" type="date" hint="For packages without fixed departures." {...field('validUntil')} />
      </FormSection>

      <FormSection title="Images">
        <ImageField label="Main image" required {...field('image')} className="md:col-span-2" />
        <TextField label="Main image description (alt text)" hint="Describe the photo for screen readers." {...field('imageAlt')} className="md:col-span-2" />
        <ImageField label="Flyer (optional)" hint="The official flyer, linked from the package card." {...field('flyer')} className="md:col-span-2" />
        <div className="md:col-span-2">
          <RowsField
            label="Gallery photo"
            name="gallery"
            value={values.gallery}
            onChange={change}
            errors={errors}
            max={20}
            addLabel="Add photo"
            newRow={() => ({ src: '', alt: '' })}
            columns={[
              { key: 'src', label: 'Image', type: 'image', wide: true },
              { key: 'alt', label: 'Description (alt text)', wide: true },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Search engines (SEO)">
        <TextField label="SEO title" maxLength={70} hint="Up to 70 characters." {...field('seoTitle')} />
        <TextAreaField label="SEO description" rows={3} maxLength={170} hint="Up to 170 characters." {...field('seoDescription')} />
      </FormSection>

      {/* Actions stay in reach at the bottom of the screen. */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-admin-border bg-white/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-end gap-2">
          <Button onClick={() => navigate('/admin/packages')} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => setPreviewing(true)} disabled={saving}>
            <Eye size={16} aria-hidden="true" />
            Preview
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {!saving && <Save size={16} aria-hidden="true" />}
            {saving ? 'Saving…' : id ? 'Save changes' : 'Create package'}
          </Button>
        </div>
      </div>

      <PackagePreview item={previewing ? values : null} onClose={() => setPreviewing(false)} />
    </form>
  )
}

function PackageFormPage() {
  const { id } = useParams()
  const { data, loading, error, reload } = useApiQuery(id ? `/admin/packages/${id}` : null)
  const title = id ? (data ? `Edit: ${data.title}` : 'Edit package') : 'Add package'

  return (
    <>
      <PageHeader
        title={title}
        crumbs={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Packages', to: '/admin/packages' },
          { label: id ? 'Edit' : 'New' },
        ]}
      />
      {!id ? (
        <PackageForm initial={null} />
      ) : loading && !data ? (
        <Card>
          <LoadingState label="Loading package…" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={error.status === 404 ? undefined : reload} />
        </Card>
      ) : (
        <PackageForm key={data.id} initial={data} id={id} />
      )}
    </>
  )
}

export default PackageFormPage
