import Header from '@components/Header.jsx';
import { useGetArticlesQuery } from '@services/ConduitAPI.js';
import { Skeleton } from '@gravity-ui/uikit';

import './styles/App.less';
import ArticlesList from '@pages/ArticlesList.jsx';

export function App() {
  const { error, isLoading, data } = useGetArticlesQuery({
    limit: 5,
    offset: 0,
  });
  const articles = data ? data['articles'] : [];

  console.log(data, error, isLoading);

  return (
    <>
      <Header />
      <main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {isLoading ? (
          <Skeleton className="loadingSpin" />
        ) : error ? (
          <div>Ошибка загрузки: {error.message}</div>
        ) : null}
        <ArticlesList articles={articles} />
      </main>
    </>
  );
}
