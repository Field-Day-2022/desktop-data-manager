import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmjxPpYBWe1gwBvDXka9-Fk4zRuWPQw-Y",
  authDomain: "asu-field-day.firebaseapp.com",
  databaseURL: "https://asu-field-day-default-rtdb.firebaseio.com",
  projectId: "asu-field-day",
  storageBucket: "asu-field-day.appspot.com",
  messagingSenderId: "470318492986",
  appId: "1:470318492986:web:955f2fa8a51014c6fc7403",
  measurementId: "G-4NXHBQ69GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app) // export db