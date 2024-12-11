import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/extensions
import { ConduitAPI } from '@/services/ConduitAPI'; // Путь к вашему API
import authReducer from '@store/authSlice';

// Миддлвар для обработки ошибок
const errorMiddleware = store => next => action => {
  if (action.error) {
    console.error('Ошибка:', action.error.message || 'Неизвестная ошибка');
    // Здесь можно добавить логику отображения глобального алерта.
  }
  return next(action);
};

// Заготовки для редьюсеров слайсов
const articleReducer = (state = {}, action) => state; // В дальнейшем замените на реальный слайс

// Конфигурация store
const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer, // Редьюсер API
    auth: authReducer, // Слойка для авторизации
    article: articleReducer, // Слойка для статей
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware, errorMiddleware),
});

export default store;
