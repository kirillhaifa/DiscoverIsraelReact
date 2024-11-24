import React from "react";
import { useSelector } from "react-redux";
import { selectPlaces } from "../../store/Places/placesSelectors";
import { 
  selectUnvisited, 
  selectParameters, 
  selectDistance 
} from "../../store/Filters/filtersSelectors";
import { Place } from "../../types";
import PlaceCard from "../PlaceCard/PlaceCard";
import { getDistanceFromLatLonInKm } from "../../utils/functions";
import { selectUserRatings } from "../../store/User/userSelector";
import { RootState } from "../../store";
let classes = require('./PlacesList.module.scss')

const PlacesList = () => {
  // Извлекаем данные через мемоизированные селекторы
  const places = useSelector(selectPlaces); // Массив мест
  const unvisited = useSelector(selectUnvisited); // Фильтр "непосещенные"
  const parameters = useSelector(selectParameters); // Параметры фильтра
  const maxDistance = useSelector(selectDistance); // Максимальное расстояние
  const userRatings = useSelector(selectUserRatings); // Рейтинги пользователя
  const userCoordinates = useSelector((state: RootState) => state.location.coordinates); // Координаты пользователя

  // Фильтрация мест
  const filteredPlaces = places.filter((place: Place) => {
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

    return true; // Если место прошло все фильтры
  });

  return (
    <div className={classes.list}>
      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((place: Place) => (
          <PlaceCard key={place.id} place={place} />
        ))
      ) : (
        <div>
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

