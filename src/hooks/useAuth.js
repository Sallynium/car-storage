import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = !!(user && user.email === import.meta.env.VITE_ADMIN_EMAIL);

  const login = () => signInWithRedirect(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, loading, isAdmin, login, logout };
}
