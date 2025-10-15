import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Дополнительная проверка каждые 3 секунды для случаев когда onAuthStateChanged не срабатывает
    const interval = setInterval(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Проверяем, изменился ли статус подтверждения email
        if (user && user.emailVerified !== currentUser.emailVerified) {
          setUser({ ...currentUser });
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user]);

  return { user, loading };
};
