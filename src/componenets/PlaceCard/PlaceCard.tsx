import React, { useState } from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import PlaceRating from '../PlaceRating/PlaceRating';
import { deleteRating, submitRating } from '../../firebase/firebaseService';
import { useNavigate } from 'react-router-dom';
import { TbJewishStar } from 'react-icons/tb';
import { translations } from '../../public/translations';
let classes = require('./PlaceCard.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [imageError, setImageError] = useState(false); // Состояние для обработки ошибки изображения
  const [user] = useAuthState(auth);
  const { userData } = useSelector((state: RootState) => state.user);
  const language = useSelector((state: RootState) => state.language.language);
  const isRtl = language === 'he'; // Определяем направление текста
  const navigate = useNavigate();

  const handlePlaceClick = () => {
    navigate(`/places/${place.placeName.en.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';


  return (
    <div
      className={`${classes.card} ${themes}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      onClick={handlePlaceClick}
    >
      {!imageError ? (
        <img
          src={place.photos[0]?.photoWay}
          alt={place.placeName[language]}
          className={classes.photo}
          onError={() => setImageError(true)} // Устанавливаем ошибку при проблеме с загрузкой
        />
      ) : (
        <div className={classes.iconContainer}>
          <TbJewishStar className={classes.fallbackIcon} />
          <p>{translations.noPhotoYet[languageShort]}</p>
        </div>
      )}
      <div className={classes.descriptionContainer}>
        {user && userData?.role === 'admin' && <p>ID: {place.id}</p>}
        <div>
          <h3>{place.placeName[language]}</h3>
          <p>{place.shortDescription[language]}</p>
        </div>
        <PlaceRating
          placeId={place.id}
          submitRating={submitRating}
          deleteRating={deleteRating}
        />
      </div>
    </div>
  );
};

export default PlaceCard;
