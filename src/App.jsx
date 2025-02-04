import React from 'react';
import { Route, Routes } from 'react-router';
import Header from '@pages/Header.jsx';
import ArticlesList from '@pages/ArticlesList';
import OpenedArticle from '@pages/OpenedArticle';
import '@styles/App.less';
import SignUp from '@pages/SignUp.jsx';
import SignIn from '@pages/SignIn.jsx';
import EditProfile from '@pages/EditProfile.jsx';
import CreateArticle from '@pages/CreateArticle.jsx';
import EditArticle from '@pages/EditArticle.jsx';

export function App() {
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
        <Route path="articles/edit/:slug" element={<EditArticle />} />
      </Route>
    </Routes>
  );
}
