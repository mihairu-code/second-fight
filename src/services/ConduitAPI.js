import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const my = {
  user: {
    username: 'bioneed',
    email: 'okonchatelni@gmail.com',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDIxMDFkY2UxOGQwMWIwMDJiNTkyNiIsInVzZXJuYW1lIjoiYmlvbmVlZCIsImV4cCI6MTczNzU2Njc0OSwiaWF0IjoxNzMyMzgyNzQ5fQ.lq8Izz91l3tlmlqWK11FgzrMCODI1NGjyqAtP3WEbpo',
  },
};

export const ConduitAPI = createApi({
  reducerPath: 'ConduitAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
  }),
  endpoints: builder => ({
    getArticles: builder.query({
      query: ({ limit = 10, offset = 0 }) => ({
        url: '/articles',
        params: { limit, offset },
      }),
    }),
    getArticleBySlug: builder.query({
      query: slug => ({
        url: `/articles/${slug}`,
      }),
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleBySlugQuery } = ConduitAPI;
