import React from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  const {
    userData,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

  return (
    <div className="place-details">
      <h2>{place.placeName.en}</h2>
      {userData?.role === 'admin' && (
        <>
          <p>ID: {place.id}</p>
        </>
      )}

      <p><strong>Short Description:</strong> {place.shortDescription.en}</p>
      <p><strong>Extended Description:</strong> {place.extendedDescription.en}</p>
      <p><strong>Region:</strong> {place.region}</p>
      <p><strong>Coordinates:</strong> {place.coordinates[0]}, {place.coordinates[1]}</p>
      <p><strong>Google Maps Link:</strong> <a href={place.googleMapsLink} target="_blank" rel="noopener noreferrer">Open Map</a></p>
      
      <h3>Parameters:</h3>
      <ul>
        <li>Grill: {place.parameters.grill ? 'Yes' : 'No'}</li>
        <li>Hiking: {place.parameters.hiking ? 'Yes' : 'No'}</li>
        <li>View: {place.parameters.view ? 'Yes' : 'No'}</li>
        <li>Beach: {place.parameters.beach ? 'Yes' : 'No'}</li>
        {/* Add more parameters as needed */}
      </ul>
      
      <h3>Photos:</h3>
      <ul>
        {place.photos.map((photo, index) => (
          <li key={index}>
            <p>{photo.photoName}</p>
            <img src={photo.photoWay} alt={photo.photoName} style={{ maxWidth: '200px' }} />
          </li>
        ))}
      </ul>
      
      <h3>Ticket Prices:</h3>
      <p><strong>Adult:</strong> {place.ticketPrice.adult}</p>
      <p><strong>Child:</strong> {place.ticketPrice.child}</p>
      
      <h3>Schedule:</h3>
      <p><strong>Summer (Weekdays):</strong> {place.schedule.summer.weekdaysAndSaturday.open} - {place.schedule.summer.weekdaysAndSaturday.close}</p>
      <p><strong>Winter (Weekdays):</strong> {place.schedule.winter.weekdaysAndSaturday.open} - {place.schedule.winter.weekdaysAndSaturday.close}</p>
    </div>
  );
};

export default PlaceDetails;
