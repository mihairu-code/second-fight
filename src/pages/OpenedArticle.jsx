import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Card, Spin, Text, User } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentArticle } from '@store/articleSlice';
import { useGetArticleBySlugQuery } from '@services/ConduitAPI';
import {
  capitalizeFirstLetter,
  formatDate,
  renderTags,
} from '@utils/cardFunctions';
import '@styles/OpenedArticle.less';
import ArticleHeader from '@components/ArticleHeader';
import ExtraButtons from '@components/ExtraButtons';

const OpenedArticle = React.memo(() => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetArticleBySlugQuery(slug, {
    skip: useSelector(state => state.article.currentArticle?.slug === slug),
  });

  const currentArticle = useSelector(state => state.article.currentArticle);
  const currentUser = useSelector(state => state.auth?.user?.username);

  useEffect(() => {
    if (data && data.article && data.article.slug !== currentArticle?.slug) {
      dispatch(setCurrentArticle(data.article));
    }
  }, [dispatch, data, currentArticle]);

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

  if (!currentArticle) {
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
  } = currentArticle;
  let { username, image } = author;
  image =
    !image || !image.startsWith('http')
      ? 'https://kartinki.pics/pics/uploads/posts/2022-09/thumbs/1662497028_1-kartinkin-net-p-ochen-legkie-risunki-pinterest-1.jpg'
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
        <ExtraButtons slug={slug} data={currentArticle} />
      )}
    </article>
  );
});

export default OpenedArticle;
