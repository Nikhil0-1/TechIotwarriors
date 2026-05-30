// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRDZeoSlrd8TGVWwtCqG-nBFOPIus0faA",
  authDomain: "techiotwarriors-d2bcf.firebaseapp.com",
  projectId: "techiotwarriors-d2bcf",
  storageBucket: "techiotwarriors-d2bcf.firebasestorage.app",
  messagingSenderId: "1061045052762",
  appId: "1:1061045052762:web:d4a81773e346d61a9c7f63",
  measurementId: "G-L4619DRLME"
};

// Initialize Firebase (singleton pattern for SSR environments)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exports for SDK modules
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics conditionally on the client-side
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
