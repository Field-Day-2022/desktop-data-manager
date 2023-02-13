// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, orderBy, startAfter, limit, getDocs, startAt, where } from 'firebase/firestore';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { sessionLabels, turtleLabels, lizardLabels, mammalLabels, snakeLabels, amphibianLabels, arthropodLabels } from '../const/tableLabels'
import DataTable from '../components/DataTable';

export default function TablePage({ tableName, collectionName }) {
    const [entries, setEntries] = useState([]);
    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [batchSize, setBatchSize] = useState(15);
    const [labels, setLabels] = useState();
    const [whereClause, setWhereClause] = useState();

    useEffect(() => {
        console.log(`loading ${tableName} from ${collectionName}`)
        const loadInitialEntries = async (initialWhereClause) => {
            let initialQuery;
            if (tableName !== 'Session') {
                initialQuery = query(
                    collection(db, collectionName),
                    where(initialWhereClause[0], '==', initialWhereClause[1]),
                    orderBy('dateTime', 'desc'),
                    limit(batchSize)
                );
            } else {
                initialQuery = query(
                    collection(db, collectionName),
                    orderBy('dateTime', 'desc'),
                    limit(batchSize)
                );
            }
            const initialQuerySnapshot = await getDocs(initialQuery);
            setEntries(initialQuerySnapshot.docs);
            const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
            setDocumentQueryCursor(lastVisibleDoc);
        };
        if (tableName === 'Session') {
            setLabels(sessionLabels);
            loadInitialEntries();
        } else if (tableName === 'Turtle') {
            setLabels(turtleLabels);
            setWhereClause(['taxa', 'Turtle'])
            loadInitialEntries(['taxa', 'Turtle'])
        } else if (tableName === 'Lizard') {
            setLabels(lizardLabels);
            setWhereClause(['taxa', 'Lizard'])
            loadInitialEntries(['taxa', 'Lizard'])
        } else if (tableName === 'Mammal') {
            setLabels(mammalLabels);
            setWhereClause(['taxa', 'Mammal'])
            loadInitialEntries(['taxa', 'Mammal'])
        } else if (tableName === 'Snake') {
            setLabels(snakeLabels);
            setWhereClause(['taxa', 'Snake'])
            loadInitialEntries(['taxa', 'Snake'])
        } else if (tableName === 'Arthropod') {
            setLabels(arthropodLabels);
            setWhereClause(['taxa', 'N/A'])
            loadInitialEntries(['taxa', 'N/A'])
        } else if (tableName === 'Amphibian') {
            setLabels(amphibianLabels);
            setWhereClause(['taxa', 'Amphibian'])
            loadInitialEntries(['taxa', 'Amphibian'])
        }
    }, [collectionName]);

    const changeBatchSize = async (newBatchSize) => {
        setBatchSize(newBatchSize)
        let initialQuery;
        if (tableName !== 'Session') {
            initialQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                limit(newBatchSize)
            );
        } else {
            initialQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                limit(newBatchSize)
            );
        }
        const initialQuerySnapshot = await getDocs(initialQuery);
        setEntries(initialQuerySnapshot.docs);
        const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    }

    const loadPrevBatch = async () => {
        let prevBatchQuery;
        if (tableName !== 'Session') {
            prevBatchQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                startAt(queryCursorStack[queryCursorStack.length - 1]),
                limit(batchSize)
            );
        } else {
            prevBatchQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                startAt(queryCursorStack[queryCursorStack.length - 1]),
                limit(batchSize)
            );
        }
        const prevBatchSnapshot = await getDocs(prevBatchQuery);
        setEntries(prevBatchSnapshot.docs);
        setDocumentQueryCursor(prevBatchSnapshot.docs[prevBatchSnapshot.docs.length - 1]);
        let tempStack = queryCursorStack;
        tempStack.pop();
        setQueryCursorStack(tempStack)
    }


    const loadNextBatch = async () => {
        setQueryCursorStack([
            ...queryCursorStack,
            entries[0]
        ])
        let nextBatchQuery;
        if (tableName !== 'Session') {
            nextBatchQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                startAfter(documentQueryCursor),
                limit(batchSize)
            );
        } else {
            nextBatchQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                startAfter(documentQueryCursor),
                limit(batchSize)
            );
        }
        const nextBatchSnapshot = await getDocs(nextBatchQuery);
        setEntries(nextBatchSnapshot.docs);
        const lastVisibleDoc = nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    };

    return (
        <PageWrapper>
            <TabBar />
            <div className='bg-white'>
                <DataTable name={tableName} labels={labels} entries={entries} />
                <Pagination
                    batchSize={batchSize}
                    changeBatchSize={changeBatchSize}
                    loadPrevBatch={loadPrevBatch}
                    loadNextBatch={loadNextBatch}
                />
            </div>
        </PageWrapper>
    );
}

const TableHeading = ({ label }) => {
    return <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold">{label}</th>;
};