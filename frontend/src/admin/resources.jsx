import { resolveImage } from '../data/imageAssets.js'
import { formatDateTime } from './format.js'
import { Badge, StatusBadge } from './components/ui.jsx'

// The content types managed with the shared list + dialog page
// (pages/ResourcePage.jsx). Each entry describes its API endpoint, table
// columns, filters and form fields; the server validates everything again.
//
// field types: text, textarea, number, select, switch, lines, image,
//              package (published or draft package), icon (service icon)

const STATUS_FILTER = {
  name: 'status',
  label: 'Status',
  options: [
    { value: 'all', label: 'All statuses' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ],
}

const STATUS_FIELD = {
  name: 'status',
  label: 'Status',
  type: 'select',
  hint: 'Only published items are shown on the website.',
  options: [
    { value: 'draft', label: 'Draft (hidden)' },
    { value: 'published', label: 'Published (visible on website)' },
  ],
}

const ORDER_FIELD = { name: 'sortOrder', label: 'Display order', type: 'number', hint: 'Lower numbers are shown first.' }

const ACCENT_FIELD = {
  name: 'accent',
  label: 'Accent colour',
  type: 'select',
  options: [
    { value: 'azure', label: 'Blue' },
    { value: 'jade', label: 'Green' },
    { value: 'ember', label: 'Red' },
  ],
}

const thumb = (image) =>
  image ? <img src={resolveImage(image)} alt="" className="hidden h-11 w-14 shrink-0 rounded-md object-cover sm:block" /> : null

const updatedColumn = { key: 'updatedAt', label: 'Updated', render: (item) => formatDateTime(item.updatedAt), className: 'whitespace-nowrap' }
const statusColumn = { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> }
const linkedPackage = (item) =>
  item.package ? (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="break-words">{item.package.title}</span>
      {item.package.status !== 'published' && <Badge tone="draft">Draft</Badge>}
    </span>
  ) : (
    <Badge tone="draft">No package</Badge>
  )

export const FAQ_PAGES = [
  { value: 'destinations', label: 'Destinations page' },
  { value: 'services', label: 'Services page' },
  { value: 'carRental', label: 'Car rental page' },
  { value: 'contact', label: 'Contact page' },
  { value: 'visa', label: 'Visa page' },
]

export const RESOURCES = {
  destinations: {
    route: 'destinations',
    endpoint: '/admin/destinations',
    title: 'Destinations',
    singular: 'destination',
    description: 'Places shown as postcards and in the destination guide. Deleting or unpublishing one removes it from the website.',
    toggle: 'status',
    labelField: 'name',
    searchPlaceholder: 'Search destinations',
    filters: [STATUS_FILTER],
    sorts: [
      { value: 'order', label: 'Website order' },
      { value: 'recent', label: 'Recently updated' },
      { value: 'name', label: 'Name A–Z' },
    ],
    columns: [
      {
        key: 'name',
        label: 'Destination',
        primary: true,
        render: (item) => (
          <span className="flex items-center gap-3">
            {thumb(item.image)}
            <span className="min-w-0">
              <span className="block break-words font-medium">{item.name}</span>
              <span className="block break-all text-xs font-normal text-admin-muted">/{item.slug}</span>
            </span>
          </span>
        ),
      },
      { key: 'package', label: 'Package', render: linkedPackage },
      statusColumn,
      updatedColumn,
    ],
    defaults: {
      name: '',
      slug: '',
      tagline: '',
      description: '',
      image: '',
      imageAlt: '',
      package: '',
      accent: 'azure',
      featured: false,
      status: 'draft',
      sortOrder: 0,
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', hint: 'Leave blank to create it from the name.' },
      { name: 'tagline', label: 'Short description', type: 'textarea', required: true, wide: true, rows: 2 },
      { name: 'description', label: 'Longer description', type: 'textarea', wide: true, rows: 4 },
      { name: 'image', label: 'Photo', type: 'image', required: true, wide: true },
      { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text', wide: true },
      {
        name: 'package',
        label: 'Package that visits it',
        type: 'package',
        hint: 'The postcard and destination guide show this package’s name, duration (e.g. 4N / 5D) and price. It must be published. Without one, they say “price on request”.',
      },
      ACCENT_FIELD,
      STATUS_FIELD,
      ORDER_FIELD,
      { name: 'featured', label: 'Featured', type: 'switch', wide: true },
    ],
  },

  banners: {
    route: 'banners',
    endpoint: '/admin/banners',
    title: 'Hero banners',
    singular: 'banner',
    description: 'Slides of the home page hero. Only active banners are shown; with none active, the hero is hidden.',
    toggle: 'active',
    labelField: 'name',
    searchPlaceholder: 'Search banners',
    filters: [
      {
        name: 'active',
        label: 'Active',
        options: [
          { value: 'all', label: 'All banners' },
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ],
      },
    ],
    sorts: [
      { value: 'order', label: 'Slide order' },
      { value: 'recent', label: 'Recently updated' },
      { value: 'name', label: 'Name A–Z' },
    ],
    columns: [
      {
        key: 'name',
        label: 'Banner',
        primary: true,
        render: (item) => (
          <span className="flex items-center gap-3">
            {thumb(item.image)}
            <span className="min-w-0">
              <span className="block break-words font-medium">{item.name}</span>
              <span className="block break-words text-xs font-normal uppercase text-admin-muted">
                {[item.titleLine1, item.titleLine2].filter(Boolean).join(' ')}
              </span>
            </span>
          </span>
        ),
      },
      { key: 'sortOrder', label: 'Order', className: 'tabular-nums' },
      { key: 'package', label: 'Package', render: linkedPackage },
      { key: 'active', label: 'Status', render: (item) => <StatusBadge status={item.active ? 'active' : 'inactive'} /> },
      updatedColumn,
    ],
    defaults: {
      name: '',
      titleLine1: '',
      titleLine2: '',
      subtitle: '',
      image: '',
      imageAlt: '',
      ctaLabel: 'Explore trips',
      ctaLink: '#packages',
      package: '',
      accent: 'azure',
      active: true,
      sortOrder: 0,
    },
    fields: [
      { name: 'name', label: 'Name (for your reference)', type: 'text', required: true },
      { name: 'titleLine1', label: 'Title, line 1', type: 'text', required: true, maxLength: 24, hint: 'Large poster word(s), up to 24 characters.' },
      { name: 'titleLine2', label: 'Title, line 2', type: 'text', maxLength: 24 },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', required: true, wide: true, rows: 2 },
      { name: 'image', label: 'Background photo', type: 'image', required: true, wide: true },
      { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text', wide: true },
      { name: 'ctaLabel', label: 'Button label', type: 'text' },
      { name: 'ctaLink', label: 'Button link', type: 'text', hint: 'A page (/packages), a section (#packages) or https:// URL.' },
      { name: 'package', label: 'Package', type: 'package', hint: 'Shows its duration and price; “Plan this trip” enquires about it.' },
      ACCENT_FIELD,
      ORDER_FIELD,
      { name: 'active', label: 'Active (shown on the website)', type: 'switch' },
    ],
    validate: (values) => {
      const link = values.ctaLink.trim()
      if (link && !/^(#[\w-]*|\/(?!\/)\S*|https?:\/\/\S+)$/.test(link)) {
        return { ctaLink: 'Use /page, #section or a full https:// URL' }
      }
      return {}
    },
  },

  services: {
    route: 'services',
    endpoint: '/admin/services',
    title: 'Services',
    singular: 'service',
    description: 'Travel services on the home and Services pages.',
    toggle: 'status',
    labelField: 'title',
    searchPlaceholder: 'Search services',
    filters: [STATUS_FILTER],
    sorts: [
      { value: 'order', label: 'Website order' },
      { value: 'recent', label: 'Recently updated' },
      { value: 'name', label: 'Name A–Z' },
    ],
    columns: [
      {
        key: 'title',
        label: 'Service',
        primary: true,
        render: (item) => (
          <span className="flex items-center gap-3">
            {thumb(item.image)}
            <span className="break-words font-medium">{item.title}</span>
          </span>
        ),
      },
      { key: 'sortOrder', label: 'Order', className: 'tabular-nums' },
      statusColumn,
      updatedColumn,
    ],
    defaults: {
      title: '',
      slug: '',
      summary: '',
      features: [],
      icon: 'Plane',
      image: '',
      imageAlt: '',
      inquiryLabel: '',
      status: 'draft',
      sortOrder: 0,
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', hint: 'Leave blank to create it from the title.' },
      { name: 'summary', label: 'Description', type: 'textarea', required: true, wide: true, rows: 3 },
      { name: 'features', label: 'Features', type: 'lines', wide: true, rows: 4 },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'inquiryLabel', label: 'Enquiry form label', type: 'text', hint: 'Option in “What do you need?”; defaults to the title.' },
      { name: 'image', label: 'Photo', type: 'image', wide: true },
      { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text', wide: true },
      STATUS_FIELD,
      ORDER_FIELD,
    ],
  },

  testimonials: {
    route: 'testimonials',
    endpoint: '/admin/testimonials',
    title: 'Testimonials',
    singular: 'testimonial',
    description: 'Add only real reviews, with the customer’s permission. The reviews section appears once one is published.',
    toggle: 'status',
    labelField: 'name',
    searchPlaceholder: 'Search reviews',
    filters: [STATUS_FILTER],
    sorts: [
      { value: 'order', label: 'Website order' },
      { value: 'recent', label: 'Recently updated' },
      { value: 'name', label: 'Name A–Z' },
    ],
    columns: [
      { key: 'name', label: 'Customer', primary: true, render: (item) => <span className="break-words font-medium">{item.name}</span> },
      {
        key: 'quote',
        label: 'Review',
        render: (item) => <span className="line-clamp-2 max-w-md break-words text-admin-muted">{item.quote}</span>,
      },
      { key: 'rating', label: 'Rating', render: (item) => (item.rating ? `${item.rating} / 5` : '—') },
      statusColumn,
      updatedColumn,
    ],
    defaults: { name: '', trip: '', quote: '', source: '', image: '', rating: '', status: 'draft', sortOrder: 0 },
    fields: [
      { name: 'name', label: 'Customer display name', type: 'text', required: true },
      { name: 'trip', label: 'Trip', type: 'text', hint: 'e.g. Vietnam group departure' },
      { name: 'quote', label: 'Review text', type: 'textarea', required: true, wide: true, rows: 5 },
      { name: 'source', label: 'Source', type: 'text', hint: 'e.g. Google review' },
      {
        name: 'rating',
        label: 'Rating',
        type: 'select',
        options: [{ value: '', label: 'No rating' }, ...[5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} / 5` }))],
      },
      { name: 'image', label: 'Photo (optional)', type: 'image', wide: true },
      STATUS_FIELD,
      ORDER_FIELD,
    ],
    toBody: (values) => ({ ...values, rating: values.rating === '' || values.rating === null ? null : Number(values.rating) }),
    fromRecord: (record) => ({ ...record, rating: record.rating ? String(record.rating) : '' }),
  },

  faqs: {
    route: 'faqs',
    endpoint: '/admin/faqs',
    title: 'FAQs',
    singular: 'question',
    description: 'Questions shown in the FAQ section of each page.',
    toggle: 'status',
    labelField: 'question',
    searchPlaceholder: 'Search questions',
    filters: [STATUS_FILTER, { name: 'faqPage', label: 'Page', options: [{ value: 'all', label: 'All pages' }, ...FAQ_PAGES] }],
    sorts: [
      { value: 'order', label: 'Page and order' },
      { value: 'recent', label: 'Recently updated' },
    ],
    columns: [
      { key: 'question', label: 'Question', primary: true, render: (item) => <span className="break-words font-medium">{item.question}</span> },
      { key: 'page', label: 'Page', render: (item) => FAQ_PAGES.find((page) => page.value === item.page)?.label ?? item.page },
      { key: 'sortOrder', label: 'Order', className: 'tabular-nums' },
      statusColumn,
    ],
    defaults: { question: '', answer: '', page: 'contact', status: 'draft', sortOrder: 0 },
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, wide: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, wide: true, rows: 5 },
      { name: 'page', label: 'Shown on', type: 'select', options: FAQ_PAGES },
      STATUS_FIELD,
      ORDER_FIELD,
    ],
  },
}
