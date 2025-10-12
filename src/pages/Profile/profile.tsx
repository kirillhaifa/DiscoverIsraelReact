import React, { useState } from 'react';
import ProfileEditForm from '../../componenets/ProfileEditForm/ProfileEditForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../../public/translations';
import LanguageSelector from '../../componenets/LanguageSelector/languageSelector';
import Navigation from '../../componenets/Navigation/Navigation';
import Header from '../../componenets/Header/Header';
import { Navigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import ProfileAchievements from '../../componenets/ProfileAchievements/ProfileAchievements';

let classes = require('./profile.module.scss');
let themes = require('../../../public/Styles/themes.module.scss');

const Profile = () => {
  const { userData, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const language = useSelector((state: RootState) => state.language.language);
  const ratingCount = userData?.ratings ? userData.ratings.length : 0;
  const [avatarError, setAvatarError] = useState(false);

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
  if (!userData) return <Navigate to="/login" replace />;

  return (
    <div className={classes.profilePage}>
      <div className={classes.headerRow}>
        {userData.profilePicture && !avatarError ? (
          <img
            className={classes.avatar}
            src={userData.profilePicture}
            alt={translations.profile[language]}
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className={classes.avatarFallback} aria-label={translations.profile[language]}>
            <FaUserCircle />
          </div>
        )}
        <div className={classes.info}>
          <h2 className={classes.sectionTitle}>{translations.profile[language]}</h2>
          <div>{translations.firstName[language]}: {userData.name || 'N/A'}</div>
            <div>{translations.lastName[language]}: {userData.surname || 'N/A'}</div>
            <div>{translations.email[language]}: {userData?.email || 'N/A'}</div>
            <div>{translations.premiumStatus[language]}: {userData?.premiumStatus ? 'Yes' : 'No'}</div>
            <div>{translations.placesVisited[language]}: {ratingCount}</div>
        </div>
      </div>
      <div>
        <h3 className={classes.sectionTitle}>{translations.achievements[language]}</h3>
        <ProfileAchievements ratingCount={ratingCount} levels={achievementLevels as any} />
      </div>
      <div className={classes.editBlock}>
        <ProfileEditForm />
      </div>
    </div>
  );
};

export default Profile;
