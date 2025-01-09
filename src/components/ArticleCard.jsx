import React, { useState } from 'react';
import { Text, User } from '@gravity-ui/uikit';
import { HeartFill } from '@gravity-ui/icons';
import { Link } from 'react-router';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
  toggleFavorite,
} from '@utils/cardFunctions.jsx';

import '@styles/ArticleCard.less';

const ArticleCard = ({ data = {}, currentPage }) => {
  const {
    slug,
    title,
    description,
    createdAt,
    updatedAt,
    tagList,
    author = {},
    favorited,
  } = data;
  const { username, image } = author;

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
    <li key={slug}>
      <Link
        to={`/articles/${slug}`}
        state={{ data, fromPage: currentPage }}
        className="article-card"
      >
        <section className="section-title">
          <h5 className="article-title">{capitalizeFirstLetter(title)}</h5>
          <HeartFill
            onClick={handleToggleLike}
            className={`like ${isFavorited ? 'liked' : ''}`}
            stroke="red"
            fill="none"
          />
        </section>
        {renderTags(tagList)}
        <Text
          className="card-text"
          whiteSpace="break-spaces"
          ellipsis
          variant="caption-2"
        >
          {capitalizeFirstLetter(description)}
        </Text>
        <User
          className="card-user"
          avatar={{ imgUrl: image, loading: 'eager' }}
          name={username}
          description={formatDate(updatedAt || createdAt)}
          size="l"
        />
      </Link>
    </li>
  );
};

export default ArticleCard;
