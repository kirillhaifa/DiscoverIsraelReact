import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../../../firebaseConfig';
import { resendEmailVerification } from '../../firebase/authService';
import { translations } from '../../../public/translations';
import { RootState } from '../../store';
import Logout from '../Logout/logout';

let classes = require('./EmailVerification.module.scss');

const EmailVerification: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  // Проверка статуса email каждые 2 секунды
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.emailVerified) {
          // Принудительно обновляем данные пользователя из Firebase
          await currentUser.reload();
          
          if (currentUser.emailVerified) {
            // Принудительно перезагружаем страницу для обновления состояния
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleResendEmail = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await resendEmailVerification();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000); // Скрываем уведомление через 5 секунд
    } catch (error) {
      console.error('Ошибка при отправке письма подтверждения:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h3 className={classes.title}>{t('emailVerificationTitle')}</h3>
        <p className={classes.message}>{t('emailVerificationMessage')}</p>
        
        <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          После подтверждения email страница автоматически обновится
        </p>

        {emailSent && (
          <div className={classes.successMessage}>
            ✓ Письмо отправлено повторно!
          </div>
        )}

        <div className={classes.actions}>
          <button 
            onClick={handleResendEmail}
            className={classes.resendButton}
            disabled={emailSent}
          >
            {t('resendVerificationEmail')}
          </button>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
