import React from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Slider from 'react-slick';
import IconButton from '@mui/material/IconButton';
import { MdLocationOn } from 'react-icons/md';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
let classes = require('./PlaceDetails.module.scss');

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  return (
    <div className={classes.placeDetailsWrapper}>
      <Slider {...sliderSettings}>
        {place.photos.map((photo, idx) => (
          <div key={idx} className={classes.sliderContainer}>
            <img
              src={photo.photoWay}
              alt={photo.photoName}
              className={classes.sliderImage}
              loading="lazy"
            />
          </div>
        ))}
      </Slider>
      <div className={classes.detailsHeader}>
        <h2 className={classes.placeTitle}>{place.placeName.en}</h2>
        <IconButton
          href={place.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть в Google Maps"
          size="large"
        >
          <MdLocationOn size={32} color="#2d7c9a" />
        </IconButton>
      </div>
      <p className={classes.placeDescription}>{place.extendedDescription.en}</p>
    </div>
  );
};

export default PlaceDetails;
