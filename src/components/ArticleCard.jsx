import React from 'react';
import { Label, Text, User } from '@gravity-ui/uikit';
import { Heart } from '@gravity-ui/icons';
import { Link } from 'react-router';

import '@styles/ArticleCard.less';
import { formatDate, randomColorTags } from '@utils/cardFunctions';

export default function ArticleCard({ data = {}, currentPage }) {
  const {
    slug = '',
    title = 'No title',
    description = '',
    createdAt,
    updatedAt,
    tagList = [],
    author = {},
  } = data;

  const { username = 'Username', image = '' } = author;

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
          <Heart className="like" />
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
