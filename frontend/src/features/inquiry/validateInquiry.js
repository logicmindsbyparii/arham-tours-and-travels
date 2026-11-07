// Form validation for the enquiry form, kept separate so it is easy to test.

export const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

// Returns an object of { fieldName: message } for every invalid field.
export function validateInquiry(form) {
  const errors = {}
  const phoneDigits = form.phone.replace(/\D/g, '')
  const isTourPackage = form.service.toLowerCase().includes('tour package')

  if (form.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = 'Please enter a phone number with 10 to 15 digits.'
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address, or leave it empty.'
  }
  if (!form.service) errors.service = 'Please choose what you need help with.'
  if (isTourPackage && !form.destination.trim()) {
    errors.destination = 'Please tell us the destination or package you are interested in.'
  }
  if (form.travelDate && form.travelDate < today()) {
    errors.travelDate = 'The travel date cannot be in the past.'
  }

  return errors
}
