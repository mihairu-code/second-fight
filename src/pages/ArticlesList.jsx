import React from 'react';
import { useSearchParams } from 'react-router';
import { Pagination, Skeleton } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard';
import '@styles/ArticlesList.less';
import { useGetArticlesQuery } from '@services/ConduitAPI';

export default function ArticlesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const { data, error, isLoading } = useGetArticlesQuery({
    limit: pageSize,
    offset,
  });

  const articles = data?.articles || [];
  const total = data?.articlesCount || 0;

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} className="loadingSpin" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Ошибка загрузки: {error.message || 'Неизвестная ошибка'}</div>;
  }

  if (!articles.length) {
    return <div>Статей нет.</div>;
  }

  return (
    <>
      <ul className="list">
        {articles.map(article => (
          <ArticleCard key={article.slug} data={article} currentPage={page} />
        ))}
      </ul>
      <Pagination
        className="pagination"
        page={page}
        pageSize={pageSize}
        total={total}
        compact
        onUpdate={newPage => setSearchParams({ page: newPage })}
      />
    </>
  );
}
