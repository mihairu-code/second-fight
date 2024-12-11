import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, UserLabel } from '@gravity-ui/uikit';
import { Link, Outlet, useNavigate } from 'react-router';
import { logout } from '@store/authSlice';
import { useGetCurrentUserQuery } from '@services/ConduitAPI';

import '../styles/Header.less';

export default function Header() {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate('/profile');
  };
  const token = useSelector(state => state.auth.token);
  const { data, error, isLoading } = useGetCurrentUserQuery();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="header">
        <Link className="header__title_link" to="/articles">
          <h1 className="header__title">Realworld Blog</h1>
        </Link>
        {!isAuthenticated ? (
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
            <UserLabel
              className="header__user-label"
              type="person"
              size="xl"
              view="clear"
              avatar={user?.image || 'https://via.placeholder.com/150'}
              onClick={goToProfile}
            >
              {user?.username || 'Anonymous'}
            </UserLabel>
            <Button
              className="header__logout"
              size="xl"
              view="outlined"
              onClick={handleLogout}
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
