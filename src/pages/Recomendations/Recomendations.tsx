import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import RecommendationCard from '../../componenets/RecommendationCard/PlaceInCollectionCard';
import CollectionCard from '../../componenets/CollectionCard/CollectionCard';
import { translations } from '../../../public/translations';
import { fetchCollectionsThunk } from '../../store/Collections/collectionsThunks';
let styles = require('./Recomendations.module.scss');

const Recommendations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const places = useSelector((state: RootState) => state.places.places);
  const { collections, loading: collectionsLoading } = useSelector((state: RootState) => state.collections);

  // Загружаем коллекции при монтировании компонента
  useEffect(() => {
    dispatch(fetchCollectionsThunk());
  }, [dispatch]);


  return (
    <div className={styles.wrapper}>
      <section className={styles.block}>
        <h2 className={styles.heading}>{translations.personalRecommendationsTitle[language]}</h2>
        <p className={styles.status}>{translations.inProgress[language]}</p>
        <p className={styles.description}>{translations.personalRecommendationsDesc[language]}</p>
      </section>


      {/* Секция коллекций */}
      <section className={styles.block}>
        <h2 className={styles.heading}>{translations.thematicCollectionsTitle[language]}</h2>
        {collectionsLoading ? (
          <p className={styles.status}>{translations.loading[language]}</p>
        )  : (
          <div className={styles.cardsGrid}>
            {collections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Recommendations;