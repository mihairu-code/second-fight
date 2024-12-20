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
  }),
});

export const { useGetArticlesQuery, useGetArticleBySlugQuery } = ConduitAPI;
