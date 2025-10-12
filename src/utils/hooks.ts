import { AppDispatch } from "../store";
import { setLocation, setLocationError } from "../store/Location/locationSlice";
import { useRef, useEffect, useState } from "react";

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

/**
 * useDebounce хук для задержки вызова значения/функции.
 * @param value - значение, которое нужно дебаунсить
 * @param delay - задержка в мс
 * @returns дебаунсенное значение
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
