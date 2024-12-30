import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- Firebase Configuration --- //
// Validate environment variables to avoid runtime errors
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Optional (for Realtime Database)
};

// Log an error if any Firebase environment variable is missing
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing Firebase environment variable: ${key}`);
  }
});

// --- Initialize Firebase --- //
// Initialize the Firebase app only once and handle errors during initialization
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  console.log("Firebase app initialized successfully.");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// --- Firebase Services --- //
export const auth = getAuth(app); // Firebase Authentication
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
export const db = getFirestore(app); // Firestore Database
export const storage = getStorage(app); // Firebase Storage

// --- Optional Exports --- //
// Export configuration for debugging or extending Firebase services if needed
export { firebaseConfig };

// Export the initialized app instance
export default app;
