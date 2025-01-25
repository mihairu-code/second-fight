import React, { useCallback } from 'react';
import {
  ConduitAPI,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { capitalizeFirstLetter } from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@gravity-ui/uikit';

const ArticleHeader = ({
  slug,
  favorited,
  favoritesCount,
  title,
  component,
}) => {
  const dispatch = useDispatch();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();
  // eslint-disable-next-line no-undef
  const token = localStorage.getItem('auth');

  const showToast = useCallback((name, title, content, theme = 'info') => {
    toaster.add({
      name,
      title,
      content,
      theme,
      autoHiding: 5000,
    });
  }, []);

  const handleToggleLike = async e => {
    e.preventDefault();

    if (!token) {
      showToast(
        'consent-error',
        'Оповещение',
        'Необходимо авторизоваться',
        'info',
        'Зарегистрироваться', // Текст кнопки
      );
      return;
    }

    try {
      if (favorited) {
        await unfavoriteArticle(slug);
        dispatch(
          ConduitAPI.util.updateQueryData(
            'getArticles',
            { limit: 5, offset: 0 },
            draft => {
              const article = draft.articles.find(a => a.slug === slug);
              if (article) {
                article.favorited = false;
                article.favoritesCount -= 1;
              }
            },
          ),
        );
      } else {
        await favoriteArticle(slug);
        dispatch(
          ConduitAPI.util.updateQueryData(
            'getArticles',
            { limit: 5, offset: 0 },
            draft => {
              const article = draft.articles.find(a => a.slug === slug);
              if (article) {
                article.favorited = true;
                article.favoritesCount += 1;
              }
            },
          ),
        );
      }
    } catch (error) {
      console.error('Ошибка при изменении лайка:', error);
    }
  };

  return (
    <section className="section-title">
      <Tooltip content={capitalizeFirstLetter(title)} placement="top">
        <h5 className={`article-title ${component && 'article-title__card'}`}>
          {capitalizeFirstLetter(title)}
        </h5>
      </Tooltip>
      <div className="like-container" onClick={handleToggleLike}>
        <HeartFill
          className={`like ${favorited ? 'liked' : ''}`}
          stroke="red"
          fill="none"
        />
        <span className="favorites-count">{favoritesCount}</span>
      </div>
    </section>
  );
};

export default ArticleHeader;
