import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { requireAuth } from '../../store/authPrompt/authPromptSlice';
import { FaStar } from 'react-icons/fa';
let classes = require('./PlaceRating.module.scss');
let themes = require('../../../public/Styles/themes.module.scss');
let basic = require('../../../public/Styles/basic.module.scss');

const PlaceRating = ({ placeId, submitRating, deleteRating }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [hideTimer, setHideTimer] = useState(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const barRef = useRef(null);

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
    event.stopPropagation();
    if (!userData || !userData.userID) {
      dispatch(requireAuth({ reason: 'rate' }));
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

  // Открытие бара с задержкой
  const handleMouseEnter = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
    const timer = setTimeout(() => setShowBar(true), 500);
    setHoverTimer(timer);
  };

  // Скрытие бара с задержкой
  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    const timer = setTimeout(() => setShowBar(false), 1000);
    setHideTimer(timer);
  };

  // Открытие бара по клику
  const handleStarClick = (e) => {
    e.stopPropagation();
    setShowBar(true);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
  };

  // Скрытие бара при клике вне
  useEffect(() => {
    if (!showBar) return;
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setShowBar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBar]);

  return (
    <div className={`${classes.container} ${themes}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={e => e.stopPropagation()}
      style={{ position: 'relative' }}
    >
      {selectedRating && (
        <span 
          className={`${classes.ratingNumber} ${showBar ? basic.visuallyHidden : ''}`}
        >
          {selectedRating}
        </span>
      )}
      <button
        className={classes.starButton}
        onClick={handleStarClick}
        disabled={isSaving}
        aria-label="Оценить место"
      >
        <FaStar
          size={20}
          color={selectedRating ? '#9b8400ff' : '#ccc'}
        />
      </button>
      <div
        ref={barRef}
        className={
          showBar ? `${classes.ratingBar} ${classes.barVisible}` : classes.ratingBar
        }
      >
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
              className={
                selectedRating === index + 1 ? classes['span-active'] : ''
              }
            >
              {index + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaceRating;
