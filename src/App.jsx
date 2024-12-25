import React from 'react';
import { Route, Routes } from 'react-router';

import { Skeleton } from '@gravity-ui/uikit';
import Header from '@components/Header';
import ArticlesList from '@pages/ArticlesList';
import OpenedArticle from '@pages/OpenedArticle';
import '@styles/App.less';

import { useGetArticlesQuery } from '@services/ConduitAPI';
import SignUp from '@pages/SignUp.jsx';
import SignIn from '@pages/SignIn.jsx';
import EditProfile from '@pages/EditProfile.jsx';
import CreateArticle from '@pages/CreateArticle.jsx';

export function App() {
  const { error, isLoading } = useGetArticlesQuery({
    limit: 5,
    offset: 0,
  });

  if (isLoading) {
    return (
      <main>
        <Skeleton className="loadingSpin" />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div>Ошибка загрузки: {error.message || 'Неизвестная ошибка'}</div>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<ArticlesList />} />
        <Route path="articles" element={<ArticlesList />} />
        <Route path="articles/:slug" element={<OpenedArticle />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="profile" element={<EditProfile />} />
        <Route path="new-article" element={<CreateArticle />} />
      </Route>
    </Routes>
  );
}
