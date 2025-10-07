import React, { useState } from 'react';
import { Link } from 'react-router-dom';
let classes = require('./Navigation.module.scss');
import { translations } from '../../public/translations';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';


const Navigation = () => {
  const [user, loading, error] = useAuthState(auth);
  const { userData } = useSelector((state: RootState) => state.user);
  const { language } = useSelector((state: RootState) => state.language);
  const [menuOpen, setMenuOpen] = useState(false);
  let languageShort = '';
  switch (language) {
    case 'ru':
      languageShort = 'ru';
      break;
    case 'en':
      languageShort = 'en';
      break;
    case 'he':
      languageShort = 'he';
      break;
    default:
      languageShort = 'en';
  }

  const navLinks = (
    <>
      <li className={classes.link}>
        <Link to="/" onClick={() => setMenuOpen(false)}>{translations.home[languageShort]}</Link>
      </li>
      <li className={classes.link}>
        <Link to="/map" onClick={() => setMenuOpen(false)}>{translations.map[languageShort]}</Link>
      </li>
      <li className={classes.link}>
        <Link to="/contacts" onClick={() => setMenuOpen(false)}>{translations.contacts[languageShort]}</Link>
      </li>
      <li className={classes.link}>
        <Link to="/about" onClick={() => setMenuOpen(false)}>{translations.aboutProject[languageShort]}</Link>
      </li>
      {user && userData?.role === 'admin' && (
        <li className={classes.link}>
          <Link to="/admin" className={classes.adminLink} onClick={() => setMenuOpen(false)}>
            {translations.adminPanel[languageShort]}
          </Link>
        </li>
      )}
    </>
  );

  return (
    <>
      {/* Desktop navigation */}
      <ul className={classes.linkList}>{navLinks}</ul>

      {/* Mobile burger button */}
      <button className={classes.menuButton} onClick={() => setMenuOpen(true)} aria-label="Открыть меню">
        <span >☰</span>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={classes.mobileMenu}>
          <button className={"" + classes.closeButton} onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">
            ×
          </button>
          <ul>{navLinks}</ul>
        </nav>
      )}
    </>
  );
};

export default Navigation;
