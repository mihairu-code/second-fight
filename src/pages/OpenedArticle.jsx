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
  const fromPage = state?.fromPage || 1; // Номер страницы, откуда была открыта карточка
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const {
    title,
    description,
    body,
    updatedAt,
    tagList = [],
    author = {},
  } = data || {};

  const { username, image } = author;

  const handleOutsideClick = event => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      navigate(`/articles?page=${fromPage}`); // Возврат на нужную страницу
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
          {title[0]?.toUpperCase() + title.slice(1)}
        </h5>
        <Heart className="like" />
      </section>
      <ul className="tag-list">
        {tagList.map(tag => (
          <li key={tag}>
            <Label
              className="tag"
              theme={randomColorTags(tag)}
              children={tag[0]?.toUpperCase() + tag.slice(1)}
            />
          </li>
        ))}
      </ul>
      <Text
        className="card-text"
        whiteSpace="break-spaces"
        ellipsis={true}
        variant="caption-2"
      >
        {description[0]?.toUpperCase() + description.slice(1)}
      </Text>
      <ReactMarkdown className="card__body_text">
        {body
          ? body[0].toUpperCase() + body.slice(1)
          : 'Содержимое отсутствует.'}
      </ReactMarkdown>
      <User
        className="card-user"
        avatar={{ imgUrl: image, loading: 'eager' }}
        name={username[0]?.toUpperCase() + username.slice(1)}
        description={new Date(updatedAt).toLocaleDateString()}
        size="l"
      />
    </article>
  );
}
