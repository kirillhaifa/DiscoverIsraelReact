import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { Place } from '../../types';
import { fetchPlannedPlaces } from '../../firebase/firebaseService';
import { translations } from '../../../public/translations';
import Loader from '../Loader/Loader';
import { IoAdd, IoShare, IoClose } from 'react-icons/io5';
import { FaWhatsapp, FaTelegram, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLink } from 'react-icons/fa';
import PlacesMap from '../../pages/Map/Map';
let classes = require('./TripPlanner.module.scss');

interface TripPlannerProps {
  onClose?: () => void;
  allowUnauthorized?: boolean;
}

const TripPlanner: React.FC<TripPlannerProps> = ({
  onClose,
  allowUnauthorized = false,
}) => {
  const [user] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [plannedPlaces, setPlannedPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSharedTrip, setIsSharedTrip] = useState<boolean>(false);
  const language = useSelector((state: RootState) => state.language.language);
  const allPlaces = useSelector((state: RootState) => state.places.places);

  useEffect(() => {
    const loadPlannedPlaces = async () => {
      if (!user) {
        setPlannedPlaces([]);
        // Не устанавливаем loading = false здесь, если есть shared trip
        const urlParams = new URLSearchParams(window.location.search);
        const tripData = urlParams.get('trip');
        if (!tripData) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const places = await fetchPlannedPlaces(user.uid);
        setPlannedPlaces(places);
      } catch (error) {
        console.error('Error fetching planned places:', error);
        setPlannedPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlannedPlaces();
  }, [user]);

  // Обработка shared trip из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripData = urlParams.get('trip');

    if (tripData && allPlaces && allPlaces.length > 0) {
      try {
        const decodedData = JSON.parse(atob(tripData));
        setIsSharedTrip(true);
        setSelectedDate(decodedData.date || '');
        setSelectedTime(decodedData.time || '');

        // Найти места по ID
        const sharedPlaces = decodedData.places
          .map((placeId: string) => allPlaces.find((p) => p.id === placeId))
          .filter(Boolean);

        setSelectedPlaces(sharedPlaces);
      } catch (error) {
        console.error('Error parsing shared trip data:', error);
      }
      setLoading(false);
    } else if (tripData && (!allPlaces || allPlaces.length === 0)) {
      // Если есть tripData, но места еще не загружены, ждем
      return;
    } else if (!tripData && !user) {
      // Если нет tripData и нет пользователя, завершаем загрузку
      setLoading(false);
    }
  }, [allPlaces, user]);

  const addPlaceToTrip = (place: Place) => {
    if (!selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const removePlaceFromTrip = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== placeId));
  };

  const generateShareUrl = () => {
    const tripData = {
      date: selectedDate,
      time: selectedTime,
      places: selectedPlaces.map((p) => p.id),
    };

    const encodedData = btoa(JSON.stringify(tripData));
    const basename =
      process.env.NODE_ENV === 'production' ? '/DiscoverIsraelReact' : '';
    return `${window.location.origin}${basename}/shared-trip?trip=${encodedData}`;
  };

  const handleShareToSocial = (platform: string) => {
    const shareUrl = generateShareUrl();
    const shareText = `${translations.checkOutMyTrip[language]} - ${selectedPlaces.length} ${translations.places[language]}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let socialUrl = '';

    switch (platform) {
      case 'whatsapp':
        socialUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        socialUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert(translations.linkCopied[language]);
        }).catch(() => {
          // Fallback для старых браузеров
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert(translations.linkCopied[language]);
        });
        return;
    }

    if (socialUrl) {
      window.open(socialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Фильтрация мест по поисковому запросу
  const filteredPlaces = React.useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return plannedPlaces;

    // Поиск среди запланированных мест
    const filteredPlanned = plannedPlaces.filter(
      (place) =>
        place.placeName[language]?.toLowerCase().includes(searchTerm) ||
        place.shortDescription[language]?.toLowerCase().includes(searchTerm),
    );

    // Если нет результатов среди запланированных, ищем среди всех мест
    if (filteredPlanned.length === 0 && allPlaces) {
      return allPlaces
        .filter(
          (place) =>
            place.placeName[language]?.toLowerCase().includes(searchTerm) ||
            place.shortDescription[language]
              ?.toLowerCase()
              .includes(searchTerm),
        )
        .slice(0, 10); // Ограничиваем до 10 результатов
    }

    return filteredPlanned;
  }, [plannedPlaces, allPlaces, searchQuery, language]);

  if (loading) {
    return (
      <div className={classes.container}>
        <Loader />
      </div>
    );
  }

  if (!user && !isSharedTrip && !allowUnauthorized) {
    return (
      <div className={classes.authRequired}>
        <h2>{translations.tripPlannerTitle[language]}</h2>
        <p>{translations.loginRequiredForTripPlanner[language]}</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>
          {isSharedTrip
            ? translations.sharedTrip[language]
            : translations.tripPlannerTitle[language]}
        </h1>
        {onClose && (
          <button onClick={onClose} className={classes.closeButton}>
            <IoClose />
            {translations.close[language]}
          </button>
        )}
      </div>

      {/* Секция выбора даты и времени */}
      <div className={classes.dateTimeSection}>
        <h3>{translations.selectDateTime[language]}</h3>
        <div className={classes.dateTimePickers}>
          <div className={classes.inputGroup}>
            <label htmlFor="trip-date">
              {translations.selectDate[language]}
            </label>
            <input
              id="trip-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={classes.dateInput}
              disabled={isSharedTrip}
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor="trip-time">
              {translations.selectTime[language]}
            </label>
            <input
              id="trip-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className={classes.timeInput}
              disabled={isSharedTrip}
            />
          </div>
        </div>
      </div>

      {/* Секция выбора мест */}
      {!isSharedTrip && (
        <div className={classes.placesSection}>
          <h3>{translations.selectPlacesForTrip[language]}</h3>

          {/* Поиск мест */}
          <div className={classes.searchContainer}>
            <input
              type="text"
              placeholder={translations.searchPlaceholder[language]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={classes.searchInput}
            />
          </div>

          {/* Доступные места */}
          {filteredPlaces.length > 0 ? (
            <div className={classes.availablePlaces}>
              <h4>
                {searchQuery
                  ? `${translations.searchResults[language]} (${filteredPlaces.filter((place) => !selectedPlaces.find((p) => p.id === place.id)).length})`
                  : translations.availablePlaces[language]}
              </h4>
              <div className={classes.placesListContainer}>
                <div className={classes.placesList}>
                  {filteredPlaces
                    .filter(
                      (place) => !selectedPlaces.find((p) => p.id === place.id),
                    )
                    .map((place) => (
                      <div key={place.id} className={classes.placeItem}>
                        <div className={classes.placeImage}>
                          <img
                            src={
                              place.photos && place.photos.length > 0
                                ? place.photos[0].photoWay
                                : '/img/icon.png'
                            }
                            alt={place.placeName[language]}
                            className={classes.placeThumb}
                          />
                        </div>
                        <div className={classes.placeInfo}>
                          <h5>{place.placeName[language]}</h5>
                          <p>{place.shortDescription[language]}</p>
                        </div>
                        <button
                          onClick={() => addPlaceToTrip(place)}
                          className={classes.addButton}
                        >
                          <IoAdd />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.noPlaces}>
              <p>
                {searchQuery
                  ? translations.noSearchResults[language]
                  : translations.noPlannedPlaces[language]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Выбранные места для маршрута */}
      {selectedPlaces.length > 0 && (
        <div className={classes.selectedPlaces}>
          <h4>
            {isSharedTrip
              ? translations.viewSharedTrip[language]
              : translations.selectedRoute[language]}
          </h4>
          <div className={classes.placesList}>
            {selectedPlaces.map((place, index) => (
              <div key={place.id} className={classes.selectedPlaceItem}>
                <span className={classes.routeNumber}>{index + 1}</span>
                <div className={classes.placeImage}>
                  <img
                    src={
                      place.photos && place.photos.length > 0
                        ? place.photos[0].photoWay
                        : '/img/icon.png'
                    }
                    alt={place.placeName[language]}
                    className={classes.placeThumb}
                  />
                </div>
                <div className={classes.placeInfo}>
                  <h5>{place.placeName[language]}</h5>
                  <p>{place.shortDescription[language]}</p>
                </div>
                {!isSharedTrip && (
                  <button
                    onClick={() => removePlaceFromTrip(place.id)}
                    className={classes.removeButton}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Секция карты */}
      {selectedPlaces.length > 0 && (
        <div className={classes.mapSection}>
          <h3>{translations.tripRoute[language]}</h3>
          <div className={classes.mapPlaceholder}>
            <p>{translations.mapComingSoon[language]}</p>
          </div>
          <div className={classes.mapContainer}>
            <PlacesMap />
          </div>
        </div>
      )}

      {/* Секция поделиться */}
      {selectedPlaces.length > 0 && selectedDate && !isSharedTrip && (
        <div className={classes.shareSection}>
          <h3>{translations.shareTrip[language]}</h3>
          <div className={classes.socialBar}>
            <button 
              onClick={() => handleShareToSocial('whatsapp')}
              className={`${classes.socialButton} ${classes.whatsapp}`}
              title="WhatsApp"
            >
              <FaWhatsapp />
            </button>
            <button 
              onClick={() => handleShareToSocial('telegram')}
              className={`${classes.socialButton} ${classes.telegram}`}
              title="Telegram"
            >
              <FaTelegram />
            </button>
            <button 
              onClick={() => handleShareToSocial('facebook')}
              className={`${classes.socialButton} ${classes.facebook}`}
              title="Facebook"
            >
              <FaFacebook />
            </button>
            <button 
              onClick={() => handleShareToSocial('twitter')}
              className={`${classes.socialButton} ${classes.twitter}`}
              title="Twitter"
            >
              <FaTwitter />
            </button>
            <button 
              onClick={() => handleShareToSocial('linkedin')}
              className={`${classes.socialButton} ${classes.linkedin}`}
              title="LinkedIn"
            >
              <FaLinkedin />
            </button>
            <button 
              onClick={() => handleShareToSocial('copy')}
              className={`${classes.socialButton} ${classes.copy}`}
              title={translations.copyLink[language]}
            >
              <FaLink />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
