import { createSlice } from '@reduxjs/toolkit'

// The slider no longer assumes 3 slides. Each action receives the current
// slide count as its payload, so the hero can show any number of slides.
const initialState = {
  activeIndex: 0,
}

const isValidCount = (count) => Number.isInteger(count) && count > 0

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {
    nextSlide: (state, action) => {
      const count = action.payload
      if (!isValidCount(count)) return
      state.activeIndex = (state.activeIndex + 1) % count
    },
    previousSlide: (state, action) => {
      const count = action.payload
      if (!isValidCount(count)) return
      state.activeIndex = (state.activeIndex - 1 + count) % count
    },
    goToSlide: (state, action) => {
      const index = action.payload
      if (Number.isInteger(index) && index >= 0) {
        state.activeIndex = index
      }
    },
  },
})

export const { nextSlide, previousSlide, goToSlide } = sliderSlice.actions

export const selectActiveSlide = (state) => state.slider.activeIndex

export default sliderSlice.reducer
