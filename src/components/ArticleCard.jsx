import React, { useState } from 'react';
import { Label, Text, User } from '@gravity-ui/uikit';
import { HeartFill } from '@gravity-ui/icons';
import { Link } from 'react-router';

import '@styles/ArticleCard.less';
import { formatDate, randomColorTags } from '@utils/cardFunctions';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';

export default function ArticleCard({ data = {}, currentPage }) {
  const {
    slug = '',
    title = 'No title',
    description = '',
    createdAt,
    updatedAt,
    tagList = [],
    author = {},
    favorited = false, // начальное состояние из пропсов
  } = data;

  const { username = 'Username', image = '' } = author;

  const [isFavorited, setIsFavorited] = useState(favorited);
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const toggleLike = async e => {
    e.preventDefault(); // Чтобы клик не открывал статью

    try {
      if (isFavorited) {
        await unfavoriteArticle(slug);
      } else {
        await favoriteArticle(slug);
      }
      setIsFavorited(!isFavorited); // Обновляем состояние
    } catch (error) {
      console.error('Ошибка лайка:', error);
    }
  };

  return (
    <li key={slug}>
      <Link
        to={`/articles/${slug}`}
        state={{ data, fromPage: currentPage }}
        className="article-card"
      >
        <section className="section-title">
          <h5 className="article-title">
            {title !== ''
              ? title[0]?.toUpperCase() + title.slice(1)
              : 'No title'}
          </h5>
          <HeartFill
            onClick={toggleLike}
            className={`like ${isFavorited ? 'liked' : ''}`} // Класс для стилизации
            stroke="red"
            fill="none"
          />
        </section>
        <ul className="tag-list">
          {tagList.map((tag, index) =>
            tag !== '' ? (
              <li key={index}>
                <Label
                  className="tag"
                  theme={randomColorTags(tag)}
                  children={tag[0]?.toUpperCase() + tag.slice(1)}
                />
              </li>
            ) : null,
          )}
        </ul>
        <Text
          className="card-text"
          whiteSpace="break-spaces"
          ellipsis
          variant="caption-2"
        >
          {description !== ''
            ? description[0]?.toUpperCase() + description.slice(1)
            : 'No text'}
        </Text>
        <User
          className="card-user"
          avatar={{ imgUrl: image, loading: 'eager' }}
          name={username[0]?.toUpperCase() + username.slice(1)}
          description={formatDate(updatedAt || createdAt)}
          size="l"
        />
      </Link>
    </li>
  );
}
