import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error(err);
      setLoginError(err.message);
    });

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = !!(user && user.email === import.meta.env.VITE_ADMIN_EMAIL);

  const login = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        signInWithRedirect(auth, googleProvider);
      } else {
        console.error(err);
        setLoginError(err.message);
      }
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, isAdmin, login, logout, loginError };
}
