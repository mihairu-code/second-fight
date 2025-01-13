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

  return (
    <li key={slug}>
      <Link
        to={`/articles/${slug}`}
        state={{ data, fromPage: currentPage }}
        className="article-card"
      >
        <ArticleHeader favorited={favorited} slug={slug} title={title} />
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
