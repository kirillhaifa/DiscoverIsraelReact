import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { selectFilteredPlaces, selectPlaces } from "../../store/Places/placesSelectors";
import { Place } from "../../types";
import PlaceCard from "../PlaceCard/PlaceCard";
import Loader from "../Loader/Loader";
import { RootState } from "../../store";
import { translations } from "../../../public/translations";
let classes = require('./PlacesList.module.scss')

const PlacesList = () => {
  const places = useSelector(selectPlaces);
  const filteredPlaces = useSelector(selectFilteredPlaces);
  const language = useSelector((state: RootState) => state.language.language);
  const [isLoading, setIsLoading] = useState(true);

  // Отслеживаем состояние загрузки
  useEffect(() => {
    if (places.length > 0) {
      // Добавляем небольшую задержку для плавного перехода
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
    }
  }, [places]);

  // Показываем лоадер во время загрузки
  if (isLoading) {
    return (
      <div className={classes.list}>
        <Loader message={`${translations.loading[language] || translations.loading.en}...`} />
      </div>
    );
  }

  return (
    <div className={classes.list}>
      {filteredPlaces.length > 0 ? (
        <TransitionGroup component="div" className={classes.transitionGroup}>
          {filteredPlaces.map((place: Place) => (
            <CSSTransition
              key={place.id}
              timeout={300}
              classNames={{
                enter: classes.placeEnter,
                enterActive: classes.placeEnterActive,
                exit: classes.placeExit,
                exitActive: classes.placeExitActive,
              }}
            >
              <PlaceCard place={place} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <div className={classes.noResults}>
          <h2>No places found</h2>
          <p>
            Try adjusting your filters to see more places.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlacesList;

