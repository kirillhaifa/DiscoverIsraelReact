import React from 'react';
import Login from '../../componenets/Login/Login';
let classes = require('./LoginPage.module.scss');

const LoginPage: React.FC = () => {
  return (
    <div className={classes.pageWrapper}>
      <div className={classes.mainContent}>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
