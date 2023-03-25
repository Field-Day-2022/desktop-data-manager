import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    startAt,
    where,
} from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { db } from './firebase';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from './jotai';
import { notify, Type } from '../components/Notifier';

export const useFirestore = () => {
    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [entries, setEntries] = useState([]);

    const collectionName = `${environment === 'test' ? 'Test' : ''}${currentProject}${currentTable === 'Session' ? 'Session' : 'Data'
        }`;

    const defaultConstraints = [
        collection(db, collectionName),
        orderBy('dateTime', 'desc'),
        limit(batchSize),
    ];

    const generateQueryConstraints = ({ constraints = {} }) => {
        const { whereClause, at, after } = constraints;
        const queryConstraints = [...defaultConstraints];

        whereClause?.length && queryConstraints.push(where(...whereClause));
        at ? queryConstraints.push(startAt(at)) : after && queryConstraints.push(startAfter(after));

        return queryConstraints;
    };

    // function that returns all session documents
    const getSessions = async () => {
        try {
            const currentQuery = query(collection(db, `${environment === 'test' ? 'Test' : ''}${currentProject}Session`));
            const { docs } = await getDocs(currentQuery);
            return docs;
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const loadDocs = async (queryConstraints) => {
        try {
            const currentQuery = query(
                ...generateQueryConstraints({ constraints: queryConstraints })
            );
            const { docs } = await getDocs(currentQuery);
            setEntries(docs);
            const lastVisibleDoc = docs[docs.length - 1];
            setDocumentQueryCursor(lastVisibleDoc);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const loadEntries = async () => {
        const queryConstraints = {
            whereClause: currentTable !== 'Session' && [
                'taxa',
                '==',
                currentTable === 'Arthropod' ? 'N/A' : currentTable,
            ],
        };
        await loadDocs(queryConstraints);
    };

    const loadBatch = async (constraints) => {
        await loadDocs(constraints);
    };

    const loadPrevBatch = async () => {
        if (queryCursorStack.length - 1 < 0) {
            notify(Type.error, 'Unable to go back. This is the first page.');
            return;
        }

        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        setQueryCursorStack(queryCursorStack.slice(0, -1));

        const constraints = {
            whereClause: currentTable !== 'Session' && [
                'taxa',
                '==',
                currentTable === 'Arthropod' ? 'N/A' : currentTable,
            ],
            at: prevQueryCursor,
        };
        await loadBatch(constraints);
    };

    const loadNextBatch = async () => {
        const constraints = {
            whereClause: currentTable !== 'Session' && [
                'taxa',
                '==',
                currentTable === 'Arthropod' ? 'N/A' : currentTable,
            ],
            after: documentQueryCursor,
        };
        setQueryCursorStack([...queryCursorStack, entries[0]]);
        await loadBatch(constraints);
    };

    return { entries, loadEntries, loadPrevBatch, loadNextBatch, getSessions };
};
