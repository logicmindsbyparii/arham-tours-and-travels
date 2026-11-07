import { configureStore } from '@reduxjs/toolkit'
import sliderReducer from '../features/slider/sliderSlice.js'
import inquiryReducer from '../features/inquiry/inquirySlice.js'
import siteReducer from '../features/site/siteSlice.js'
import adminAuthReducer from '../admin/authSlice.js'

export const store = configureStore({
  reducer: {
    slider: sliderReducer,
    inquiry: inquiryReducer,
    site: siteReducer,
    adminAuth: adminAuthReducer,
  },
})
