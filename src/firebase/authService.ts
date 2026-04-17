import { auth } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import apiClient from '../utils/apiClient';


export const registerUser = async (email: string, password: string) => {
  try {
    // Создаём пользователя через Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // Отправляем письмо с подтверждением email
      await sendEmailVerification(user);

      // Создаём профиль пользователя через backend API
      await apiClient.post('/api/users/register', {
        email: user.email,
        name: null,
        surname: null,
        profilePicture: null,
      });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Авторизация через email/password
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Получение данных пользователя через backend API
    const userData = await getUserData(user.uid);
    
    return userData;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Функция для выхода пользователя
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("singout error:", error);
  }
};

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    // Авторизация через Google
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Upsert профиля через backend API (создаст если не существует)
    await apiClient.post('/api/users/register', {
      email: user.email,
      name: user.displayName?.split(' ')[0] || null,
      surname: user.displayName?.split(' ')[1] || null,
      profilePicture: user.photoURL || null,
    });

    // Получение данных пользователя через backend API
    const userData = await getUserData(user.uid);
    
    return userData;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const getUserData = async (userUID: string) => {
  try {
    const { data } = await apiClient.get('/api/users/me');
    return {
      ...data.data,
      uid: userUID,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      displayName: auth.currentUser?.displayName,
      photoURL: auth.currentUser?.photoURL,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Функция для проверки и обновления статуса подтверждения email
export const checkEmailVerificationStatus = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Обновляем данные пользователя из Firebase
      await user.reload();
      return user.emailVerified;
    }
    return false;
  } catch (error) {
    console.error('Error checking email verification status:', error);
    return false;
  }
};

// Функция для повторной отправки письма подтверждения
export const resendEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error resending email verification:', error);
    throw error;
  }
};