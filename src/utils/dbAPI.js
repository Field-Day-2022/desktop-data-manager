import { db } from '../utils/firebase';
import { collection, query, orderBy, startAfter, limit, getDocs, startAt, where } from 'firebase/firestore';

export const query = (whereClause,) => {
    return query(
        collection(db, collectionName),
        where(whereClause[0], '==', whereClause[1]),
        orderBy('dateTime', 'desc'),
        limit(newBatchSize)
    ); 
}