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

const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) {
        constraints = [constraints];
    }

    try {
        const currentQuery = query(
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            ...constraints
        );
        const docs = await getDocs(currentQuery);
        console.log(`Read ${docs.size} docs from ${collectionName}.`);
        return docs;
    } catch (error) {
        console.error('Error loading entries:', error);
    }
};

const addDocToCollection = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log(`Document written to collection: ${collectionName} with ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

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

    const loadBatch = async (constraints = []) => {
        if (!Array.isArray(constraints)) {
            constraints = [constraints];
        }
        const whereClause =
            currentTable !== 'Session' &&
            where('taxa', '==', currentTable === 'Arthropod' ? 'N/A' : currentTable);
        whereClause && constraints.push(whereClause);

        constraints.push(limit(batchSize));

        const { docs } = await getDocsFromCollection(collectionName, constraints);
        const lastVisibleDoc = docs[docs.length - 1];
        setEntries(docs);
        setDocumentQueryCursor(lastVisibleDoc);
    };

    const loadPrevBatch = async () => {
        if (queryCursorStack.length === 0) {
            notify(Type.error, 'Unable to go back. This is the first page.');
            return;
        }
        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        setQueryCursorStack(queryCursorStack.slice(0, -1));
        await loadBatch(startAt(prevQueryCursor));
    };

    const loadNextBatch = async () => {
        setQueryCursorStack([...queryCursorStack, entries[0]]);
        await loadBatch(startAfter(documentQueryCursor));
    };

    return { loadBatch, loadPrevBatch, loadNextBatch, entries, setEntries };
};

export const useFirestore = () => {
    const currentProject = useAtomValue(currentProjectName);
    const environment = useAtomValue(appMode);

    const getAnswerSet = async (set_name) => {
        const docs = await getDocsFromCollection('AnswerSet', where('set_name', '==', set_name));
        return docs.map((doc) => doc.data().answers);
    };

    const getSessions = async () => {
        const docs = await getDocsFromCollection(
            `${environment === 'test' ? 'Test' : ''}${currentProject}Session`
        );
        return docs.map((doc) => doc.data());
    };

    const getSessionsByYear = async (year) => {
        const docs = await getDocsFromCollection(
            `${environment === 'test' ? 'Test' : ''}${currentProject}Session`,
            where('year', '==', year)
        );
        return docs.map((doc) => doc.data());
    };

    const createSession = async (session) => {
        const sessionCollection = `${environment === 'test' ? 'Test' : ''}${currentProject}Session`;
        const getSessionDataModel = () => {
            const { date, time, ...data } = session;
            return data;
        };
        addDocToCollection(sessionCollection, getSessionDataModel());
    };

    return {
        getSessions,
        getSessionsByYear,
        createSession,
        getAnswerSet,
    };
};
