import { createSlice } from '@reduxjs/toolkit'

const initialState = { activeBar : '' , }

const layoutSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setActiveBar : (state,action) => {
        state.activeBar = action.payload ;
    }
  },
})

export const {setActiveBar} = layoutSlice.actions
export default layoutSlice.reducer

