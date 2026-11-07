import { MessageCircle } from 'lucide-react'
import { useWhatsApp } from '../../features/inquiry/whatsapp.js'
import { useBusiness } from '../../features/site/useSite.js'

// Floating WhatsApp shortcut, visible on every screen size.
function WhatsAppButton() {
  const whatsApp = useWhatsApp()
  const { name } = useBusiness()

  return (
    <a
      href={whatsApp.general()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${name} on WhatsApp (opens in a new tab)`}
      className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-4 text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition hover:pr-5 hover:brightness-110 sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={24} aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 group-hover:max-w-40 group-focus-visible:max-w-40">
        WhatsApp us
      </span>
    </a>
  )
}

export default WhatsAppButton
