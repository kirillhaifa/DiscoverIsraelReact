import React, { useState } from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { TbJewishStar } from 'react-icons/tb';
import { translations } from '../../../public/translations';
let styles = require('./PlaceInCollectionCard.module.scss');


interface PlaceInCollectionCardProps { place: Place; }

const PlaceInCollectionCard: React.FC<PlaceInCollectionCardProps> = ({ place }) => {
  const language = useSelector((s: RootState) => s.language.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    navigate(`/places/${place.placeName.en.toLowerCase().replace(/\s+/g,'-')}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      {(!imgError && place.photos?.[0]?.photoWay) ? (
        <img
          className={styles.image}
          src={place.photos[0].photoWay}
          alt={place.placeName[language]}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <TbJewishStar className={styles.fallbackIcon} />
          <span>{translations.noPhotoYet[languageShort]}</span>
        </div>
      )}
      <div className={styles.titleBar}>
        <p className={styles.title}>{place.placeName[language]}</p>
      </div>
    </div>
  );
};

export default PlaceInCollectionCard;
