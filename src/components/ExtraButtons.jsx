import { Button, Popup } from '@gravity-ui/uikit';
import React, { useRef, useState } from 'react';
import { CircleExclamationFill } from '@gravity-ui/icons';
import { useDeleteArticleMutation } from '@services/ConduitAPI.js';
import { useNavigate } from 'react-router';

const ExtraButtons = ({ slug, data }) => {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteArticle] = useDeleteArticleMutation();
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate('/articles');
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    } finally {
      closePopup();
    }
  };

  return (
    <>
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
            Вы уверены, что хотите удалить эту статью ?
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
    </>
  );
};

export default ExtraButtons;
