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

export const getArthropodLabels = async () => {
    let labelArray = [];
    await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'ArthropodSpecies'))
    ).then((snapshot) => {
        snapshot.docs[0].data().answers.forEach((ans) => {
            labelArray.push(ans.primary);
        });
    });
    return labelArray;
};

const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) {
        constraints = [constraints];
    }

    // console.log(
    //     'Loading entries from collection:',
    //     collectionName,
    //     'with constraints:',
    //     constraints
    // );

    try {
        const currentQuery = query(
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            ...constraints
        );
        const docs = await getDocs(currentQuery);
        // console.log(`Read ${docs.size} docs from ${collectionName}.`);
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

const getSitesForProject = async (projectName) => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', `${projectName}Sites`))
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push(answer.primary);
        });
    });
    return options;
};

const getArraysForSite = async (projectName, siteName) => {
    const answerSet = await getDocs(
        query(
            collection(db, 'AnswerSet'),
            where('set_name', '==', `${projectName}${siteName}Array`)
        )
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push(answer.primary);
        });
    });
    return options;
};

const getTrapStatuses = async () => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'trap statuses'))
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push(answer.primary);
        });
    });
    return options;
};

const getFenceTraps = async () => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps'))
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push(answer.primary);
        });
    });
    return options;
};

const getSexes = async () => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'Sexes'))
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push(answer.primary);
        });
    });
    return options;
};

const getSessionsByProjectAndYear = async (environment, projectName, year) => {
    environment = environment === 'test' ? 'Test' : '';
    const sessions = await getDocs(
        query(
            collection(db, `${environment}${projectName}Session`),
            where('dateTime', '>=', `${year}-01-01`),
            where('dateTime', '<=', `${year}-12-31`)
        )
    );
    // console.log('sessions', sessions.docs);
    return sessions.docs;
};

const getSpeciesCodesForProjectByTaxa = async (project, taxa) => {
    // console.log(`${project}${taxa}Species`);
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', `${project}${taxa}Species`))
    );
    const options = [];
    answerSet.docs.forEach((doc) => {
        doc.data().answers.forEach((answer) => {
            options.push({
                code: answer.primary,
                genus: answer.secondary.Genus,
                species: answer.secondary.Species,
            });
        });
    });
    return options;
};

export const uploadNewEntry = async (entryData, project, environment) => {
    let success = false;
    const now = new Date();
    if (entryData.dateTime === '') entryData.dateTime = now.toISOString();
    const taxa = entryData.taxa;
    if (entryData.taxa === 'Arthropod') {
        if (entryData.aran === '') entryData.aran = '0';
        if (entryData.auch === '') entryData.auch = '0';
        if (entryData.blat === '') entryData.blat = '0';
        if (entryData.chil === '') entryData.chil = '0';
        if (entryData.cole === '') entryData.cole = '0';
        if (entryData.crus === '') entryData.crus = '0';
        if (entryData.derm === '') entryData.derm = '0';
        if (entryData.diel === '') entryData.diel = '0';
        if (entryData.dipt === '') entryData.dipt = '0';
        if (entryData.hete === '') entryData.hete = '0';
        if (entryData.hyma === '') entryData.hyma = '0';
        if (entryData.hymb === '') entryData.hymb = '0';
        if (entryData.lepi === '') entryData.lepi = '0';
        if (entryData.mant === '') entryData.mant = '0';
        if (entryData.orth === '') entryData.orth = '0';
        if (entryData.pseu === '') entryData.pseu = '0';
        if (entryData.scor === '') entryData.scor = '0';
        if (entryData.soli === '') entryData.soli = '0';
        if (entryData.thys === '') entryData.thys = '0';
        if (entryData.unki === '') entryData.unki = '0';
        if (entryData.micro === '') entryData.micro = '0';
        entryData.taxa = 'N/A';
    } else if (entryData.taxa === 'Lizard') {
        await updateDoc(doc(db, 'Metadata', 'LizardData'), {
            lastEditTime: now.getTime(),
        });
    }
    entryData.lastEdit = now.getTime();
    for (const key in entryData) {
        if (entryData[key] === '') entryData[key] = 'N/A';
    }
    const entryId =`${entryData.site}${taxa}${now.getTime()}`;
    let collectionName = `Test${project.replace(/\s/g, '')}Data`;
    if (environment === 'live') {
        collectionName = `${project.replace(/\s/g, '')}Data`;
    }
    await setDoc(doc(db, collectionName, entryId), entryData).then(() => (success = true));
    return success;
};

export {
    getDocsFromCollection,
    addDocToCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
    getCollectionNameFromDoc,
    startEntryOperation,
    getSitesForProject,
    getArraysForSite,
    getTrapStatuses,
    getFenceTraps,
    getSexes,
    getSessionsByProjectAndYear,
    getSpeciesCodesForProjectByTaxa,
};
