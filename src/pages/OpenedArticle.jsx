import '@styles/OpenedArticle.less';
import { Heart } from '@gravity-ui/icons';
import { Label, Text, User } from '@gravity-ui/uikit';
import { useLocation } from 'react-router';

export default function OpenedArticle() {
  const { state } = useLocation();
  const data = state?.data;

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

  return (
    <article className="article-card article_opened">
      <section className="section-title">
        <h5 className="article-title">
          {title[0].toUpperCase() + title.slice(1)}
        </h5>
        <Heart className="like" />
      </section>
      <ul className="tag-list">
        {tagList.map(tag => (
          <li key={tag + Math.random() * 10000}>
            <Label
              className="tag"
              theme={randomColorTags(tag)}
              children={tag[0].toUpperCase() + tag.slice(1)}
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
        {description[0].toUpperCase() + description.slice(1)}
      </Text>
      <Text
        className="card__body_text"
        whiteSpace="break-spaces"
        ellipsis={false}
        variant="caption-2"
      >
        {body[0].toUpperCase() + body.slice(1)}
      </Text>
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
