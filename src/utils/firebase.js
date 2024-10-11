// Firebase import
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// SKD's that are available:
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDf315Ml5vfmtGVYQJa2Kq7SxUAgg_2vqs',
    authDomain: 'field-day-backup.firebaseapp.com',
    databaseURL: 'https://field-day-backup-default-rtdb.firebaseio.com',
    projectId: 'field-day-backup',
    storageBucket: 'field-day-backup.appspot.com',
    messagingSenderId: '846923163868',
    appId: '1:846923163868:web:e3c5e877fa12832e126c19',
    measurementId: 'G-KW1M085EYT',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
