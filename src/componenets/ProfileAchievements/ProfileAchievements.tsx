import React from 'react';
import { translations } from '../../public/translations';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MdHome, MdDirectionsWalk, MdExplore } from 'react-icons/md';
import { FaBinoculars, FaSuitcase, FaRoute, FaHiking, FaMapSigns, FaGlobeAmericas } from 'react-icons/fa';
import { GiCompass } from 'react-icons/gi';
let classes = require('./ProfileAchievements.module.scss');

interface AchievementLevel { threshold: number; key: keyof typeof translations; }

interface Props {
  ratingCount: number;
  levels: AchievementLevel[];
}

const ProfileAchievements: React.FC<Props> = ({ ratingCount, levels }) => {
  const language = useSelector((state: RootState) => state.language.language);
  const iconMap: Record<string, JSX.Element> = {
    homebody: <MdHome />,
    pedestrian: <MdDirectionsWalk />,
    scout: <FaBinoculars />,
    tourist: <FaSuitcase />,
    wanderer: <FaRoute />,
    navigator: <MdExplore />,
    adventurer: <FaHiking />,
    trailblazer: <FaMapSigns />,
    traveler: <FaGlobeAmericas />,
    agasfer: <GiCompass />,
  };
  return (
    <div className={classes.root}>
      {levels.map((level, idx) => {
        const next = levels[idx + 1];
        const completed = ratingCount >= (next ? next.threshold : level.threshold);
        const isCurrent = !completed && ratingCount >= level.threshold;
        let pct = 0;
        if (completed) {
          pct = 100;
        } else if (isCurrent && next) {
          const span = next.threshold - level.threshold;
            pct = ((ratingCount - level.threshold) / span) * 100;
        } else if (!next && ratingCount >= level.threshold) {
          pct = 100; // last level partial when beyond threshold
        }
        return (
          <div key={level.key as string} className={`${classes.card} ${completed ? classes.cardCompleted : ''} ${isCurrent ? classes.cardActive : ''}`}>
            <div className={classes.level}>{level.threshold}+</div>
            <div className={classes.icon} aria-hidden>
              <div className={classes.iconBase}>{iconMap[level.key as string]}</div>
              <div className={classes.iconFill} style={{ width: `${Math.min(Math.max(pct,0),100)}%` }}>
                {iconMap[level.key as string]}
              </div>
            </div>
            <div className={classes.title}>{translations[level.key][language]}</div>
            <div className={classes.progressBarWrap}>
              <div className={classes.progress} style={{ width: `${Math.min(Math.max(pct,0),100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileAchievements;
