import { useMemo } from 'react'
import { useBusiness } from '../site/useSite.js'

// Builds a wa.me link. encodeURIComponent keeps spaces, "&", line breaks and
// emoji intact inside the pre-filled message. number: digits with country
// code, no "+" (set under Settings in the admin panel).
export function buildWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function quickWhatsAppMessage(topic) {
  return `Hi, I would like to enquire about ${topic}.`
}

// WhatsApp links for the business number in the admin settings:
//   build(message)  any pre-filled message
//   quick(topic)    "Hi, I would like to enquire about <topic>."
//   general()       the default message from the settings
export function useWhatsApp() {
  const { whatsappNumber, whatsappMessage } = useBusiness()
  return useMemo(
    () => ({
      build: (message) => buildWhatsAppUrl(whatsappNumber, message),
      quick: (topic) => buildWhatsAppUrl(whatsappNumber, quickWhatsAppMessage(topic)),
      general: (topic = 'a holiday or travel booking') =>
        buildWhatsAppUrl(whatsappNumber, whatsappMessage || quickWhatsAppMessage(topic)),
    }),
    [whatsappNumber, whatsappMessage],
  )
}

// Turns the enquiry form into a readable WhatsApp message. Empty optional
// fields are left out.
export function formatInquiryMessage(form) {
  const details = [
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
    form.email.trim() && `Email: ${form.email.trim()}`,
    `Looking for: ${form.service}`,
    form.destination.trim() && `Destination / package: ${form.destination.trim()}`,
    form.travelDate && `Travel date: ${form.travelDate}`,
    form.travellers && `Travellers: ${form.travellers}`,
    form.message.trim() && `Details: ${form.message.trim()}`,
  ]

  return [
    'Hello, I would like to make a travel enquiry.',
    '',
    ...details.filter(Boolean),
  ].join('\n')
}
