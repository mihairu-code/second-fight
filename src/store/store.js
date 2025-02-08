import { configureStore } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI';
import authReducer from '@store/authSlice.js';

const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware),
});

export default store;
