import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userStore'
import walletReducer from './walletStore'

export default configureStore({
  reducer: {
    user: userReducer,
    wallet: walletReducer,
  },
})
