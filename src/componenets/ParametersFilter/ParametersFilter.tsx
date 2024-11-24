import React from 'react';
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
import { FaWifi } from 'react-icons/fa';
import { MdAccessible } from 'react-icons/md';
import { MdOutlineForest } from 'react-icons/md';
import ReactComponent from '../../public/img/unesco.svg'
import { MdChildFriendly } from "react-icons/md";
import { LuMountainSnow } from "react-icons/lu";

let classes = require('./parametersFilter.module.scss');
let basic = require('../../public/Styles/basic.module.scss');

const ParametersFilter = () => {
  const dispatch = useDispatch();
  const parameters = useSelector(
    (state: RootState) => state.filters.parameters,
  );
  const language = useSelector((state: RootState) => state.language.language); // Текущий язык

  const handleChange = (key: string, value: boolean) => {
    dispatch(setParameter({ key, value }));
  };

  return (
    <div className={classes.container}>
      <form className={classes.form}>
        {/* Grill */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="grill"
            checked={parameters.grill}
            onChange={(e) => handleChange('grill', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="grill" className={classes.label}>
            <span className={classes.customCheckbox}></span>
            <MdOutlineOutdoorGrill className={`${classes.icon}`} />
            {translations.grill[language]}
          </label>
        </div>

        {/* Hiking */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="hiking"
            checked={parameters.hiking}
            onChange={(e) => handleChange('hiking', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="hiking" className={classes.label}>
            <LiaHikingSolid className={`${classes.icon}`} />
            <span className={classes.customCheckbox}></span>
            {translations.hiking[language]}
          </label>
        </div>

        {/* View */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="view"
            checked={parameters.view}
            onChange={(e) => handleChange('view', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="view" className={classes.label}>
            <PiBinocularsLight className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.view[language]}
          </label>
        </div>

        {/* Transport */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="transport"
            checked={parameters.transport}
            onChange={(e) => handleChange('transport', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="transport" className={classes.label}>
            <IoBusOutline className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.transport[language]}
          </label>
        </div>

        {/* Beach */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="beach"
            checked={parameters.beach}
            onChange={(e) => handleChange('beach', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="beach" className={classes.label}>
            <TbSunset2 className={classes.icon} />

            <span className={classes.customCheckbox}></span>
            {translations.beach[language]}
          </label>
        </div>

        {/* Historical */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="historical"
            checked={parameters.historical}
            onChange={(e) => handleChange('historical', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="historical" className={classes.label}>
            <GiAncientColumns className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.historical[language]}
          </label>
        </div>

        {/* Free */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="free"
            checked={parameters.free}
            onChange={(e) => handleChange('free', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="free" className={classes.label}>
            <TbFreeRights className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.free[language]}
          </label>
        </div>

        {/* Pets */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="pets"
            checked={parameters.pets}
            onChange={(e) => handleChange('pets', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="pets" className={classes.label}>
            <LiaDogSolid className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.pets[language]}
          </label>
        </div>

        {/* Parking */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="parking"
            checked={parameters.parking}
            onChange={(e) => handleChange('parking', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="parking" className={classes.label}>
            <LuParkingSquare className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.parking[language]}
          </label>
        </div>

        {/* <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="toilets"
            checked={parameters.toilets}
            onChange={(e) => handleChange('toilets', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="toilets" className={classes.label}>
            <MdOutlineWc className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.toilets[language]}
          </label>
        </div>

        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="drinkingWater"
            checked={parameters.drinkingWater}
            onChange={(e) => handleChange('drinkingWater', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="drinkingWater" className={classes.label}>
            <span className={classes.customCheckbox}></span>
            {translations.drinkingWater[language]}
          </label>
        </div>

        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="cafe"
            checked={parameters.cafe}
            onChange={(e) => handleChange('cafe', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="cafe" className={classes.label}>
            <span className={classes.customCheckbox}></span>
            {translations.cafe[language]}
          </label>
        </div>
 */}
        {/* Wifi */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="wifi"
            checked={parameters.wifi}
            onChange={(e) => handleChange('wifi', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="wifi" className={classes.label}>
            <FaWifi className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.wifi[language]}
          </label>
        </div>

        {/* Accessible */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="accessible"
            checked={parameters.accessible}
            onChange={(e) => handleChange('accessible', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="accessible" className={classes.label}>
            <MdAccessible className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.accessible[language]}
          </label>
        </div>

        {/* UNESCO */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="unesco"
            checked={parameters.unesco}
            onChange={(e) => handleChange('unesco', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="unesco" className={classes.label}>
            <LuMountainSnow className={classes.icon}></LuMountainSnow>
            <span className={classes.customCheckbox}></span>
            {translations.unesco[language]}
          </label>
        </div>

        {/* National Park */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="nationalPark"
            checked={parameters.nationalPark}
            onChange={(e) => handleChange('nationalPark', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="nationalPark" className={classes.label}>
            <MdOutlineForest className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.nationalPark[language]}
          </label>
        </div>

        {/* Kids Friendly */}
        <div className={classes.inputContainer}>
          <input
            type="checkbox"
            id="kidsFriendly"
            checked={parameters.kidsFriendly}
            onChange={(e) => handleChange('kidsFriendly', e.target.checked)}
            className={`${basic.visuallyHidden} ${classes.input}`}
          />
          <label htmlFor="kidsFriendly" className={classes.label}>
            <MdChildFriendly className={classes.icon} />
            <span className={classes.customCheckbox}></span>
            {translations.kidsFriendly[language]}
          </label>
        </div>
      </form>
    </div>
  );
};

export default ParametersFilter;
