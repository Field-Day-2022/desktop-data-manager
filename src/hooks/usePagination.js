import { limit, startAfter, where, endAt } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import { getDocsFromCollection, getCollectionName } from '../utils/firestore';

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
    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const collectionName = getCollectionName(environment, currentProject, currentTable);
    const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
    const [queryCursorStack, setQueryCursorStack] = useState([]);

    useEffect(() => {
        const resetPagination = async () => {
            setLastVisibleDoc(null);
            setQueryCursorStack([]);
            await loadBatch(); // Reload data after resetting state
        };
        resetPagination();
    }, [currentTableName, batchSize]);

    const getBatch = async (constraints = []) => {
        if (!Array.isArray(constraints)) constraints = [constraints];

        const whereClause =
            currentTable &&
            currentTable !== 'Session' &&
            where('taxa', '==', currentTable === 'Arthropod' ? 'N/A' : currentTable);
        if (whereClause) constraints.push(whereClause);
        constraints.push(limit(batchSize));
        return await getDocsFromCollection(collectionName, constraints);
    };

    const loadBatch = async (constraints = []) => {
        const docs = (await getBatch(constraints)).docs || [];
        updateEntries(docs);
        if (docs.length > 0) {
            setLastVisibleDoc(docs[docs.length - 1]);
        } else {
            setLastVisibleDoc(null);
        }
    };

    const loadNextBatch = async () => {
        if (!lastVisibleDoc) return false;
        const batch = await getBatch(startAfter(lastVisibleDoc));
        const docs = batch.docs || [];
        if (docs.length > 0) {
            setQueryCursorStack((prev) => [...prev, lastVisibleDoc]);
            setLastVisibleDoc(docs[docs.length - 1]);
            updateEntries(docs);
        }
    };

    const loadPreviousBatch = async () => {
        if (queryCursorStack.length === 0) return false;
        const previousCursor = queryCursorStack.pop();
        setQueryCursorStack([...queryCursorStack]);
        await loadBatch(endAt(previousCursor));
    };

    return { loadBatch, loadNextBatch, loadPreviousBatch };
};
