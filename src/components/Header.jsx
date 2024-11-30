import React from 'react';

import { Button } from '@gravity-ui/uikit';
import '../styles/Header.less';
import { Link } from 'react-router';
export default function Header() {
  return (
    <header className="header">
      <Link className="header__title_link" to="/articles">
        <h1 className="header__title">Realworld Blog</h1>
      </Link>
      <Link className="header__link margin_link" to="/sign-in">
        <Button className="header__sign-in" view="flat" size="xl">
          Sign In
        </Button>
      </Link>
      <Link className="header__link" to="/sign-up">
        <Button className="header__sign-up" view="outlined-success" size="xl">
          Sign Up
        </Button>
      </Link>
    </header>
  );
}
