import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useApiQuery, useFormOptions, useListControls, useMutation } from '../hooks.js'
import { errorFor, pickFields } from '../format.js'
import { useToast } from '../toast.js'
import DataList from '../components/DataList.jsx'
import RecordActions from '../components/RecordActions.jsx'
import { Button, Card, EmptyState, ErrorState, FilterSelect, LoadingState, Modal, PageHeader, Pagination, SearchInput } from '../components/ui.jsx'
import { ImageField, LinesField, NumberField, SelectField, SwitchField, TextAreaField, TextField } from '../components/fields.jsx'

const PAGE_SIZE = 10

// Turns a record from the API into form values (linked packages become ids).
function toFormValues(resource, record) {
  const values = pickFields(record, resource.defaults)
  for (const field of resource.fields) {
    if (field.type === 'package') values[field.name] = record?.[field.name]?.id ?? record?.[field.name] ?? ''
  }
  return resource.fromRecord ? resource.fromRecord(values) : values
}

function validate(resource, values) {
  const errors = {}
  for (const field of resource.fields) {
    const value = values[field.name]
    if (field.required && (value === '' || value === null || value === undefined || (typeof value === 'string' && !value.trim()))) {
      errors[field.name] = `${field.label} is required`
    }
  }
  return { ...errors, ...(resource.validate?.(values) ?? {}) }
}

function FormField({ field, values, errors, onChange, options }) {
  const props = {
    name: field.name,
    label: field.label,
    value: values[field.name],
    onChange,
    error: errorFor(errors, field.name),
    hint: field.hint,
    required: field.required,
    className: field.wide ? 'md:col-span-2' : '',
  }
  switch (field.type) {
    case 'textarea':
      return <TextAreaField {...props} rows={field.rows ?? 4} />
    case 'number':
      return <NumberField {...props} />
    case 'select':
      return <SelectField {...props} options={field.options} />
    case 'switch':
      return <SwitchField {...props} />
    case 'lines':
      return <LinesField {...props} rows={field.rows ?? 5} hint={field.hint ?? 'One item per line.'} />
    case 'image':
      return <ImageField {...props} />
    case 'package':
      return (
        <SelectField
          {...props}
          options={[
            { value: '', label: 'No package' },
            ...options.packages.map((pkg) => ({ value: pkg.id, label: pkg.status === 'published' ? pkg.title : `${pkg.title} (draft)` })),
          ]}
        />
      )
    case 'icon':
      return <SelectField {...props} options={options.serviceIcons.map((icon) => ({ value: icon, label: icon }))} />
    case 'section':
      return (
        <SelectField
          {...props}
          options={[{ value: '', label: 'Choose a section…' }, ...options.contentSections.map((section) => ({ value: section.key, label: section.label }))]}
        />
      )
    default:
      return <TextField {...props} maxLength={field.maxLength} />
  }
}

// Add / edit dialog. Saves to the server and closes only when that worked.
function EditDialog({ resource, record, onClose, onSaved, options }) {
  const mutate = useMutation()
  const toast = useToast()
  const [values, setValues] = useState(() => toFormValues(resource, record))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const editing = Boolean(record?.id)
  const formId = `${resource.route}-form`

  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    const found = validate(resource, values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    setSaving(true)
    try {
      let body = { ...values }
      for (const field of resource.fields) {
        if (field.type === 'number') body[field.name] = Number(body[field.name]) || 0
      }
      if (resource.toBody) body = resource.toBody(body)
      const json = editing
        ? await mutate('put', `${resource.endpoint}/${record.id}`, body)
        : await mutate('post', resource.endpoint, body)
      toast.success(json.message ?? 'Saved')
      onSaved()
    } catch (error) {
      if (error.details) setErrors(error.details)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      onClose={saving ? () => {} : onClose}
      size="lg"
      title={editing ? `Edit ${resource.singular}` : `Add ${resource.singular}`}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : `Create ${resource.singular}`}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resource.fields.map((field) => (
          <FormField key={field.name} field={field} values={values} errors={errors} onChange={change} options={options} />
        ))}
      </form>
    </Modal>
  )
}

function ResourcePage({ resource }) {
  const initialFilters = useMemo(
    () => ({ ...Object.fromEntries(resource.filters.map((filter) => [filter.name, 'all'])), sort: resource.sorts[0].value }),
    [resource],
  )
  const list = useListControls(initialFilters)
  const { data, meta, loading, error, reload } = useApiQuery(resource.endpoint, {
    q: list.q,
    ...list.filters,
    page: list.page,
    limit: PAGE_SIZE,
  })
  const { options } = useFormOptions()
  // null: closed; {}: adding; a record: editing it
  const [editing, setEditing] = useState(null)
  const items = data ?? []
  const filtered = Boolean(list.q) || resource.filters.some((filter) => list.filters[filter.name] !== 'all')

  const columns = useMemo(
    () => resource.columns.map((column) => (column.render ? { ...column, render: (item) => column.render(item, options) } : column)),
    [resource, options],
  )

  const afterChange = ({ deleted } = {}) => {
    if (deleted && items.length === 1 && list.page > 1) list.setPage(list.page - 1)
    else reload()
  }

  const addButton = (
    <Button variant="primary" onClick={() => setEditing({})}>
      <Plus size={16} aria-hidden="true" />
      Add {resource.singular}
    </Button>
  )

  return (
    <>
      <PageHeader
        title={resource.title}
        description={resource.description}
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: resource.title }]}
        actions={addButton}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:p-5 lg:flex-row lg:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder={resource.searchPlaceholder} label={resource.searchPlaceholder} />
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap">
            {resource.filters.map((filter) => (
              <FilterSelect
                key={filter.name}
                label={filter.label}
                value={list.filters[filter.name]}
                onChange={(value) => list.setFilter(filter.name, value)}
                options={filter.options}
              />
            ))}
            <FilterSelect label="Sort" value={list.filters.sort} onChange={(value) => list.setFilter('sort', value)} options={resource.sorts} />
          </div>
        </div>

        {loading && !data ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          filtered ? (
            <EmptyState title="Nothing matches" text="Try a different search or clear the filters." />
          ) : (
            <EmptyState title={`No ${resource.title.toLowerCase()} yet`} action={addButton} />
          )
        ) : (
          <div aria-busy={loading}>
            <DataList
              caption={resource.title}
              columns={columns}
              items={items}
              actions={(item) => (
                <RecordActions
                  item={item}
                  endpoint={resource.endpoint}
                  toggle={resource.toggle}
                  label={String(item[resource.labelField] ?? resource.singular)}
                  onEdit={setEditing}
                  onChanged={afterChange}
                />
              )}
            />
          </div>
        )}
        <Pagination meta={meta} onPage={list.setPage} />
      </Card>

      {editing && (
        <EditDialog
          resource={resource}
          record={editing.id ? editing : null}
          options={options}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}
    </>
  )
}

export default ResourcePage
