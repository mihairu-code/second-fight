import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Button, Label, Popup, Text, User } from '@gravity-ui/uikit';
import { CircleExclamationFill, HeartFill } from '@gravity-ui/icons';
import { useSelector } from 'react-redux';

import '@styles/OpenedArticle.less';
import { formatDate, randomColorTags } from '@utils/cardFunctions';
import useOnClickOutside from '../../hooks/useOnClickOutside.jsx';
import {
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';

export default function OpenedArticle() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const anchorRef = useRef(null); // Реф для привязки Popup

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
    favorited = false,
  } = data;

  const { username = 'Unknown', image = '' } = author;

  // Локальное состояние для лайка и popup
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // RTK Query мутации
  const [deleteArticle] = useDeleteArticleMutation();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const currentUser = useSelector(state => state.auth?.user?.username);

  // Открытие popup
  const openPopup = () => setIsPopupOpen(true);

  // Закрытие popup
  const closePopup = () => setIsPopupOpen(false);

  // Удаление статьи после подтверждения
  const handleDelete = async () => {
    try {
      await deleteArticle({ slug }).unwrap();
      navigate(`/articles?page=${fromPage}`);
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    } finally {
      closePopup();
    }
  };

  const toggleLike = async e => {
    e.preventDefault();

    try {
      if (isFavorited) {
        await unfavoriteArticle({ slug }).unwrap();
      } else {
        await favoriteArticle({ slug }).unwrap();
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Ошибка лайка:', error);
    }
  };

  useOnClickOutside(cardRef, () => navigate(`/articles?page=${fromPage}`));

  return (
    <article className="article-card article_opened" ref={cardRef}>
      <section className="section-title">
        <h5 className="article-title">
          {title[0]?.toUpperCase() + title.slice(1)}
        </h5>
        <HeartFill
          className={`like ${isFavorited ? 'liked' : ''}`}
          onClick={toggleLike}
          stroke="red"
          fill="none"
        />
      </section>
      <ul className="tag-list">
        {tagList.length > 0
          ? tagList.map((tag, index) =>
              tag !== '' ? (
                <li key={index}>
                  <Label className="tag" theme={randomColorTags(tag)}>
                    {tag[0]?.toUpperCase() + tag.slice(1)}
                  </Label>
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
        name={username}
        description={formatDate(updatedAt)}
        size="l"
      />

      {currentUser === username && (
        <section className="edit-article">
          {/* Кнопка удаления с привязкой Popup */}
          <Button ref={anchorRef} onClick={openPopup} view="outlined-danger">
            Удалить
          </Button>
          <Button
            onClick={() =>
              navigate(`/articles/edit/${slug}`, { state: { data } })
            }
            view="outlined-success"
          >
            Редактировать
          </Button>
        </section>
      )}

      {/* Popup подтверждения удаления */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        anchorRef={anchorRef} // Привязываем к кнопке "Удалить"
        placement="right" // Popup появляется снизу
        hasArrow // Добавляем стрелочку
        className="popup-delete"
      >
        <div className="popup-content">
          <CircleExclamationFill className="exlamation-sign" />
          <p className="popup-text">
            Вы уверены, что хотите удалить эту статью?
          </p>
          <div className="popup-actions">
            <Button onClick={closePopup} view="outlined">
              Нет
            </Button>
            <Button className="del-button" onClick={handleDelete} view="action">
              Да
            </Button>
          </div>
        </div>
      </Popup>
    </article>
  );
}
