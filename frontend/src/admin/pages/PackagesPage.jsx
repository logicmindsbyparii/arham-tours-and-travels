import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApiQuery, useListControls } from '../hooks.js'
import { formatDateTime, formatMoney } from '../format.js'
import { resolveImage } from '../../data/imageAssets.js'
import DataList from '../components/DataList.jsx'
import RecordActions from '../components/RecordActions.jsx'
import PackagePreview from '../components/PackagePreview.jsx'
import { Badge, Button, Card, EmptyState, ErrorState, FilterSelect, LoadingState, PageHeader, Pagination, SearchInput, StatusBadge } from '../components/ui.jsx'

const PAGE_SIZE = 10

const columns = [
  {
    key: 'title',
    label: 'Package',
    primary: true,
    render: (item) => (
      <span className="flex min-w-0 items-center gap-3">
        <img src={resolveImage(item.image)} alt="" className="hidden h-11 w-14 shrink-0 rounded-md object-cover sm:block" />
        <span className="min-w-0">
          <span className="block break-words font-medium">{item.title}</span>
          <span className="block break-all text-xs font-normal text-admin-muted">/{item.slug}</span>
        </span>
      </span>
    ),
  },
  { key: 'region', label: 'Destination', render: (item) => `${item.region} · ${item.category}` },
  { key: 'duration', label: 'Duration', render: (item) => `${item.nights}N / ${item.days}D`, className: 'whitespace-nowrap' },
  { key: 'price', label: 'Price', render: (item) => formatMoney(item.price, item.currency), className: 'whitespace-nowrap' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => (
      <span className="inline-flex flex-wrap gap-1.5">
        <StatusBadge status={item.status} />
        {item.featured && <Badge tone="info">Featured</Badge>}
      </span>
    ),
  },
  { key: 'updatedAt', label: 'Updated', render: (item) => formatDateTime(item.updatedAt), className: 'whitespace-nowrap' },
]

function PackagesPage() {
  const list = useListControls({ status: 'all', category: 'all', sort: 'recent' })
  const { data, meta, loading, error, reload } = useApiQuery('/admin/packages', {
    q: list.q,
    ...list.filters,
    page: list.page,
    limit: PAGE_SIZE,
  })
  const [previewing, setPreviewing] = useState(null)
  const items = data ?? []
  const filtered = list.q || list.filters.status !== 'all' || list.filters.category !== 'all'

  const afterChange = ({ deleted } = {}) => {
    if (deleted && items.length === 1 && list.page > 1) list.setPage(list.page - 1)
    else reload()
  }

  return (
    <>
      <PageHeader
        title="Packages"
        description="Published packages appear on the website; drafts are only visible here."
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Packages' }]}
        actions={
          <Button variant="primary" to="/admin/packages/new">
            <Plus size={16} aria-hidden="true" />
            Add package
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:p-5 lg:flex-row lg:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search by name, place or slug" label="Search packages" />
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap">
            <FilterSelect
              label="Status"
              value={list.filters.status}
              onChange={(value) => list.setFilter('status', value)}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
            <FilterSelect
              label="Category"
              value={list.filters.category}
              onChange={(value) => list.setFilter('category', value)}
              options={[
                { value: 'all', label: 'All categories' },
                { value: 'international', label: 'International' },
                { value: 'domestic', label: 'Domestic' },
              ]}
            />
            <FilterSelect
              label="Sort"
              value={list.filters.sort}
              onChange={(value) => list.setFilter('sort', value)}
              options={[
                { value: 'recent', label: 'Recently updated' },
                { value: 'order', label: 'Website order' },
                { value: 'title', label: 'Name A–Z' },
                { value: 'price-low', label: 'Price: low to high' },
                { value: 'price-high', label: 'Price: high to low' },
              ]}
            />
          </div>
        </div>

        {loading && !data ? (
          <LoadingState label="Loading packages…" />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          filtered ? (
            <EmptyState title="No packages match" text="Try a different search or clear the filters." />
          ) : (
            <EmptyState
              title="No packages yet"
              text="Add your first tour package. It stays a draft until you publish it."
              action={
                <Button variant="primary" to="/admin/packages/new">
                  Add package
                </Button>
              }
            />
          )
        ) : (
          <div aria-busy={loading}>
            <DataList
              caption="Packages"
              columns={columns}
              items={items}
              actions={(item) => (
                <RecordActions
                  item={item}
                  endpoint="/admin/packages"
                  label={item.title}
                  editTo={`/admin/packages/edit/${item.id}`}
                  onChanged={afterChange}
                  extra={
                    <Button className="px-3" onClick={() => setPreviewing(item)} aria-label={`Preview ${item.title}`}>
                      Preview
                    </Button>
                  }
                />
              )}
            />
          </div>
        )}
        <Pagination meta={meta} onPage={list.setPage} />
      </Card>

      <PackagePreview item={previewing} onClose={() => setPreviewing(null)} />
    </>
  )
}

export default PackagesPage
