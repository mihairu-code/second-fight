import { configureStore } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI';
import authReducer from '@store/authSlice.js';
import articleReducer from '@store/articleSlice.js';

const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer,
    auth: authReducer,
    article: articleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware),
});

export default store;
