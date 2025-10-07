import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setDistance } from "../../store/Filters/filtersSlice";
import { translations } from "../../public/translations";
import '../../public/Styles/colors.module.scss';
let classes = require('./distanceFilter.module.scss');

const DistanceFilter = () => {
  const dispatch = useDispatch();
  const maxDistance = useSelector((state: RootState) => state.filters.distance);
  const language = useSelector((state: RootState) => state.language.language);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const dropdownRef = useRef(null);

  // Закрытие dropdown при клике вне меню
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Запрос локации
  const handleLocationClick = () => {
    setDropdownOpen((open) => !open);
    if (!location && !locationError) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setLocationError(null);
          },
          (err) => {
            setLocationError(translations.locationError?.[language] || 'Ошибка определения локации');
          }
        );
      } else {
        setLocationError(translations.locationNotSupported?.[language] || 'Геолокация не поддерживается');
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = Number(event.target.value);
    dispatch(setDistance(newDistance));
  };

  return (
    <div className={classes.dropdownWrapper} ref={dropdownRef}>
      <button onClick={handleLocationClick}>
        {translations.setLocation?.[language] || 'Указать местоположение'}
        <span style={{ marginLeft: '0.5em' }}>{dropdownOpen ? '▲' : '▼'}</span>
      </button>
      {dropdownOpen && (
        <div className={classes.distanceDropdown}>
          {location && (
            <div className={classes.locationInfo}>
              {translations.yourLocation?.[language] || 'Ваша локация'}: <b>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</b>
            </div>
          )}
          {locationError && (
            <div className={classes.locationError}>{locationError}</div>
          )}
          <label htmlFor="distance" className={classes.distanceLabel}>
            {translations.maxDistance[language]}: {maxDistance} {translations.km[language]}
          </label>
          <input
            id="distance"
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxDistance || 500}
            onChange={handleChange}
            className={classes.distanceRange}
          />
        </div>
      )}
    </div>
  );
};

export default DistanceFilter;
