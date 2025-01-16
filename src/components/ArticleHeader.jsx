import React from 'react';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { capitalizeFirstLetter } from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';

const ArticleHeader = ({ slug, favorited, favoritesCount, title, refetch }) => {
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const handleToggleLike = async e => {
    e.preventDefault();
    try {
      if (favorited) {
        await unfavoriteArticle(slug);
      } else {
        await favoriteArticle(slug);
      }
      refetch();
    } catch (error) {
      console.error('Ошибка лайка:', error);
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
