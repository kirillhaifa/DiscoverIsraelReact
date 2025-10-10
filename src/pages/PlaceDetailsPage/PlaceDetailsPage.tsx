import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Place } from '../../types';
import PlaceDetails from '../../componenets/PlaceDetails/PlaceDetails';
import Navigation from '../../componenets/Navigation/Navigation';
import Header from '../../componenets/Header/Header';
let classes = require('./PlaceDetailsPage.module.scss');

const PlaceDetailsPage = () => {
  const { placeName } = useParams<{ placeName: string }>();
  
  // Получаем состояние загрузки и список мест из хранилища
  const { places, loading, error } = useSelector((state: RootState) => state.places);

  // Ищем место по имени
  const place = places.find(
    (place: Place) => place.placeName.en.toLowerCase().replace(/\s+/g, '-') === placeName
  );

  // Если места еще загружаются, выводим сообщение "Loading..."
  if (loading || !place) {
    return <div className={classes.loading}>Loading...</div>;
  }

  // Если произошла ошибка
  if (error) {
    return <div className={classes.error}>Error: {error}</div>;
  }

  // Если все данные готовы, рендерим детали места
  return (
    <div className={classes.placeDetailsPage}>
      <div className={classes.content}>
        <PlaceDetails place={place} />
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
