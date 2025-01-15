import React from 'react';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { capitalizeFirstLetter } from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';

const ArticleHeader = ({ slug, favorited, title, refetch }) => {
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
      <HeartFill
        onClick={handleToggleLike}
        className={`like ${favorited ? 'liked' : ''}`}
        stroke="red"
        fill="none"
      />
    </section>
  );
};

export default ArticleHeader;
