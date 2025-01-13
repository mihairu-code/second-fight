import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Skeleton } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard';
import { useGetArticlesQuery } from '@services/ConduitAPI';
import { setPage } from '@store/articleSlice.js';

import '@styles/ArticlesList.less';

export default function ArticlesList() {
  const dispatch = useDispatch();
  const page = useSelector(state => state.article.page);
  const pageSize = 5;
  const offset = useMemo(() => (page - 1) * pageSize, [page]);

  const { data, error, isLoading } = useGetArticlesQuery(
    useMemo(() => ({ limit: pageSize, offset }), [offset]),
  );

  const articles = useMemo(() => data?.articles || [], [data]);
  const total = useMemo(() => data?.articlesCount || 0, [data]);

  const handlePageChange = useCallback(
    newPage => {
      dispatch(setPage(newPage));
    },
    [dispatch],
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
}

const ErrorMessage = ({ message }) => (
  <div>Ошибка загрузки: {message || 'Неизвестная ошибка'}</div>
);
