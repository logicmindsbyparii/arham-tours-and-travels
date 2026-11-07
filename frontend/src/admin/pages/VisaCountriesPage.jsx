import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, Plus, Upload } from 'lucide-react'
import { useApiQuery, useListControls, useMutation } from '../hooks.js'
import { useToast } from '../toast.js'
import DataList from '../components/DataList.jsx'
import RecordActions from '../components/RecordActions.jsx'
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  FilterSelect,
  LoadingState,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
} from '../components/ui.jsx'
import { visaCountryColumns } from '../resources/definitions.jsx'

const PAGE_SIZE = 10

function VisaCountriesPage() {
  const list = useListControls({ status: 'all', sort: 'recent' })
  const mutate = useMutation()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const { data, meta, loading, error, reload } = useApiQuery('/admin/visa-countries', {
    q: list.q,
    ...list.filters,
    page: list.page,
    limit: PAGE_SIZE,
  })

  // Bulk import state
  const [importOpen, setImportOpen] = useState(false)
  const [importRows, setImportRows] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [importing, setImporting] = useState(false)

  const items = data ?? []
  const filtered = Boolean(list.q || list.filters.status !== 'all')

  const afterChange = ({ deleted } = {}) => {
    if (deleted && items.length === 1 && list.page > 1) {
      list.setPage(list.page - 1)
    } else {
      reload()
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        name: '',
        slug: '',
        flag: '',
        image: '',
        tagline: '',
        processingTime: '',
        stayDuration: '',
        validity: '',
        entryType: '',
        documentGroups: [
          {
            title: 'Common documents',
            items: ['Passport with 6 months validity', 'Photographs (white background)'],
          },
          {
            title: 'If you are employed',
            items: ['Leave letter from employer', 'Salary slips for 3 months'],
          },
        ],
        charges: [
          {
            visaType: '',
            currency: 'INR',
            embassyFee: 0,
            serviceFee: 0,
            processingTime: '',
            note: '',
          },
        ],
        chargesNote: '',
        notes: '',
        status: 'draft',
        sortOrder: 0,
      },
    ]
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'visa-countries-template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result)
        const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : []
        if (rows.length === 0) {
          toast.error('The selected file has no valid visa country rows.')
          return
        }
        if (rows.length > 100) {
          toast.error('Import batch cannot exceed 100 countries.')
          return
        }

        // Local client pre-validation check
        const rowErrors = rows.map((r, i) => {
          const errs = []
          if (!r.name?.trim()) errs.push('Country name is required')
          if (r.charges) {
            r.charges.forEach((c, cIdx) => {
              if (c.embassyFee < 0) errs.push(`Charge ${cIdx + 1}: embassy fee cannot be negative`)
              if (c.serviceFee < 0) errs.push(`Charge ${cIdx + 1}: service fee cannot be negative`)
            })
          }
          return { index: i, errors: errs }
        })

        setImportRows(rows)
        setImportErrors(rowErrors)
      } catch (err) {
        toast.error(`Invalid JSON file: ${err.message}`)
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = async () => {
    if (importRows.length === 0 || importing) return
    setImporting(true)
    try {
      const res = await mutate('post', '/admin/visa-countries/import', importRows)
      const results = res.data ?? []
      const createdCount = results.filter((r) => r.status === 'created').length
      const updatedCount = results.filter((r) => r.status === 'updated').length
      const failedCount = results.filter((r) => r.status === 'failed').length

      if (failedCount > 0) {
        toast.error(`${failedCount} rows failed validation. ${createdCount} created, ${updatedCount} updated.`)
      } else {
        toast.success(`Successfully imported ${results.length} countries as drafts.`)
      }

      setImportOpen(false)
      setImportRows([])
      setImportErrors([])
      reload()
    } catch (err) {
      toast.error(err.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Visa countries"
        description="Countries with document checklists and fee tables. Each country shows only its own data on the website."
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Visa countries' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={downloadTemplate} className="px-3 text-xs sm:text-sm">
              <Download size={15} aria-hidden="true" />
              Download template
            </Button>
            <Button
              type="button"
              onClick={() => {
                setImportRows([])
                setImportErrors([])
                setImportOpen(true)
              }}
              className="px-3 text-xs sm:text-sm"
            >
              <Upload size={15} aria-hidden="true" />
              Import from JSON
            </Button>
            <Button variant="primary" to="/admin/visa-countries/new" className="px-3 text-xs sm:text-sm">
              <Plus size={16} aria-hidden="true" />
              Add country
            </Button>
          </div>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:p-5 lg:flex-row lg:items-center">
          <SearchInput
            value={list.search}
            onChange={list.setSearch}
            placeholder="Search by country, tagline or slug"
            label="Search visa countries"
          />
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
              label="Sort"
              value={list.filters.sort}
              onChange={(value) => list.setFilter('sort', value)}
              options={[
                { value: 'recent', label: 'Recently updated' },
                { value: 'order', label: 'Website order' },
                { value: 'name', label: 'Name A–Z' },
              ]}
            />
          </div>
        </div>

        {loading && !data ? (
          <LoadingState label="Loading visa countries…" />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          filtered ? (
            <EmptyState title="No countries match" text="Try a different search or clear the filters." />
          ) : (
            <EmptyState
              title="No visa countries yet"
              text="Add your first country with its document requirements and visa charges, or import from JSON."
              action={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button variant="primary" to="/admin/visa-countries/new">
                    <Plus size={16} aria-hidden="true" />
                    Add country
                  </Button>
                  <Button type="button" onClick={() => setImportOpen(true)}>
                    <Upload size={16} aria-hidden="true" />
                    Import from JSON
                  </Button>
                </div>
              }
            />
          )
        ) : (
          <div aria-busy={loading}>
            <DataList
              caption="Visa countries"
              columns={visaCountryColumns}
              items={items}
              actions={(item) => (
                <RecordActions
                  item={item}
                  endpoint="/admin/visa-countries"
                  label={item.name}
                  editTo={`/admin/visa-countries/${item.id}`}
                  onChanged={afterChange}
                />
              )}
            />
          </div>
        )}
        <Pagination meta={meta} onPage={list.setPage} />
      </Card>

      {/* Bulk Import Modal */}
      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Visa Countries from JSON"
        description="Upload a JSON file containing an array of visa countries. Imported records are always set to Draft status for review."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="text-xs text-admin-muted">
              {importRows.length > 0 ? `${importRows.length} countries ready` : 'No file loaded'}
            </span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => setImportOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmImport}
                loading={importing}
                disabled={importRows.length === 0}
              >
                {importing ? 'Importing…' : `Confirm import (${importRows.length})`}
              </Button>
            </div>
          </div>
        }
      >
        <div className="p-4 sm:p-6 space-y-4">
          <div className="rounded-xl border border-dashed border-admin-border bg-admin-subtle p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="import-json-file"
            />
            <label
              htmlFor="import-json-file"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-admin-text shadow-xs ring-1 ring-admin-border hover:bg-admin-subtle"
            >
              <Upload size={16} aria-hidden="true" />
              Choose JSON file
            </label>
            <p className="mt-2 text-xs text-admin-muted">
              Select a JSON file containing an array of up to 100 country objects.
            </p>
          </div>

          {importRows.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
                Preview ({importRows.length} rows)
              </h4>
              <div className="max-h-60 overflow-y-auto rounded-lg border border-admin-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-admin-subtle sticky top-0 border-b border-admin-border">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Row</th>
                      <th className="px-3 py-2 font-semibold">Name</th>
                      <th className="px-3 py-2 font-semibold">Slug</th>
                      <th className="px-3 py-2 font-semibold">Groups</th>
                      <th className="px-3 py-2 font-semibold">Fees</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border">
                    {importRows.map((row, idx) => {
                      const rowErr = importErrors[idx]?.errors ?? []
                      const hasErr = rowErr.length > 0
                      return (
                        <tr key={idx} className={hasErr ? 'bg-red-50/50' : ''}>
                          <td className="px-3 py-2 font-mono">{idx + 1}</td>
                          <td className="px-3 py-2 font-medium text-admin-text">
                            {row.flag ? `${row.flag} ` : ''}
                            {row.name || <span className="italic text-red-500">Missing name</span>}
                          </td>
                          <td className="px-3 py-2 font-mono text-admin-muted">{row.slug || '—'}</td>
                          <td className="px-3 py-2">{row.documentGroups?.length ?? 0}</td>
                          <td className="px-3 py-2">{row.charges?.length ?? 0}</td>
                          <td className="px-3 py-2">
                            {hasErr ? (
                              <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                <AlertCircle size={13} aria-hidden="true" />
                                {rowErr[0]}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                <CheckCircle2 size={13} aria-hidden="true" />
                                Valid draft
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default VisaCountriesPage
