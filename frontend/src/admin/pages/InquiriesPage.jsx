import { useMemo, useState } from 'react'
import {
  Calendar,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useApiQuery, useListControls, useMutation } from '../hooks.js'
import { useToast } from '../toast.js'
import { formatDateTime } from '../format.js'
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingState,
  PageHeader,
  Pagination,
} from '../components/ui.jsx'

const STATUS_CONFIG = {
  new: { label: 'New', tone: 'info', bg: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  contacted: { label: 'Contacted', tone: 'draft', bg: 'bg-amber-50 text-amber-800 ring-amber-600/25' },
  in_progress: { label: 'In Progress', tone: 'published', bg: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
  converted: { label: 'Converted', tone: 'published', bg: 'bg-green-50 text-green-700 ring-green-600/20' },
  closed: { label: 'Closed', tone: 'neutral', bg: 'bg-gray-100 text-gray-600 ring-gray-400/20' },
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Inquiries' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

function InquiryStatusBadge({ status }) {
  const conf = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${conf.bg}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {conf.label}
    </span>
  )
}

function cleanPhone(raw) {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  return digits
}

function InquiriesPage() {
  const toast = useToast()
  const mutate = useMutation()
  const { search, setSearch, q, filters, setFilter, page, setPage } = useListControls({ status: 'all' })

  const query = useMemo(() => {
    const params = { page, limit: 15, sort: 'recent' }
    if (q) params.q = q
    if (filters.status && filters.status !== 'all') params.status = filters.status
    return params
  }, [filters, page, q])

  const { data: items, meta, loading, error, reload } = useApiQuery('/admin/inquiries', query)
  const [activeItem, setActiveItem] = useState(null)
  const [modalNotes, setModalNotes] = useState('')
  const [modalStatus, setModalStatus] = useState('new')
  const [savingNotes, setSavingNotes] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openDetail = (item) => {
    setActiveItem(item)
    setModalNotes(item.notes || '')
    setModalStatus(item.status || 'new')
  }

  const closeDetail = () => {
    setActiveItem(null)
    setModalNotes('')
  }

  const updateStatusQuick = async (item, newStatus) => {
    try {
      await mutate('put', `/admin/inquiries/${item.id}`, { ...item, status: newStatus })
      toast.success(`Inquiry marked as ${STATUS_CONFIG[newStatus]?.label || newStatus}`)
      reload()
    } catch (err) {
      toast.error(err.message || 'Could not update status')
    }
  }

  const saveModalChanges = async () => {
    if (!activeItem) return
    setSavingNotes(true)
    try {
      await mutate('put', `/admin/inquiries/${activeItem.id}`, {
        ...activeItem,
        status: modalStatus,
        notes: modalNotes,
      })
      toast.success('Inquiry updated successfully')
      reload()
      closeDetail()
    } catch (err) {
      toast.error(err.message || 'Could not save changes')
    } finally {
      setSavingNotes(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await mutate('delete', `/admin/inquiries/${toDelete.id}`)
      toast.success('Inquiry deleted')
      reload()
      setToDelete(null)
      if (activeItem?.id === toDelete.id) closeDetail()
    } catch (err) {
      toast.error(err.message || 'Could not delete inquiry')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Customer Inquiries"
        description="Track customer inquiries, status updates, travel requirements, and notes."
        crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Inquiries' }]}
        actions={
          <Button onClick={reload} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = (filters.status || 'all') === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter('status', opt.value)}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-admin-primary text-white shadow-xs'
                      : 'bg-admin-subtle text-admin-muted hover:bg-slate-200 hover:text-admin-text'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px] max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-admin-muted">
              <Search size={16} aria-hidden="true" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, phone, package…"
              className="w-full rounded-lg border border-admin-border bg-white py-2 pl-9 pr-8 text-sm text-admin-text placeholder:text-admin-muted focus:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-admin-muted hover:text-admin-text cursor-pointer"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Table / List */}
      <Card>
        {loading && !items ? (
          <LoadingState label="Loading inquiries…" />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !items || items.length === 0 ? (
          <EmptyState
            title="No inquiries found"
            text={q ? `No inquiries match "${q}". Try clearing filters.` : 'Customer inquiries submitted via the website or WhatsApp will appear here.'}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-subtle/50 text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    <th scope="col" className="px-4 py-3 sm:px-6">Customer</th>
                    <th scope="col" className="px-4 py-3">Requirement</th>
                    <th scope="col" className="px-4 py-3">Travel Date & Pax</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Received</th>
                    <th scope="col" className="px-4 py-3 text-right sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {items.map((item) => {
                    const phoneClean = cleanPhone(item.phone)
                    const waUrl = phoneClean
                      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hello ${item.name}, thank you for contacting Arham Tours & Travels regarding your inquiry for ${item.service || 'tour packages'}.`)}`
                      : null

                    return (
                      <tr key={item.id} className="hover:bg-admin-subtle/40 transition-colors">
                        <td className="px-4 py-3.5 sm:px-6">
                          <div className="font-semibold text-admin-text">{item.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            {item.phone && (
                              <a
                                href={`tel:${item.phone}`}
                                className="inline-flex items-center gap-1 font-medium text-admin-primary-strong hover:underline"
                                title="Call customer"
                              >
                                <Phone size={12} aria-hidden="true" />
                                {item.phone}
                              </a>
                            )}
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 font-medium text-green-700 hover:bg-green-100 ring-1 ring-green-600/20"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={12} aria-hidden="true" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                          {item.email && (
                            <div className="mt-0.5 text-xs text-admin-muted">
                              <a href={`mailto:${item.email}`} className="hover:underline">
                                {item.email}
                              </a>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-medium text-admin-text block">{item.service || 'Tour Package'}</span>
                          {item.destination && (
                            <span className="text-xs text-admin-muted block mt-0.5">
                              Destination: <span className="text-admin-text font-medium">{item.destination}</span>
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-xs text-admin-muted">
                          {item.travelDate ? (
                            <div className="flex items-center gap-1 text-admin-text">
                              <Calendar size={13} aria-hidden="true" className="text-admin-muted" />
                              <span>{item.travelDate}</span>
                            </div>
                          ) : (
                            <div>Date: Flexible / Not specified</div>
                          )}
                          <div className="mt-1 flex items-center gap-1">
                            <Users size={13} aria-hidden="true" className="text-admin-muted" />
                            <span>{item.travellers || '1'} traveller(s)</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <InquiryStatusBadge status={item.status} />
                            <select
                              aria-label={`Change status for ${item.name}`}
                              value={item.status}
                              onChange={(e) => updateStatusQuick(item, e.target.value)}
                              className="rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-text focus:outline-none focus:ring-1 focus:ring-admin-primary"
                            >
                              {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {item.notes && (
                            <p className="mt-1 max-w-xs truncate text-[11px] italic text-admin-muted" title={item.notes}>
                              Note: {item.notes}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-admin-muted">
                          {formatDateTime(item.createdAt)}
                        </td>

                        <td className="px-4 py-3.5 text-right sm:px-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="secondary"
                              className="px-2.5 py-1 text-xs"
                              onClick={() => openDetail(item)}
                            >
                              Details
                            </Button>
                            <IconButton
                              label="Delete inquiry"
                              onClick={() => setToDelete(item)}
                              className="text-admin-muted hover:text-admin-danger"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {meta && meta.pages > 1 && (
              <div className="border-t border-admin-border p-4">
                <Pagination meta={meta} onPage={setPage} />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Inquiry Detail & Notes Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-admin-border">
            <div className="flex items-start justify-between border-b border-admin-border pb-4">
              <div>
                <h3 id="inquiry-modal-title" className="text-lg font-bold text-admin-text">
                  Inquiry from {activeItem.name}
                </h3>
                <p className="text-xs text-admin-muted mt-0.5">
                  Received on {formatDateTime(activeItem.createdAt)} · Source: {activeItem.source || 'Website'}
                </p>
              </div>
              <IconButton label="Close" onClick={closeDetail}>
                <X size={18} aria-hidden="true" />
              </IconButton>
            </div>

            <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Contact info grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-admin-subtle p-3 text-xs">
                <div>
                  <span className="font-semibold text-admin-muted block">Phone / WhatsApp:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.phone}</span>
                </div>
                <div>
                  <span className="font-semibold text-admin-muted block">Email:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.email || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold text-admin-muted block">Service:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.service}</span>
                </div>
                <div>
                  <span className="font-semibold text-admin-muted block">Destination:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.destination || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold text-admin-muted block">Travel Date:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.travelDate || 'Flexible'}</span>
                </div>
                <div>
                  <span className="font-semibold text-admin-muted block">Travellers:</span>
                  <span className="font-medium text-admin-text mt-0.5 block">{activeItem.travellers || '1'}</span>
                </div>
              </div>

              {/* Message */}
              {activeItem.message && (
                <div>
                  <label className="block text-xs font-semibold text-admin-muted mb-1">Customer Note / Message:</label>
                  <div className="rounded-xl border border-admin-border bg-slate-50 p-3 text-xs leading-relaxed text-admin-text whitespace-pre-wrap">
                    {activeItem.message}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <label htmlFor="modal-status-select" className="block text-xs font-semibold text-admin-muted mb-1.5">
                  Inquiry Status:
                </label>
                <select
                  id="modal-status-select"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-text focus:border-admin-primary focus:outline-none"
                >
                  {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Notes */}
              <div>
                <label htmlFor="modal-notes-area" className="block text-xs font-semibold text-admin-muted mb-1.5">
                  Internal Staff Notes (Follow-up log):
                </label>
                <textarea
                  id="modal-notes-area"
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Called client on 30 Oct; sent quote for 5N Dubai via WhatsApp. Waiting for passport copies."
                  className="w-full rounded-lg border border-admin-border bg-white p-3 text-xs text-admin-text placeholder:text-admin-muted focus:border-admin-primary focus:outline-none"
                />
              </div>

              {/* Quick WhatsApp reply */}
              {activeItem.phone && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${cleanPhone(activeItem.phone)}?text=${encodeURIComponent(`Hello ${activeItem.name}, following up from Arham Tours & Travels regarding your inquiry for ${activeItem.service}. How may we assist you with your travel plans?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-700 transition"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Open Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="mt-6 flex items-center justify-between border-t border-admin-border pt-4">
              <Button variant="danger" onClick={() => setToDelete(activeItem)}>
                Delete inquiry
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={closeDetail}>
                  Cancel
                </Button>
                <Button variant="primary" loading={savingNotes} onClick={saveModalChanges}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {toDelete && (
        <ConfirmDialog
          title="Delete inquiry"
          message={`Are you sure you want to delete the inquiry from "${toDelete.name}"? This action cannot be undone.`}
          confirmLabel="Delete inquiry"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  )
}

export default InquiriesPage
