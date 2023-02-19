// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, orderBy, startAfter, limit, getDocs, startAt, where } from 'firebase/firestore';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { TABLE_LABELS } from '../const/tableLabels'
import DataTable from '../components/DataTable';
import { useAtom } from 'jotai';
import { currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import Dropdown from '../components/Dropdown';
import { notify, Type } from '../components/Notifier';

export default function TablePage({ collectionName }) {
    const [entries, setEntries] = useState([]);
    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);
    const [labels, setLabels] = useState();
    const [whereClause, setWhereClause] = useState();

    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);

    useEffect(() => {
        console.log(`loading ${tableName} from ${collectionName}`)
        const loadEntries = async () => {
            let initialQuery;
            
            if (tableName !== 'Session') {
                initialQuery = query(
                    collection(db, collectionName),
                    where(whereClause[0], '==', whereClause[1]),
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

        setLabels(TABLE_LABELS[tableName]);
        if (tableName !== 'Session') {
            setWhereClause(['taxa', (tableName === 'Arthropod') ? 'N/A' : tableName]);
            loadEntries(['taxa', (tableName === 'Arthropod') ? 'N/A' : tableName]);
        } else {
            loadEntries();
        }

    }, [collectionName, tableName, batchSize]);

    const loadPrevBatch = async () => {
        let prevBatchQuery;
        if (queryCursorStack.length - 1 < 0) {
            notify(Type.error, 'Unable to go back. This is the first page.')
            return
        }
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
            <div className='flex justify-between items-center overflow-auto'>
                <TabBar />
                <div className='flex items-center px-5 space-x-5'>
                    <div>Project: </div>
                    <Dropdown
                        onClickHandler={(selectedOption) => {
                            if (selectedOption !== currentProject)
                                setCurrentProject(selectedOption.replace(/\s/g, ''));
                        }}
                        options={['Gateway', 'Virgin River', 'San Pedro']}
                    />
                </div>

            </div>

            <div>
                <DataTable name={tableName} labels={labels} entries={entries} />
                <Pagination
                    loadPrevBatch={loadPrevBatch}
                    loadNextBatch={loadNextBatch}
                />
            </div>
        </PageWrapper>
    );
}