import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2, Search, X } from 'lucide-react'

// Light-theme building blocks of the admin panel.

const BUTTON_VARIANTS = {
  primary: 'bg-admin-primary text-white hover:bg-admin-primary-strong border-transparent',
  secondary: 'bg-white text-admin-text border-admin-border hover:bg-admin-subtle',
  danger: 'bg-admin-danger text-white hover:bg-red-700 border-transparent',
  ghost: 'bg-transparent text-admin-muted border-transparent hover:bg-admin-subtle hover:text-admin-text',
}

export function Button({ variant = 'secondary', to, loading = false, className = '', children, ...props }) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 size={16} aria-hidden="true" className="animate-spin" />}
      {children}
    </button>
  )
}

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-subtle hover:text-admin-text focus-visible:outline-2 focus-visible:outline-admin-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`min-w-0 rounded-xl border border-admin-border bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] ${className}`} {...props}>
      {children}
    </div>
  )
}

// Title row of every page: breadcrumbs, heading, description and actions.
export function PageHeader({ title, description, crumbs = [], actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1.5">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-admin-muted">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight size={12} aria-hidden="true" />}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-admin-primary-strong hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="break-words text-xl font-semibold text-admin-text sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-admin-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

const BADGES = {
  published: 'bg-green-50 text-green-700 ring-green-600/20',
  active: 'bg-green-50 text-green-700 ring-green-600/20',
  draft: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  inactive: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  neutral: 'bg-admin-subtle text-admin-muted ring-admin-border',
  info: 'bg-sky-50 text-admin-primary-strong ring-sky-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
}

export function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${BADGES[tone]}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const label = { published: 'Published', draft: 'Draft', active: 'Active', inactive: 'Inactive' }[status] ?? status
  return (
    <Badge tone={status}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 px-4 py-16 text-sm text-admin-muted">
      <Loader2 size={20} aria-hidden="true" className="animate-spin text-admin-primary" />
      {label}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center px-4 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-admin-danger">
        <AlertTriangle size={22} aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-admin-text">Could not load this data</p>
      <p className="mt-1 max-w-md text-sm text-admin-muted">{error?.message ?? 'Something went wrong.'}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-subtle text-admin-muted">
        <Inbox size={22} aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-admin-text">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-admin-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-xs">
      <span className="sr-only">{label}</span>
      <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-admin-border bg-white pl-9 pr-3 text-sm text-admin-text placeholder:text-admin-muted focus:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
      />
    </label>
  )
}

export function FilterSelect({ label, value, onChange, options }) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-admin-border bg-white px-3 text-sm text-admin-text focus:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20 sm:w-auto"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.pages <= 1) {
    return meta ? <p className="px-4 py-3 text-xs text-admin-muted sm:px-5">{meta.total} {meta.total === 1 ? 'record' : 'records'}</p> : null
  }
  const first = (meta.page - 1) * meta.limit + 1
  const last = Math.min(meta.total, meta.page * meta.limit)
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border px-4 py-3 sm:px-5">
      <p className="text-xs text-admin-muted">
        {first}–{last} of {meta.total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="px-3" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="hidden min-[400px]:inline">Previous</span>
        </Button>
        <span className="text-xs text-admin-muted">
          {meta.page} / {meta.pages}
        </span>
        <Button variant="secondary" className="px-3" disabled={meta.page >= meta.pages} onClick={() => onPage(meta.page + 1)} aria-label="Next page">
          <span className="hidden min-[400px]:inline">Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}

// Accessible dialog on the native <dialog>: Escape closes it, focus stays
// inside, and the content scrolls within the viewport on small screens.
export function Modal({ open, onClose, title, description, size = 'md', children, footer }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return undefined
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    if (!open) return undefined
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-2xl', lg: 'sm:max-w-4xl', xl: 'sm:max-w-6xl' }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => event.target === ref.current && onClose()}
      className={`m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-hidden rounded-xl bg-white p-0 text-admin-text shadow-2xl backdrop:bg-slate-900/40 ${widths[size]}`}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-1rem)] flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <h2 id={titleId} className="break-words text-lg font-semibold text-admin-text">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-sm text-admin-muted">{description}</p>}
            </div>
            <IconButton label="Close" onClick={onClose} className="-mr-2">
              <X size={18} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-admin-border bg-admin-subtle px-4 py-3 min-[400px]:flex-row min-[400px]:justify-end sm:px-6">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-admin-muted">{message}</p>
    </Modal>
  )
}
