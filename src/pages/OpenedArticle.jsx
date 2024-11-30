import '@styles/OpenedArticle.less';
import { Heart } from '@gravity-ui/icons';
import { Label, Text, User } from '@gravity-ui/uikit';
import { useLocation, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { randomColorTags } from '@utils/cardFunctions.js';
import { useEffect, useRef } from 'react';

export default function OpenedArticle() {
  const { state } = useLocation();
  const data = state?.data;
  const cardRef = useRef(null); // Ссылка на карточку
  const navigate = useNavigate();

  const {
    slug,
    title,
    description,
    body,
    updatedAt,
    tagList = [],
    favorited,
    favoritesCount,
    author = {},
  } = data || {};

  const { username, image } = author;

  const randomColorTags = tag => {
    const colors = [
      'utility',
      'success',
      'info',
      'warning',
      'unknown',
      'danger',
      'normal',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const formatDate = dateUp =>
    new Date(dateUp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleOutsideClick = event => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      navigate(-1); // Возврат на предыдущую страницу
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <article className="article-card article_opened" ref={cardRef}>
      <section className="section-title">
        <h5 className="article-title">
          {title[0].toUpperCase() + title.slice(1)}
        </h5>
        <Heart className="like" />
      </section>
      <ul className="tag-list">
        {tagList.length > 0
          ? tagList.map(tag =>
              tag !== undefined ? (
                <li key={tag}>
                  <Label
                    className="tag"
                    theme={randomColorTags(tag)}
                    children={tag[0]?.toUpperCase() + tag.slice(1)}
                  />
                </li>
              ) : null,
            )
          : null}
      </ul>
      <Text
        className="card-text"
        whiteSpace="break-spaces"
        ellipsis={true}
        variant="caption-2"
      >
        {description[0].toUpperCase() + description.slice(1)}
      </Text>
      <ReactMarkdown className="card__body_text">
        {body
          ? body[0].toUpperCase() + body.slice(1)
          : 'Содержимое отсутствует.'}
      </ReactMarkdown>
      <User
        className="card-user"
        avatar={{ imgUrl: image, loading: 'eager' }}
        name={username[0].toUpperCase() + username.slice(1)}
        description={formatDate(updatedAt)}
        size="l"
      />
    </article>
  );
}
