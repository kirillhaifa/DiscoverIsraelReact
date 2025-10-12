import React from 'react';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearUserData } from '../../store/User/userSlice';
import { clearTheme } from '../../store/ColorScheme/themeSlice';
import { resetFilters } from '../../store/Filters/filtersSlice';
import { resetPlaces } from '../../store/Places/placesSlice';
import { translations } from '../../../public/translations';
import { CiLogout } from "react-icons/ci";
let classes = require('./logout.module.scss');

const Logout = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Сначала очищаем Redux store
      dispatch(clearUserData());
      dispatch(clearTheme());
      dispatch(resetFilters());
      dispatch(resetPlaces());
      
      // Затем выходим из Firebase Auth
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={classes.button}>
      <CiLogout className={classes.logout} />
      <span className={classes.logoutText}>{translations.logout[languageShort]}</span>
    </button>
  );
};

export default Logout;
