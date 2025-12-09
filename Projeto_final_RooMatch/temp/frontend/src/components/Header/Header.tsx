import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>RooMatch</h1>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/tasks">Tasks</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;