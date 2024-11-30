import '@styles/ArticlesList.less';
import React from 'react';
import { Pagination, Skeleton } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard.jsx';
import { useGetArticlesQuery } from '@services/ConduitAPI.js';
import { useSearchParams } from 'react-router';

export default function ArticlesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 5; // Количество статей на страницу
  const offset = (page - 1) * pageSize; // Вычисление сдвига для запроса

  const { data, error, isLoading } = useGetArticlesQuery({
    limit: pageSize,
    offset,
  });
  const articles = data ? data.articles : [];
  const total = data ? data.articlesCount : 0; // Общее количество статей

  if (isLoading) {
    return (
      <div>
        {[...Array(pageSize)].map((_, index) => (
          <Skeleton key={index} className="loadingSpin" />
        ))}
      </div>
    );
  }

  if (!isLoading && articles.length === 0) {
    return <div>Статей нет.</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error.message}</div>;
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
        compact={true}
        onUpdate={newPage => {
          setSearchParams({ page: newPage });
        }}
      />
    </>
  );
}
