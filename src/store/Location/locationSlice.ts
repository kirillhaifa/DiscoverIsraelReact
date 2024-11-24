import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  coordinates: [number, number] | null; // Координаты пользователя
  error: string | null; // Сообщение об ошибке
}

const initialState: LocationState = {
  coordinates: null,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<[number, number]>) {
      state.coordinates = action.payload;
      state.error = null; // Сбрасываем ошибку, если локация успешно установлена
    },
    setLocationError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.coordinates = null; // Сбрасываем координаты, если есть ошибка
    },
  },
});

export const { setLocation, setLocationError } = locationSlice.actions;

export default locationSlice.reducer;
