import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, MessageCircle, RotateCcw, Send } from 'lucide-react'
import { resetInquiry, selectInquiryDraft, updateField } from './inquirySlice.js'
import { formatInquiryMessage, useWhatsApp } from './whatsapp.js'
import { today, validateInquiry } from './validateInquiry.js'
import Select from '../../components/ui/Select.jsx'
import DatePicker from '../../components/ui/DatePicker.jsx'
import { useSite } from '../site/useSite.js'
import { api } from '../../lib/api.js'

const inputClass =
  'mt-2 w-full rounded-xl border bg-white/70 px-4 py-3.5 text-base text-ink placeholder:text-slate/70 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-ember/30'

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-ember-deep" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-slate"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-ember-deep">
          {error}
        </p>
      )}
    </div>
  )
}

function InquiryForm() {
  const dispatch = useDispatch()
  const form = useSelector(selectInquiryDraft)
  const [errors, setErrors] = useState({})
  const [sentMessage, setSentMessage] = useState(null)
  const errorSummaryRef = useRef(null)
  const { business, serviceOptions } = useSite()
  const whatsApp = useWhatsApp()

  const handleChange = (event) => {
    const { name, value } = event.target
    dispatch(updateField({ name, value }))
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateInquiry(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Let the summary render, then move focus to it for screen-reader users.
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    // Persist inquiry in the backend so admin can track it
    api.post('/public/inquiries', form).catch(() => {})

    const message = formatInquiryMessage(form)
    window.open(whatsApp.build(message), '_blank', 'noopener,noreferrer')
    setSentMessage(message)
  }

  const startOver = () => {
    dispatch(resetInquiry())
    setSentMessage(null)
    setErrors({})
  }

  // Shared props for a field: id, error state and the description it points to.
  // Ids follow `inquiry-${name}`, so the name field matches INQUIRY_FIRST_FIELD_ID.
  const a11y = (name, hasHint = false) => {
    const id = `inquiry-${name}`
    const describedBy = errors[name] ? `${id}-error` : hasHint ? `${id}-hint` : undefined
    return {
      id,
      name,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': describedBy,
      className: `${inputClass} ${errors[name] ? 'border-ember-deep' : 'border-ink/15'}`,
    }
  }

  if (sentMessage) {
    const email = business.emails[0]
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(
      `Travel enquiry from ${form.name.trim()}`,
    )}&body=${encodeURIComponent(sentMessage)}`

    return (
      <div role="status" className="rounded-[26px] bg-white/70 p-8 ring-1 ring-ink/10 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white">
          <MessageCircle size={26} aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-3xl text-ink">Your message is ready in WhatsApp.</h3>
        <p className="mt-3 text-base leading-7 text-slate">
          WhatsApp should have opened in a new tab with your enquiry filled in. Press send there to reach us.
          This website does not send or store your details itself.
        </p>
        <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-paper p-4 font-sans text-sm leading-6 text-ink/80">
          {sentMessage}
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsApp.build(sentMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-semibold text-white hover:brightness-110"
          >
            <MessageCircle size={17} aria-hidden="true" />
            Open WhatsApp again
          </a>
          {email && (
            <a
              href={emailUrl}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/25 px-6 text-sm font-semibold text-ink hover:border-ink"
            >
              <Mail size={17} aria-hidden="true" />
              Send by email instead
            </a>
          )}
          <button
            type="button"
            onClick={startOver}
            className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-slate hover:text-ink"
          >
            <RotateCcw size={16} aria-hidden="true" />
            New enquiry
          </button>
        </div>
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="inquiry-form-title"
      className="rounded-[26px] bg-white/55 p-6 ring-1 ring-ink/10 sm:p-10"
    >
      <h3 id="inquiry-form-title" className="text-3xl text-ink">
        Tell us about your trip
      </h3>
      <p className="mt-2 text-sm text-slate">
        Fields marked <span className="text-ember-deep">*</span> are required.
      </p>

      {errorList.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-xl border border-ember-deep/40 bg-ember/10 p-4 text-sm text-ink focus:outline-none"
        >
          <p className="font-semibold">Please check {errorList.length === 1 ? 'this field' : 'these fields'}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id="inquiry-name" label="Full name" required error={errors.name}>
          <input {...a11y('name')} value={form.name} onChange={handleChange} autoComplete="name" maxLength={100} />
        </Field>

        <Field id="inquiry-phone" label="Phone / WhatsApp" required error={errors.phone}>
          <input
            {...a11y('phone')}
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="+91 98765 43210"
            maxLength={20}
          />
        </Field>

        <Field id="inquiry-email" label="Email" error={errors.email}>
          <input
            {...a11y('email')}
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            maxLength={254}
          />
        </Field>

        <Field id="inquiry-service" label="What do you need?" required error={errors.service}>
          <Select
            {...a11y('service')}
            value={form.service}
            onChange={handleChange}
            options={serviceOptions}
            placeholder="Choose one…"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            id="inquiry-destination"
            label="Destination, package or car"
            required={form.service.toLowerCase().includes('tour package')}
            error={errors.destination}
            hint="Filled in automatically when you choose a package, destination or car above."
          >
            <input
              {...a11y('destination', true)}
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. Vietnam Group Departure with Phu Quoc"
              maxLength={150}
            />
          </Field>
        </div>

        <Field id="inquiry-travelDate" label="Travel date" error={errors.travelDate}>
          <DatePicker {...a11y('travelDate')} min={today()} value={form.travelDate} onChange={handleChange} />
        </Field>

        <Field id="inquiry-travellers" label="Travellers" required>
          <Select
            {...a11y('travellers')}
            value={form.travellers}
            onChange={handleChange}
            options={['1', '2', '3', '4', '5', '6', '7–10', '11+']}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id="inquiry-message" label="Anything else?">
            <textarea
              {...a11y('message')}
              value={form.message}
              onChange={handleChange}
              rows={4}
              maxLength={1500}
              placeholder="Budget, hotel preferences, dietary needs (e.g. Jain food), special occasions…"
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ember px-4 text-[0.9rem] font-semibold text-white sm:px-6 sm:text-base transition hover:bg-ember-deep"
      >
        Continue on WhatsApp
        <Send size={18} aria-hidden="true" />
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-slate">
        Opens WhatsApp with your enquiry filled in, ready for you to send. Nothing is stored on this website.
      </p>
    </form>
  )
}

export default InquiryForm
