import '@styles/ArticlesList.less';
import React from 'react';
import { Pagination } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard.jsx';

export default function ArticlesList({ articles = [] }) {
  if (!articles.length) {
    return <div>Нет статей для отображения.</div>;
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
        page={1}
        pageSize={100}
        total={1000}
        compact={true}
      />
    </>
  );
}
