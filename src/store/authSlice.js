import { createSlice } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI'; // Путь к вашему API

const initialState = {
  token: null, // Токен пользователя
  user: null, // Информация о текущем пользователе
  isAuthenticated: false, // Флаг авторизации
  loading: false, // Флаг загрузки
  error: null, // Ошибки авторизации
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        ConduitAPI.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          console.log('Login fulfilled:', payload);
          state.token = payload.user.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addMatcher(ConduitAPI.endpoints.login.matchPending, state => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        ConduitAPI.endpoints.login.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
        },
      )
      .addMatcher(
        ConduitAPI.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAuthenticated = true;
          state.loading = false;
        },
      )
      .addMatcher(ConduitAPI.endpoints.getCurrentUser.matchPending, state => {
        state.loading = true;
      })
      .addMatcher(ConduitAPI.endpoints.getCurrentUser.matchRejected, state => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
