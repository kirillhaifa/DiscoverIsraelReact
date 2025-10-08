import React, { useState, useEffect } from 'react';
import { Place } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Slider from 'react-slick';
import IconButton from '@mui/material/IconButton';
import PhotosModal from '../PhotosModal/PhotosModal';
import { MdLocationOn, MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import useMediaQuery from '@mui/material/useMediaQuery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
let classes = require('./PlaceDetails.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState(place.photos || []);

  useEffect(() => {
    setPhotos(place.photos || []);
  }, [place.photos]);

  const isSmall = useMediaQuery('(max-width:767px)');

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  const handlePhotoClick = (idx: number) => {
    if (isSmall) return;
    setModalIndex(idx);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setModalIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length === 0) return;
    setModalIndex(prev => {
      if (prev === null) return 0;
      return (prev - 1 + photos.length) % photos.length;
    });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length === 0) return;
    setModalIndex(prev => {
      if (prev === null) return 0;
      return (prev + 1) % photos.length;
    });
  };

  // Keyboard navigation and helpers
  const prevPhoto = () => {
    if (photos.length === 0) return;
    setModalIndex(prev => {
      if (prev === null) return 0;
      return (prev - 1 + photos.length) % photos.length;
    });
  };

  const nextPhoto = () => {
    if (photos.length === 0) return;
    setModalIndex(prev => {
      if (prev === null) return 0;
      return (prev + 1) % photos.length;
    });
  };

  React.useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen, photos]);

  const handleImageError = (idx: number) => {
    setPhotos(prev => {
      const removed = prev[idx];
      const newPhotos = prev.filter((_, i) => i !== idx);
      console.warn(`Photo unavailable and removed: ${removed?.photoWay || 'unknown'} (${removed?.photoName || 'no name'})`);

      // adjust modal index after removal
      setModalIndex(prevIdx => {
        if (prevIdx === null) return null;
        if (idx < prevIdx) return prevIdx - 1;
        if (idx === prevIdx) {
          if (newPhotos.length === 0) {
            setModalOpen(false);
            return null;
          }
          // if removed last item, move index back one
          if (prevIdx >= newPhotos.length) return newPhotos.length - 1;
          return prevIdx;
        }
        return prevIdx;
      });

      return newPhotos;
    });
  };

  const currentPhoto = modalIndex !== null ? photos[modalIndex] : null;

  return (
    <div className={`${classes.placeDetailsWrapper} ${themes}`}>
      <Slider {...sliderSettings}>
        {photos.map((photo, idx) => (
          <div key={photo.photoWay || idx} className={classes.sliderContainer}>
            <img
              src={photo.photoWay}
              alt={photo.photoName}
              className={classes.sliderImage}
              loading="lazy"
              onClick={() => handlePhotoClick(idx)}
              onError={() => handleImageError(idx)}
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
          className={classes.mapBtn}
        >
          <MdLocationOn size={32} />
        </IconButton>
      </div>
      <p className={classes.placeDescription}>{place.extendedDescription.en}</p>
      <PhotosModal
        open={modalOpen}
        index={modalIndex}
        photos={photos}
        onClose={handleClose}
        onImageError={handleImageError}
      />
    </div>
  );
};

export default PlaceDetails;
