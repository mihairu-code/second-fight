import { createSlice } from '@reduxjs/toolkit';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';

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
      localStorage.removeItem('auth');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
