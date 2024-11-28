import '@styles/ArticleCard.less';
import { Label, Text, User } from '@gravity-ui/uikit';
import { Heart } from '@gravity-ui/icons';
import { Link } from 'react-router';

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
  } = data || {};

  if (!data) {
    return <div>Loading...</div>; // Показываем сообщение о загрузке
  }

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
      <Link to={`/articles/${slug}`} state={{ data }} className="article-card">
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
        <User
          className="card-user"
          avatar={{ imgUrl: image, loading: 'eager' }}
          name={username[0].toUpperCase() + username.slice(1)}
          description={formatDate(updatedAt)}
          size="l"
        />
      </Link>
    </li>
  );
}
