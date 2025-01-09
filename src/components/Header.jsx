import React from 'react';
import { Button, UserLabel } from '@gravity-ui/uikit';
import { Link, Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '@store/authSlice.js';
import '../styles/Header.less';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user); // Получаем данные о пользователе из Redux

  const logout = () => {
    dispatch(clearAuth());
    // eslint-disable-next-line no-undef
    localStorage.removeItem('auth');
  };

  return (
    <>
      <header className="header">
        <Link className="header__title_link" to="/articles" replace={true}>
          <h1 className="header__title">Realworld Blog</h1>
        </Link>
        {!user ? (
          <>
            <Link className="header__link margin_link" to="/sign-in">
              <Button className="header__sign-in" view="flat" size="xl">
                Sign In
              </Button>
            </Link>
            <Link className="header__link" to="/sign-up">
              <Button
                className="header__sign-up"
                view="outlined-success"
                size="xl"
              >
                Sign Up
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link className="header__link margin_link" to="/new-article">
              <Button
                className="header__sign-in"
                view="outlined-success"
                size="m"
              >
                Create Article
              </Button>
            </Link>
            <Link className="header__link" to="/profile">
              <UserLabel
                className="header__user-label"
                type="person"
                size="xl"
                view="clear"
                avatar={user?.image || 'https://via.placeholder.com/150'} // Используем изображение пользователя
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
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
