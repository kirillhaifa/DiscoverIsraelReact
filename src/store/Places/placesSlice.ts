import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPlacesThunk, addPlaceThunk } from './placesThunks';
import { Place } from '../../types';

interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  places: [],
  loading: false,
  error: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    resetPlaces: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacesThunk.fulfilled, (state, action: PayloadAction<Place[]>) => {
        state.places = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlacesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch places';
      })
      .addCase(addPlaceThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetPlaces } = placesSlice.actions;
export default placesSlice.reducer;
