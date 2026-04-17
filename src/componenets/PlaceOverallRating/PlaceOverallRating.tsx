import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../../public/translations';
import { MdStarRate } from 'react-icons/md';
import apiClient from '../../utils/apiClient';
let classes = require('./PlaceOverallRating.module.scss');

interface PlaceOverallRatingProps {
  placeId: string;
  /** Начальные данные из store — при загрузке страницы запрос к API не нужен */
  initialRating?: number | null;
  initialCount?: number;
  /** Инкрементируется после оценки → триггерит рефетч у API */
  refreshKey?: number;
}

const PlaceOverallRating: React.FC<PlaceOverallRatingProps> = ({
  placeId,
  initialRating = null,
  initialCount = 0,
  refreshKey = 0,
}) => {
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  const [averageRating, setAverageRating] = useState<string | null>(
    initialRating !== null ? initialRating.toFixed(1) : null,
  );
  const [ratingsCount, setRatingsCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // При инициализации (refreshKey === 0) используем данные из props — 0 запросов.
  // HTTP-запрос делается только после реальной оценки пользователем (refreshKey > 0).
  useEffect(() => {
    if (refreshKey === 0) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/ratings/${placeId}`);
        const summary = data.data;
        setAverageRating(
          summary.averageRating !== null
            ? summary.averageRating.toFixed(1)
            : null,
        );
        setRatingsCount(summary.count);
      } catch (error) {
        console.error('Ошибка при получении рейтингов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [placeId, refreshKey]);

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
