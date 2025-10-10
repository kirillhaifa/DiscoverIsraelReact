import React from 'react';
import { translations } from '../../public/translations';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { Link } from 'react-router-dom';
import Logout from '../Logout/logout';
import LanguageSelector from '../LanguageSelector/languageSelector';
import ThemeSelector from '../ThemeToggle/themeToggle';
let classes = require('./Header.module.scss');
import ProfileButton from '../ProfileButton/profileButton';
import { MdHiking, MdLogin } from 'react-icons/md';

const Header: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  // Если данные пользователя или язык еще загружаются
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <header className={classes.header}>
      <div className={classes.logoContainer}>
        <MdHiking className={classes.iconLogo} />
        <h1 className={classes.logoName}>Discover Israel</h1>
      </div>
      <div className={classes.buttonsContainer}>
        <div className={classes.selectorsContainer}>
          <LanguageSelector />
          <ThemeSelector />
        </div>
        <div className={classes.profileContainer}>
          {user ? (
            <div className={classes.welcomeMessage}>
              <ProfileButton />
              <Logout />
            </div>
          ) : (
            <Link to="/login" className={classes.loginButton}>
              <MdLogin size={20} style={{ marginRight: 6 }} />
              <span className={classes.loginText}>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
