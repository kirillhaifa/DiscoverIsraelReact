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

  // Логируем текущие значения для отладки
  useEffect(() => {
    console.log('ThemeToggle render:');
    console.log('userProfileTheme:', userProfileTheme);
    console.log('userPreferredTheme:', userPreferredTheme);
    console.log('userData:', userData);
  }, [userProfileTheme, userPreferredTheme, userData]);

  // Обработчик изменения темы
  const handleThemeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    
    console.log('Theme changing to:', selectedTheme);
    console.log('Current user:', user);
    console.log('Current userData:', userData);
    
    // Обновляем тему в Redux store
    dispatch(setTheme(selectedTheme));
    
    // Если пользователь залогинен, обновляем тему в базе данных
    if (user && userData) {
      try {
        const result = dispatch(updateUserThunk({
          userID: userData.userID,
          colorTheme: selectedTheme
        }) as any);
        console.log('Theme update dispatched:', result);
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
      <label htmlFor="theme-select" className={classes.label}>
        {translations.colorTheme[currentLanguage]}
      </label>
      {/* Desktop: обычный select */}
      <div className={classes.selectWrapper}>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={handleThemeChange}
          className={classes.desktopSelect}
        >
          <option value="light">{translations.light[currentLanguage]}</option>
          <option value="dark">{translations.dark[currentLanguage]}</option>
        </select>
        <div className={classes.iconWrapper}>
          {currentTheme === 'light' ? (
            <PiSunThin className={classes.icon} />
          ) : (
            <PiMoonStarsThin className={classes.icon} />
          )}
        </div>
      </div>
      {/* Mobile: dropdown-кнопка */}
      <div className={classes.mobileDropdownWrapper}>
        <button
          className={classes.dropdownButton}
          onClick={() => setDropdownOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          {currentTheme === 'light' ? (
            <PiSunThin className={classes.icon} />
          ) : (
            <PiMoonStarsThin className={classes.icon} />
          )}
          {currentTheme === 'light'
            ? translations.light[currentLanguage]
            : translations.dark[currentLanguage]}
          {/* <span className={classes.arrow}>{dropdownOpen ? '▲' : '▼'}</span> */}
        </button>
        {dropdownOpen && (
          <div className={classes.dropdownMenu} role="listbox">
            <button
              className={classes.dropdownItem}
              onClick={() => handleMobileThemeChange('light')}
              aria-selected={currentTheme === 'light'}
            >
              <PiSunThin className={classes.icon} /> {translations.light[currentLanguage]}
            </button>
            <button
              className={classes.dropdownItem}
              onClick={() => handleMobileThemeChange('dark')}
              aria-selected={currentTheme === 'dark'}
            >
              <PiMoonStarsThin className={classes.icon} /> {translations.dark[currentLanguage]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
