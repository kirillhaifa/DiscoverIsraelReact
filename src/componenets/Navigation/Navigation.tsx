import React from 'react';
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

  return (
      <ul className={classes.linkList}>
        <li className={classes.link}>
          <Link to="/">{translations.home[languageShort]}</Link>
        </li>
        {/* <li className={classes.link}>
          <Link to="/unsafe-for-israelis">
            {translations.unsafeForIsraelis[languageShort]}
          </Link>
        </li> */}
        <li className={classes.link}>
          <Link to="/map">{translations.map[languageShort]}</Link>
        </li>
        <li className={classes.link}>
          <Link to="/contacts">{translations.contacts[languageShort]}</Link>
        </li>
        <li className={classes.link}>
          <Link to="/about">{translations.aboutProject[languageShort]}</Link>
        </li>
        {user && userData?.role === 'admin' && (
          <li className={classes.link}>
            <Link to="/admin" className={classes.adminLink}>
              {translations.adminPanel[languageShort]}
            </Link>
          </li>
        )}
      </ul>
  );
};

export default Navigation;
