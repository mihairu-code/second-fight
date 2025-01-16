import { createSlice } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI';

const initialState = {
  openArticleSlug: null,
  articles: [],
  currentArticle: null,
  slug: null,
  articleForm: {
    title: '',
    description: '',
    body: '',
    tagList: [],
    editTagIndex: null,
  },
  page: 1,
  pageSize: 5,
  filter: '',
  total: 0,
};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setArticles(state, action) {
      state.articles = action.payload.articles;
      state.total = action.payload.total;
    },
    setCurrentArticle(state, action) {
      state.currentArticle = action.payload;
    },
    setArticleForm(state, action) {
      state.articleForm = { ...state.articleForm, ...action.payload };
    },
    resetArticles(state) {
      state.articles = [];
      state.total = 0;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      ConduitAPI.endpoints.getArticles.matchFulfilled,
      (state, action) => {
        state.articles = action.payload.articles;
        state.total = action.payload.articlesCount;
      },
    );
  },
});

export const {
  setPage,
  setFilter,
  setArticles,
  setCurrentArticle,
  setArticleForm,
  resetArticleForm,
  resetArticles,
} = articleSlice.actions;

export default articleSlice.reducer;
