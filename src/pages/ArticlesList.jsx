import '@styles/ArticlesList.less';
import React from 'react';
import { Pagination } from '@gravity-ui/uikit';
import ArticleCard from '@components/ArticleCard.jsx';

export default function ArticlesList({ articles }) {
  return (
    <>
      <section className="list">
        {articles.map((article, index) => (
          <ArticleCard key={index} data={article} />
        ))}
      </section>
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
