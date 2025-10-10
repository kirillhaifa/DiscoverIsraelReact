import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Login from '../Login/Login';
let classes = require('./LoginPage.module.scss');

const LoginPage: React.FC = () => {
  return (
    <div className={classes.pageWrapper}>
      <Header />
      <Navigation />
      <div className={classes.mainContent}>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
