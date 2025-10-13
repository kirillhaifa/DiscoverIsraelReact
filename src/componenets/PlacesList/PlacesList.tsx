import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { selectPlaces } from "../../store/Places/placesSelectors";
import { 
  selectUnvisited, 
  selectParameters, 
  selectDistance,
  selectSearchText 
} from "../../store/Filters/filtersSelectors";
import { Place } from "../../types";
import PlaceCard from "../PlaceCard/PlaceCard";
import Loader from "../Loader/Loader";
import { getDistanceFromLatLonInKm } from "../../utils/functions";
import { selectUserRatings } from "../../store/User/userSelector";
import { RootState } from "../../store";
import { translations } from "../../../public/translations";
let classes = require('./PlacesList.module.scss')

const PlacesList = () => {
  // Извлекаем данные через мемоизированные селекторы
  const places = useSelector(selectPlaces); // Массив мест
  const unvisited = useSelector(selectUnvisited); // Фильтр "непосещенные"
  const parameters = useSelector(selectParameters); // Параметры фильтра
  const maxDistance = useSelector(selectDistance); // Максимальное расстояние
  const searchText = useSelector(selectSearchText); // Текст поиска
  const userRatings = useSelector(selectUserRatings); // Рейтинги пользователя
  const userCoordinates = useSelector((state: RootState) => state.location.coordinates); // Координаты пользователя
  const language = useSelector((state: RootState) => state.language.language); // Текущий язык

  // Состояние для анимаций и загрузки
  const [previousPlaces, setPreviousPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Мемоизированная фильтрация мест
  const filteredPlaces = useMemo(() => {
    return places.filter((place: Place) => {
    // Фильтрация по "непосещенные"
    if (
      unvisited &&
      userRatings.some((rating) => rating.placeId === place.id)
    ) {
      return false;
    }

    // Фильтрация по параметрам
    const parametersMatch = Object.entries(parameters).every(
      ([key, value]) => {
        if (value) {
          return place.parameters[key as keyof Place["parameters"]] === true;
        }
        return true;
      }
    );
    if (!parametersMatch) return false;

    // Фильтрация по расстоянию
    if (userCoordinates && maxDistance < 500) {
      const distance = getDistanceFromLatLonInKm(
        userCoordinates[0],
        userCoordinates[1],
        place.coordinates[0],
        place.coordinates[1]
      );
      if (distance > maxDistance) return false;
    }

    // Фильтрация по тексту поиска
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      const nameMatch = Object.values(place.placeName).some(name => name.toLowerCase().includes(searchLower));
      const shortDescMatch = Object.values(place.shortDescription).some(desc => desc.toLowerCase().includes(searchLower));
      const extendedDescMatch = Object.values(place.extendedDescription).some(desc => desc.toLowerCase().includes(searchLower));
      const regionMatch = place.region.toLowerCase().includes(searchLower);
      
      if (!nameMatch && !shortDescMatch && !extendedDescMatch && !regionMatch) {
        return false;
      }
    }

    return true; // Если место прошло все фильтры
    });
  }, [places, unvisited, userRatings, parameters, userCoordinates, maxDistance, searchText]);

  // Отслеживаем изменения для анимаций
  useEffect(() => {
    setPreviousPlaces(filteredPlaces);
  }, [filteredPlaces]);

  // Отслеживаем состояние загрузки
  useEffect(() => {
    if (places.length > 0) {
      // Добавляем небольшую задержку для плавного перехода
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
    }
  }, [places]);

  // Показываем лоадер во время загрузки
  if (isLoading) {
    return (
      <div className={classes.list}>
        <Loader message={`${translations.loading[language] || translations.loading.en}...`} />
      </div>
    );
  }

  return (
    <div className={classes.list}>
      {filteredPlaces.length > 0 ? (
        <TransitionGroup component="div" className={classes.transitionGroup}>
          {filteredPlaces.map((place: Place) => (
            <CSSTransition
              key={place.id}
              timeout={300}
              classNames={{
                enter: classes.placeEnter,
                enterActive: classes.placeEnterActive,
                exit: classes.placeExit,
                exitActive: classes.placeExitActive,
              }}
            >
              <PlaceCard place={place} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <div className={classes.noResults}>
          <h2>No places found</h2>
          <p>
            Try adjusting your filters to see more places.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlacesList;

