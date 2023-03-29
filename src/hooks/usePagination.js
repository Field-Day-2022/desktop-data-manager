import { limit, startAfter, startAt, where } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from './jotai';
import { useFirestore } from './useFirestore';

/**
 * This hook is responsible for loading paginated data from Firestore.
 * It is designed to work with the Firestore pagination architecture that
 * is implemented in the backend.
 * @param {function} updateEntries - A function that updates the entries
 *  state with the new entries that were loaded.
 * @returns {object} - An object with the following properties:
 *    - loadBatch - A function that loads a batch of entries.
 *    - loadNextBatch - A function that loads the next batch of entries.
 *    - loadPreviousBatch - A function that loads the previous batch of entries.
 */

export const usePagination = (updateEntries) => {
    const { getDocsFromCollection, getCollectionName } = useFirestore();

    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const collectionName = getCollectionName(environment, currentProject, currentTable);

    const [lastVisibleDoc, setLastVisibleDoc] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);

    const loadBatch = async (constraints = []) => {
        if (!Array.isArray(constraints)) { constraints = [constraints]; }

        const whereClause =
            currentTable !== 'Session' &&
            where('taxa', '==', currentTable === 'Arthropod' ? 'N/A' : currentTable);
        whereClause && constraints.push(whereClause);
        constraints.push(limit(batchSize));
        constraints.push(orderBy('dateTime', 'desc'))

        const { docs } = await getDocsFromCollection(collectionName, constraints);
        const newLastVisibleDoc = docs[docs.length - 1];
        updateEntries(docs);
        setLastVisibleDoc(newLastVisibleDoc);
    };

    const getQueryCursorStack = (currentCursor, cursorStack) => {
        return [...cursorStack, currentCursor];
    };

    const loadNextBatch = async () => {
        const newQueryCursorStack = getQueryCursorStack(lastVisibleDoc, queryCursorStack);
        setQueryCursorStack(newQueryCursorStack);
        await loadBatch(startAfter(lastVisibleDoc));
    };

    const loadPreviousBatch = async () => {
        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        const newQueryCursorStack = queryCursorStack.slice(0, -1);
        setQueryCursorStack(newQueryCursorStack);
        await loadBatch(startAt(prevQueryCursor));
    };

    return { loadBatch, loadNextBatch, loadPreviousBatch };
};
