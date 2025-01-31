import React, { useCallback, useMemo } from 'react';
import { Button, UserLabel } from '@gravity-ui/uikit';
import { Link, Outlet, useNavigate } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '@store/authSlice.js';
import { setArticles, setPage } from '@store/articleSlice.js';
import '../styles/Header.less';
import baseAvatar from '@assets/baseAvatar.webp';

const Header = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user, shallowEqual);

  const handleLogoClick = useCallback(() => {
    dispatch(setPage(1)); // Устанавливаем первую страницу
    navigate('/articles');
  }, [dispatch, navigate]);

  const logout = useCallback(() => {
    dispatch(clearAuth());
    // eslint-disable-next-line no-undef
    localStorage.removeItem('auth');
    dispatch(setArticles({ articles: [], total: 0 }));
    navigate('/articles');
  }, [dispatch, navigate]);

  const guestLinks = useMemo(
    () => (
      <>
        <Link className="header__link margin_link" to="/sign-in">
          <Button view="flat" size="xl">
            Войти
          </Button>
        </Link>
        <Link className="header__link" to="/sign-up">
          <Button view="outlined-success" size="xl">
            Регистрация
          </Button>
        </Link>
      </>
    ),
    [],
  );

  const userLinks = useMemo(
    () => (
      <>
        <Link className="header__link margin_link" to="/new-article">
          <Button view="outlined-success" size="m" className="header__sign-in">
            Create Article
          </Button>
        </Link>
        <Link className="header__link" to="/profile">
          <UserLabel
            className="header__user-label"
            type="person"
            size="xl"
            view="clear"
            avatar={user?.image || baseAvatar}
          >
            {user?.username || 'Anonymous'}
          </UserLabel>
        </Link>
        <Button
          className="header__logout"
          size="xl"
          view="outlined"
          onClick={logout}
        >
          Log out
        </Button>
      </>
    ),
    [user, logout],
  );

  return (
    <>
      <header className="header">
        <Link
          className="header__title_link"
          to="/articles"
          onDoubleClick={handleLogoClick}
        >
          <h1 className="header__title">Realworld Blog</h1>
        </Link>
        {user ? userLinks : guestLinks}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
});

export default Header;
