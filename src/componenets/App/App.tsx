import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { fetchUserData } from '../../store/User/fetchUserThunk';
import { RootState, AppDispatch } from '../../store';
import PlacesList from '../PlacesList/PlacesList';
import Register from '../Register/register';
import Checkin from '../Checkin/checkin';
import GoogleLogin from '../GoogleLogin/googleLogin';
import Logout from '../Logout/logout';
import { fetchPlacesThunk } from '../../store/Places/placesThunks';
import PlaceDetailsPage from '../PlaceDetailsPage/PlaceDetailsPage';
import Navigation from '../Navigation/Navigation';
import PlacesMap from '../Map/Map';
import AdminPanel from '../AdminPanel/AdminPanel';
import NotFound from '../NotFound/NotFound';
import '../../public/Fonts/fonts.scss';
import Profile from '../Profile/profile';
import Header from '../Header/Header';
import AboutProject from '../AboutProject/aboutProject';
import Contacts from '../Contacts/contacts';
import ParametersFilter from '../ParametersFilter/ParametersFilter';
import DistanceFilter from '../DistanceFilter/distanceFilter';
import { fetchUserLocation } from '../../utils/hooks';
import UnvisitedFilter from '../UnvisitedFliter/UnvisitedFilter';
import { selectUserColorTheme } from '../../store/User/userSelector';

let classes = require('./App.module.scss');
let normilizer = require('../../public/Styles/normalizer.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const { language } = useSelector((state: RootState) => state.language);
  const userPreferredTheme = useSelector(selectUserColorTheme);
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    dispatch(fetchUserLocation());
  }, [dispatch]);

  useEffect(() => {
    // if (userPreferredTheme) {
    setResolvedTheme(userPreferredTheme);
    // } else {
    //   const systemPrefersDark = window.matchMedia(
    //     '(prefers-color-scheme: dark)',
    //   ).matches;
    //   setResolvedTheme(systemPrefersDark ? 'dark' : 'light');

    //   const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    //     if (!userPreferredTheme) {
    //       setResolvedTheme(e.matches ? 'dark' : 'light');
    //     }
    //   };

    //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    //   mediaQuery.addEventListener('change', handleSystemThemeChange);

    //   return () => {
    //     mediaQuery.removeEventListener('change', handleSystemThemeChange);
    //   };
    // }
  }, [userPreferredTheme]);

  let languageClass = '';
  switch (language) {
    case 'ru':
      languageClass = 'russian';
      break;
    case 'en':
      languageClass = 'english';
      break;
    case 'he':
      languageClass = 'hebrew';
      break;
    default:
      languageClass = 'english';
  }

  useEffect(() => {
    if (user) {
      if (user.uid) {
        dispatch(fetchUserData(user.uid));
      }
    }
    dispatch(fetchPlacesThunk());
  }, [user, dispatch]);

  useLayoutEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <Router>
      <div
        className={`${classes.app} ${normilizer} ${themes[resolvedTheme]} ${classes[languageClass]} ${isAnimating ? classes.fadeOut : classes.fadeIn} ${language === 'he' ? classes.rtl : ''}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              user && user.emailVerified ? (
                <>
                  <Header />
                  <Navigation />
                  <ParametersFilter />
                  <DistanceFilter/>
                  <UnvisitedFilter />
                  <PlacesList />
                </>
              ) : user ? (
                <>
                  <h3>Please confirm your email</h3>
                  <Logout />
                </>
              ) : (
                <>
                  <Header />
                  <h2>Welcome</h2>
                  <Register />
                  <Checkin />
                  <GoogleLogin />
                  <PlacesList />
                </>
              )
            }
          />
          {/* Другие маршруты */}
          <Route path="/places/:placeName" element={<PlaceDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/map" element={<PlacesMap />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/about" element={<AboutProject />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
