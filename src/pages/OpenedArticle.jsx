import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Card, Spin, Text, User } from '@gravity-ui/uikit';
import { useGetArticleBySlugQuery } from '@services/ConduitAPI';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
} from '@utils/cardFunctions';
import '@styles/OpenedArticle.less';
import ArticleHeader from '@components/ArticleHeader';
import ExtraButtons from '@components/ExtraButtons';
import baseAvatar from '@assets/baseAvatar.webp';
import { useSelector } from 'react-redux';

const OpenedArticle = React.memo(() => {
  const { slug } = useParams();
  const { data, error, isLoading, refetch } = useGetArticleBySlugQuery(slug);

  const currentUser = useSelector(state => state.auth?.user?.username);

  useEffect(() => {
    refetch();
  }, [slug, refetch]);

  if (isLoading) {
    return <Spin size="xl" className="loadingSpin" />;
  }

  if (error) {
    return (
      <Card theme="danger" className="card__message">
        Ошибка загрузки: {error.message || 'Неизвестная ошибка'}
      </Card>
    );
  }

  if (!data?.article) {
    return <Card theme="info">Статья не найдена.</Card>;
  }

  const {
    title,
    description,
    body,
    updatedAt,
    tagList,
    author = {},
    favorited,
    favoritesCount,
  } = data.article;
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

  return (
    <article className="article-card article_opened">
      <ArticleHeader
        slug={slug}
        title={title}
        favorited={favorited}
        favoritesCount={favoritesCount}
      />
      {tagList.length !== 0 && renderTags(tagList, 'OpenedArticle')}
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
        <ExtraButtons slug={slug} data={data.article} />
      )}
    </article>
  );
});

export default OpenedArticle;
