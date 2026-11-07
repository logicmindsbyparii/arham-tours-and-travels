import { useId, useRef, useState } from 'react'
import { Eye, EyeOff, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react'
import { api } from '../../lib/api.js'
import { IMAGE_ASSETS, resolveImage } from '../../data/imageAssets.js'
import { useApiQuery } from '../hooks.js'
import { useToast } from '../toast.js'
import { Button, IconButton, LoadingState, Modal } from './ui.jsx'

// Form controls for the admin panel. Every control takes `name`, `value`,
// `onChange(name, value)` and an optional `error`, so the forms stay small.

const inputClass =
  'block min-h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-sm text-admin-text placeholder:text-admin-muted/80 focus:outline-none focus:ring-2 disabled:bg-admin-subtle'
const borderFor = (error) =>
  error ? 'border-admin-danger focus:border-admin-danger focus:ring-admin-danger/20' : 'border-admin-border focus:border-admin-primary focus:ring-admin-primary/20'

export function Field({ id, label, hint, error, required, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-admin-text">
        {label}
        {required && (
          <span className="text-admin-danger" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-admin-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-admin-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const describedBy = (id, hint, error) => [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined

export function TextField({ label, name, value, onChange, error, hint, required, type = 'text', className, ...props }) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        type={type}
        name={name}
        value={value ?? ''}
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} ${borderFor(error)}`}
        {...props}
      />
    </Field>
  )
}

// Password input with an eye button to show or hide what is typed.
export function PasswordField({ label, name, value, onChange, error, hint, required, className, ...props }) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value ?? ''}
          onChange={(event) => onChange(name, event.target.value)}
          required={required}
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, hint, error)}
          className={`${inputClass} ${borderFor(error)} pr-12`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-admin-muted hover:text-admin-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-admin-primary"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </Field>
  )
}

export function NumberField({ label, name, value, onChange, error, hint, required, className, ...props }) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        name={name}
        value={value ?? ''}
        onChange={(event) => onChange(name, event.target.value === '' ? '' : Number(event.target.value))}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} ${borderFor(error)}`}
        {...props}
      />
    </Field>
  )
}

export function TextAreaField({ label, name, value, onChange, error, hint, required, rows = 4, className, ...props }) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} ${borderFor(error)} resize-y leading-6`}
        {...props}
      />
    </Field>
  )
}

export function SelectField({ label, name, value, onChange, options, error, hint, required, className }) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        name={name}
        value={value ?? ''}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} ${borderFor(error)}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function SwitchField({ label, name, value, onChange, hint, className = '' }) {
  const id = useId()
  return (
    <div className={`flex min-h-11 items-start justify-between gap-4 rounded-lg border border-admin-border bg-white px-3 py-2.5 ${className}`}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-admin-text">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-admin-muted">{hint}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        onClick={() => onChange(name, !value)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary ${
          value ? 'bg-admin-primary' : 'bg-slate-300'
        }`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

// A list of short texts, typed one per line.
export function LinesField({ label, name, value, onChange, error, hint = 'One item per line.', rows = 5, className }) {
  const id = useId()
  const [text, setText] = useState(() => (value ?? []).join('\n'))
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          onChange(
            name,
            event.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
          )
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} ${borderFor(error)} resize-y leading-6`}
      />
    </Field>
  )
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Picks a built-in website photo or a previously uploaded image.
function ImageLibrary({ open, onClose, onPick }) {
  const uploads = useApiQuery(open ? '/admin/uploads' : null)
  const builtIn = Object.keys(IMAGE_ASSETS).map((key) => ({ ref: `asset:${key}`, label: key.replace(/-/g, ' ') }))
  const uploaded = (uploads.data ?? []).map((file) => ({ ref: file.url, label: file.url.split('/').pop() }))

  const grid = (items) => (
    <ul className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <li key={item.ref} className="min-w-0">
          <button
            type="button"
            onClick={() => onPick(item.ref)}
            className="group block w-full overflow-hidden rounded-lg border border-admin-border text-left focus-visible:outline-2 focus-visible:outline-admin-primary"
          >
            <img src={resolveImage(item.ref)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-90" />
            <span className="block truncate px-2 py-1.5 text-xs capitalize text-admin-muted">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <Modal open={open} onClose={onClose} title="Choose an image" size="lg">
      <h3 className="mb-3 text-sm font-semibold text-admin-text">Uploaded images</h3>
      {uploads.loading ? (
        <LoadingState />
      ) : uploads.error ? (
        <p className="text-sm text-admin-danger">{uploads.error.message}</p>
      ) : uploaded.length === 0 ? (
        <p className="text-sm text-admin-muted">No uploads yet.</p>
      ) : (
        grid(uploaded)
      )}
      <h3 className="mb-3 mt-6 text-sm font-semibold text-admin-text">Website photos</h3>
      {grid(builtIn)}
    </Modal>
  )
}

// Image with preview: upload a new file, choose an existing one, or paste a URL.
export function ImageField({ label, name, value, onChange, error, hint, required, className }) {
  const id = useId()
  const toast = useToast()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const preview = resolveImage(value)

  const upload = async (file) => {
    if (!file) return
    if (!UPLOAD_TYPES.includes(file.type)) return toast.error('Choose a JPG, PNG or WebP image.')
    if (file.size > MAX_UPLOAD_BYTES) return toast.error('The image is larger than 5 MB.')
    const form = new FormData()
    form.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/admin/uploads', form)
      onChange(name, data.url)
      toast.success('Image uploaded')
    } catch (uploadError) {
      toast.error(uploadError.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field id={id} label={label} hint={hint ?? 'JPG, PNG or WebP, up to 5 MB.'} error={error} required={required} className={className}>
      <div className={`rounded-lg border bg-admin-subtle p-3 ${error ? 'border-admin-danger' : 'border-admin-border'}`}>
        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-admin-border bg-white min-[480px]:w-40">
            {preview ? (
              <img src={preview} alt="Selected" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus size={28} aria-hidden="true" className="text-admin-muted" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id={`${id}-file`}
                onChange={(event) => upload(event.target.files?.[0])}
              />
              <Button onClick={() => fileRef.current?.click()} loading={uploading}>
                {!uploading && <Upload size={16} aria-hidden="true" />}
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
              <Button onClick={() => setLibraryOpen(true)}>Choose</Button>
              {value && (
                <Button variant="ghost" onClick={() => onChange(name, '')}>
                  <X size={16} aria-hidden="true" />
                  Remove
                </Button>
              )}
            </div>
            <input
              id={id}
              type="text"
              value={value ?? ''}
              onChange={(event) => onChange(name, event.target.value.trim())}
              placeholder="or paste an https:// image URL"
              aria-label={`${label}: image reference or URL`}
              aria-invalid={Boolean(error)}
              className={`${inputClass} ${borderFor(error)} text-xs`}
            />
          </div>
        </div>
      </div>
      <ImageLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(ref) => {
          onChange(name, ref)
          setLibraryOpen(false)
        }}
      />
    </Field>
  )
}

// Repeating rows of small objects (itinerary days, phone numbers, links…).
// columns: [{ key, label, type: 'text' | 'number' | 'textarea' | 'image', placeholder }]
// errors: the whole error map of the form (cells are "name.index.key").
export function RowsField({ label, name, value, onChange, columns, newRow, addLabel = 'Add', errors, hint, max = 30 }) {
  const rows = value ?? []
  const update = (index, key, cell) => onChange(name, rows.map((row, i) => (i === index ? { ...row, [key]: cell } : row)))
  const remove = (index) => onChange(name, rows.filter((_, i) => i !== index))

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-admin-text">{label}</legend>
      {hint && <p className="mb-2 text-xs text-admin-muted">{hint}</p>}
      <ol className="space-y-3">
        {rows.map((row, index) => (
          <li key={index} className="rounded-lg border border-admin-border bg-admin-subtle p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                {label} {index + 1}
              </span>
              <IconButton label={`Remove ${label.toLowerCase()} ${index + 1}`} onClick={() => remove(index)} className="h-9 w-9 hover:text-admin-danger">
                <Trash2 size={16} aria-hidden="true" />
              </IconButton>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {columns.map((column) => {
                const props = {
                  label: column.label,
                  name: column.key,
                  value: row[column.key],
                  onChange: (key, cell) => update(index, key, cell),
                  error: errors?.[`${name}.${index}.${column.key}`],
                  placeholder: column.placeholder,
                  className: column.wide ? 'sm:col-span-2' : '',
                }
                if (column.type === 'number') return <NumberField key={column.key} {...props} min={1} />
                if (column.type === 'textarea') return <TextAreaField key={column.key} {...props} rows={3} />
                if (column.type === 'image') return <ImageField key={column.key} {...props} />
                return <TextField key={column.key} {...props} />
              })}
            </div>
          </li>
        ))}
      </ol>
      {rows.length < max && (
        <Button className="mt-3" onClick={() => onChange(name, [...rows, newRow(rows.length)])}>
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </Button>
      )}
      {errors?.[name] && <p className="mt-1.5 text-xs font-medium text-admin-danger">{errors[name]}</p>}
    </fieldset>
  )
}

// Groups fields under a heading inside a card.
export function FormSection({ title, description, children }) {
  return (
    <section className="min-w-0 rounded-xl border border-admin-border bg-white p-4 sm:p-6">
      <h2 className="text-base font-semibold text-admin-text">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-admin-muted">{description}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}
