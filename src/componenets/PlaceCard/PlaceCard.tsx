import React, { useState, useEffect } from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import PlaceRating from '../PlaceRating/PlaceRating';
import PlaceOverallRating from '../PlaceOverallRating/PlaceOverallRating';
import ParametersWidget from '../ParametersWidget/ParametersWidget';
import {
  deleteRating,
  submitRating,
  addPlaceToPlans,
  removePlaceFromPlans,
  checkPlaceInPlans,
} from '../../firebase/firebaseService';
import { useNavigate } from 'react-router-dom';
import { TbJewishStar } from 'react-icons/tb';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import { translations } from '../../../public/translations';
let classes = require('./PlaceCard.module.scss');
let themes = require('../../../public/Styles/themes.module.scss');

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [imageError, setImageError] = useState(false); // Состояние для обработки ошибки изображения
  const [isInPlans, setIsInPlans] = useState(false); // Состояние для отслеживания планов
  const [user] = useAuthState(auth);
  const { userData } = useSelector((state: RootState) => state.user);
  const language = useSelector((state: RootState) => state.language.language);
  const isRtl = language === 'he'; // Определяем направление текста
  const navigate = useNavigate();
  const searchText = useSelector(
    (state: RootState) => state.filters.searchText,
  );

  // Проверка, находится ли место в планах пользователя
  useEffect(() => {
    const checkPlansStatus = async () => {
      if (user) {
        const inPlans = await checkPlaceInPlans(user.uid, place.id);
        setIsInPlans(inPlans);
      }
    };

    checkPlansStatus();
  }, [user, place.id]);

  const handlePlaceClick = () => {
    navigate(
      `/places/${place.placeName.en.toLowerCase().replace(/\s+/g, '-')}`,
    );
  };

  // Функция для добавления/удаления места из планов
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем открытие карточки места

    if (!user) {
      return; // Можно добавить показ модалки входа
    }

    try {
      if (isInPlans) {
        await removePlaceFromPlans(user.uid, place.id);
        setIsInPlans(false);
      } else {
        await addPlaceToPlans(user.uid, place.id);
        setIsInPlans(true);
      }
    } catch (error) {
      console.error('Error updating plans:', error);
    }
  };

  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(
      `(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    );
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{
            background: '#ffe066',
            color: '#222',
            borderRadius: '3px',
            padding: '0 2px',
          }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

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
        <div>
          {userData?.role === 'admin' && <p>{place.id}</p>}
          <h3 className={classes.placeName}>
            {highlightText(place.placeName[language], searchText)}
          </h3>
          <ParametersWidget place={place} inCard={true} />
          <p className={classes.shortDescription}>
            {highlightText(place.shortDescription[language], searchText)}
          </p>
        </div>
        <div className={classes.ratingsContainer}>
          <div className={classes.ratingsSection}>
            <PlaceOverallRating placeId={place.id} />
            <div className={classes.heartContainer}>
            {user && (
              <Tooltip 
                title={
                  isInPlans
                    ? translations.removeFromPlans[language]
                    : translations.addToPlans[language]
                }
                placement="top"
              >
                <button
                  className={classes.heartButton}
                  onClick={handleHeartClick}
                >
                  {isInPlans ? (
                    <FaHeart className={classes.heartFilled} />
                  ) : (
                    <FaRegHeart className={classes.heartEmpty} />
                  )}
                </button>
              </Tooltip>
            )}
            <Tooltip 
              title={translations.ratePlace[language]}
              placement="top"
            >
              <div>
                <PlaceRating
                  placeId={place.id}
                  submitRating={submitRating}
                  deleteRating={deleteRating}
                />
              </div>
            </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
