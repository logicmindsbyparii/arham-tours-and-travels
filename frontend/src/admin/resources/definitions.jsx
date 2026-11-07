import { formatDateTime } from '../format.js'
import { StatusBadge } from '../components/ui.jsx'

export const STATUS_FILTER = {
  name: 'status',
  label: 'Status',
  options: [
    { value: 'all', label: 'All statuses' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ],
}

export const STATUS_FIELD = {
  name: 'status',
  label: 'Status',
  type: 'select',
  hint: 'Only published items are shown on the website.',
  options: [
    { value: 'draft', label: 'Draft (hidden)' },
    { value: 'published', label: 'Published (visible on website)' },
  ],
}

export const ORDER_FIELD = {
  name: 'sortOrder',
  label: 'Display order',
  type: 'number',
  hint: 'Lower numbers are shown first.',
}

export const updatedColumn = {
  key: 'updatedAt',
  label: 'Updated',
  render: (item) => formatDateTime(item.updatedAt),
  className: 'whitespace-nowrap',
}

export const statusColumn = {
  key: 'status',
  label: 'Status',
  render: (item) => <StatusBadge status={item.status} />,
}

export const visaCountryColumns = [
  {
    key: 'name',
    label: 'Country',
    primary: true,
    render: (item) => (
      <span className="flex items-center gap-3">
        {item.flag ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xl font-normal" aria-hidden="true">
            {item.flag}
          </span>
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-semibold text-admin-primary">
            {item.name?.slice(0, 2).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          <span className="block break-words font-medium">{item.name}</span>
          <span className="block break-all text-xs font-normal text-admin-muted">/{item.slug}</span>
        </span>
      </span>
    ),
  },
  {
    key: 'documentGroups',
    label: 'Document groups',
    render: (item) => {
      const count = item.documentGroups?.length ?? 0
      return <span className="tabular-nums">{count} {count === 1 ? 'group' : 'groups'}</span>
    },
    className: 'whitespace-nowrap',
  },
  {
    key: 'charges',
    label: 'Fee rows',
    render: (item) => {
      const count = item.charges?.length ?? 0
      return <span className="tabular-nums">{count} {count === 1 ? 'fee row' : 'fee rows'}</span>
    },
    className: 'whitespace-nowrap',
  },
  statusColumn,
  updatedColumn,
]

export const visaCountryResource = {
  route: 'visa-countries',
  endpoint: '/admin/visa-countries',
  title: 'Visa countries',
  singular: 'visa country',
  description: 'Countries with visa checklists and fee schedules. Published countries appear on the website with their own documents and charges.',
  toggle: 'status',
  labelField: 'name',
  searchPlaceholder: 'Search visa countries',
  filters: [STATUS_FILTER],
  sorts: [
    { value: 'recent', label: 'Recently updated' },
    { value: 'order', label: 'Website order' },
    { value: 'name', label: 'Name A–Z' },
  ],
  columns: visaCountryColumns,
  defaults: {
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
  },
}

