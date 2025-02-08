import React, { useCallback, useMemo } from 'react';
import { Pagination, Skeleton } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard';
import { useGetArticlesQuery } from '@services/ConduitAPI';
import '@styles/ArticlesList.less';

const ArticlesList = React.memo(() => {
  const pageSize = 5;
  const [page, setPage] = React.useState(1);

  const offset = useMemo(() => (page - 1) * pageSize, [page]);

  const { data, error, isLoading } = useGetArticlesQuery({
    limit: pageSize,
    offset,
  });

  const articles = useMemo(() => data?.articles || [], [data]);
  const total = useMemo(() => data?.articlesCount || 0, [data]);

  const handlePageChange = useCallback(newPage => {
    setPage(newPage);
  }, []);

  if (isLoading) {
    return (
      <div>
        {[...Array(pageSize)].map((_, index) => (
          <Skeleton key={index} className="loadingSpin" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <ul className="list">
        {articles.map(article => (
          <ArticleCard key={article.slug} data={article} />
        ))}
      </ul>
      {total > pageSize && (
        <Pagination
          className="pagination"
          page={page}
          pageSize={pageSize}
          total={total}
          compact
          onUpdate={handlePageChange}
        />
      )}
    </>
  );
});

const ErrorMessage = ({ message }) => (
  <div>Ошибка загрузки: {message || 'Неизвестная ошибка'}</div>
);

export default ArticlesList;
