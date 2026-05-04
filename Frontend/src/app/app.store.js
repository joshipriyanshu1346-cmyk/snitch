import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/auth/state/auth.slice.js'
import productReducer from '../feature/product/state/product.slice.js'
import aiReducer from '../feature/ai/state/ai.slice.js'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    ai: aiReducer,
  },
})