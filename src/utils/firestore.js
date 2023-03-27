import {
    addDoc,
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

export const usePagination = () => {
    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [entries, setEntries] = useState([]);

    const collectionName = `${environment === 'test' ? 'Test' : ''}${currentProject}${
        currentTable === 'Session' ? 'Session' : 'Data'
    }`;

    const defaultConstraints = [
        collection(db, collectionName),
        orderBy('dateTime', 'desc'),
        limit(batchSize),
    ];

    const whereClause = currentTable !== 'Session' && [
        'taxa',
        '==',
        currentTable === 'Arthropod' ? 'N/A' : currentTable,
    ];

    const generateQueryConstraints = ({ constraints = {} }) => {
        const { at, after } = constraints;
        const queryConstraints = [...defaultConstraints];

        whereClause?.length && queryConstraints.push(where(...whereClause));
        at ? queryConstraints.push(startAt(at)) : after && queryConstraints.push(startAfter(after));

        return queryConstraints;
    };

    const loadBatch = async (queryConstraints) => {
        console.log('Loading batch from collection:', collectionName);
        try {
            const currentQuery = query(
                ...generateQueryConstraints({ constraints: queryConstraints })
            );
            const { docs } = await getDocs(currentQuery);
            setEntries(docs);
            console.log('Number of entries loaded:', docs.length);
            const lastVisibleDoc = docs[docs.length - 1];
            setDocumentQueryCursor(lastVisibleDoc);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const loadEntries = async () => {
        const queryConstraints = { whereClause };
        await loadBatch(queryConstraints);
    };

    const loadPrevBatch = async () => {
        if (queryCursorStack.length === 0) {
            notify(Type.error, 'Unable to go back. This is the first page.');
            return;
        }

        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        setQueryCursorStack(queryCursorStack.slice(0, -1));

        const constraints = { whereClause, at: prevQueryCursor };
        await loadBatch(constraints);
    };

    const loadNextBatch = async () => {
        const constraints = { whereClause, after: documentQueryCursor };
        setQueryCursorStack([...queryCursorStack, entries[0]]);
        await loadBatch(constraints);
    };

    return { loadEntries, loadPrevBatch, loadNextBatch, entries, setEntries };
};

export const useFirestore = () => {
    const currentProject = useAtomValue(currentProjectName);
    const environment = useAtomValue(appMode);

    const getAnswerSet = async (set_name) => {
        console.log('Getting answer set:', set_name);
        try {
            const currentQuery = query(
                collection(db, 'AnswerSet'),
                where('set_name', '==', set_name)
            );
            const { docs } = await getDocs(currentQuery);
            return docs.map((doc) => doc.data().answers);
        } catch (error) {
            console.error('Error loading answer sets:', error);
        }
    };

    const getSessions = async () => {
        try {
            const currentQuery = query(
                collection(db, `${environment === 'test' ? 'Test' : ''}${currentProject}Session`)
            );
            const { docs } = await getDocs(currentQuery);
            return docs;
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const createSession = async (session) => {
        const sessionCollection = `${environment === 'test' ? 'Test' : ''}${currentProject}Session`;

        const getSessionDataModel = () => {
            const { date, time, ...data } = session;
            return data;
        };

        try {
            const sessionRef = await addDoc(
                collection(db, sessionCollection),
                getSessionDataModel()
            );
            console.log('Document written with ID: ', sessionRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return {
        getSessions,
        createSession,
        getAnswerSet,
    };
};
