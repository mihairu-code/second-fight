import { configureStore } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI'; // Путь к вашему API

const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer, // Редьюсер API
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware),
});

export default store;
