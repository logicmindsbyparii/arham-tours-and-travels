import PackageDetail from '../../features/packages/PackageDetail.jsx'
import { normalizePackage } from '../../features/site/useSite.js'
import { Badge, Modal } from './ui.jsx'

// Shows a package (draft or published) with the website's own detail
// component, exactly as visitors will see it in the package popup.
function PackagePreview({ item, onClose }) {
  return (
    <Modal
      open={Boolean(item)}
      onClose={onClose}
      size="xl"
      title={item ? `Preview: ${item.title}` : 'Preview'}
      description="How this package looks in the popup on the website's Packages page."
    >
      {item && (
        <>
          {item.status !== 'published' && (
            <p className="mb-3">
              <Badge tone="draft">Draft: not visible on the website until published</Badge>
            </p>
          )}
          <div className="overflow-hidden rounded-xl ring-1 ring-admin-border">
            <PackageDetail item={normalizePackage({ ...item, id: item.slug || 'preview' })} titleId="package-preview-title" onBeforeEnquire={onClose} />
          </div>
        </>
      )}
    </Modal>
  )
}

export default PackagePreview
