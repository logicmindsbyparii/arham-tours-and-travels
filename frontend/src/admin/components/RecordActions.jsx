import { useState } from 'react'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { useMutation } from '../hooks.js'
import { useToast } from '../toast.js'
import { Button, ConfirmDialog } from './ui.jsx'

// Edit / Publish-Unpublish (or Activate-Deactivate) / Delete for one record.
// Every change goes to the server first; the list reloads only after it worked.
//   endpoint  e.g. "/admin/packages"
//   toggle    'status' (published/draft), 'active' (banners) or null
//   onEdit    called with the record; or editTo for a link
function RecordActions({ item, endpoint, toggle = 'status', label, onEdit, editTo, onChanged, extra }) {
  const mutate = useMutation()
  const toast = useToast()
  const [busy, setBusy] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const isLive = toggle === 'active' ? item.active : item.status === 'published'

  const flip = async () => {
    setBusy('toggle')
    try {
      const json =
        toggle === 'active'
          ? await mutate('patch', `${endpoint}/${item.id}/active`, { active: !item.active })
          : await mutate('patch', `${endpoint}/${item.id}/status`, { status: isLive ? 'draft' : 'published' })
      toast.success(json.message ?? 'Saved')
      onChanged()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(null)
    }
  }

  const remove = async () => {
    setBusy('delete')
    try {
      const json = await mutate('delete', `${endpoint}/${item.id}`)
      toast.success(json.message ?? 'Deleted')
      setConfirming(false)
      onChanged({ deleted: true })
    } catch (error) {
      toast.error(error.message)
      setConfirming(false)
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      {extra}
      <Button to={editTo} onClick={editTo ? undefined : () => onEdit(item)} className="px-3" aria-label={`Edit ${label}`}>
        <Pencil size={15} aria-hidden="true" />
        Edit
      </Button>
      {toggle && (
        <Button
          onClick={flip}
          loading={busy === 'toggle'}
          className="px-3"
          aria-label={`${isLive ? (toggle === 'active' ? 'Deactivate' : 'Unpublish') : toggle === 'active' ? 'Activate' : 'Publish'} ${label}`}
        >
          {busy !== 'toggle' && (isLive ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />)}
          {isLive ? (toggle === 'active' ? 'Deactivate' : 'Unpublish') : toggle === 'active' ? 'Activate' : 'Publish'}
        </Button>
      )}
      <Button
        onClick={() => setConfirming(true)}
        className="px-3 text-admin-danger hover:border-red-200 hover:bg-red-50"
        aria-label={`Delete ${label}`}
      >
        <Trash2 size={15} aria-hidden="true" />
        Delete
      </Button>
      <ConfirmDialog
        open={confirming}
        title={`Delete “${label}”?`}
        message="This permanently removes it from the database and from the website. This cannot be undone."
        busy={busy === 'delete'}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}

export default RecordActions
