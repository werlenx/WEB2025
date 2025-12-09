import React from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <h1>Welcome to RooMatch!</h1>
      <p>Your one-stop solution for managing tasks effectively.</p>
    </div>
  );
};

export default Home;