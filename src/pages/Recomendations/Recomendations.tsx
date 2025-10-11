import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import RecommendationCard from '../../componenets/RecommendationCard/RecommendationCard';
import { translations } from '../../public/translations';
let styles = require('./Recomendations.module.scss');

const Recomendations: React.FC = () => {
  const language = useSelector((state: RootState) => state.language.language);
  const places = useSelector((state: RootState) => state.places.places);
  const jesusPathIds = [
    'XDdrnFpMo1H8KIwgXdSR',
    'ugLABuH8QmFHHUnrrBve',
    'xzYLoB188IrQV8npt70r',
    '1xpvrofeP7M9SdFwaUhq',
    'to9Iuz1Qf3kpB5Pp8kuW',
    '7m9GQui0vKoQA6SjrLxd',
    'eND0M1kjXcbEVrSiscBS'
  ];
  const jesusPlaces = places.filter(p => jesusPathIds.includes(p.id));

  const linkify = (text: string) => {
    // Map simple keywords to place ids (English names assumed in data) for inline links
    const map: { keyword: RegExp; id: string }[] = [
      { keyword: /Room of the Last Supper|Горница Тайной Вечери|חדר הסעודה האחרונה/i, id: 'XDdrnFpMo1H8KIwgXdSR' },
      { keyword: /Gethsemane|Гефсимани|גתשמני/i, id: 'ugLABuH8QmFHHUnrrBve' },
      { keyword: /Holy Sepulchre|Гроба Господня|הקבר/i, id: 'xzYLoB188IrQV8npt70r' },
      { keyword: /Mount Tabor|Фавор|תבור/i, id: '1xpvrofeP7M9SdFwaUhq' },
      { keyword: /Capernaum|Капернаум|כפר נחום/i, id: 'to9Iuz1Qf3kpB5Pp8kuW' },
      { keyword: /Nazareth|Назарет|נצרת/i, id: 'eND0M1kjXcbEVrSiscBS' },
      { keyword: /Yardenit|Ярденит|ירדנית/i, id: '7m9GQui0vKoQA6SjrLxd' },
    ];
    let parts: (string | JSX.Element)[] = [text];
    map.forEach(({ keyword, id }) => {
      parts = parts.flatMap(segment => {
        if (typeof segment !== 'string') return [segment];
        const pieces = segment.split(keyword);
        const matches = segment.match(keyword);
        if (!matches) return [segment];
        const out: (string | JSX.Element)[] = [];
        pieces.forEach((piece, idx) => {
          out.push(piece);
          if (idx < pieces.length - 1) {
            out.push(<a key={id + idx} href={`#/places/${id}`} className={styles.inlineLink}>{matches[0]}</a>);
          }
        });
        return out;
      });
    });
    return parts;
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.block}>
        <h2 className={styles.heading}>{translations.personalRecommendationsTitle[language]}</h2>
        <p className={styles.status}>{translations.inProgress[language]}</p>
        <p className={styles.description}>{translations.personalRecommendationsDesc[language]}</p>
      </section>
      <section className={styles.block}>
        <h2 className={styles.heading}>{translations.thematicCollectionsTitle[language]}</h2>
        <div className={styles.subBlock}>
          <h3 className={styles.subHeading}>{translations.jesusPathTitle[language]}</h3>
          <p className={styles.description}>{linkify(translations.jesusPathNarrative[language])}</p>
          <h4 className={styles.placesHeading}>{translations.jesusPathPlacesHeading[language]}</h4>
          <ul className={styles.placesList}>
            <li>{translations.jesusPathRoomOfSupper[language]}</li>
            <li>{translations.jesusPathGethsemane[language]}</li>
            <li>{translations.jesusPathSepulchre[language]}</li>
            <li>{translations.jesusPathTabor[language]}</li>
            <li>{translations.jesusPathCapernaum[language]}</li>
            <li>{translations.jesusPathNazareth[language]}</li>
            <li>{translations.jesusPathYardenit[language]}</li>
          </ul>
          <div className={styles.cardsGrid}>
            {jesusPlaces.map(p => (<RecommendationCard key={p.id} place={p} />))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recomendations;