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
    writeBatch,
    getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';
import { Type } from '../components/Notifier';

export const getArthropodLabels = async () => {
    const snapshot = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'ArthropodSpecies')),
    );
    const answers = snapshot.docs[0]?.data().answers || [];
    return answers.map((ans) => ans.primary).sort((a, b) => a.localeCompare(b));
};
const deleteDocumentFromFirestore = async (entrySnapshot, deleteMsg) => {
    let response = [];
    try {
        await deleteDoc(doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id));
        response = [Type.success, deleteMsg || 'Document successfully deleted!'];
    } catch (e) {
        response = [Type.error, `Error deleting document: ${e}`];
    }
    if (entrySnapshot.data().taxa === 'Lizard') {
        updateLizardMetadata('delete', { entrySnapshot });
    }
    return response;
};

const updateLizardMetadata = async (operation, operationDataObject) => {
    const lizardDoc = doc(db, 'Metadata', 'LizardData');
    const { entrySnapshot } = operationDataObject;
    try {
        if (operation === 'update') {
            await updateDoc(lizardDoc, { lastEditTime: operationDataObject.lastEditTime });
        } else if (operation === 'delete') {
            await updateDoc(lizardDoc, {
                deletedEntries: arrayUnion({
                    entryId: entrySnapshot.id,
                    collectionId: entrySnapshot.ref.parent.id,
                }),
            });
        }
        console.log(`Sent ${operation} to the PWA`);
    } catch (e) {
        console.error(`Error sending ${operation} to PWA: ${e}`);
    }
};

const pushEntryChangesToFirestore = async (entrySnapshot, entryData, editMsg) => {
    if (entryData.taxa === 'Lizard') {
        const lastEditTime = new Date().getTime();
        entryData.lastEdit = lastEditTime;
        updateLizardMetadata('update', { lastEditTime });
    }
    let response = [];
    if (entryData.dateTime) {
        const newDate = new Date(entryData.dateTime);
        if (!isNaN(newDate)) {
            entryData.year = newDate.getFullYear();
        }
    }
    await setDoc(doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id), entryData)
        .then(() => {
            response = [Type.success, editMsg || 'Changes successfully written to database!'];
        })
        .catch((e) => {
            response = [Type.error, `Error writing changes to database: ${e}`];
        });
    return response;
};

const editSessionAndItsEntries = async (sessionSnapshot, sessionData) => {
    const collectionId = sessionSnapshot.ref.parent.id.slice(0, -7);
    const entriesQuery = query(
        collection(db, `${collectionId}Data`),
        sessionSnapshot.data().sessionId
            ? where('sessionId', '==', sessionSnapshot.data().sessionId)
            : where('sessionDateTime', '==', sessionSnapshot.data().dateTime),
    );
    const entries = await getDocs(entriesQuery);
    const batch = writeBatch(db);
    entries.docs.forEach((entry) => {
        batch.update(doc(db, entry.ref.parent.id, entry.id), {
            dateTime: sessionData.dateTime,
            sessionDateTime: sessionData.dateTime,
        });
    });
    await batch.commit();
    return pushEntryChangesToFirestore(
        sessionSnapshot,
        sessionData,
        `Session ${entries.size ? `and its ${entries.size} entries` : ''} successfully changed`,
    );
};

export const getSessionEntryCount = async (sessionSnapshot) => {
    const collectionId = sessionSnapshot.ref.parent.id.slice(0, -7);
    const snapshot = await getCountFromServer(
        query(
            collection(db, `${collectionId}Data`),
            where('sessionDateTime', '==', sessionSnapshot.data().dateTime),
        ),
    );
    return snapshot.data().count;
};

const deleteSessionAndItsEntries = async (sessionSnapshot) => {
    const collectionId = sessionSnapshot.ref.parent.id.slice(0, -7);
    const entries = await getDocs(
        query(
            collection(db, `${collectionId}Data`),
            where('sessionDateTime', '==', sessionSnapshot.data().dateTime),
        ),
    );
    const deletePromises = entries.docs.map((entry) => deleteDocumentFromFirestore(entry));
    await Promise.all(deletePromises);
    return deleteDocumentFromFirestore(
        sessionSnapshot,
        `Session ${entries.size ? `and its ${entries.size} entries` : ''} successfully deleted`,
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
    } else if (operationName === 'uploadSessionEdits') {
        return editSessionAndItsEntries(operationData.entrySnapshot, operationData.entryData);
    } else {
        return [Type.error, 'Unknown error occurred'];
    }
};
const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) constraints = [constraints];
    try {
        const currentQuery = query(
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            ...constraints,
        );
        return await getDocs(currentQuery);
    } catch (error) {
        console.error('Error loading entries:', error);
        return null;
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
    return `${environment === 'test' ? 'Test' : ''}${projectName}${tableName === 'Session' ? 'Session' : 'Data'}`;
};

const getCollectionNameFromDoc = (snapshot) => snapshot?.ref.parent.id;

export const uploadNewEntry = async (entryData, project, environment) => {
    try {
        // Initialize timestamps
        const now = new Date();
        entryData.entryId = entryData.entryId || now.getTime();
        entryData.lastEdit = now.getTime();

        console.log('Starting uploadNewEntry with:', {
            project,
            environment,
            entryData,
        });

        // Handle Arthropod special case
        if (entryData.taxa === 'Arthropod') {
            entryData = {
                ...entryData,
                aran: entryData.aran || '0',
                auch: entryData.auch || '0',
                blat: entryData.blat || '0',
                chil: entryData.chil || '0',
                cole: entryData.cole || '0',
                crus: entryData.crus || '0',
                derm: entryData.derm || '0',
                diel: entryData.diel || '0',
                dipt: entryData.dipt || '0',
                hete: entryData.hete || '0',
                hyma: entryData.hyma || '0',
                hymb: entryData.hymb || '0',
                lepi: entryData.lepi || '0',
                mant: entryData.mant || '0',
                orth: entryData.orth || '0',
                pseu: entryData.pseu || '0',
                scor: entryData.scor || '0',
                soli: entryData.soli || '0',
                thys: entryData.thys || '0',
                unki: entryData.unki || '0',
                micro: entryData.micro || '0',
                taxa: 'N/A',
            };
        }

        // Handle Lizard special case
        if (entryData.taxa === 'Lizard') {
            try {
                await updateDoc(doc(db, 'Metadata', 'LizardData'), {
                    lastEditTime: now.getTime(),
                });
            } catch (error) {
                console.error('Error updating lizard metadata:', error);
            }
        }

        // Clean empty and undefined fields
        const cleanedData = {};
        for (const [key, value] of Object.entries(entryData)) {
            if (key === 'sessionId' && !value) {
                // If sessionId is missing but we have sessionDateTime, generate from that
                cleanedData[key] = entryData.sessionDateTime
                    ? new Date(entryData.sessionDateTime).getTime()
                    : now.getTime();
            } else {
                cleanedData[key] = value === undefined || value === '' ? 'N/A' : value;
            }
        }

        // Construct document ID and collection name
        const entryId = `${cleanedData.site}${cleanedData.taxa === 'N/A' ? 'Arthropod' : cleanedData.taxa}${cleanedData.entryId}`;
        const collectionName = `${environment === 'live' ? '' : 'Test'}${project.replace(/\s/g, '')}Data`;

        console.log('Attempting to write to Firestore:', {
            collectionName,
            entryId,
            finalData: cleanedData,
        });

        try {
            const docRef = doc(db, collectionName, entryId);
            await setDoc(docRef, cleanedData);
            console.log('Successfully wrote to Firestore:', docRef.path);
            return true;
        } catch (writeError) {
            console.error('Firestore write error:', writeError);
            console.error('Write error details:', {
                code: writeError.code,
                message: writeError.message,
                stack: writeError.stack,
                collectionName,
                entryId,
            });
            return false;
        }
    } catch (error) {
        console.error('Error in uploadNewEntry:', error);
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack,
        });
        return false;
    }
};

export const getStandardizedDateTimeString = (dateString) => {
    const tempDate = new Date(dateString);
    return `${tempDate.getFullYear()}/${String(tempDate.getMonth() + 1).padStart(2, '0')}/${String(tempDate.getDate()).padStart(2, '0')} ${tempDate.toLocaleTimeString('en-US', { hourCycle: 'h23' })}`;
};

export const uploadNewSession = async (sessionData, project, environment) => {
    const collectionName = `${environment === 'live' ? '' : 'Test'}${project.replace(/\s/g, '')}Session`;
    try {
        await addDoc(collection(db, collectionName), sessionData);
        return true;
    } catch {
        return false;
    }
};

const getAnswerSetOptions = async (setName) => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', setName)),
    );
    return answerSet.docs.flatMap((doc) => doc.data().answers.map((answer) => answer.primary));
};

export const getSitesForProject = (projectName) => getAnswerSetOptions(`${projectName}Sites`);
export const getArraysForSite = (projectName, siteName) =>
    getAnswerSetOptions(`${projectName}${siteName}Array`);
export const getTrapStatuses = () => getAnswerSetOptions('trap statuses');
export const getFenceTraps = () => getAnswerSetOptions('Fence Traps');
export const getSexes = () => getAnswerSetOptions('Sexes');

const getSessionsByProjectAndYear = async (environment, projectName, year) => {
    const collectionName = `${environment === 'test' ? 'Test' : ''}${projectName}Session`;
    const sessionsQuery = query(
        collection(db, collectionName),
        where('dateTime', '>=', `${year}/01/01 00:00:00`),
        where('dateTime', '<=', `${year}/12/31 23:59:59`),
        orderBy('dateTime', 'desc'),
    );
    return (await getDocs(sessionsQuery)).docs;
};

const getSpeciesCodesForProjectByTaxa = async (project, taxa) => {
    const answerSet = await getDocs(
        query(collection(db, 'AnswerSet'), where('set_name', '==', `${project}${taxa}Species`)),
    );
    return answerSet.docs.flatMap((doc) =>
        doc.data().answers.map((answer) => ({
            code: answer.primary,
            genus: answer.secondary.Genus,
            species: answer.secondary.Species,
        })),
    );
};

export {
    getDocsFromCollection,
    addDocToCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
    getCollectionNameFromDoc,
    startEntryOperation,
    getSessionsByProjectAndYear,
    getSpeciesCodesForProjectByTaxa,
    //getSessionEntryCount,
    pushEntryChangesToFirestore,
    deleteDocumentFromFirestore,
    editSessionAndItsEntries,
    deleteSessionAndItsEntries,
    updateLizardMetadata,
};
