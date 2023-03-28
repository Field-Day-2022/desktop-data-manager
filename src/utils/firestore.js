import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { db } from './firebase';
import { appMode, currentProjectName } from './jotai';

export const getDocsFromCollection = async (collectionName, constraints = []) => {
    if (!Array.isArray(constraints)) {
        constraints = [constraints];
    }

    console.log('Loading entries from collection:', collectionName, constraints)

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

export const addDocToCollection = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log('Document written with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

export const updateDocInCollection = async (collectionName, docId, data) => {
    try {
        await updateDoc(doc(db, collectionName, docId), data);
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
};

export const deleteDocFromCollection = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('Document successfully deleted!');
    } catch (error) {
        console.error('Error removing document: ', error);
    }
};

export const getCollectionName = (environment, projectName, tableName) => {
    return `${environment === 'test' ? 'Test' : ''}${projectName}${
        tableName === 'Session' ? 'Session' : 'Data'
    }`;
};

export const useFirestore = () => {
    const currentProject = useAtomValue(currentProjectName);
    const environment = useAtomValue(appMode);

    const getAnswerSet = async (set_name) => {
        const docs = await getDocsFromCollection('AnswerSet', where('set_name', '==', set_name));
        return docs.map((doc) => doc.data().answers);
    };

    const getSessions = async () => {
        const docs = await getDocsFromCollection(`${environment === 'test' ? 'Test' : ''}${currentProject}Session`);
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
