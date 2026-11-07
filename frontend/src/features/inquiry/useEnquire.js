import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useReducedMotion } from 'framer-motion'
import { prefillInquiry } from './inquirySlice.js'

export const INQUIRY_SECTION_ID = 'contact'
export const INQUIRY_FIRST_FIELD_ID = 'inquiry-name'

// Returns enquire({ service, destination }): fills the enquiry form with the
// chosen package or service, scrolls to the form and moves keyboard focus there.
export function useEnquire() {
  const dispatch = useDispatch()
  const reduceMotion = useReducedMotion()

  return useCallback(
    ({ service, destination }) => {
      dispatch(prefillInquiry({ service, destination }))

      document.getElementById(INQUIRY_SECTION_ID)?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      document.getElementById(INQUIRY_FIRST_FIELD_ID)?.focus({ preventScroll: true })
    },
    [dispatch, reduceMotion],
  )
}
