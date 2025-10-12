import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCollectionsThunk, createCollectionThunk } from './collectionsThunks';
import { Collection } from '../../types';

interface CollectionsState {
  collections: Collection[];
  userCollections: Collection[];
  publicCollections: Collection[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  userCollections: [],
  publicCollections: [],
  loading: false,
  error: null,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    resetCollections: () => initialState,
    setCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionsThunk.fulfilled, (state, action: PayloadAction<Collection[]>) => {
        state.collections = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollectionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collections';
      })
      .addCase(createCollectionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollectionThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Добавляем новую коллекцию к существующим
        if (action.payload) {
          state.collections.push(action.payload);
        }
      })
      .addCase(createCollectionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create collection';
      });
  },
});

export const { resetCollections, setCollections } = collectionsSlice.actions;
export default collectionsSlice.reducer;
