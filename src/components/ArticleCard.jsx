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
import { useGetArticlesQuery } from '@services/ConduitAPI.js';

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
  const {
    username,
    image = 'https://99px.ru/sstorage/1/2016/08/image_11308161654431723981.jpg',
  } = author;
  const { refetch } = useGetArticlesQuery({ limit: 5, offset: 0 });
  const avatarUrl = image?.startsWith('https') ? image : baseAvatar;

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
          refetch={refetch}
        />
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
          avatar={{ imgUrl: avatarUrl, loading: 'eager' }}
          name={username}
          description={formatDate(updatedAt || createdAt)}
          size="l"
        />
      </Link>
    </li>
  );
};

export default ArticleCard;
