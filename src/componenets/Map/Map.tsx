import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';

const PlacesMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // // Получаем состояние пользователя и язык из Redux
  // const { userData } = useSelector((state: RootState) => state.user);
  // const { language } = useSelector((state: RootState) => state.language);

  // // Проверка наличия данных перед рендерингом
  // if (!userData || !language) {
  //   return <p>Loading...</p>; // Рендерим сообщение, пока данные не будут доступны
  // }

  const handleMapLoad = () => {
    setIsMapLoaded(true);
    setMapError(false);
  };

  const handleMapError = () => {
    setIsMapLoaded(false);
    setMapError(true);
  };

  return (
    <>
      <Header />
      <Navigation />
      {!isMapLoaded && !mapError && <p>Loading map...</p>}
      {mapError && (
        <p style={{ color: 'red' }}>Failed to load the map. Please try again later.</p>
      )}
      <iframe
        className="map"
        src="https://www.google.com/maps/d/u/0/embed?mid=1upKmWv0I1zL3VW_2gLoDDANfYLZqhRY&ehbc=2E312F"
        width="100%"
        height="650vh"
        onLoad={handleMapLoad}
        onError={handleMapError}
      ></iframe>
    </>
  );
};

export default PlacesMap;
