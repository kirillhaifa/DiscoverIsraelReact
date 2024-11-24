import { createSelector } from "reselect";
import { RootState } from "..";

// Базовый селектор для слайса фильтров
const selectFiltersSlice = (state: RootState) => state.filters;

// Селектор для получения региона
export const selectRegion = createSelector(
  [selectFiltersSlice],
  (filters) => filters.region
);

// Селектор для получения расстояния
export const selectDistance = createSelector(
  [selectFiltersSlice],
  (filters) => filters.distance
);

// Селектор для фильтра по сезону
export const selectSeason = createSelector(
  [selectFiltersSlice],
  (filters) => filters.season
);

// Селектор для фильтра "открыто сейчас"
export const selectOpenNow = createSelector(
  [selectFiltersSlice],
  (filters) => filters.openNow
);

// Селектор для фильтра "непосещенные"
export const selectUnvisited = createSelector(
  [selectFiltersSlice],
  (filters) => filters.unvisited
);

// Селектор для минимального времени посещения
export const selectMinVisitTime = createSelector(
  [selectFiltersSlice],
  (filters) => filters.minVisitTime
);

// Селектор для фильтра "только с фото"
export const selectHasPhotos = createSelector(
  [selectFiltersSlice],
  (filters) => filters.hasPhotos
);

// Селектор для рейтинга
export const selectRating = createSelector(
  [selectFiltersSlice],
  (filters) => filters.rating
);

// Селектор для всех параметров
export const selectParameters = createSelector(
  [selectFiltersSlice],
  (filters) => filters.parameters
);

// Селектор для конкретного параметра (динамический)
export const selectParameter = (key: string) =>
  createSelector([selectParameters], (parameters) => parameters[key]);
