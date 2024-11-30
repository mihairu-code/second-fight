import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line import/extensions
import { ConduitAPI } from '@/services/ConduitAPI'; // Путь к вашему API

const errorMiddleware = store => next => action => {
  if (action.error) {
    console.error('Ошибка:', action.error.message || 'Неизвестная ошибка');
    // Здесь можно добавить логику отображения глобального алерта.
  }
  return next(action);
};

// Добавляем middleware в store
const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware, errorMiddleware),
});

export default store;
