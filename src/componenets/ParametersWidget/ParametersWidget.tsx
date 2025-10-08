import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Place } from '../../types';
import { translations } from '../../public/translations';
import { MdOutlineOutdoorGrill } from 'react-icons/md';
import { LiaHikingSolid } from 'react-icons/lia';
import { PiBinocularsLight } from 'react-icons/pi';
import { IoBusOutline } from 'react-icons/io5';
import { TbSunset2 } from 'react-icons/tb';
import { GiAncientColumns } from 'react-icons/gi';
import { TbFreeRights } from 'react-icons/tb';
import { LiaDogSolid } from 'react-icons/lia';
import { LuParkingSquare } from 'react-icons/lu';
import { FaWifi } from 'react-icons/fa';
import { MdAccessible } from 'react-icons/md';
import { MdOutlineForest } from 'react-icons/md';
import { MdChildFriendly } from 'react-icons/md';
import { LuMountainSnow } from 'react-icons/lu';

let classes = require('./ParametersWidget.module.scss');

type ParamKey =
  | 'grill'
  | 'hiking'
  | 'view'
  | 'transport'
  | 'beach'
  | 'historical'
  | 'free'
  | 'pets'
  | 'parking'
  | 'wifi'
  | 'accessible'
  | 'unesco'
  | 'nationalPark'
  | 'kidsFriendly';

interface ParametersWidgetProps {
  place: Place;
}

const paramMap: Record<ParamKey, { Icon: React.ComponentType<any>; labelKey: string }> = {
  grill: { Icon: MdOutlineOutdoorGrill, labelKey: 'grill' },
  hiking: { Icon: LiaHikingSolid, labelKey: 'hiking' },
  view: { Icon: PiBinocularsLight, labelKey: 'view' },
  transport: { Icon: IoBusOutline, labelKey: 'transport' },
  beach: { Icon: TbSunset2, labelKey: 'beach' },
  historical: { Icon: GiAncientColumns, labelKey: 'historical' },
  free: { Icon: TbFreeRights, labelKey: 'free' },
  pets: { Icon: LiaDogSolid, labelKey: 'pets' },
  parking: { Icon: LuParkingSquare, labelKey: 'parking' },
  wifi: { Icon: FaWifi, labelKey: 'wifi' },
  accessible: { Icon: MdAccessible, labelKey: 'accessible' },
  unesco: { Icon: LuMountainSnow, labelKey: 'unesco' },
  nationalPark: { Icon: MdOutlineForest, labelKey: 'nationalPark' },
  kidsFriendly: { Icon: MdChildFriendly, labelKey: 'kidsFriendly' },
};

const ParametersWidget: React.FC<ParametersWidgetProps> = ({ place }) => {
  // place stores parameters under place.parameters (object of booleans)
  const params = (place as any).parameters || (place as any);
  const activeKeys = Object.keys(paramMap).filter((k) => params && params[k]);
  const language = useSelector((state: RootState) => (state.language as any).language || 'en');

  if (activeKeys.length === 0) return null;

  return (
    <div className={classes.widget} aria-hidden={false}>
      {activeKeys.map((k) => {
        const key = k as ParamKey;
        const { Icon, labelKey } = paramMap[key];
        return (
          <Tooltip key={key} title={(translations as any)[labelKey]?.[language] || key} arrow>
            <div className={classes.iconWrap}>
              <Icon className={classes.icon} />
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ParametersWidget;
