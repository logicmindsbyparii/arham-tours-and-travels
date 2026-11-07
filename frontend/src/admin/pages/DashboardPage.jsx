import { Link } from 'react-router-dom'
import { FileCheck, HelpCircle, Images, Inbox, MapPin, MessageSquareQuote, Package, Plus, Settings, Sparkles } from 'lucide-react'
import { useApiQuery } from '../hooks.js'
import { ACTION_LABELS, formatDateTime, formatMoney } from '../format.js'
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../components/ui.jsx'

function StatCard({ icon: Icon, label, value, detail, to }) {
  return (
    <Card className="p-4 sm:p-5">
      <Link to={to} className="group flex items-start justify-between gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-admin-primary">
        <div className="min-w-0">
          <p className="text-sm text-admin-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-admin-text">{value}</p>
          {detail && <p className="mt-1 text-xs text-admin-muted">{detail}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-admin-primary-strong transition-colors group-hover:bg-admin-primary group-hover:text-white">
          <Icon size={19} aria-hidden="true" />
        </span>
      </Link>
    </Card>
  )
}

function DashboardPage() {
  const { data, loading, error, reload } = useApiQuery('/admin/dashboard')

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What is on the website right now, from the database."
        actions={
          <>
            <Button variant="primary" to="/admin/packages/new">
              <Plus size={16} aria-hidden="true" />
              Add package
            </Button>
            <Button to="/admin/inquiries">
              <Inbox size={16} aria-hidden="true" />
              View inquiries
            </Button>
          </>
        }
      />

      {loading && !data ? (
        <Card>
          <LoadingState label="Loading dashboard…" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : (
        <Dashboard data={data} />
      )}
    </>
  )
}

function Dashboard({ data }) {
  const { counts } = data
  const categories = Object.entries(data.packagesByCategory)

  return (
    <div className="space-y-6">
      {!data.settingsConfigured && (
        <Card className="flex flex-col gap-3 border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">
            Business settings have not been saved yet, so the website uses its built-in contact details.
          </p>
          <Button to="/admin/settings" className="shrink-0">
            <Settings size={16} aria-hidden="true" />
            Open settings
          </Button>
        </Card>
      )}

      <section aria-label="Totals" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Packages" value={counts.packages.total} detail={`${counts.packages.published} published · ${counts.packages.draft} draft`} to="/admin/packages" />
        <StatCard icon={MapPin} label="Destinations" value={counts.destinations.total} detail={`${counts.destinations.published} published`} to="/admin/destinations" />
        <StatCard icon={Images} label="Hero banners" value={counts.banners.total} detail={`${counts.banners.active} active`} to="/admin/banners" />
        <StatCard icon={Sparkles} label="Services" value={counts.services.total} detail={`${counts.services.published} published`} to="/admin/services" />
        <StatCard icon={FileCheck} label="Visa countries" value={counts.visaCountries?.total ?? 0} detail={`${counts.visaCountries?.published ?? 0} published`} to="/admin/visa-countries" />
        <StatCard icon={MessageSquareQuote} label="Testimonials" value={counts.testimonials.total} detail={`${counts.testimonials.published} published`} to="/admin/testimonials" />
        <StatCard icon={HelpCircle} label="FAQs" value={counts.faqs.total} detail={`${counts.faqs.published} published`} to="/admin/faqs" />
        <StatCard icon={Inbox} label="Customer Inquiries" value={counts.inquiries?.total ?? 0} detail={`${counts.inquiries?.new ?? 0} new · ${counts.inquiries?.in_progress ?? 0} active`} to="/admin/inquiries" />
        <Card className="p-4 sm:p-5">
          <p className="text-sm text-admin-muted">Packages by type</p>
          {categories.length === 0 ? (
            <p className="mt-2 text-sm text-admin-muted">No packages yet.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {categories.map(([category, split]) => (
                <li key={category} className="flex items-center justify-between gap-2">
                  <span className="capitalize text-admin-text">{category}</span>
                  <span className="tabular-nums text-admin-muted">
                    {split.published} live · {split.draft} draft
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-5">
            <h2 className="font-semibold">Recent customer inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm font-medium text-admin-primary-strong hover:underline">
              View all
            </Link>
          </div>
          {!data.recentInquiries || data.recentInquiries.length === 0 ? (
            <EmptyState title="No customer inquiries yet" text="Inquiries submitted via website will appear here." />
          ) : (
            <ul className="divide-y divide-admin-border">
              {data.recentInquiries.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/admin/inquiries"
                    className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 hover:bg-admin-subtle sm:px-5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-medium text-admin-text">
                        {item.name} <span className="font-normal text-xs text-admin-muted">({item.phone})</span>
                      </span>
                      <span className="block text-xs text-admin-muted">
                        {item.service} {item.destination ? `· ${item.destination}` : ''} · {formatDateTime(item.createdAt)}
                      </span>
                    </span>
                    <Badge tone={item.status === 'new' ? 'info' : 'neutral'}>{item.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-5">
            <h2 className="font-semibold">Recently updated packages</h2>
            <Link to="/admin/packages" className="text-sm font-medium text-admin-primary-strong hover:underline">
              View all
            </Link>
          </div>
          {data.recentPackages.length === 0 ? (
            <EmptyState title="No packages yet" action={<Button variant="primary" to="/admin/packages/new">Add package</Button>} />
          ) : (
            <ul className="divide-y divide-admin-border">
              {data.recentPackages.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/admin/packages/edit/${item.id}`}
                    className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 hover:bg-admin-subtle sm:px-5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-medium text-admin-text">{item.title}</span>
                      <span className="block text-xs text-admin-muted">
                        {formatMoney(item.price, item.currency)} · updated {formatDateTime(item.updatedAt)}
                      </span>
                    </span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-5">
            <h2 className="font-semibold">Recent activity</h2>
            <Link to="/admin/activity-logs" className="text-sm font-medium text-admin-primary-strong hover:underline">
              View all
            </Link>
          </div>
          {data.recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <ul className="divide-y divide-admin-border">
              {data.recentActivity.map((entry) => (
                <li key={entry.id} className="flex min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-1 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm text-admin-text">
                      <Badge tone="info">{ACTION_LABELS[entry.action] ?? entry.action}</Badge>{' '}
                      <span className="capitalize">{entry.entityType}</span>
                      {entry.entityLabel && <span className="text-admin-muted"> · {entry.entityLabel}</span>}
                    </p>
                    <p className="mt-0.5 break-all text-xs text-admin-muted">{entry.adminEmail}</p>
                  </div>
                  <time dateTime={entry.createdAt} className="text-xs text-admin-muted">
                    {formatDateTime(entry.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
