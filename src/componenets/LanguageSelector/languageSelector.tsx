import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../store/Language/languageSlice';
import { RootState } from '../../store';
import classNames from 'classnames';
let classes = require('./languageSelector.module.scss');
let basic = require('../../public/Styles/basic.module.scss')

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);

  const handleChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <div className={classes.languageSelector}>
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
    </div>
  );
};

export default LanguageSelector;
