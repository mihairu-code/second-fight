import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18'; // Путь к вашему API

const authSlice = createSlice({
  name: 'auth',
  initialState: (() => {
    // eslint-disable-next-line no-undef
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        return {
          token: parsedAuth.token,
          user: parsedAuth.user,
        };
      } catch (e) {
        toaster.add({
          name: 'ParseError',
          title: 'Ошибка',
          description: e.message,
          theme: 'danger',
          content: 'Failed to parse auth from localStorage:',
          autoHiding: 7000,
        });
      }
    }
    return { token: null, user: null };
  })(),
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth: state => {
      state.token = null;
      state.user = null;
      // eslint-disable-next-line no-undef
      localStorage.removeItem('auth'); // Удаляем из localStorage при logout
    },
  },
});
export const { setAuth, clearAuth } = authSlice.actions;

const store = configureStore({
  reducer: {
    [ConduitAPI.reducerPath]: ConduitAPI.reducer,
    auth: authSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ConduitAPI.middleware),
});

export default store;
