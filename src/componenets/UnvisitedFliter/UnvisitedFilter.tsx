import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setUnvisited } from "../../store/Filters/filtersSlice";
import { translations } from "../../public/translations";
let styles = require('./UnvisitedFilter.module.scss');

const UnvisitedFilter = () => {
  const dispatch = useDispatch();
  const unvisited = useSelector((state: RootState) => state.filters.unvisited);
  const language = useSelector((state: RootState) => state.language.language);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUnvisited(event.target.checked));
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        <span
          className={
            unvisited ? `${styles.checkbox} ${styles.checked}` : styles.checkbox
          }
        >
          <input
            type="checkbox"
            checked={unvisited}
            onChange={handleChange}
            className={styles.input}
          />
          <svg
            className={styles.checkmark}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="3,8 7,12 13,4"
              stroke="var(--main-color, #2d7c9a)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {translations.unvisitedOnly[language]}
      </label>
    </div>
  );
};

export default UnvisitedFilter;
