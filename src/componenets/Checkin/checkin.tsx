// src/components/Login.tsx
import React, { useState } from 'react';
import { loginUser, registerUser } from '../../firebase/authService';
import { useSelector } from 'react-redux';
import { translations } from '../../../public/translations';
import { RootState } from '../../store';

interface LoginProps {
  title?: string;
  className?: string;
  type?: 'login' | 'register';
}

const CheckinLogin: React.FC<LoginProps> = ({ title, className, type = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  const defaultTitle = type === 'register' ? t('register') : t('login');

  const handleSubmit = async () => {
    try {
      if (type === 'register') {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }
    } catch (error) {
      console.error(type === 'register' ? 'Ошибка регистрации:' : 'Ошибка входа:', error);
    }
  };

  return (
    <div className={className}>
      <h3>{title || defaultTitle}</h3>
      <label style={{ display: 'block' }}>
        <span style={{ display: 'block', fontSize: 12 }}>{t('email')}</span>
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label style={{ display: 'block', marginTop: 8 }}>
        <span style={{ display: 'block', fontSize: 12 }}>{t('password')}</span>
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button style={{ marginTop: 12 }} onClick={handleSubmit}>{type === 'register' ? t('register') : t('login')}</button>
    </div>
  );
};

export default CheckinLogin;
