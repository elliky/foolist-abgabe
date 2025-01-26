import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// it is possible to change auth persistance with setPersistence(auth, browserLocalPersistence).then....
// but because it is only an mvp we do not care that much about security

// Initialize Firestore database
const db = getFirestore(app);

export const signInAnonymouslyWithFirebase = () => signInAnonymously(auth);
export const signInWithEmailAndPasswordWithFirebase = (
  email: string,
  password: string,
) => signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmailAndPasswordWithFirebase = (
  email: string,
  password: string,
) => createUserWithEmailAndPassword(auth, email, password);

export { auth, db };
