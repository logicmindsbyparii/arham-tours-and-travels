import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import PackageDetail from './PackageDetail.jsx'
import { getSmoothScroll } from '../../hooks/useSmoothScroll.js'

// Full details of one package in a popup. Built on the native <dialog>, so
// Escape closes it, focus stays inside while it is open and returns to the
// "View more" button afterwards. Clicking the dark backdrop also closes it.
function PackageDialog({ item, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!item) return
    if (!dialog.open) dialog.showModal()
    dialog.scrollTop = 0
    // Hold the page still behind the popup.
    getSmoothScroll()?.stop()
    document.documentElement.style.overflow = 'hidden'

    return () => {
      getSmoothScroll()?.start()
      document.documentElement.style.overflow = ''
    }
  }, [item])

  const close = () => dialogRef.current?.close()

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && close()}
      aria-labelledby="package-dialog-title"
      // Let the popup scroll on its own instead of smooth-scrolling the page.
      data-lenis-prevent
      className="package-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-6xl overflow-y-auto rounded-[28px] bg-white p-0 text-ink shadow-[0_40px_120px_-30px_rgb(15_23_42/0.6)] backdrop:bg-ink/70 backdrop:backdrop-blur-sm sm:w-[calc(100%-3rem)]"
    >
      {item && (
        <>
          <button
            type="button"
            onClick={close}
            aria-label="Close package details"
            className="sticky top-3 z-10 float-right mr-3 mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-ink/10 transition hover:rotate-90 hover:bg-ember hover:text-white sm:mr-4 sm:mt-4"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <PackageDetail item={item} titleId="package-dialog-title" onBeforeEnquire={close} />
        </>
      )}
    </dialog>
  )
}

export default PackageDialog
