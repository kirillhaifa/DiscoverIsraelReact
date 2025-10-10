// src/components/Login/Login.tsx
import React from 'react';
import { handleGoogleSignIn } from '../../firebase/authService';
import { FcGoogle } from 'react-icons/fc';
import CheckinLogin from '../Checkin/checkin';
import { useSelector } from 'react-redux';
import { translations } from '../../public/translations';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import { Navigate } from 'react-router-dom';
let classes = require('./Login.module.scss');

const Login: React.FC = () => {
  const language = useSelector((state: RootState) => state.language.language);
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className={classes.loading}>{translations.loading[language]}</div>;
  if (user) return <Navigate to="/" replace />;
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;
  return (
    <div className={classes.mainContent}>
      <section className={classes.welcomeBlock}>
        <h1 className={classes.welcomeTitle}>{t('welcomeTitle')}</h1>
        <p className={classes.welcomeText}>{t('welcomeText')}</p>
      </section>
      <section className={classes.loginWrapper}>
        <div className={classes.optionsGrid}>
          <div className={classes.fullRow}>
            <div
              className={classes.buttonContainer}
              onClick={handleGoogleSignIn}
              role="button"
              tabIndex={0}
              aria-label={t('googleLogin')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGoogleSignIn(); }}
            >
              <FcGoogle className={classes.icon} />
              <button type="button" className={classes.button}>{t('googleLogin')}</button>
            </div>
            <div className={classes.inlineNote}>{t('fastestWay')}</div>
          </div>
          <CheckinLogin title={t('emailPassword')} className={classes.formBlock} />
          <CheckinLogin title={t('checkinLoginPassword')} className={classes.formBlock} />
        </div>
      </section>
    </div>
  );
};

export default Login;
