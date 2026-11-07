import { createContext, useContext } from 'react'

// toast.success(message) / toast.error(message), from components/Toaster.jsx.
export const ToastContext = createContext(null)

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast must be used inside <Toaster>')
  return toast
}
