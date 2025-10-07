import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setUnvisited } from "../../store/Filters/filtersSlice";
import { translations } from "../../public/translations";

const UnvisitedFilter = () => {
  const dispatch = useDispatch();
  const unvisited = useSelector((state: RootState) => state.filters.unvisited);
  const language = useSelector((state: RootState) => state.language.language);

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
        {translations.unvisitedOnly[language]}
      </label>
    </div>
  );
};

export default UnvisitedFilter;
