import Header from '@components/Header.jsx';
import { useGetArticlesQuery } from '@services/ConduitAPI.js';
import { Skeleton } from '@gravity-ui/uikit';

import './styles/App.less';
import ArticlesList from '@pages/ArticlesList.jsx';
import { Route, Routes } from 'react-router';
import React from 'react';
import { SignUp } from '@pages/SignUp';
import { SignIn } from '@pages/SignIn';

export function App() {
  const { error, isLoading, data } = useGetArticlesQuery({
    limit: 5,
    offset: 0,
  });
  const articles = data ? data['articles'] : [];
  return (
    <>
      <Header />
      <main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {isLoading ? (
          <Skeleton className="loadingSpin" />
        ) : error ? (
          <div>Ошибка загрузки: {error.message}</div>
        ) : (
          <Routes>
            <Route path="/" element={<ArticlesList articles={articles} />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        )}
      </main>
    </>
  );
}
