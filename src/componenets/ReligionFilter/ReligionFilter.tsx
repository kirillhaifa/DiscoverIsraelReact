import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleReligion } from '../../store/Filters/filtersSlice';
import { selectActiveReligions } from '../../store/Filters/filtersSelectors';
import { translations } from '../../../public/translations';
import { FaBook, FaChevronDown } from 'react-icons/fa';
import { TbJewishStar } from 'react-icons/tb';
import { LiaCrossSolid } from 'react-icons/lia';
import { TbMoon } from 'react-icons/tb';
import { BsStarFill, BsSunFill } from 'react-icons/bs';

let classes = require('./religionFilter.module.scss');

const religionDefs = [
  { key: 'jewish',    Icon: TbJewishStar },
  { key: 'christian', Icon: LiaCrossSolid },
  { key: 'muslim',    Icon: TbMoon },
  { key: 'druze',     Icon: BsStarFill },
  { key: 'bahai',     Icon: BsSunFill },
] as const;

const ReligionFilter: React.FC = () => {
  const dispatch = useDispatch();
  const activeReligions = useSelector(selectActiveReligions);
  const language = useSelector((state: RootState) => state.language.language);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const hasActive = activeReligions.length > 0;

  return (
    <div className={classes.container} ref={containerRef}>
      <button
        className={`${classes.button} ${hasActive ? classes.buttonActive : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FaBook className={classes.bookIcon} />
        <span>{(translations as any).religionsFilter[language]}</span>
        {hasActive && (
          <span className={classes.badge}>{activeReligions.length}</span>
        )}
        <FaChevronDown className={`${classes.arrow} ${open ? classes.arrowOpen : ''}`} />
      </button>

      {open && (
        <div className={classes.dropdown} role="listbox">
          {religionDefs.map(({ key, Icon }) => {
            const isActive = activeReligions.includes(key);
            return (
              <label
                key={key}
                className={`${classes.item} ${isActive ? classes.itemActive : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => dispatch(toggleReligion(key))}
                  className={classes.hiddenCheckbox}
                />
                <Icon className={classes.icon} />
                <span className={classes.label}>
                  {(translations as any)[key][language]}
                </span>
                <span className={`${classes.checkmark} ${isActive ? classes.checkmarkActive : ''}`} />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReligionFilter;
