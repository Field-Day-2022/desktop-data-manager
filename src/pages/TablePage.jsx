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
import { appMode, currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import Dropdown from '../components/Dropdown';
import { notify, Type } from '../components/Notifier';

export default function TablePage() {
    const [entries, setEntries] = useState([]);
    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [labels, setLabels] = useState();

    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);
    const [environment, setEnvironment] = useAtom(appMode);

    useEffect(() => {
        setLabels(TABLE_LABELS[tableName]);
        loadEntries();
    }, [tableName, batchSize]);

    const getCollectionName = () => {
        return ((environment === 'test')?'Test':null) + currentProject + ((tableName==='Session')?'Session':'Data')
    }

    const generateQueryConstraints = ({ whereClause = null, at = null, after = null }) => {
        const collectionName = getCollectionName();
        console.log(`loading ${tableName} from ${collectionName}`)
        const constraints = [
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            limit(batchSize)
        ]
        if (whereClause) {
            console.log('adding where clause')
            constraints.push(where(...whereClause))
        }
        if (at) {
            constraints.push(startAt(at))
        } else if (after) {
            constraints.push(startAfter(after))
        }

        return constraints;
    }

    const loadEntries = async () => {
        
        let initialQuery;

        initialQuery = query(
            ...generateQueryConstraints(
                {
                    whereClause: (tableName !== 'Session')
                        ? ['taxa', '==', (tableName === 'Arthropod') ? 'N/A' : tableName]
                        : null
                })
        )

        const initialQuerySnapshot = await getDocs(initialQuery);
        setEntries(initialQuerySnapshot.docs);
        const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    };

    const loadPrevBatch = async () => {
        let prevBatchQuery;
        if (queryCursorStack.length - 1 < 0) {
            notify(Type.error, 'Unable to go back. This is the first page.')
            return
        }

        prevBatchQuery = query(
            ...generateQueryConstraints(
                {
                    whereClause: (tableName !== 'Session')
                        ? ['taxa', '==', (tableName === 'Arthropod') ? 'N/A' : tableName]
                        : null,
                    at: queryCursorStack[queryCursorStack.length - 1]
                })
        );

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

        nextBatchQuery = query(
            ...generateQueryConstraints(
                {
                    whereClause: (tableName !== 'Session')
                        ? ['taxa', '==', (tableName === 'Arthropod') ? 'N/A' : tableName]
                        : null,
                    after: documentQueryCursor
                })
        );

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
                <DataTable name={tableName} labels={labels} entries={entries} setEntries={setEntries} />
                <Pagination
                    loadPrevBatch={loadPrevBatch}
                    loadNextBatch={loadNextBatch}
                />
            </div>
        </PageWrapper>
    );
}