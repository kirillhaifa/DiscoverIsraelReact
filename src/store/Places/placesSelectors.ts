import { createSelector } from 'reselect';
import { RootState } from '..';
import { Place } from '../../types';
import { getDistanceFromLatLonInKm } from '../../utils/functions';
import {
  selectUnvisited,
  selectActiveTags,
  selectActiveReligions,
  selectDistance,
  selectSearchText,
} from '../Filters/filtersSelectors';
import { selectUserRatings } from '../User/userSelector';

// Базовый селектор для слайса мест
const selectPlacesSlice = (state: RootState) => state.places;

// Селектор для полного списка мест
export const selectPlaces = createSelector(
  [selectPlacesSlice],
  (placesSlice) => placesSlice.places
);

// Селектор для загрузочного состояния
export const selectPlacesLoading = createSelector(
  [selectPlacesSlice],
  (placesSlice) => placesSlice.loading
);

// Селектор для ошибок загрузки
export const selectPlacesError = createSelector(
  [selectPlacesSlice],
  (placesSlice) => placesSlice.error
);

// Селектор для получения конкретного места по ID
export const selectPlaceById = (placeId: string) =>
  createSelector([selectPlaces], (places) =>
    places.find((place) => place.id === placeId)
  );

// // Селектор для фильтрации мест (пример с параметрами)
// export const selectFilteredPlaces = createSelector(
//   [selectPlaces, selectFilters, selectUserCoordinates],
//   (places, filters, userCoordinates) => {
//     return places.filter((place) => {
//       const matchesParameters = Object.entries(filters.parameters).every(
//         ([key, value]) => {
//           if (value) {
//             return place.parameters[key as keyof Place['parameters']] === true;
//           }
//           return true;
//         }
//       );

//       const matchesDistance =
//         filters.distance === 500 ||
//         !userCoordinates || // Используем userCoordinates из другого слайса
//         !place.coordinates ||
//         getDistanceFromLatLonInKm(
//           userCoordinates[0],
//           userCoordinates[1],
//           place.coordinates[0],
//           place.coordinates[1]
//         ) <= filters.distance;

//       return matchesParameters && matchesDistance;
//     });
//   }
// );

// Селектор для подсчёта общего числа мест
export const selectPlacesCount = createSelector(
  [selectPlaces],
  (places) => places.length
);

// Координаты пользователя
const selectUserCoordinates = (state: RootState) => state.location.coordinates;

// Мемоизированная фильтрация — все фильтры в одном месте
export const selectFilteredPlaces = createSelector(
  [selectPlaces, selectUnvisited, selectActiveTags, selectActiveReligions,
   selectDistance, selectSearchText, selectUserRatings, selectUserCoordinates],
  (places, unvisited, activeTags, activeReligions, maxDistance, searchText, userRatings, userCoordinates) => {
    return places.filter((place: Place) => {
      // Непосещённые
      if (unvisited && userRatings.some(r => r.placeId === place.id)) return false;

      // Теги (все должны совпасть — AND)
      if (activeTags.length > 0 && !activeTags.every(tag => place.tags.includes(tag))) return false;

      // Религии (хотя бы одна — OR)
      if (activeReligions.length > 0 && !activeReligions.some(r => place.religions.includes(r as any))) return false;

      // Расстояние
      if (userCoordinates && maxDistance < 500) {
        const dist = getDistanceFromLatLonInKm(
          userCoordinates[0], userCoordinates[1],
          place.coordinates[0], place.coordinates[1]
        );
        if (dist > maxDistance) return false;
      }

      // Текстовый поиск
      if (searchText?.trim()) {
        const q = searchText.toLowerCase().trim();
        const match =
          Object.values(place.placeName).some(n => n.toLowerCase().includes(q)) ||
          Object.values(place.shortDescription).some(d => d.toLowerCase().includes(q)) ||
          Object.values(place.extendedDescription).some(d => d.toLowerCase().includes(q)) ||
          place.region.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }
);

// Селектор для подсчёта мест с определённым тегом
export const selectPlacesCountByTag = (tag: string) =>
  createSelector(
    [selectPlaces],
    (places) => places.filter((place) => place.tags.includes(tag)).length
  );
