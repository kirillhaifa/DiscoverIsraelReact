// src/components/Login.tsx
import React, { useState } from 'react';
import { loginUser } from '../../firebase/authService';
import { useSelector } from 'react-redux';
import { translations } from '../../../public/translations';
import { RootState } from '../../store';

interface LoginProps {
  title?: string;
  className?: string;
}

const Login: React.FC<LoginProps> = ({ title = 'Login', className }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div className={className}>
      <h3>{title}</h3>
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
      <button style={{ marginTop: 12 }} onClick={handleLogin}>{t('login')}</button>
    </div>
  );
};

export default Login;
