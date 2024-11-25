import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/extensions
import { ConduitAPI } from '@/services/ConduitAPI'; // Путь к вашему API

const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware),
});

export default store;
