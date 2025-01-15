import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ConduitAPI = createApi({
  reducerPath: 'ConduitAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Articles, Article'],
  endpoints: builder => ({
    getArticles: builder.query({
      query: ({ limit = 10, offset = 0 }) => ({
        url: '/articles',
        params: { limit, offset },
      }),
      providesTags: ['Articles', 'Article'],
    }),
    getArticleBySlug: builder.query({
      query: slug => `/articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
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
        body: { article: { title, description, body, tagList } },
      }),
      invalidatesTags: ['Article'],
    }),
    deleteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),
    updateArticle: builder.mutation({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: { article },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Article', id: slug },
      ],
    }),
    favoriteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: [
        'Articles',
        (result, error, slug) => ({ type: 'Article', id: slug }),
      ],
    }),
    unfavoriteArticle: builder.mutation({
      query: slug => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Articles',
        (result, error, slug) => ({ type: 'Article', id: slug }),
      ],
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
