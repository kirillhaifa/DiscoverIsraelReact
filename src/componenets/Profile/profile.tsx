import React from 'react';
import ProfileEditForm from '../ProfileEditForm/ProfileEditForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../public/translations';
import LanguageSelector from '../LanguageSelector/languageSelector';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';

let classes = require('./profile.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

const Profile = () => {
  const { userData, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const language = useSelector((state: RootState) => state.language.language);
  const ratingCount = userData?.ratings ? userData.ratings.length : 0;

  // Уровни достижений
  const achievementLevels = [
    { threshold: 0, key: 'homebody' },
    { threshold: 10, key: 'pedestrian' },
    { threshold: 20, key: 'scout' },
    { threshold: 30, key: 'tourist' },
    { threshold: 50, key: 'wanderer' },
    { threshold: 70, key: 'navigator' },
    { threshold: 100, key: 'adventurer' },
    { threshold: 150, key: 'trailblazer' },
    { threshold: 200, key: 'traveler' },
    { threshold: 300, key: 'agasfer' },
  ];

  // Отображение состояния загрузки, ошибки или отсутствия данных
  if (loading) return <p>{translations.loading[language]}</p>;
  if (error) return <p>{translations.error[language]}: {error}</p>;
  if (!userData) return <p>{translations.loading[language]}</p>; // Если `userData` отсутствует

  return (
    <>
      <Header />
      <h1>{translations.profile[language]}</h1>
      <Navigation />
      <img
        className={classes.profileImage}
        src={
          userData.profilePicture
            ? userData.profilePicture
            : 'https://i.pinimg.com/736x/30/30/e3/3030e3fa40eb4fd810320bbff7f0a1c4.jpg'
        }
        alt={translations.profile[language]}
      />
      <div className={classes.userInfo}>
        <p>{translations.firstName[language]}: {userData.name || 'N/A'}</p>
        <p>{translations.lastName[language]}: {userData.surname || 'N/A'}</p>
        <p>{translations.email[language]}: {userData?.email || 'N/A'}</p>
        <p>{translations.premiumStatus[language]}: {userData?.premiumStatus ? 'Yes' : 'No'}</p>
        <p>{translations.placesVisited[language]}: {ratingCount}</p>
      </div>
      <div className={classes.achievements}>
        <h2>{translations.achievements[language]}</h2>
        <ul>
          {achievementLevels.map((level) => (
            <li
              key={level.key}
              className={`${classes.achievement} ${ratingCount >= level.threshold ? classes.completed : ''}`}
            >
              {translations[level.key][language]}
            </li>
          ))}
        </ul>
      </div>
      <ProfileEditForm />
    </>
  );
};

export default Profile;
