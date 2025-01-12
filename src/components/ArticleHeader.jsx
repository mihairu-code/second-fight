import React, { useState } from 'react';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import {
  capitalizeFirstLetter,
  toggleFavorite,
} from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';

const ArticleHeader = ({ slug, favorited, title }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const handleToggleLike = async e => {
    e.preventDefault();
    await toggleFavorite(
      isFavorited,
      slug,
      favoriteArticle,
      unfavoriteArticle,
      setIsFavorited,
    );
  };

  return (
    <section className="section-title">
      <h5 className="article-title">{capitalizeFirstLetter(title)}</h5>
      <HeartFill
        onClick={handleToggleLike}
        className={`like ${isFavorited ? 'liked' : ''}`}
        stroke="red"
        fill="none"
      />
    </section>
  );
};

export default ArticleHeader;
