import '@styles/ArticleCard.less';
import { Label, Text, User } from '@gravity-ui/uikit';
import { Heart } from '@gravity-ui/icons';
import { Link } from 'react-router';
import { formatDate, randomColorTags } from '@utils/cardFunctions.js';

export default function ArticleCard({ data }) {
  if (!data) {
    return <div>Loading...</div>; // Безопасная проверка входных данных
  }

  // Деструктуризация входных данных с установкой значений по умолчанию
  const {
    slug = '',
    title = 'Без названия',
    description = '',
    createdAt,
    updatedAt,
    tagList = [],
    author = {},
  } = data;

  const { username = 'username', image = '' } = author;

  return (
    <li>
      <Link to={`/articles/${slug}`} state={{ data }} className="article-card">
        <section className="section-title">
          <h5 className="article-title">
            {title[0]?.toUpperCase() + title.slice(1)}
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
          {description
            ? description[0]?.toUpperCase() + description.slice(1)
            : 'Описание отсутствует'}
        </Text>
        <User
          className="card-user"
          avatar={{ imgUrl: image, loading: 'eager' }}
          name={username[0]?.toUpperCase() + username.slice(1)}
          description={formatDate(updatedAt || createdAt)}
          size="l"
        />
      </Link>
    </li>
  );
}
