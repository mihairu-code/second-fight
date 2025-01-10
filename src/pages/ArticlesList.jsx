import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router'; // Исправлен импорт
import { Pagination, Skeleton } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard';
import '@styles/ArticlesList.less';
import { useGetArticlesQuery } from '@services/ConduitAPI';

export default function ArticlesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 5;
  const offset = useMemo(() => (page - 1) * pageSize, [page]);

  const { data, error, isLoading } = useGetArticlesQuery(
    useMemo(() => ({ limit: pageSize, offset }), [offset]),
  );

  const articles = useMemo(() => data?.articles || [], [data]);
  const total = useMemo(() => data?.articlesCount || 0, [data]);

  const handlePageChange = useCallback(
    newPage => setSearchParams({ page: newPage }),
    [setSearchParams],
  );

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
          <ArticleCard key={article.slug} data={article} currentPage={page} />
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
}

const ErrorMessage = ({ message }) => (
  <div>Ошибка загрузки: {message || 'Неизвестная ошибка'}</div>
);
