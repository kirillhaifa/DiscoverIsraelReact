import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
let classes = require('./MainLayout.module.scss');

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={classes.layout}>
      <Header />
      <Navigation />
      <main className={classes.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
