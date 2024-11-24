import { AppDispatch } from "../store";
import { setLocation, setLocationError } from "../store/Location/locationSlice";

export const fetchUserLocation = () => async (dispatch: AppDispatch) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        dispatch(setLocation(coordinates)); // Сохраняем координаты в Redux
      },
      (error) => {
        dispatch(setLocationError(`Ошибка определения локации: ${error.message}`));
      }
    );
  } else {
    dispatch(setLocationError("Геолокация не поддерживается вашим браузером."));
  }
};
