import React from 'react';
import { Text, User } from '@gravity-ui/uikit';
import { Link } from 'react-router';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
} from '@utils/cardFunctions';
import '@styles/ArticleCard.less';
import ArticleHeader from '@components/ArticleHeader';
import baseAvatar from '@assets/base_avatar.jpg';

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
    favoritesCount,
  } = data;
  let { username, image } = author;
  image =
    !image ||
    !image?.startsWith('http') ||
    image?.startsWith(
      'https://static.productionready.io/images/smiley-cyrus.jpg',
    )
      ? baseAvatar
      : image;

  return (
    <li key={slug}>
      <Link
        to={`/articles/${slug}`}
        state={{ data, fromPage: currentPage }}
        className="article-card"
      >
        <ArticleHeader
          favorited={favorited}
          favoritesCount={favoritesCount}
          slug={slug}
          title={title}
          component={ArticleCard}
        />
        {renderTags(tagList, 'ArticleCard')}
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
