import { createSelector } from 'reselect';
import { RootState } from '..';
import { Place } from '../../types';
import { getDistanceFromLatLonInKm } from '../../utils/functions';

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

// Селектор для подсчёта мест с определённым параметром
export const selectPlacesCountByParameter = (parameter: keyof Place['parameters']) =>
  createSelector(
    [selectPlaces],
    (places) => places.filter((place) => place.parameters[parameter]).length
  );
