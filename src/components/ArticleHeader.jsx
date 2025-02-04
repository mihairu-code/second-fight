import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ConduitAPI,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI.js';
import { capitalizeFirstLetter } from '@utils/cardFunctions.jsx';
import { HeartFill } from '@gravity-ui/icons';
import '@styles/ArticleCard.less';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { Tooltip } from '@gravity-ui/uikit';

const ArticleHeader = React.memo(
  ({ favorited, favoritesCount, slug, title, component }) => {
    const dispatch = useDispatch();
    // eslint-disable-next-line no-undef
    const token = localStorage.getItem('auth');

    const [favoriteArticle] = useFavoriteArticleMutation();
    const [unfavoriteArticle] = useUnfavoriteArticleMutation();

    const showToast = useCallback((name, title, content, theme = 'info') => {
      toaster.add({
        name,
        title,
        content,
        theme,
        autoHiding: 5000,
      });
    }, []);

    const handleToggleLike = async e => {
      e.preventDefault();

      if (!token) {
        showToast(
          'consent-error',
          'Оповещение',
          'Необходимо авторизоваться',
          'info',
          'Зарегистрироваться',
        );
        return;
      }

      try {
        const action = favorited ? unfavoriteArticle : favoriteArticle;
        await action(slug);

        dispatch(
          ConduitAPI.util.updateQueryData('getArticleBySlug', slug, draft => {
            if (draft?.article) {
              draft.article.favorited = !favorited;
              draft.article.favoritesCount += favorited ? -1 : 1;
            }
          }),
        );

        dispatch(
          ConduitAPI.util.updateQueryData(
            'getArticles',
            { limit: 5, offset: 0 },
            draft => {
              const article = draft.articles.find(a => a.slug === slug);
              if (article) {
                article.favorited = !favorited;
                article.favoritesCount += favorited ? -1 : 1;
              }
            },
          ),
        );
      } catch (error) {
        console.error('Ошибка при изменении лайка:', error);
      }
    };

    return (
      <section className="section-title">
        <Tooltip content={capitalizeFirstLetter(title)} placement="top">
          <h5 className={`article-title ${component && 'article-title__card'}`}>
            {capitalizeFirstLetter(title)}
          </h5>
        </Tooltip>
        <div className="like-container" onClick={handleToggleLike}>
          <HeartFill
            className={`like ${favorited ? 'liked' : ''}`}
            stroke="red"
            fill="none"
          />
          <span className="favorites-count">{favoritesCount}</span>
        </div>
      </section>
    );
  },
);

export default ArticleHeader;
