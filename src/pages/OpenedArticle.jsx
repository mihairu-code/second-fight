import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Text, User } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentArticle } from '@store/articleSlice';
import { useGetArticleBySlugQuery } from '@services/ConduitAPI';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
} from '@utils/cardFunctions';
import '@styles/OpenedArticle.less';
import ArticleHeader from '@components/ArticleHeader';
import ExtraButtons from '@components/ExtraButtons';

const OpenedArticle = () => {
  const { state } = useLocation();
  const { slug } = state.data;
  const dispatch = useDispatch();

  // Запрос статьи по slug
  const { data, error, isLoading } = useGetArticleBySlugQuery(slug);

  // Сохраняем статью в Redux
  useEffect(() => {
    if (data) {
      dispatch(setCurrentArticle(data.article));
    }
  }, [dispatch, data]);

  const currentArticle = useSelector(state => state.article.currentArticle);
  const currentUser = useSelector(state => state.auth?.user?.username);

  if (isLoading) {
    return <div>Загрузка статьи...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error.message || 'Неизвестная ошибка'}</div>;
  }

  if (!currentArticle) {
    return <div>Статья не найдена.</div>;
  }

  const {
    title,
    description,
    body,
    updatedAt,
    tagList,
    author = {},
    favorited,
  } = currentArticle;
  const { username, image } = author;

  return (
    <article className="article-card article_opened">
      <ArticleHeader slug={slug} title={title} favorited={favorited} />
      {renderTags(tagList)}
      <Text
        className="card-text"
        whiteSpace="break-spaces"
        ellipsis
        variant="caption-2"
      >
        {capitalizeFirstLetter(description)}
      </Text>
      <ReactMarkdown className="card__body_text">
        {capitalizeFirstLetter(body)}
      </ReactMarkdown>
      <User
        className="card-user"
        avatar={{ imgUrl: image, loading: 'eager' }}
        name={username}
        description={formatDate(updatedAt)}
        size="l"
      />
      {currentUser === username && (
        <ExtraButtons slug={slug} data={currentArticle} />
      )}
    </article>
  );
};

export default OpenedArticle;
