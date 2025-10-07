import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  BrowserRouter,
} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { fetchUserData } from '../../store/User/fetchUserThunk';
import { clearUserData } from '../../store/User/userSlice';
import { setTheme } from '../../store/ColorScheme/themeSlice';
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
import SearchBar from '../SearchBar/SearchBar';

let classes = require('./App.module.scss');
let normilizer = require('../../public/Styles/normalizer.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

const BASENAME =
  process.env.NODE_ENV === 'production' ? '/DiscoverIsraelReact' : '/';

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const { language } = useSelector((state: RootState) => state.language);
  const userProfileTheme = useSelector(selectUserColorTheme);
  const userPreferredTheme = useSelector(
    (state: RootState) => state.theme.theme,
  );
  const userLoading = useSelector((state: RootState) => state.user.loading);
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    dispatch(fetchUserLocation());
  }, [dispatch]);

  useEffect(() => {
    // Приоритет: тема из localStorage (userPreferredTheme) > тема из профиля > светлая тема по умолчанию
    const themeToUse = userPreferredTheme || userProfileTheme || 'light';
    console.log('App resolving theme:', {
      userPreferredTheme,
      userProfileTheme,
      themeToUse,
    });
    setResolvedTheme(themeToUse);
  }, [userPreferredTheme, userProfileTheme]);

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
        console.log(
          'App: User authenticated, fetching user data for:',
          user.uid,
        );
        console.log('User email:', user.email);
        console.log('User emailVerified:', user.emailVerified);

        // Небольшая задержка для обеспечения очистки старых данных
        setTimeout(() => {
          dispatch(fetchUserData(user.uid));
        }, 100);
      }
    } else {
      console.log('App: No user authenticated, clearing user data');
      // Очищаем данные пользователя при выходе
      dispatch(clearUserData());
    }
    dispatch(fetchPlacesThunk());
  }, [user, dispatch]);

  // Инициализация темы из профиля пользователя
  useEffect(() => {
    console.log('App theme initialization check:');
    console.log('userProfileTheme:', userProfileTheme);
    console.log('userPreferredTheme:', userPreferredTheme);
    console.log('user:', user?.uid);

    // Если есть тема в профиле пользователя, но нет сохраненной локально, используем тему из профиля
    if (user && userProfileTheme && !userPreferredTheme) {
      console.log('Initializing theme from user profile:', userProfileTheme);
      dispatch(setTheme(userProfileTheme));
    } else if (!user && userPreferredTheme) {
      // Если пользователь вышел, но тема еще сохранена в localStorage, сохраняем ее
      console.log(
        'User logged out, keeping localStorage theme:',
        userPreferredTheme,
      );
    }
  }, [user, userProfileTheme, userPreferredTheme, dispatch]);

  useLayoutEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <BrowserRouter basename={BASENAME}>
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
                  <SearchBar />
                  <div className={classes.filtersContainer}>
                    <DistanceFilter />
                    <UnvisitedFilter />
                  </div>
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
    </BrowserRouter>
  );
};

export default App;
