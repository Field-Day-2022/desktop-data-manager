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

    const sessionLabels = [
        'Date/Time',
        'Recorder',
        'Handler',
        'Site',
        'Array',
        'No Captures',
        'Trap Status',
        'Comments',
    ]

    

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
        loadInitialEntries();
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
        <table className="bg-slate-200 border-separate border-spacing-2 border border-black">
            <thead>
                <tr>
                    <TableHeading label="Actions" />
                    {tableName === 'Session' && sessionLabels.map(label => <TableHeading key={label} label={label} />)}
                </tr>
            </thead>
            <tbody>
                {entries.map(entry => <Entry key={entry.id} entrySnapshot={entry} tableName={tableName} />)}
            </tbody>
        </table>
    )
}

const TableHeading = ({ label }) => {
    return (
        <th className="border border-gray-800 p-2">{label}</th>
    )
}

const Entry = ({ entrySnapshot, tableName }) => {

    console.log(entrySnapshot.data())

    const sessionKeys = [
        'dateTime',
        'recorder',
        'handler',
        'site',
        'array',
        'noCaptures',
        'trapStatus',
        'commentsAboutTheArray',
    ]

    return  (
        <tr>
            <td>Action</td>
            {tableName === 'Session' ?
                sessionKeys.map(key => (
                    <td key={key} className="border border-gray-800 p-2">{entrySnapshot.data()[key]}</td>
                ))
            :
            null 
            }
        </tr>
    )
}