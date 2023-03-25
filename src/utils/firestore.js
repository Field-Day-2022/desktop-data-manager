// A collection of functions for interacting with firestore

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to get the collection name based on app state in jotai
export function getCollectionName(environment, currentProject, tableName) {
    return (
        (environment === 'test' ? 'Test' : '') +
        currentProject +
        (tableName === 'Session' ? 'Session' : 'Data')
    );
}
