import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ConduitAPI = createApi({
  reducerPath: 'ConduitAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // Получаем токен из состояния
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    // Получение списка статей
    getArticles: builder.query({
      query: ({ limit = 10, offset = 0 }) => ({
        url: '/articles',
        params: { limit, offset },
      }),
    }),
    // Получение статьи по slug
    getArticleBySlug: builder.query({
      query: slug => ({
        url: `/articles/${slug}`,
      }),
    }),
    // Авторизация пользователя
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: { email, password } },
      }),
    }),
    // Регистрация нового пользователя
    signUp: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/users',
        method: 'POST',
        body: { user: { username, email, password } },
      }),
    }),
    // Получение текущего пользователя
    getCurrentUser: builder.query({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
    // Обновление данных пользователя
    updateUser: builder.mutation({
      query: userData => ({
        url: '/user',
        method: 'PUT',
        body: { user: userData },
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useLoginMutation,
  useSignUpMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} = ConduitAPI;
