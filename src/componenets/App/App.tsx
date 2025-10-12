import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { fetchUserData } from '../../store/User/fetchUserThunk';
import { clearUserData } from '../../store/User/userSlice';
import { setTheme } from '../../store/ColorScheme/themeSlice';
import { RootState, AppDispatch } from '../../store';
import Logout from '../Logout/logout';
import { fetchPlacesThunk } from '../../store/Places/placesThunks';
import PlaceDetailsPage from '../../pages/PlaceDetailsPage/PlaceDetailsPage';
import PlacesMap from '../../pages/Map/Map';
import NotFound from '../NotFound/NotFound';
import '../../../public/Fonts/fonts.scss';
import Profile from '../../pages/Profile/profile';
import AboutProject from '../../pages/AboutProject/aboutProject';
import { fetchUserLocation } from '../../utils/hooks';
import { selectUserColorTheme } from '../../store/User/userSelector';
import LoginPage from '../../pages/LoginPage/LoginPage';
import AuthModal from '../AuthModal/AuthModal';
import MainPageLayout from '../../pages/MainPage/MainPage';
import AdminPanel from '../../pages/AdminPanel/AdminPanel';
import MainLayout from '../Layout/MainLayout';
import Recommendations from '../../pages/Recomendations/Recomendations';
import CollectionPage from '../../pages/CollectionPage/CollectionPage';

let classes = require('./App.module.scss');
let normilizer = require('../../../public/Styles/normalizer.module.scss');
let themes = require('../../../public/Styles/themes.module.scss');

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
    // Если есть тема в профиле пользователя, но нет сохраненной локально, используем тему из профиля
    if (user && userProfileTheme && !userPreferredTheme) {
      dispatch(setTheme(userProfileTheme));
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
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.emailVerified ? (
                    <MainPageLayout />
                  ) : (
                    <>
                      <h3>Please confirm your email</h3>
                      <Logout />
                    </>
                  )
                ) : (
                  <MainPageLayout />
                )
              }
            />
            <Route path="/places/:placeName" element={<PlaceDetailsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/map" element={<PlacesMap />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<AboutProject />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/collections/:id" element={<CollectionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <div id="modal-root" />
          <AuthModal />
        </MainLayout>
      </div>
    </BrowserRouter>
  );
};

export default App;
