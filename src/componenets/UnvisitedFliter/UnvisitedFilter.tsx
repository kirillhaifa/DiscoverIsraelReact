import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setUnvisited } from "../../store/Filters/filtersSlice";

const UnvisitedFilter = () => {
  const dispatch = useDispatch();
  const unvisited = useSelector((state: RootState) => state.filters.unvisited);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUnvisited(event.target.checked));
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={unvisited}
          onChange={handleChange}
        />
        Только непосещенные места
      </label>
    </div>
  );
};

export default UnvisitedFilter;
