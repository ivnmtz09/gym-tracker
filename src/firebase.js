import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCIjxXYh6fJ5TGI4W3mCY4pdeb7klk4b8",
  authDomain: "gym-tracker-ivnmtz09.firebaseapp.com",
  projectId: "gym-tracker-ivnmtz09",
  storageBucket: "gym-tracker-ivnmtz09.firebasestorage.app",
  messagingSenderId: "469334720153",
  appId: "1:469334720153:web:5a06eef927ca0eb4ff8208",
  measurementId: "G-74D742BDD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
