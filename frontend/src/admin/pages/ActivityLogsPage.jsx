import { useApiQuery, useListControls } from '../hooks.js'
import { ACTION_LABELS, formatDateTime } from '../format.js'
import DataList from '../components/DataList.jsx'
import { Badge, Card, EmptyState, ErrorState, FilterSelect, LoadingState, PageHeader, Pagination, SearchInput } from '../components/ui.jsx'

const ENTITY_TYPES = ['package', 'destination', 'visa country', 'banner', 'service', 'testimonial', 'faq', 'content', 'settings', 'profile', 'admin', 'image']

const columns = [
  {
    key: 'createdAt',
    label: 'When',
    primary: true,
    render: (entry) => <time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>,
    className: 'whitespace-nowrap',
  },
  { key: 'action', label: 'Action', render: (entry) => <Badge tone={entry.action === 'delete' ? 'danger' : 'info'}>{ACTION_LABELS[entry.action] ?? entry.action}</Badge> },
  {
    key: 'entity',
    label: 'Record',
    render: (entry) => (
      <span className="break-words">
        <span className="capitalize">{entry.entityType || '—'}</span>
        {entry.entityLabel && <span className="text-admin-muted"> · {entry.entityLabel}</span>}
      </span>
    ),
  },
  { key: 'adminEmail', label: 'Admin', render: (entry) => <span className="break-all">{entry.adminEmail || '—'}</span> },
  { key: 'ip', label: 'IP address', render: (entry) => <span className="break-all text-admin-muted">{entry.ip || '—'}</span> },
]

// Read-only audit trail of admin actions (newest first).
function ActivityLogsPage() {
  const list = useListControls({ action: 'all', entityType: '' })
  const { data, meta, loading, error, reload } = useApiQuery('/admin/activity-logs', {
    q: list.q,
    ...list.filters,
    page: list.page,
    limit: 20,
  })
  const items = data ?? []

  return (
    <>
      <PageHeader
        title="Activity logs"
        description="Sign-ins and every change made in the admin panel."
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Activity logs' }]}
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:p-5 lg:flex-row lg:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search record or admin email" label="Search activity" />
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap">
            <FilterSelect
              label="Action"
              value={list.filters.action}
              onChange={(value) => list.setFilter('action', value)}
              options={[{ value: 'all', label: 'All actions' }, ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label }))]}
            />
            <FilterSelect
              label="Record type"
              value={list.filters.entityType}
              onChange={(value) => list.setFilter('entityType', value)}
              options={[{ value: '', label: 'All record types' }, ...ENTITY_TYPES.map((type) => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))]}
            />
          </div>
        </div>
        {loading && !data ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="No activity found" />
        ) : (
          <div aria-busy={loading}>
            <DataList caption="Activity logs" columns={columns} items={items} />
          </div>
        )}
        <Pagination meta={meta} onPage={list.setPage} />
      </Card>
    </>
  )
}

export default ActivityLogsPage
