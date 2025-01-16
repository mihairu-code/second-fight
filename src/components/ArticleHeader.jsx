import React, { useCallback } from 'react';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { capitalizeFirstLetter } from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';

const ArticleHeader = ({ slug, favorited, favoritesCount, title, refetch }) => {
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
      } else {
        await favoriteArticle(slug);
      }
      refetch();
    } catch (error) {
      console.error('Ошибка при изменении лайка:', error);
    }
  };

  return (
    <section className="section-title">
      <h5 className="article-title">{capitalizeFirstLetter(title)}</h5>
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
