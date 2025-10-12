import React, { useState } from 'react';
import { Collection } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { TbPhoto } from 'react-icons/tb';
import { translations } from '../../../public/translations';
let styles = require('./CollectionCard.module.scss');

interface CollectionCardProps { 
  collection: Collection; 
}

// Функция для получения текста количества мест из переводов
const getPlacesCountText = (count: number, languageShort: string) => {
  // Используем существующие переводы, адаптируя их для единственного/множественного числа
  const baseTranslation = translations.placesVisited[languageShort];
  
  if (languageShort === 'ru') {
    if (count === 1) return 'место';
    if (count >= 2 && count <= 4) return 'места';
    return 'мест';
  }
  
  if (languageShort === 'en') {
    return count === 1 ? 'place' : 'places';
  }
  
  if (languageShort === 'he') {
    return count === 1 ? 'מקום' : 'מקומות';
  }
  
  return 'places'; // Английский как fallback
};

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const language = useSelector((s: RootState) => s.language.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    navigate(`/collections/${collection.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      {(!imgError && collection.coverPhoto) ? (
        <img
          className={styles.image}
          src={collection.coverPhoto}
          alt={collection.title[language] || collection.title.en}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <TbPhoto className={styles.fallbackIcon} />
          <span>{translations.noPhotoYet[languageShort]}</span>
        </div>
      )}
      
      <div className={styles.content}>
        <h3 className={styles.title}>
          {collection.title[language] || collection.title.en}
        </h3>
        <p className={styles.description}>
          {collection.shortDescription[language] || collection.shortDescription.en}
        </p>
        <div className={styles.meta}>
          <span className={styles.placesCount}>
            {collection.placeIds.length} {getPlacesCountText(collection.placeIds.length, languageShort)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
