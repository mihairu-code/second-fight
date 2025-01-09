import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Button, Popup, Text, User } from '@gravity-ui/uikit';
import { CircleExclamationFill, HeartFill } from '@gravity-ui/icons';
import { useSelector } from 'react-redux';
import {
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { formatDate } from '@utils/cardFunctions';
import {
  capitalizeFirstLetter,
  renderTags,
  toggleFavorite,
} from '@utils/cardFunctions.jsx';

import '@styles/OpenedArticle.less';

const OpenedArticle = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const anchorRef = useRef(null);

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

  const [isFavorited, setIsFavorited] = useState(favorited);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteArticle] = useDeleteArticleMutation();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const currentUser = useSelector(state => state.auth?.user?.username);

  const handleToggleLike = async e => {
    e.preventDefault();
    toggleFavorite(
      isFavorited,
      slug,
      favoriteArticle,
      unfavoriteArticle,
      setIsFavorited,
    );
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate(`/articles?page=${fromPage}`);
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    } finally {
      closePopup();
    }
  };

  return (
    <article className="article-card article_opened">
      <section className="section-title">
        <h5 className="article-title">{capitalizeFirstLetter(title)}</h5>
        <HeartFill
          onClick={handleToggleLike}
          className={`like ${isFavorited ? 'liked' : ''}`}
          stroke="red"
          fill="none"
        />
      </section>
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
        <section className="edit-article">
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

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        anchorRef={anchorRef}
        placement="right"
        hasArrow
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
};

export default OpenedArticle;
