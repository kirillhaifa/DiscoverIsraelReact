import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSearchText } from '../../store/Filters/filtersSlice';
let styles = require('./SearchBar.module.scss');
import { useDebounce } from '../../utils/hooks';
import { translations } from '../../public/translations';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.filters.searchText);
  const [inputValue, setInputValue] = React.useState(searchText);
  const debouncedValue = useDebounce(inputValue, 400);
  const language = useSelector((state: RootState) => state.language.language); 

  useEffect(() => {
    dispatch(setSearchText(debouncedValue));
  }, [debouncedValue, dispatch]);

  return (
    <div className={styles.textFilterWrapper}>
      <input
        type="text"
        className={styles.textInput}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={translations.searchPlaceholder[language] || translations.searchPlaceholder.ru}
      />
    </div>
  );
};

export default SearchBar;
