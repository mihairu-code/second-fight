import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { HeartFill } from '@gravity-ui/icons';
import { Tooltip } from '@gravity-ui/uikit';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '@services/ConduitAPI';
import { capitalizeFirstLetter } from '@utils/cardFunctions';
import '@styles/ArticleCard.less';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';

const ArticleHeader = React.memo(
  ({ favorited, favoritesCount, slug, title, component }) => {
    const currentUser = useSelector(state => state.auth?.user?.username);
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

      if (!currentUser) {
        showToast(
          'consent-error',
          'Оповещение',
          'Необходимо авторизоваться',
          'info',
        );
        return;
      }

      try {
        const action = favorited ? unfavoriteArticle : favoriteArticle;
        await action(slug).unwrap();
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
