import React from 'react';
import TripPlanner from '../TripPlanner/TripPlanner';

const SharedTrip: React.FC = () => {
  return <TripPlanner allowUnauthorized={true} />;
};

export default SharedTrip;
