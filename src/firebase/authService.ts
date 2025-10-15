import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';


export const registerUser = async (email: string, password: string) => {
  try {
    // Создаем пользователя через Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // Отправляем письмо с подтверждением email
      await sendEmailVerification(user);

      // Добавляем пользователя в Firestore в коллекцию 'Users'
      await setDoc(doc(db, 'Users', user.uid), {
        userID: user.uid,
        name: null, 
        surname: null,
        premiumStatus: false,
        email: user.email,
        profilePicture: null, 
        joinDate: new Date(),
        ratings: [],
        wishlist: [], 
        role: 'user',
        language: 'en',
        colorTheme: 'light',
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

    // Получение данных пользователя из Firestore
    const userData = await getUserData(user.uid);
    
    return userData; // Возвращаем полный объект пользователя
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


    // Проверяем, существует ли пользователь в Firestore
    const userDocRef = doc(db, 'Users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Если пользователь не существует, создаем новую запись
      await setDoc(userDocRef, {
        userID: user.uid,
        name: user.displayName?.split(' ')[0] || null,
        surname: user.displayName?.split(' ')[1] || null,
        premiumStatus: false,
        email: user.email,
        profilePicture: user.photoURL || null,
        joinDate: new Date(),
        ratings: [],
        wishlist: [],
        role: 'user',
        language: 'en',
        colorTheme: 'light',
      });
    } 

    // Получение данных пользователя из Firestore
    const userData = await getUserData(user.uid);
    
    return userData; // Возвращаем полный объект пользователя
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const getUserData = async (userUID: string) => {
  try {
    const userDocRef = doc(db, 'Users', userUID);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {
        ...userDoc.data(),
        uid: userUID,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        displayName: auth.currentUser?.displayName,
        photoURL: auth.currentUser?.photoURL,
      };
    } else {
      return null;
    }
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