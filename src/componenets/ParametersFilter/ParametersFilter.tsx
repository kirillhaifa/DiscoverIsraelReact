import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setParameter } from '../../store/Filters/filtersSlice';
import { translations } from '../../public/translations'; // Импорт переводов
import { MdOutlineOutdoorGrill } from 'react-icons/md';
import { LiaHikingSolid } from 'react-icons/lia';
import { PiBinocularsLight } from 'react-icons/pi';
import { IoBusOutline } from 'react-icons/io5';
import { TbSunset2 } from 'react-icons/tb';
import { GiAncientColumns } from 'react-icons/gi';
import { TbFreeRights } from 'react-icons/tb';
import { LiaDogSolid } from 'react-icons/lia';
import { LuParkingSquare } from 'react-icons/lu';
import { MdOutlineWc } from 'react-icons/md';
import { FaCheck, FaWifi } from 'react-icons/fa';
import { MdAccessible } from 'react-icons/md';
import { MdOutlineForest } from 'react-icons/md';
import ReactComponent from '../../public/img/unesco.svg'
import { MdChildFriendly } from "react-icons/md";
import { LuMountainSnow } from "react-icons/lu";
import { FaCheckCircle } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

let classes = require('./parametersFilter.module.scss');
let basic = require('../../public/Styles/basic.module.scss');

const ParametersFilter = () => {
  const dispatch = useDispatch();
  const parameters = useSelector(
    (state: RootState) => state.filters.parameters,
  );
  const language = useSelector((state: RootState) => state.language.language); // Текущий язык
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [uniformWidth, setUniformWidth] = useState<number | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  const handleChange = (key: string, value: boolean) => {
    dispatch(setParameter({ key, value }));
  };

  // Закрытие dropdown при клике вне меню
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Re-measure on language change (different text length) and on window resize (desktop only)
  useLayoutEffect(() => {
    const measure = () => {
      if (window.innerWidth < 768) { // mobile: let them be full width
        setUniformWidth(null);
        return;
      }
      const widths = itemRefs.current.map(el => el ? el.offsetWidth : 0);
      if (widths.length) {
        const max = Math.max(...widths);
        setUniformWidth(max);
      }
    };
    // Delay to ensure fonts/styles applied
    requestAnimationFrame(() => measure());
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [language]);

  const filterDefs = [
    { key: 'grill', Icon: MdOutlineOutdoorGrill },
    { key: 'hiking', Icon: LiaHikingSolid },
    { key: 'view', Icon: PiBinocularsLight },
    { key: 'transport', Icon: IoBusOutline },
    { key: 'beach', Icon: TbSunset2 },
    { key: 'historical', Icon: GiAncientColumns },
    { key: 'free', Icon: TbFreeRights },
    { key: 'pets', Icon: LiaDogSolid },
    { key: 'parking', Icon: LuParkingSquare },
    { key: 'wifi', Icon: FaWifi },
    { key: 'accessible', Icon: MdAccessible },
    { key: 'unesco', Icon: LuMountainSnow },
    { key: 'nationalPark', Icon: MdOutlineForest },
    { key: 'kidsFriendly', Icon: MdChildFriendly },
  ] as const;

  // Список чекбоксов (фильтров)
  const filterCheckboxes = (
    <form className={classes.form}>
      {filterDefs.map((f, i) => {
        const IconCmp = f.Icon;
        const checked = (parameters as any)[f.key];
        return (
          <div
            key={f.key}
            className={classes.inputContainer}
            ref={el => { if (el) itemRefs.current[i] = el; }}
            style={uniformWidth ? { width: uniformWidth } : undefined}
          >
            <input
              type="checkbox"
              id={f.key}
              checked={checked}
              onChange={(e) => handleChange(f.key, e.target.checked)}
              className={`${basic.visuallyHidden} ${classes.input}`}
            />
            <label htmlFor={f.key} className={classes.label}>
              <IconCmp className={classes.icon} />
              <span className={classes.customCheckbox}></span>
              {(translations as any)[f.key][language]}
            </label>
            <div className={classes.checkboxBadge}><FaCheck size={10} /></div>
          </div>
        );
      })}
    </form>
  );

  return (
    <div className={classes.container} ref={dropdownRef}>
      {/* Desktop: обычные фильтры */}
      <div className={classes.desktopFilters}>{filterCheckboxes}</div>
      {/* Mobile: кнопка и дропдаун */}
      <div className={classes.mobileDropdownWrapper}>
        <button
          className={classes.dropdownButton}
          onClick={() => setDropdownOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          {translations.filters[language]}
          <FaChevronDown className={`${classes.arrowIcon} ${dropdownOpen ? classes.arrowOpen : ''}`} />
        </button>
        {dropdownOpen && (
          <div className={classes.dropdownMenu} role="listbox">
            {filterCheckboxes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersFilter;
