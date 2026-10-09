import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration imported from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0182738952",
  appId: "1:578253456597:web:1c22f54bc99f01fa514e5c",
  apiKey: "AIzaSyCyZRTxKzKKkH68zqyV9I5Yel-r98adqzY",
  authDomain: "gen-lang-client-0182738952.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-smartfoodredistr-0c4aa7f3-9bd2-4b06-8096-28f799d8e842",
  storageBucket: "gen-lang-client-0182738952.firebasestorage.app",
  messagingSenderId: "578253456597",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  // Initialize Firestore with the custom database ID if available
  if (firebaseConfig.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization note (operating with resilient local sync):', error);
  // Fallback initialize without custom database ID if needed
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
