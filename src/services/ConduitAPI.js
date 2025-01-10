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
    registerUser: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/users',
        method: 'POST',
        body: { user: { username, email, password } },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: { email, password } },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ username, email, avatar, password }) => ({
        url: '/user',
        method: 'PUT',
        body: {
          user: {
            username,
            email,
            image: avatar,
            ...(password && { password }),
          },
        },
      }),
    }),
    createArticle: builder.mutation({
      query: ({ title, description, body, tagList }) => ({
        url: '/articles',
        method: 'POST',
        body: {
          article: {
            title,
            description,
            body,
            tagList,
          },
        },
      }),
    }),
    deleteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
    }),
    updateArticle: builder.mutation({
      query: ({ slug, ...articleData }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: articleData,
      }),
    }),
    favoriteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
    }),
    unfavoriteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useLoginMutation,
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} = ConduitAPI;
