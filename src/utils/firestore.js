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
import { notify, Type } from '../components/Notifier'

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

const deleteDocumentFromFirestore = async (
    entrySnapshot,
    successMessage
) => {
    await deleteDoc(
        doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id)
    ).then(() => {
        notify(Type.success, successMessage || 'Document successfully deleted!');
    }).catch((e) => {
        notify(Type.error, `Error deleting document: ${e}`);
    });
    if (entrySnapshot.data().taxa === 'Lizard')
        updateLizardMetadata( 'delete', { entrySnapshot } );
}

const updateLizardMetadata = async (
    operation,
    operationDataObject
) => {
    if (operation === 'create') {

    } else if (operation === 'update') {
        await updateDoc(
            doc(db, 'Metadata', 'LizardData'), {
                lastEditTime: operationDataObject.lastEditTime
            }
        ).then(() => {
            notify(Type.success, 'Sent update to the PWA');
        }).catch((e) => {
            notify(Type.error, `Error sending deletion to PWA: ${e}`);
        });
    } else if (operation === 'delete') {
        const { entrySnapshot } = operationDataObject;
        await updateDoc(
            doc(db, 'Metadata', 'LizardData'), 
            {
                deletedEntries: arrayUnion({
                    entryId: entrySnapshot.id,
                    collectionId: entrySnapshot.ref.parent.id
                })
            }
        ).then(() => {
            notify(Type.success, 'Sent deletion to the PWA');
        }).catch((e) => {
            notify(Type.error, `Error sending deletion to PWA: ${e}`);
        });
    }
}

const pushEntryChangesToFirestore = async (
    entrySnapshot,
    entryData,
) => {
    if (entryData.taxa === 'Lizard') {
        const lastEditTime = new Date().getTime();
        entryData.lastEdit = lastEditTime
        updateLizardMetadata( 'update', { lastEditTime } );
    }
    await setDoc(
        doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id),
        entryData
    ).then(() => {
        notify(Type.success, 'Changes successfully written to database!');
    }).catch((e) => {
        notify(Type.error, `Error writing changes to database: ${e}`);
    });
};

const deleteSessionAndItsEntries = async (sessionSnapshot) => {
    const entries = await getDocs(query(
        collection(db, `${sessionSnapshot.ref.parent.id.substr(0, sessionSnapshot.ref.parent.id.length - 7)}Data`),
        where('sessionDateTime', '==', sessionSnapshot.data().dateTime)
    ));
    entries.docs.forEach(entry => {
        deleteDocumentFromFirestore(entry, 'Session entry successfully deleted');
    })
    deleteDocumentFromFirestore(sessionSnapshot, 'Session successfully deleted')
}

const startEntryOperation = (
    operationName,
    operationData,
) => {
    operationData.setEntryUIState('viewing');
    if (operationName.includes('delete')) operationData.removeEntryFromUI();
    if (operationName === 'uploadEntryEdits') {
        pushEntryChangesToFirestore(
            operationData.entrySnapshot, 
            operationData.entryData
        )
    } else if (operationName === 'deleteEntry') {
        deleteDocumentFromFirestore(operationData.entrySnapshot)
    } else if (operationName === 'deleteSession') {
        deleteSessionAndItsEntries(operationData.entrySnapshot)
    }
}

export {
    getDocsFromCollection,
    addDocToCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
    startEntryOperation
};
