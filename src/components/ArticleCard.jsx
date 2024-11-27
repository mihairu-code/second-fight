import '@styles/ArticleCard.less';
import { Label, Text, User } from '@gravity-ui/uikit';

export default function ArticleCard({ data }) {
  // Деструктуризация входных данных
  const {
    slug,
    title,
    description,
    body,
    createdAt,
    updatedAt,
    tagList = [],
    favorited,
    favoritesCount,
    author = {},
  } = data;

  const { username = 'username', bio, image, following } = author;

  // Функция для случайных цветов тегов (если понадобится)
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
    <li>
      <a className="article-card">
        <h5 className="article-title">
          {title[0].toUpperCase() + title.slice(0)}
        </h5>
        <ul className="tag-list">
          {tagList.map(tag => (
            <li key={tag}>
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
          {body[0].toUpperCase() + body.slice(1)}
        </Text>
        <User
          className="card-user"
          avatar={{ imgUrl: image, loading: 'eager' }}
          name={username[0].toUpperCase() + username.slice(1)}
          description={formatDate(updatedAt)}
          size="l"
        />
      </a>
    </li>
  );
}
