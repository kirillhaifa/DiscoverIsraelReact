import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSearchText } from '../../store/Filters/filtersSlice';
let styles = require('./SearchBar.module.scss');

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.filters.searchText);
  return (
    <div className={styles.textFilterWrapper}>
      <input
        type="text"
        className={styles.textInput}
        value={searchText}
        onChange={e => dispatch(setSearchText(e.target.value))}
        placeholder={'Поиск по тексту...'}
      />
    </div>
  );
};

export default SearchBar;
