import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Button, Label, Text, User } from '@gravity-ui/uikit';
import { Heart } from '@gravity-ui/icons';

import '@styles/OpenedArticle.less';
import { formatDate, randomColorTags } from '@utils/cardFunctions';
import useOnClickOutside from '../../hooks/useOnClickOutside.jsx';
import { useDeleteArticleMutation } from '@services/ConduitAPI.js';
import { useSelector } from 'react-redux';

export default function OpenedArticle() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Получение данных из state (предусмотрено значение по умолчанию)
  const {
    data = {},
    fromPage = 1, // Номер страницы для возврата
  } = state || {};

  const {
    slug,
    title = 'No title',
    description = '',
    body = 'No content available.',
    updatedAt,
    tagList = [],
    author = {},
  } = data;

  const { username = 'Unknown', image = '' } = author;

  // Хук для обработки кликов вне статьи
  useOnClickOutside(cardRef, () => navigate(`/articles?page=${fromPage}`));

  const currentUser = useSelector(state => state.auth?.user?.username);

  const [deleteArticle] = useDeleteArticleMutation();

  // Обработчик удаления
  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate(`/articles?page=${fromPage}`); // Возвращаемся на страницу со статьями
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/articles/edit/${slug}`, { state: { data } });
  };

  return (
    <article className="article-card article_opened" ref={cardRef}>
      <section className="section-title">
        <h5 className="article-title">
          {title[0]?.toUpperCase() + title.slice(1)}
        </h5>
        <Heart className="like" />
      </section>
      <ul className="tag-list">
        {tagList.length > 0
          ? tagList.map((tag, index) =>
              tag !== '' ? (
                <li key={index}>
                  <Label
                    className="tag"
                    theme={randomColorTags(tag)}
                    children={tag[0]?.toUpperCase() + tag.slice(1)}
                  />
                </li>
              ) : null,
            )
          : 'No tags'}
      </ul>
      <Text
        className="card-text"
        whiteSpace="break-spaces"
        ellipsis
        variant="caption-2"
      >
        {description[0]?.toUpperCase() + description.slice(1)}
      </Text>
      <ReactMarkdown className="card__body_text">
        {body[0]?.toUpperCase() + body.slice(1)}
      </ReactMarkdown>
      <User
        className="card-user"
        avatar={{ imgUrl: image, loading: 'eager' }}
        name={username[0]?.toUpperCase() + username.slice(1)}
        description={formatDate(updatedAt)}
        size="l"
      />
      {currentUser === username && (
        <section className="edit-article">
          <Button onClick={handleDelete} view="outlined-danger">
            Удалить
          </Button>
          <Button onClick={handleEdit} view="outlined-success">
            Редактировать
          </Button>
        </section>
      )}
    </article>
  );
}
