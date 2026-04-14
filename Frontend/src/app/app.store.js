import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/auth/state/auth.slice.js'
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})