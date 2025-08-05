import React, { useEffect } from 'react';
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

  return (
    <div className={classes.themeSelector}>
      <label htmlFor="theme-select">
        {translations.colorTheme[currentLanguage]}
      </label>
      <div className={classes.selectWrapper}>
        <select
          id="theme-select"
          value={userPreferredTheme || userProfileTheme || 'light'}
          onChange={handleThemeChange}
        >
          <option value="light">{translations.light[currentLanguage]}</option>
          <option value="dark">{translations.dark[currentLanguage]}</option>
        </select>
        <div className={classes.iconWrapper}>
          {(userPreferredTheme || userProfileTheme) === 'light' ? (
            <PiSunThin className={classes.icon} />
          ) : (
            <PiMoonStarsThin className={classes.icon} />
          )}
        </div>

      </div>
    </div>
  );
};

export default ThemeSelector;
