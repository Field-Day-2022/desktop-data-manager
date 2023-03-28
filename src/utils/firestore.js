import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    startAt,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { db } from './firebase';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from './jotai';
import { notify, Type } from '../components/Notifier';
import { keyLabelMap, TABLE_LABELS } from '../const/tableLabels';

const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) {
        constraints = [constraints];
    }

    console.log('Loading entries from collection:', collectionName, constraints);

    try {
        const currentQuery = query(
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            ...constraints
        );
        const docs = await getDocs(currentQuery);
        return docs;
    } catch (error) {
        console.error('Error loading entries:', error);
    }
};

const addDocToCollection = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log('Document written with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

const updateDocInCollection = async (collectionName, docId, data) => {
    try {
        await updateDoc(doc(db, collectionName, docId), data);
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
};

const deleteDocFromCollection = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('Document successfully deleted!');
    } catch (error) {
        console.error('Error removing document: ', error);
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

    const deleteEntry = (collectionName, docId) => {
        deleteDocFromCollection(collectionName, docId);
        setEntries(entries.filter((entry) => entry.id !== docId));
    };

    const updateEntry = (collectionName, docId, data) => {
        updateDocInCollection(collectionName, docId, data);
        setEntries(
            entries.map((entry) => {
                if (entry.id === docId) {
                    return { ...entry, data };
                }
                return entry;
            })
        );
    };

    const getEntryValue = (entry, key) => {
        if (key === 'dateTime') {
            return entry.data().dateTime.toDate();
        }
        return entry.data()[key];
    };

    const getLabel = (key, tableName) => {
        if (key === 'commentsAboutTheArray' && tableName === 'Session') {
            return 'Comments';
        }
        return keyLabelMap[key];
    };

    const getKey = (label, tableName) => {
        if (label === 'Comments' && tableName === 'Session') {
            return 'commentsAboutTheArray';
        }
        return Object.keys(keyLabelMap).find((key) => keyLabelMap[key] === label);
    };

    const getKeys = (tableName) => {
        const labels = TABLE_LABELS[tableName];
        return labels.map((label) => getKey(label, tableName));
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

    return { 
        loadBatch, 
        loadPrevBatch, 
        loadNextBatch, 
        entries, 
        setEntries, 
        updateEntry, 
        deleteEntry, 
        getEntryValue,
        getKey,
        getKeys,
        getLabel
    };
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
