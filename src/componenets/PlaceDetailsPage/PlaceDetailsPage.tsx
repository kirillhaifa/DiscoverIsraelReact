import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Place } from '../../types';
import PlaceDetails from '../PlaceDetails/PlaceDetails';
import Navigation from '../Navigation/Navigation';

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
    return <p>Loading...</p>;
  }

  // Если произошла ошибка
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Если все данные готовы, рендерим детали места
  return (
    <div>
      <h1>{place?.placeName.en}</h1>
      <Navigation />
      <PlaceDetails place={place} />
    </div>
  );
};

export default PlaceDetailsPage;
