import React from 'react';
import { Route, Routes } from 'react-router';

import { Skeleton } from '@gravity-ui/uikit';
import Header from '@components/Header';
import ArticlesList from '@pages/ArticlesList';
import OpenedArticle from '@pages/OpenedArticle';
import { SignIn } from '@pages/SignIn';
import { SignUp } from '@pages/SignUp';

import '@styles/App.less';

import { useGetArticlesQuery } from '@services/ConduitAPI';

export function App() {
  const { error, isLoading } = useGetArticlesQuery({
    limit: 5,
    offset: 0,
  });
  return (
    <>
      <Header />
      <main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {isLoading ? (
          <Skeleton className="loadingSpin" />
        ) : error ? (
          <div>Ошибка загрузки: {error.message || 'Неизвестная ошибка'}</div>
        ) : (
          <Routes>
            <Route path="/" element={<ArticlesList />} />
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/articles/:slug" element={<OpenedArticle />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        )}
      </main>
    </>
  );
}
