// src/components/Login.tsx
import React, { useState } from 'react';
import { loginUser } from '../../firebase/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password).then((res) => {
        console.log(res)
      });
      console.log("Вход выполнен успешно!");
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
    </div>
  );
};

export default Login;
