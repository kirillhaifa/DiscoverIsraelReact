import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
let classes = require('./PlaceRating.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

const PlaceRating = ({ placeId, submitRating, deleteRating }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.ratings) {
      const existingMark = userData.ratings.find(
        (mark) => mark.placeId === placeId,
      );
      if (existingMark) {
        setUserRating(existingMark.rating);
        setSelectedRating(existingMark.rating);
      }
    }
  }, [userData, placeId]);

  const handleRatingClick = async (rating, event) => {
    event.stopPropagation(); // Останавливаем всплытие клика
    if (!userData || !userData.userID) {
      navigate('/login')
      return;
    }

    setIsSaving(true);

    try {
      if (rating === userRating) {
        await deleteRating(userData.userID, placeId);
        setUserRating(null);
        setSelectedRating(null);
      } else {
        await submitRating(userData.userID, placeId, rating);
        setUserRating(rating);
        setSelectedRating(rating);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`${classes.container} ${themes}`} onClick={(e) => e.stopPropagation()}>
      {[...Array(10)].map((_, index) => (
        <button
          key={index + 1}
          onClick={(event) => handleRatingClick(index + 1, event)}
          disabled={isSaving}
          className={`${classes.button} ${
            selectedRating === index + 1 ? classes['button-active'] : ''
          } ${isSaving ? classes['button-saving'] : ''}`}
        >
          <span
            className={`${
              selectedRating === index + 1 ? classes['span-active'] : ''
            }`}
          >
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PlaceRating;
