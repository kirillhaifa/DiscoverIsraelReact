import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  region: string | null;
  distance: number;
  season: boolean;
  openNow: boolean;
  unvisited: boolean;
  minVisitTime: number;
  hasPhotos: boolean;
  rating: string | null;
  activeTags: string[];  // активные теги-фильтры: ['hiking', 'free', 'bombShelter', ...]
  activeReligions: string[]; // активные религии-фильтры
  searchText: string;
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
  activeTags: [],
  activeReligions: [],
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
    toggleTag(state, action: PayloadAction<string>) {
      const tag = action.payload;
      const idx = state.activeTags.indexOf(tag);
      if (idx === -1) {
        state.activeTags.push(tag);
      } else {
        state.activeTags.splice(idx, 1);
      }
    },
    toggleReligion(state, action: PayloadAction<string>) {
      const religion = action.payload;
      const idx = state.activeReligions.indexOf(religion);
      if (idx === -1) {
        state.activeReligions.push(religion);
      } else {
        state.activeReligions.splice(idx, 1);
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
  toggleTag,
  toggleReligion,
  setSearchText,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
