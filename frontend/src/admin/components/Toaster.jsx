import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { ToastContext } from '../toast.js'

// Small notifications in the corner. Success messages close by themselves;
// errors stay longer so they can be read.
function Toaster({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), [])

  const push = useCallback(
    (type, message) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-3), { id, type, message }])
      window.setTimeout(() => dismiss(id), type === 'error' ? 7000 : 3500)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({ success: (message) => push('success', message), error: (message) => push('error', message) }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96"
      >
        {toasts.map((toast) => {
          const error = toast.type === 'error'
          const Icon = error ? XCircle : CheckCircle2
          return (
            <div
              key={toast.id}
              role={error ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-3.5 text-sm text-admin-text shadow-lg ${
                error ? 'border-admin-danger/30' : 'border-admin-success/30'
              }`}
            >
              <Icon size={18} aria-hidden="true" className={`mt-0.5 shrink-0 ${error ? 'text-admin-danger' : 'text-admin-success'}`} />
              <p className="min-w-0 flex-1 break-words">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-admin-muted hover:bg-admin-subtle hover:text-admin-text"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export default Toaster
