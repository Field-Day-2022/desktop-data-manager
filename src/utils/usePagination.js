import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { limit, startAfter, startAt, where } from 'firebase/firestore';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from './jotai';
import { notify, Type } from '../components/Notifier';
import { keyLabelMap, TABLE_LABELS } from '../const/tableLabels';
import {
    getDocsFromCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
} from './firestore';

export const usePagination = () => {
    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [entries, setEntries] = useState([]);
    const [collectionName, setCollectionName] = useState(
        getCollectionName(environment, currentProject, currentTable)
    );

    useEffect(() => {
        setCollectionName(getCollectionName(environment, currentProject, currentTable));
    }, [environment, currentProject, currentTable]);

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

    const deleteEntry = (docId) => {
        deleteDocFromCollection(collectionName, docId);
        setEntries(entries.filter((entry) => entry.id !== docId));
    };

    const updateEntry = (docId, data) => {
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

    const getLabel = (key) => {
        if (key === 'commentsAboutTheArray' && currentTable === 'Session') {
            return 'Comments';
        }
        return keyLabelMap[key];
    };

    const getKey = (label) => {
        if (label === 'Comments' && currentTable === 'Session') {
            return 'commentsAboutTheArray';
        }
        return Object.keys(keyLabelMap).find((key) => keyLabelMap[key] === label);
    };

    const getKeys = () => {
        const labels = TABLE_LABELS[currentTable];
        return labels.map((label) => getKey(label, currentTable));
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
        entries,
        setEntries,
        updateEntry,
        deleteEntry,
        loadBatch,
        loadPrevBatch,
        loadNextBatch,
        getEntryValue,
        getKey,
        getKeys,
        getLabel,
    };
};
