import { createSlice } from '@reduxjs/toolkit'

// The enquiry form's draft lives in Redux so that any "Enquire" button on the
// page (packages, destinations, services, cars) can prefill it.
export const emptyInquiry = {
  name: '',
  phone: '',
  email: '',
  service: '',
  destination: '',
  travelDate: '',
  travellers: '2',
  message: '',
}

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState: {
    draft: emptyInquiry,
  },
  reducers: {
    updateField: (state, action) => { 
      const { name, value } = action.payload
      if (name in state.draft) state.draft[name] = value
    },
    prefillInquiry: (state, action) => {
      const { service = '', destination = '' } = action.payload
      state.draft.service = service
      state.draft.destination = destination
    },
    resetInquiry: (state) => {
      state.draft = emptyInquiry
    },
  },
})

export const { updateField, prefillInquiry, resetInquiry } = inquirySlice.actions

export const selectInquiryDraft = (state) => state.inquiry.draft

export default inquirySlice.reducer
