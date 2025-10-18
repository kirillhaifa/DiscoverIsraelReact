import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { Place } from '../../types';
import { fetchPlannedPlaces } from '../../firebase/firebaseService';
import PlaceCard from '../../componenets/PlaceCard/PlaceCard';
import TripPlanner from '../../componenets/TripPlanner/TripPlanner';
import { translations } from '../../../public/translations';
import Loader from '../../componenets/Loader/Loader';
import Slider from 'react-slick';
import { IoChevronDown } from 'react-icons/io5';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
let classes = require('./Plans.module.scss');

const Plans: React.FC = () => {
  const [user] = useAuthState(auth);
  const [plannedPlaces, setPlannedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAsList, setShowAsList] = useState(false); // Состояние для переключения между слайдером и списком
  const language = useSelector((state: RootState) => state.language.language);

  // Определяем мобильное устройство
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const loadPlannedPlaces = async () => {
      if (!user) {
        setPlannedPlaces([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const places = await fetchPlannedPlaces(user.uid);
        setPlannedPlaces(places);
      } catch (error) {
        console.error('Error fetching planned places:', error);
        setPlannedPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlannedPlaces();
  }, [user]);

  // Настройки для react-slick
  const sliderSettings = {
    dots: true,
    infinite: plannedPlaces.length > 1,
    speed: 500,
    slidesToShow: isMobile ? 1 : Math.min(3, plannedPlaces.length),
    slidesToScroll: 1,
    autoplay: false,
    arrows: isMobile ? false : plannedPlaces.length > 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, plannedPlaces.length),
          slidesToScroll: 1,
          arrows: plannedPlaces.length > 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          infinite: plannedPlaces.length > 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className={classes.container}>
        <Loader message={translations.loading[language]} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={classes.container}>
        <div className={classes.authRequired}>
          <h2>{translations.plansTitle[language]}</h2>
          <p>{translations.loginRequiredForPlans[language]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <h1>{translations.plansTitle[language]}</h1>
          <p className={classes.subtitle}>
            {plannedPlaces.length > 0 
              ? `${translations.plansCount[language]} ${plannedPlaces.length}` 
              : translations.noPlansYet[language]
            }
          </p>
        </div>
        
        {plannedPlaces.length > 0 && (
          <div className={classes.headerRight}>
            <button 
              className={classes.toggleButton}
              onClick={() => setShowAsList(!showAsList)}
            >
              <span>
                {showAsList 
                  ? translations.showAsSlider[language] 
                  : translations.showAllPlaces[language]
                }
              </span>
              <IoChevronDown 
                className={`${classes.chevron} ${showAsList ? classes.chevronUp : ''}`}
              />
            </button>
          </div>
        )}
      </div>

      {plannedPlaces.length > 0 ? (
        showAsList ? (
          <div className={classes.listContainer}>
            {plannedPlaces.map((place) => (
              <div key={place.id} className={classes.listItem}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        ) : (
          <div className={classes.sliderContainer}>
            <Slider {...sliderSettings}>
              {plannedPlaces.map((place) => (
                <div key={place.id} className={classes.slideItem}>
                  <PlaceCard place={place} />
                </div>
              ))}
            </Slider>
          </div>
        )
      ) : (
        <div className={classes.emptyState}>
          <p>{translations.noPlansMessage[language]}</p>
        </div>
      )}
      
      {/* Trip Planner */}
      <div className={classes.tripPlannerSection}>
        <TripPlanner />
      </div>
    </div>
  );
};

export default Plans;
