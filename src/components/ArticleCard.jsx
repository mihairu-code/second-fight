import React from 'react';
import { Text, User } from '@gravity-ui/uikit';
import { Link } from 'react-router';
import removeMarkdown from 'remove-markdown';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
} from '@utils/cardFunctions';
import '@styles/ArticleCard.less';
import baseAvatar from '@assets/baseAvatar.webp';
import ArticleHeader from '@components/ArticleHeader';

const ArticleCard = React.memo(({ data, currentPage }) => {
  const {
    slug,
    title,
    description,
    body, // Текст статьи
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
    ) ||
    image?.startsWith('https://api.realworld.io/images/smiley-cyrus.jpg')
      ? baseAvatar
      : image;

  const plainTextBody = removeMarkdown(body);

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
        {tagList.length !== 0 && renderTags(tagList, 'ArticleCard')}
        <Text
          className="card-text"
          whiteSpace="break-spaces"
          ellipsis
          variant="caption-2"
        >
          {capitalizeFirstLetter(description)}
        </Text>
        <Text
          className="card-body"
          whiteSpace="nowrap"
          ellipsis
          variant="body-2"
        >
          {capitalizeFirstLetter(plainTextBody)}
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
});

export default ArticleCard;
