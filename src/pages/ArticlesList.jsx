import '@styles/ArticlesList.less';
import React, { useState } from 'react';
import { Pagination } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard.jsx';
import { useGetArticlesQuery } from '@services/ConduitAPI.js';

export default function ArticlesList() {
  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 5; // Количество статей на страницу
  const offset = (page - 1) * pageSize; // Вычисление сдвига для запроса

  const { data, error, isLoading } = useGetArticlesQuery({
    limit: pageSize,
    offset,
  });
  const articles = data ? data.articles : [];
  const total = data ? data.articlesCount : 0; // Общее количество статей

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error.message}</div>;
  }

  return (
    <>
      <ul className="list">
        {articles.map((article, index) => (
          <ArticleCard key={index} data={article} />
        ))}
      </ul>
      <Pagination
        className="pagination"
        page={page}
        pageSize={pageSize}
        total={total}
        compact={true}
        onUpdate={newPage => setPage(newPage)} // Обновление текущей страницы
      />
    </>
  );
}
