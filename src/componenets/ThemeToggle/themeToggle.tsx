import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/ColorScheme/themeSlice';
import { PiSunThin, PiMoonStarsThin } from 'react-icons/pi';
import { translations } from '../../public/translations';
let classes = require('./themeToggle.module.scss');

const ThemeSelector: React.FC = () => {
  const dispatch = useDispatch();

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

  // Установка темы из профиля пользователя при первой загрузке
  useEffect(() => {
    if (userProfileTheme && !userPreferredTheme) {
      dispatch(setTheme(userProfileTheme));
    }
  }, [userProfileTheme, userPreferredTheme, dispatch]);

  // Обработчик изменения темы
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    dispatch(setTheme(selectedTheme));
  };

  return (
    <div className={classes.themeSelector}>
      <label htmlFor="theme-select">
        {translations.colorTheme[currentLanguage]}
      </label>
      <div className={classes.selectWrapper}>
        <select
          id="theme-select"
          value={userPreferredTheme || 'system'}
          onChange={handleThemeChange}
        >
          <option value="light">{translations.light[currentLanguage]}</option>
          <option value="dark">{translations.dark[currentLanguage]}</option>
        </select>
        <div className={classes.iconWrapper}>
          {userPreferredTheme === 'light' ? (
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
