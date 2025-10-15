import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../../public/translations';
import { MdStarRate } from 'react-icons/md';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
let classes = require('./PlaceOverallRating.module.scss');

interface PlaceOverallRatingProps {
  placeId: string;
}

const PlaceOverallRating: React.FC<PlaceOverallRatingProps> = ({ placeId }) => {
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;
  
  const [ratings, setRatings] = useState<{ userId: string; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Получаем все рейтинги для данного места из Firebase
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        // Получаем всех пользователей
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersRef);
        
        const allRatings: { userId: string; rating: number }[] = [];
        
        // Проходим по всем пользователям и ищем рейтинги для данного места
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          if (userData.ratings && Array.isArray(userData.ratings)) {
            const placeRating = userData.ratings.find((rating: any) => rating.placeId === placeId);
            if (placeRating) {
              allRatings.push({
                userId: userDoc.id,
                rating: placeRating.rating
              });
            }
          }
        });
        
        setRatings(allRatings);
      } catch (error) {
        console.error('Ошибка при получении рейтингов:', error);
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [placeId]);

  // Вычисляем средний рейтинг
  const calculateAverageRating = (ratings: { userId: string; rating: number }[]) => {
    if (!ratings || ratings.length === 0) return null;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    const average = sum / ratings.length;
    const rounded = Math.round(average * 10) / 10;
    return rounded.toFixed(1); // Всегда показываем 1 знак после запятой (7.0, 8.4)
  };

  const averageRating = calculateAverageRating(ratings);
  const ratingsCount = ratings.length;

  if (loading) {
    return (
      <div className={classes.container}>
        <div className={classes.noRating}>
          <MdStarRate className={classes.noRatingIcon} />
          <span className={classes.noRatingText}>...</span>
        </div>
      </div>
    );
  }

  if (!averageRating || ratingsCount === 0) {
    return (
      <div className={classes.container}>
        <div className={classes.noRating}>
          <span className={classes.noRatingText}>{t('noRatings')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.rating}>
        <span className={classes.ratingValue}>{averageRating}</span>
        <span className={classes.ratingsCount}>({ratingsCount})</span>
      </div>
    </div>
  );
};

export default PlaceOverallRating;
