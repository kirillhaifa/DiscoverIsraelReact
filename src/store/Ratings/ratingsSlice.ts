import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRatingsThunk } from './fetchRatingsThunk';

export interface Rating {
  placeId: string;
  rating: number;
}

interface RatingsState {
  ratings: Rating[];
  loading: boolean;
  error: string | null;
}

const initialState: RatingsState = {
  ratings: [],
  loading: false,
  error: null,
};

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    clearRatings: (state) => {
      state.ratings = [];
      state.loading = false;
      state.error = null;
    },
    addOrUpdateRating: (state, action: PayloadAction<Rating>) => {
      const idx = state.ratings.findIndex((r) => r.placeId === action.payload.placeId);
      if (idx >= 0) {
        state.ratings[idx].rating = action.payload.rating;
      } else {
        state.ratings.push(action.payload);
      }
    },
    removeRating: (state, action: PayloadAction<string>) => {
      state.ratings = state.ratings.filter((r) => r.placeId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatingsThunk.fulfilled, (state, action: PayloadAction<Rating[]>) => {
        state.ratings = action.payload;
        state.loading = false;
      })
      .addCase(fetchRatingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ratings';
      });
  },
});

export const { clearRatings, addOrUpdateRating, removeRating } = ratingsSlice.actions;
export default ratingsSlice.reducer;
