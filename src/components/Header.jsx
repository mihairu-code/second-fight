// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Button } from '@gravity-ui/uikit';
import '../styles/Header.less';
export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Realworld Blog</h1>
      <Button className="header__sign-in" view="flat" size="xl">
        Sign In
      </Button>
      <Button className="header__sign-up" view="outlined-success" size="xl">
        Sign Up
      </Button>
    </header>
  );
}
