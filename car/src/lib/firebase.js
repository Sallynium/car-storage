import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDsjvPZaGgosY9S5mwpUgARw_m7IiqMjQY",
  authDomain: "car-inventory-8598d.firebaseapp.com",
  projectId: "car-inventory-8598d",
  storageBucket: "car-inventory-8598d.firebasestorage.app",
  messagingSenderId: "199743478637",
  appId: "1:199743478637:web:ed1bf5c18426d78ef4d864"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
