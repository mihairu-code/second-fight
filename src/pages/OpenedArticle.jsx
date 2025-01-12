import React from 'react';
import { useLocation } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Text, User } from '@gravity-ui/uikit';
import { useSelector } from 'react-redux';
import { formatDate } from '@utils/cardFunctions';
import { capitalizeFirstLetter, renderTags } from '@utils/cardFunctions.jsx';

import '@styles/OpenedArticle.less';
import ArticleHeader from '@components/ArticleHeader.jsx';
import ExtraButtons from '@components/ExtraButtons.jsx';

const OpenedArticle = () => {
  const { state } = useLocation();

  const { data = {}, fromPage = 1 } = state || {};
  const {
    slug,
    title,
    description,
    body,
    updatedAt,
    tagList,
    author = {},
    favorited,
  } = data;
  const { username, image } = author;

  const currentUser = useSelector(state => state.auth?.user?.username);

  return (
    <article className="article-card article_opened">
      <ArticleHeader slug={slug} title={title} favorited={favorited} />
      {renderTags(tagList)}
      <Text
        className="card-text"
        whiteSpace="break-spaces"
        ellipsis
        variant="caption-2"
      >
        {capitalizeFirstLetter(description)}
      </Text>
      <ReactMarkdown className="card__body_text">
        {capitalizeFirstLetter(body)}
      </ReactMarkdown>
      <User
        className="card-user"
        avatar={{ imgUrl: image, loading: 'eager' }}
        name={username}
        description={formatDate(updatedAt)}
        size="l"
      />
      {currentUser === username && (
        <ExtraButtons slug={slug} fromPage={fromPage} data={data} />
      )}
    </article>
  );
};

export default OpenedArticle;
