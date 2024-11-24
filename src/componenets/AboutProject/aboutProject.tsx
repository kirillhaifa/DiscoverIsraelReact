import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../public/translations';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';

const AboutProject = () => {
  const { language } = useSelector((state: RootState) => state.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  // Проверка на наличие данных о языке
  if (!language) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <Header />
    <Navigation />
    <div>
      <h1>{translations.aboutProject[languageShort]}</h1>
      <p>{translations.projectDescription[languageShort]}</p>
    </div>
    </>
  );
};

export default AboutProject;
