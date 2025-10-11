import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../store/Language/languageSlice';
import { RootState } from '../../store';
import classNames from 'classnames';
import { PiGlobeHemisphereEastLight } from 'react-icons/pi';
let classes = require('./languageSelector.module.scss');
let basic = require('../../public/Styles/basic.module.scss')

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    dispatch(setLanguage(e.target.value));
    setMenuOpen(false);
  };

  // Закрытие dropdown при клике вне меню
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Список языков
  const languageOptions = (
    <>
      <input
        type="radio"
        id="language-en"
        value="en"
        checked={language === 'en'}
        onChange={handleChange}
        className={`${classes.input} ${basic.visuallyHidden} ${classes.english}`}
      />
      <label htmlFor="language-en"  className={`${classes.select} ${classes.english}`}>
        English
      </label>

      <input
        type="radio"
        id="language-ru"
        value="ru"
        checked={language === 'ru'}
        onChange={handleChange}
        className={`${classes.input} ${basic.visuallyHidden}  ${classes.russian}`}
      />
      <label htmlFor="language-ru" className={`${classes.select} ${classes.russian}`}>
        Русский
      </label>

      <input
        type="radio"
        id="language-he"
        value="he"
        checked={language === 'he'}
        onChange={handleChange}
        className={`${classes.input} ${basic.visuallyHidden}`}
      />
      <label htmlFor="language-he" className={`${classes.select} ${classes.hebrew}`}>
        עברית
      </label>
    </>
  );

  // Текст на кнопке — текущий язык
  const getLangLabel = () => {
    switch (language) {
      case 'en': return 'English';
      case 'ru': return 'Русский';
      case 'he': return 'עברית';
      default: return '🌐';
    }
  };

  return (
    <div className={classes.languageSelector} ref={dropdownRef}>
      <button
        className={classes.dropdownButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-label="Language selector"
        type="button"
      >
        <PiGlobeHemisphereEastLight className={classes.globeIcon} />
        <span className={classes.currentLabel}>{getLangLabel()}</span>
      </button>
      {menuOpen && (
        <div className={classes.dropdownMenu} role="listbox">
          {languageOptions}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
