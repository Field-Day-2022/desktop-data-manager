import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    orderBy,
    arrayUnion,
    where,
} from 'firebase/firestore';
import { db } from './firebase';

const getDocCollectionName = (doc) => {
    return doc.ref.parent.id;
};

const getEntryCollectionName = (sessionDoc) => {
    const sessionCollection = getDocCollectionName(sessionDoc);
    return `${sessionCollection.substr(0, sessionCollection.length - 7)}Data`;
};

const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) {
        constraints = [constraints];
    }

    console.log(
        'Loading entries from collection:',
        collectionName,
        'with constraints:',
        constraints
    );

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

const getCollectionName = (environment, projectName, tableName) => {
    return `${environment === 'test' ? 'Test' : ''}${projectName}${
        tableName === 'Session' ? 'Session' : 'Data'
    }`;
};

const updateEntry = async (entry, data) => {
    const collectionName = getDocCollectionName(entry);
    console.log('Updating entry:', entry.id, 'in collection:', collectionName);
    if (entry.data().taxa === 'Lizard') {
        await setLastLizardEditTime(new Date().getTime())
            .then(() => {
                console.log('Updated lizard edit time');
            })
            .catch((e) => {
                console.log(`Error updating lizard edit time: ${e}`);
                return [false, 'Error updating lizard metadata.'];
            });
    }
    return updateDoc(doc(db, collectionName, entry.id), data)
        .then(() => {
            console.log('Updated entry');
            return [true, 'Successfully updated entry.'];
        })
        .catch((e) => {
            console.log(`Error updating entry: ${e}`);
            return [false, 'Error updating entry.'];
        });
};

const deleteEntry = async (entry) => {
    const collectionName = getDocCollectionName(entry);
    const isSession = collectionName.includes('Session');
    const isLizard = entry.data().taxa === 'Lizard';
    if (isLizard) {
        await addDeletedLizardRecord(entry)
            .then(() => {
                console.log('Added deleted lizard record');
            })
            .catch((e) => {
                console.log(`Error adding deleted lizard record: ${e}`);
                return [false, 'Error updating lizard metadata.'];
            });
    }
    return deleteDoc(doc(db, collectionName, entry.id))
        .then(() => {
            if (isSession) {
                return deleteSessionEntries(entry)
                    .then(() => {
                        return [true, 'Successfully deleted session and its data entries.'];
                    })
                    .catch((e) => {
                        console.log(`Error deleting session entries: ${e}`);
                        return [false, 'Error deleting session entries.'];
                    });
            }
            return [true, 'Successfully deleted entry.'];
        })
        .catch((e) => {
            console.log(`Error deleting entry: ${e}`);
            return [false, 'Error deleting entry.'];
        });
};

const getEntry = async (entryId, collectionName) => {
    console.log('Getting entry:', entryId, 'from collection:', collectionName);
    return getDoc(doc(db, collectionName, entryId));
};

const setLastLizardEditTime = async (lastEditTime) => {
    await updateDoc(doc(db, 'Metadata', 'LizardData'), {
        lastEditTime,
    });
};

const addDeletedLizardRecord = async (deletedEntry) => {
    await updateDoc(doc(db, 'Metadata', 'LizardData'), {
        deletedEntries: arrayUnion({
            entryId: deletedEntry.id,
            collectionId: deletedEntry.ref.parent.id,
        }),
    });
};

const deleteSessionEntries = async (sessionDoc) => {
    const entryCollection = getEntryCollectionName(sessionDoc);
    const entries = await getDocs(
        query(
            collection(db, entryCollection),
            where('sessionDateTime', '==', sessionDoc.data().dateTime)
        )
    );
    console.log(
        'Deleting session entries:',
        entries.docs.length,
        'in collection:',
        entryCollection
    );
    entries.docs.forEach((entry) => {
        deleteEntry(entry);
    });
};

export {
    getDocsFromCollection,
    getCollectionName,
    getDocCollectionName,
    updateEntry,
    deleteEntry,
    getEntry,
};
