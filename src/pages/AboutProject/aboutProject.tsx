import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../public/translations';
let classes = require('./aboutProject.module.scss');

const AboutProject = () => {
  const { language } = useSelector((state: RootState) => state.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  // Проверка на наличие данных о языке
  if (!language) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.aboutProjectPage}>
      <h1>{translations.aboutProject[languageShort]}</h1>
      <p>{translations.projectDescription[languageShort]}</p>
      <h1>{translations.contacts[languageShort]}</h1>
      <p>{translations.phone[languageShort]}: +972532348988</p>
      <p>{translations.email[languageShort]}: format3473@gmail.com</p>
    </div>
  );
};

export default AboutProject;
