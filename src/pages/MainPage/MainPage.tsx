import React from 'react';
import MainLayout from '../../componenets/Layout/MainLayout';
import ParametersFilter from '../../componenets/ParametersFilter/ParametersFilter';
import SearchBar from '../../componenets/SearchBar/SearchBar';
import DistanceFilter from '../../componenets/DistanceFilter/distanceFilter';
import UnvisitedFilter from '../../componenets/UnvisitedFliter/UnvisitedFilter';
import PlacesList from '../../componenets/PlacesList/PlacesList';
let classes = require('./MainPage.module.scss');

const MainPageLayout: React.FC = () => {
  return (
    <>
      <ParametersFilter />
      <SearchBar />
      <div className={classes.filtersRow}>
        <DistanceFilter />
        <UnvisitedFilter />
      </div>
      <div className={classes.content}>
        <PlacesList />
      </div>
    </>
  );
};

export default MainPageLayout;
