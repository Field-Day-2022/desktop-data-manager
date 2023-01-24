// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from "../utils/firebase"
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";  

export default function Table ({
    tableName,
    collectionName,
}) {
    const [ entries, setEntries ] = useState([])
    const [ lastVisibleDocument, setLastVisibleDocument ] = useState();
    const [ batchSize, setBatchSize ] = useState(15);

    useEffect(() => {
        const loadInitialEntries = async () => {
            const initialQuery = query(
                collection(db, collectionName),
                orderBy("dateTime", "desc"),
                limit(batchSize)
            );
            const initialQuerySnapshot = await getDocs(initialQuery);
            setEntries(initialQuerySnapshot.docs)
            const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
            setLastVisibleDocument(lastVisibleDoc);
        }
        // loadInitialEntries();
    }, [])

    const loadNextBatch = async () => {
        const nextBatchQuery = query(
            collection(db, collectionName),
            orderBy("dateTime", "desc"),
            startAfter(lastVisibleDocument),
            limit(batchSize),
        )
        const nextBatchSnapshot = await getDocs(nextBatchQuery);
        setEntries(nextBatchSnapshot.docs);
        const lastVisibleDoc = nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1];
        setLastVisibleDocument(lastVisibleDoc);
    }

    return (
        <div className="bg-slate-200 w-11/12 h-full rounded-3xl p-4 my-12">
            <p>{`${tableName} - Entries`}</p>
        </div>
    )
}