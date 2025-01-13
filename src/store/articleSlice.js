import { createSlice } from '@reduxjs/toolkit';
import { ConduitAPI } from '@services/ConduitAPI';

const initialState = {
  articles: [],
  currentArticle: null,
  slug: null,
  articleForm: {
    // Добавлено состояние формы
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
      // Экшен для обновления формы
      state.articleForm = { ...state.articleForm, ...action.payload };
    },
    resetArticleForm(state) {
      // Экшен для очистки формы
      state.articleForm = initialState.articleForm;
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
} = articleSlice.actions;

export default articleSlice.reducer;
