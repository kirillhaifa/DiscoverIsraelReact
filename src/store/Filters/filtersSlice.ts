import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  region: string | null; // Например, "Northern Israel"
  distance: number ; // Максимальное расстояние в километрах
  season: boolean; // Сейчас подходящий сезон
  openNow: boolean; // Открыто сейчас
  unvisited: boolean; // Не посещенные места
  minVisitTime: number; // Минимальное время для посещения в минутах
  hasPhotos: boolean; // Только с фото
  rating: string | null; // Рейтинг: "high", "low" или null
  parameters: {
    [key: string]: boolean; // Параметры из объекта `parameters`
  };
  searchText: string; // Новый фильтр по тексту
}

const initialState: FiltersState = {
  region: null,
  distance: 500,
  season: true,
  openNow: false,
  unvisited: true,
  minVisitTime: 0,
  hasPhotos: false,
  rating: null,
  parameters: {
    grill: false,
    hiking: false,
    view: false,
    transport: false,
    beach: false,
    historical: false,
    free: false,
    pets: false,
    parking: false,
    toilets: false,
    drinkingWater: false,
    cafe: false,
    wifi: false,
    accessible: false,
    unesco: false,
    nationalPark: false,
    kidsFriendly: false,
  },
  searchText: '',
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<string | null>) {
      state.region = action.payload;
    },
    setDistance(state, action: PayloadAction<number>) {
      state.distance = action.payload;
    },
       
    setSeason(state, action: PayloadAction<boolean>) {
      state.season = action.payload;
    },
    setOpenNow(state, action: PayloadAction<boolean>) {
      state.openNow = action.payload;
    },
    setUnvisited(state, action: PayloadAction<boolean>) {
      state.unvisited = action.payload;
    },
    setMinVisitTime(state, action: PayloadAction<number>) {
      state.minVisitTime = action.payload;
    },
    setHasPhotos(state, action: PayloadAction<boolean>) {
      state.hasPhotos = action.payload;
    },
    setRating(state, action: PayloadAction<string | null>) {
      state.rating = action.payload;
    },
    setParameter(state, action: PayloadAction<{ key: string; value: boolean }>) {
      const { key, value } = action.payload;
      if (key in state.parameters) {
        state.parameters[key] = value;
      }
    },
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    resetFilters(state) {
      return initialState; // Сбрасывает все фильтры к исходному состоянию
    },
  },
});

export const {
  setRegion,
  setDistance,
  setSeason,
  setOpenNow,
  setUnvisited,
  setMinVisitTime,
  setHasPhotos,
  setRating,
  setParameter,
  setSearchText,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
