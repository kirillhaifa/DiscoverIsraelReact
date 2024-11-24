  import React from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { RootState } from "../../store";
  import { setDistance } from "../../store/Filters/filtersSlice";

  const DistanceFilter = () => {
    const dispatch = useDispatch();
    const maxDistance = useSelector((state: RootState) => state.filters.distance);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDistance = Number(event.target.value);
      dispatch(setDistance(newDistance)); // Обновляем расстояние в Redux
    };

    return (
      <div>
        <label htmlFor="distance">Максимальное расстояние: {maxDistance} км</label>
        <input
          id="distance"
          type="range"
          min="10"
          max="500"
          step="10"
          value={maxDistance || 500} // Используем значение из Redux
          onChange={handleChange} // Вызываем обновление Redux при изменении
        />
      </div>
    );
  };

  export default DistanceFilter;
