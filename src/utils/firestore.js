import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    orderBy,
    arrayUnion,
    setDoc,
    where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Type } from '../components/Notifier';

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

const addDocToCollection = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log(`Document written to collection: ${collectionName} with ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error adding document:', error);
    }
};

const updateDocInCollection = async (collectionName, docId, data) => {
    try {
        await updateDoc(doc(db, collectionName, docId), data);
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document:', error);
    }
};

const deleteDocFromCollection = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('Document successfully deleted!');
    } catch (error) {
        console.error('Error removing document:', error);
    }
};

const getCollectionName = (environment, projectName, tableName) => {
    return `${environment === 'test' ? 'Test' : ''}${projectName}${
        tableName === 'Session' ? 'Session' : 'Data'
    }`;
};

const getCollectionNameFromDoc = (snapshot) => {
    return snapshot?.ref.parent.id;
};

const deleteDocumentFromFirestore = async (entrySnapshot, deleteMsg) => {
    let response = [];
    await deleteDoc(doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id))
        .then(() => {
            response = [Type.success, deleteMsg || 'Document successfully deleted!'];
        })
        .catch((e) => {
            response = [Type.error, `Error deleting document: ${e}`];
        });
    if (entrySnapshot.data().taxa === 'Lizard') updateLizardMetadata('delete', { entrySnapshot });
    return response;
};

const updateLizardMetadata = async (operation, operationDataObject) => {
    if (operation === 'create') {
    } else if (operation === 'update') {
        await updateDoc(doc(db, 'Metadata', 'LizardData'), {
            lastEditTime: operationDataObject.lastEditTime,
        })
            .then(() => {
                console.log('Sent update to the PWA');
            })
            .catch((e) => {
                console.error(`Error sending deletion to PWA: ${e}`);
            });
    } else if (operation === 'delete') {
        const { entrySnapshot } = operationDataObject;
        await updateDoc(doc(db, 'Metadata', 'LizardData'), {
            deletedEntries: arrayUnion({
                entryId: entrySnapshot.id,
                collectionId: entrySnapshot.ref.parent.id,
            }),
        })
            .then(() => {
                console.log('Sent deletion to the PWA');
            })
            .catch((e) => {
                console.error(`Error sending deletion to PWA: ${e}`);
            });
    }
};

const pushEntryChangesToFirestore = async (entrySnapshot, entryData) => {
    if (entryData.taxa === 'Lizard') {
        const lastEditTime = new Date().getTime();
        entryData.lastEdit = lastEditTime;
        updateLizardMetadata('update', { lastEditTime });
    }
    let response = [];
    await setDoc(doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id), entryData)
        .then(() => {
            response = [Type.success, 'Changes successfully written to database!'];
        })
        .catch((e) => {
            response = [Type.error, `Error writing changes to database: ${e}`];
        });
    return response;
};

const deleteSessionAndItsEntries = async (sessionSnapshot) => {
    const entries = await getDocs(
        query(
            collection(
                db,
                `${sessionSnapshot.ref.parent.id.substr(
                    0,
                    sessionSnapshot.ref.parent.id.length - 7
                )}Data`
            ),
            where('sessionDateTime', '==', sessionSnapshot.data().dateTime)
        )
    );
    let entryCount = 0;
    entries.docs.forEach((entry) => {
        entryCount++;
        deleteDocumentFromFirestore(entry);
    });
    return deleteDocumentFromFirestore(
        sessionSnapshot,
        `Session ${entryCount > 0 ? `and its ${entryCount} entries` : ''} successfully deleted`
    );
};

const startEntryOperation = async (operationName, operationData) => {
    operationData.setEntryUIState('viewing');
    if (operationName.includes('delete')) operationData.removeEntryFromUI();
    if (operationName === 'uploadEntryEdits') {
        return pushEntryChangesToFirestore(operationData.entrySnapshot, operationData.entryData);
    } else if (operationName === 'deleteEntry') {
        return deleteDocumentFromFirestore(operationData.entrySnapshot);
    } else if (operationName === 'deleteSession') {
        return deleteSessionAndItsEntries(operationData.entrySnapshot);
    } else return [Type.error, 'Unknown error occurred'];
};

export {
    getDocsFromCollection,
    addDocToCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
    getCollectionNameFromDoc,
    startEntryOperation,
};
