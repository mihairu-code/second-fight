import React from 'react';

import { Button, UserLabel } from '@gravity-ui/uikit';
import { Link, Outlet } from 'react-router';

import '../styles/Header.less';

export default function Header() {
  const a = '';
  return (
    <>
      <header className="header">
        <Link className="header__title_link" to="/articles">
          <h1 className="header__title">Realworld Blog</h1>
        </Link>
        {a ? (
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
              avatar="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Charles_Darwin_by_Julia_Margaret_Cameron%2C_c._1868.jpg/193px-Charles_Darwin_by_Julia_Margaret_Cameron%2C_c._1868.jpg"
            >
              User Name
            </UserLabel>
            <Link>
              <Button className="header__logout" size="xl" view="outlined">
                Log out
              </Button>
            </Link>
          </>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
