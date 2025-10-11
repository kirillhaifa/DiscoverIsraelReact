import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/ColorScheme/themeSlice';
import { updateUserThunk } from '../../store/User/updateUserThunk';
import { PiSunThin, PiMoonStarsThin } from 'react-icons/pi';
import { translations } from '../../public/translations';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
let classes = require('./themeToggle.module.scss');

const ThemeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Получаем текущий язык и тему из Redux
  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const userProfileTheme = useSelector(
    (state: RootState) => state.user.userData?.colorTheme,
  );
  const userPreferredTheme = useSelector(
    (state: RootState) => state.theme.theme,
  );
  const userData = useSelector((state: RootState) => state.user.userData);

  // Обработчик изменения темы
  const handleThemeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    
    // Обновляем тему в Redux store
    dispatch(setTheme(selectedTheme));
    
    // Если пользователь залогинен, обновляем тему в базе данных
    if (user && userData) {
      try {
        const result = dispatch(updateUserThunk({
          userID: userData.userID,
          colorTheme: selectedTheme
        }) as any);
      } catch (error) {
        console.error('Failed to update theme in database:', error);
      }
    }
  };

  // Закрытие dropdown при клике вне меню
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Для мобильных: обработчик выбора темы
  const handleMobileThemeChange = (selectedTheme: string) => {
    dispatch(setTheme(selectedTheme));
    if (user && userData) {
      try {
        dispatch(updateUserThunk({
          userID: userData.userID,
          colorTheme: selectedTheme
        }) as any);
      } catch (error) {
        console.error('Failed to update theme in database:', error);
      }
    }
    setDropdownOpen(false);
  };

  // Определяем текущую тему
  const currentTheme = userPreferredTheme || userProfileTheme || 'light';

  return (
    <div className={classes.themeSelector} ref={dropdownRef}>
      <div className={classes.compact}>
        {currentTheme === 'light' ? (
          <PiSunThin className={classes.gridIcon} />
        ) : (
          <PiMoonStarsThin className={classes.gridIcon} />
        )}
        <select
          id="theme-select"
          value={currentTheme}
          onChange={handleThemeChange}
          className={classes.gridSelect}
        >
          <option value="light">{translations.light[currentLanguage]}</option>
          <option value="dark">{translations.dark[currentLanguage]}</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeSelector;
